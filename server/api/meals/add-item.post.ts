import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody<{ mealId: string, item: any }>(event)

  const meal = await prisma.meal.findFirst({ where: { id: body.mealId, userId } })
  if (!meal) throw createError({ statusCode: 404, statusMessage: 'Meal not found' })

  const items = Array.isArray(meal.itemsJson) ? [...(meal.itemsJson as any[])] : []
  items.push(body.item)

  const totals = items.reduce((a, x) => { a.kcal+=x.kcal; a.p+=x.protein; a.c+=x.carbs; a.f+=x.fat; return a }, {kcal:0,p:0,c:0,f:0})

  const updated = await prisma.meal.update({
    where: { id: meal.id },
    data: { itemsJson: items, kcal: totals.kcal, protein: totals.p, carbs: totals.c, fat: totals.f, isPlan: false }
  })
  return { meal: updated }
})
