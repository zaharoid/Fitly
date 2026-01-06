import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const q = getQuery(event)
  const from = new Date(String(q.from) + 'T00:00:00Z')
  const to = new Date(String(q.to) + 'T00:00:00Z')
  const meals = await prisma.meal.findMany({
    where: { userId, date: { gte: from, lte: to } },
    orderBy: [{ date: 'desc' }, { mealType: 'asc' }, { time: 'asc' }]
  })
  return { meals }
})
