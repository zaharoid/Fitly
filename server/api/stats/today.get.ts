import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const q = getQuery(event)
  const d = (q.date as string | undefined) || new Date().toISOString().slice(0,10)
  const date = new Date(d + 'T00:00:00Z')

  const meals = await prisma.meal.findMany({
    where: { userId, date },
    orderBy: [{ mealType: 'asc' }, { time: 'asc' }],
  })

  const totals = meals.reduce((a, x) => {
    a.kcal += x.kcal; a.p += x.protein; a.c += x.carbs; a.f += x.fat
    return a
  }, { kcal: 0, p: 0, c: 0, f: 0 })

  const byType: any = {
    BREAKFAST: { kcal: 0, p: 0, c: 0, f: 0 },
    LUNCH:     { kcal: 0, p: 0, c: 0, f: 0 },
    DINNER:    { kcal: 0, p: 0, c: 0, f: 0 },
    SNACK:     { kcal: 0, p: 0, c: 0, f: 0 },
  }

  for (const m of meals) {
    const t = byType[m.mealType]
    t.kcal += m.kcal; t.p += m.protein; t.c += m.carbs; t.f += m.fat
  }

  return { date: d, totals, byType, meals }
})
