import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const d = (getQuery(event).date as string | undefined) || new Date().toISOString().slice(0,10)
  const date = new Date(d + 'T00:00:00Z')

  const meals = await prisma.meal.findMany({
    where: { userId, date },
    orderBy: [{ mealType: 'asc' }, { time: 'asc' }],
  })

  return { meals }
})
