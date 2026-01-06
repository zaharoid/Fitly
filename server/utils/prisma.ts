import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export function startOfUTCDay(d = new Date()) {
  const x = new Date(d)
  x.setUTCHours(0,0,0,0)
  return x
}