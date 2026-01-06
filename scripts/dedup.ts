import { PrismaClient, type Product } from '@prisma/client'
const prisma = new PrismaClient()

function normalizeName(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
}

// выбираем "лучший" продукт среди дублей
function chooseBest(list: Product[]): Product {
  // приоритет: есть imageUrl → > суммарные макросы → бренд заполнен → самый ранний
  const score = (p: Product) => {
    const macros = (p.kcal > 0 ? 1 : 0) + (p.protein > 0 ? 1 : 0) + (p.carbs > 0 ? 1 : 0) + (p.fat > 0 ? 1 : 0)
    return (p.imageUrl ? 100 : 0) + macros * 10 + (p.brand ? 1 : 0)
  }
  return [...list].sort((a, b) => {
    const s = score(b) - score(a)
    if (s !== 0) return s
    return a.createdAt.getTime() - b.createdAt.getTime()
  })[0]
}

async function main() {
  const all = await prisma.product.findMany()
  console.log(`Total products: ${all.length}`)

  // 1) убедимся, что у всех заполнен nameKey
  const toFill = all.filter(p => !p.nameKey || p.nameKey.trim() === '')
  for (const p of toFill) {
    await prisma.product.update({
      where: { id: p.id },
      data: { nameKey: normalizeName(p.name) }
    })
  }
  if (toFill.length) console.log(`Filled nameKey for ${toFill.length} rows`)

  // 2) перечитаем с заполненными nameKey
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } })
  const byKey = new Map<string, Product[]>()
  for (const p of rows) {
    const key = normalizeName(p.nameKey || p.name)
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key)!.push(p)
  }

  // 3) удалим дубли (оставим лучший)
  let deleted = 0
  for (const [key, list] of byKey) {
    if (list.length <= 1) continue
    const keep = chooseBest(list)
    const toDelete = list.filter(p => p.id !== keep.id)

    for (const d of toDelete) {
      await prisma.product.delete({ where: { id: d.id } })
      deleted++
    }

    // на всякий случай нормализуем key у keep
    if (keep.nameKey !== key) {
      await prisma.product.update({ where: { id: keep.id }, data: { nameKey: key } })
    }
  }

  console.log(`Deleted duplicates: ${deleted}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
