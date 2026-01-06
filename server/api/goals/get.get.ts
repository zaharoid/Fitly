import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const goal = await prisma.goal.findUnique({ where: { userId: user.id } })
  return { goal }
})
