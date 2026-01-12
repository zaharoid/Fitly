// scripts/seed-products.ts
// Run:
//   FDC_API_KEY=xxx ts-node scripts/seed-products.ts
//   SEED_NO_IMAGES=1 ts-node scripts/seed-products.ts  (to disable OFF/Unsplash)

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const USDA = 'https://api.nal.usda.gov/fdc/v1'
const CONCURRENCY = 5
const TIMEOUT_MS = 10000
const SLEEP_BETWEEN_CALLS_MS = 120
const DISABLE_IMAGES = process.env.SEED_NO_IMAGES === '1'

// --- utils -------------------------------------------------
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
const round2 = (n: number) => Math.round(n * 100) / 100

function normalizeName(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
}

async function fetchWithTimeout(url: string, opts: RequestInit = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const r = await fetch(url, { ...opts, signal: controller.signal, headers: { Accept: 'application/json', ...(opts.headers||{}) } })
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
    return r
  } finally {
    clearTimeout(id)
  }
}

async function fetchJSON<T>(url: string, retries = 2): Promise<T> {
  let lastErr: any
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetchWithTimeout(url)
      return await r.json() as T
    } catch (e) {
      lastErr = e
      if (i === retries) break
      await sleep(600 * (i + 1))
    }
  }
  throw lastErr
}

// --- USDA types/helpers -----------------------------------
type FoodSearchResp = { foods: Array<{ fdcId: number; description: string; dataType?: string }> }
type FoodDetail = {
  fdcId: number
  description?: string
  dataType?: string
  brandOwner?: string
  foodNutrients?: Array<{ amount?: number; nutrient?: { number?: string; name?: string; unitName?: string } }>
}

function pick(food: FoodDetail, wantedNumbers: string[], fallbackNames: string[] = []): number {
  const arr = food.foodNutrients || []
  let best: { amount: number; unit?: string } | null = null
  for (const fn of arr) {
    const num = fn?.nutrient?.number
    const nm = fn?.nutrient?.name?.toLowerCase?.() || ''
    const unit = fn?.nutrient?.unitName
    const amt = typeof fn?.amount === 'number' ? fn.amount : undefined
    const ok = (num && wantedNumbers.includes(num)) || fallbackNames.some(s => nm.includes(s))
    if (ok && typeof amt === 'number') {
      if (!best) best = { amount: amt, unit }
      else if (unit === 'KCAL' && best.unit !== 'KCAL') best = { amount: amt, unit }
    }
  }
  if (!best) return 0
  if (wantedNumbers.includes('1008') && best.unit === 'KJ') return best.amount / 4.184
  return best.amount
}

function getMacros(food: FoodDetail) {
  return {
    kcal:    round2(pick(food, ['1008'], ['energy'])),
    protein: round2(pick(food, ['1003'], ['protein'])),
    carbs:   round2(pick(food, ['1005'], ['carbohydrate'])),
    fat:     round2(pick(food, ['1004'], ['total lipid','fat'])),
  }
}

async function searchIds(query: string, pageSize = 12, dataType = 'Foundation'): Promise<number[]> {
  const key = process.env.FDC_API_KEY
  if (!key) throw new Error('FDC_API_KEY missing in .env')
  const url = `${USDA}/foods/search?api_key=${key}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=${encodeURIComponent(dataType)}`
  const js = await fetchJSON<FoodSearchResp>(url)
  return (js.foods || []).map(f => f.fdcId).filter(Boolean)
}

async function getFood(id: number): Promise<FoodDetail> {
  const key = process.env.FDC_API_KEY!
  const url = `${USDA}/food/${id}?api_key=${key}`
  return await fetchJSON<FoodDetail>(url)
}

// --- Images (OFF + Unsplash fallback) ----------------------
const imageCache = new Map<string, string | null>()

async function findOffImage(name: string, brand?: string | null): Promise<string | null> {
  const q = brand ? `${name} ${brand}` : name
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=3`
  try {
    const r = await fetchWithTimeout(url, {}, 6000)
    const js: any = await r.json()
    const products: any[] = js.products || []
    for (const p of products) {
      const u = p?.image_url || p?.image_front_url || p?.image_small_url
      if (u && typeof u === 'string') return u
    }
    return null
  } catch {
    return null
  }
}

function unsplashFallback(name: string) {
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(name)},food`
}

async function getImageFor(name: string, brand?: string | null) {
  const key = normalizeName(`${name} ${brand||''}`)
  if (imageCache.has(key)) return imageCache.get(key)!
  if (DISABLE_IMAGES) { imageCache.set(key, null); return null }
  let img = await findOffImage(name, brand)
  if (!img) img = unsplashFallback(name)
  imageCache.set(key, img)
  return img
}

// --- main worker ------------------------------------------
async function main() {
  const queries = [
    'chicken breast','rice','egg','milk','yogurt','banana','apple','salmon','bread','oats','olive oil',
    'beef','potato','pasta','cheese','tomato','cucumber','peanut butter','avocado','broccoli'
  ]

  const ids = new Set<number>()
  for (const q of queries) {
    for (const t of ['Foundation','SR Legacy'] as const) {
      try {
        const got = await searchIds(q, t === 'Foundation' ? 12 : 8, t)
        got.forEach(x => ids.add(x))
        await sleep(150)
      } catch (e: any) {
        console.warn(`search failed "${q}" ${t}:`, e?.message || e)
      }
    }
  }

  const allIds = Array.from(ids)
  console.log(`FDC IDs: ${allIds.length}`)

  let created = 0, updated = 0, skipped = 0, processed = 0
  const seenNameKey = new Set<string>() // dedup within this run

  async function worker(chunk: number[]) {
    for (const id of chunk) {
      try {
        const food = await getFood(id)
        const name = (food.description || '').trim()
        if (!name) { skipped++; continue }

        const nameKey = normalizeName(name)
        if (seenNameKey.has(nameKey)) { skipped++; continue }
        seenNameKey.add(nameKey)

        const brand = food.brandOwner?.trim() || null
        const { kcal, protein, carbs, fat } = getMacros(food)
        if ((kcal || protein || carbs || fat) === 0) { skipped++; continue }

        const imageUrl = await getImageFor(name, brand)

        const existing = await prisma.product.findUnique({ where: { nameKey } }).catch(() => null)
        if (existing) {
          await prisma.product.update({
            where: { nameKey },
            data: { name, brand, servingQty: 100, kcal, protein, carbs, fat, imageUrl }
          })
          updated++
        } else {
          await prisma.product.create({
            data: { name, brand, nameKey, servingQty: 100, kcal, protein, carbs, fat, imageUrl }
          })
          created++
        }
      } catch (e: any) {
        console.warn(`fdcId ${id} failed:`, e?.message || e)
      } finally {
        processed++
        if (processed % 10 === 0) {
          console.log(`progress: ${processed}/${allIds.length} (created ${created}, updated ${updated}, skipped ${skipped})`)
        }
        await sleep(SLEEP_BETWEEN_CALLS_MS)
      }
    }
  }

  // Split by CONCURRENCY
  const chunks: number[][] = Array.from({ length: CONCURRENCY }, () => [])
  allIds.forEach((id, i) => chunks[i % CONCURRENCY]!.push(id))
  await Promise.all(chunks.map(worker))

  console.log(`Done. created=${created}, updated=${updated}, skipped=${skipped}, total=${processed}`)
}

main()
  .catch(e => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
