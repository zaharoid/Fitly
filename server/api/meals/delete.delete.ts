import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const q = getQuery(event)
  const mealId = String(q.mealId)
  const found = await prisma.meal.findFirst({ where: { id: mealId, userId } })
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Meal not found' })
  await prisma.meal.delete({ where: { id: mealId } })
  return { ok: true }
})
