import { getServerSession } from '#auth'
import { prisma } from './prisma'
import { createError } from 'h3'

export async function requireUserId(event: any) {
  const session = await getServerSession(event)
  if (!session?.user?.email) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return user.id
}
