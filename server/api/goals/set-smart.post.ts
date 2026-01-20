import { prisma } from '~/server/utils/prisma'
import { requireUserId } from '~/server/utils/auth'

const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
}

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)

  const body = await readBody<{
    weightTarget: number
    activityLevel: 'sedentary'|'light'|'moderate'|'active'|'athlete'
    deadline: string // 'YYYY-MM-DD'
  }>(event)
  console.log('set-smart body:', body);
  

  if (
    body.weightTarget == null ||
    Number.isNaN(Number(body.weightTarget))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'weightTarget is required' })
  }

  if (!body.activityLevel || !ACTIVITY[body.activityLevel]) {
    throw createError({ statusCode: 400, statusMessage: 'activityLevel is invalid' })
  }

  if (!body.deadline || !/^\d{4}-\d{2}-\d{2}$/.test(body.deadline)) {
    throw createError({ statusCode: 400, statusMessage: 'deadline must be in format YYYY-MM-DD' })
  }

  const deadlineDate = new Date(body.deadline + 'T00:00:00Z')
  if (Number.isNaN(deadlineDate.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'deadline is invalid date' })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sex: true, age: true, heightCm: true, weightKg: true },
  })

  if (!user?.sex || user.age == null || user.heightCm == null || user.weightKg == null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Profile is incomplete (need sex, age, heightCm, weightKg)',
    })
  }

  const sex = user.sex as 'm'|'f'
  const age = user.age
  const height = user.heightCm
  const weightCurrent = user.weightKg
  const weightTarget = Number(body.weightTarget)

  const BMR = sex === 'm'
    ? 10 * weightCurrent + 6.25 * height - 5 * age + 5
    : 10 * weightCurrent + 6.25 * height - 5 * age - 161

  const activityCoef = ACTIVITY[body.activityLevel]
  if (activityCoef == null) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid activity level' })
  }
  const TDEE = BMR * activityCoef

  const now = new Date()
  const daysRaw = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  const days = Math.max(7, Math.ceil(daysRaw || 0))

  const deltaKg = weightTarget - weightCurrent
  const desiredPerWeek = deltaKg / (days / 7)

  const maxLossPerWeek = Math.max(
    0.25,
    Math.min(1.0, weightCurrent * 0.01),
  )

  let weeklyKg = desiredPerWeek
  if (deltaKg < 0) weeklyKg = Math.max(-maxLossPerWeek, desiredPerWeek)
  if (deltaKg > 0) weeklyKg = Math.min(maxLossPerWeek, desiredPerWeek)

  const dailyKcalDelta = (weeklyKg * 7700) / 7
  const targetKcal = Math.round(TDEE + dailyKcalDelta)

  const proteinG = Math.round(1.8 * weightCurrent)
  const fatG = Math.round(0.8 * weightCurrent)
  const kcalFromPF = proteinG * 4 + fatG * 9
  const carbsG = Math.max(0, Math.round((targetKcal - kcalFromPF) / 4))

  const vals = [BMR, TDEE, targetKcal, proteinG, fatG, carbsG]
  if (vals.some(v => !Number.isFinite(v))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to compute goal (NaN). Check profile data.',
    })
  }

  const goal = await prisma.goal.upsert({
    where: { userId },
    update: {
      weightCurrent,
      weightTarget,
      kcalTarget: targetKcal,
      proteinTarget: proteinG,
      carbsTarget: carbsG,
      fatTarget: fatG,
      activityLevel: body.activityLevel,
      deadline: deadlineDate,
    },
    create: {
      userId,
      weightCurrent,
      weightTarget,
      kcalTarget: targetKcal,
      proteinTarget: proteinG,
      carbsTarget: carbsG,
      fatTarget: fatG,
      activityLevel: body.activityLevel,
      deadline: deadlineDate,
    },
  })

  return {
    goal,
    meta: {
      tdee: Math.round(TDEE),
      weeklyKg: Math.round(weeklyKg * 100) / 100,
      days,
    },
  }
})
