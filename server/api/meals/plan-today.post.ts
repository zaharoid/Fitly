import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
const prisma = new PrismaClient()

// распределение макросов по приёмам
const SPLIT: Record<string, number> = { breakfast: 0.30, snack: 0.10, lunch: 0.35, dinner: 0.25 }

function startOfUTCDay(d = new Date()) {
  const x = new Date(d)
  x.setUTCHours(0,0,0,0)
  return x
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const goal = await prisma.goal.findUnique({ where: { userId: user.id } })
  if (!goal?.kcalTarget || !goal?.proteinTarget || !goal?.carbsTarget || !goal?.fatTarget) {
    throw createError({ statusCode: 400, statusMessage: 'Goal is not set yet' })
  }

  const date = startOfUTCDay(new Date())

  await prisma.meal.deleteMany({ where: { userId: user.id, date, itemsJson: { path: ['_plan'], equals: true } } }).catch(()=>{})

  const base = {
    kcal: goal.kcalTarget,
    p: goal.proteinTarget,
    c: goal.carbsTarget,
    f: goal.fatTarget
  }

  // Время приёмов (UTC — подкорректируешь при желании)
  const times: Record<string, [number, number]> = {
    breakfast: [8, 30],
    snack:     [11, 0],
    lunch:     [13, 0],
    dinner:    [19, 0],
  }

  const created = []
  for (const [name, frac] of Object.entries(SPLIT)) {
    const [hh, mm] = times[name]
    const time = new Date(date); time.setUTCHours(hh, mm, 0, 0)

    const part = {
      kcal: Math.round(base.kcal * frac),
      protein: Math.round(base.p * frac),
      carbs: Math.round(base.c * frac),
      fat: Math.round(base.f * frac),
    }

    const itemsJson = [
      {
        _plan: true, // флаг, по которому мы легко отличим «план» от реальной записи
        name: `Planned ${name}`,
        grams: null,
        kcal: part.kcal,
        protein: part.protein,
        carbs: part.carbs,
        fat: part.fat,
      }
    ]

    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        date,
        time,
        itemsJson,
        kcal: part.kcal,
        protein: part.protein,
        carbs: part.carbs,
        fat: part.fat,
      }
    })
    created.push({ id: meal.id, name, ...part })
  }

  return { ok: true, created }
})
