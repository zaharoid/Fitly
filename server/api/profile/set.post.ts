import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{
    sex?: 'm'|'f'
    age?: number
    heightCm?: number
    weightKg?: number
  }>(event)

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      sex: body.sex ?? null,
      age: body.age ?? null,
      heightCm: body.heightCm ?? null,
      weightKg: body.weightKg ?? null,
    },
    select: { id: true, sex: true, age: true, heightCm: true, weightKg: true }
  })

  return { profile: user }
})
