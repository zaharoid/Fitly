import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody<{ mealId: string, items: any[], mealType?: string, time?: string }>(event)

  const found = await prisma.meal.findFirst({ where: { id: body.mealId, userId } })
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Meal not found' })

  const totals = body.items.reduce((a, x) => { a.kcal+=x.kcal; a.p+=x.protein; a.c+=x.carbs; a.f+=x.fat; return a }, {kcal:0,p:0,c:0,f:0})
  const time = body.time ? new Date(body.time) : found.time

  const updated = await prisma.meal.update({
    where: { id: body.mealId },
    data: {
      itemsJson: body.items,
      kcal: totals.kcal, protein: totals.p, carbs: totals.c, fat: totals.f,
      mealType: (body.mealType as any) ?? found.mealType,
      time
    }
  })

  return { meal: updated }
})
