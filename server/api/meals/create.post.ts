import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

function parseTime(time: string) {
  const [hh, mm] = time.split(':').map(Number)
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null
  return { hh, mm }
}

function checkTimeRange(hh: number, mm: number, mealType: string) {
  const mins = hh * 60 + mm
  if (mealType === 'BREAKFAST') return mins >= 5*60 && mins <= 11*60   // 05:00–11:00
  if (mealType === 'LUNCH')     return mins >= 11*60 && mins <= 16*60  // 11:00–16:00
  if (mealType === 'DINNER')    return mins >= 16*60 && mins <= 22*60  // 16:00–22:00
  if (mealType === 'SNACK')     return true                            // any
  return true
}

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody<{
    date: string
    time: string     // 'HH:MM'
    mealType: 'BREAKFAST'|'LUNCH'|'DINNER'|'SNACK'
    item: { productId?: string, name: string, grams: number, kcal: number, protein: number, carbs: number, fat: number }
  }>(event)

  const date = new Date(body.date + 'T00:00:00Z')
  const parsed = parseTime(body.time)
  if (!parsed) throw createError({ statusCode: 400, statusMessage: 'Bad time' })

  if (!checkTimeRange(parsed.hh, parsed.mm, body.mealType)) {
    throw createError({ statusCode: 400, statusMessage: 'Time out of allowed range for this meal type' })
  }

  const time = new Date(date)
  time.setUTCHours(parsed.hh, parsed.mm, 0, 0)

  const it = body.item
  const meal = await prisma.meal.create({
    data: {
      userId,
      date,
      time,
      mealType: body.mealType,
      isPlan: false,
      itemsJson: [it],
      kcal: it.kcal,
      protein: it.protein,
      carbs: it.carbs,
      fat: it.fat,
    },
  })

  return { meal }
})
