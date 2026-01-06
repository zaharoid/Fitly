import { prisma, startOfUTCDay } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)

  const rows = await prisma.meal.findMany({
    where: { userId },
    select: { date: true },
    orderBy: { date: 'asc' },
  })

  const dayKeys = Array.from(new Set(rows.map(r => r.date.toISOString().slice(0,10)))).sort()
  const totalActiveDays = dayKeys.length

  const today = startOfUTCDay()
  let streak = 0
  for (let i = dayKeys.length - 1; i >= 0; i--) {
    const d = new Date(dayKeys[i] + 'T00:00:00Z')
    const expected = new Date(today)
    expected.setUTCDate(today.getUTCDate() - streak)
    if (d.getTime() === expected.getTime()) streak++
    else if (d.getTime() < expected.getTime()) break
  }

  return { totalActiveDays, currentStreak: streak }
})
