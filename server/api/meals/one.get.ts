import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const mealId = String(getQuery(event).mealId || '')
  const meal = await prisma.meal.findFirst({ where: { id: mealId, userId } })
  if (!meal) throw createError({ statusCode: 404, statusMessage: 'Meal not found' })
  return { meal }
})
