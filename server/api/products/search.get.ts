// /server/api/products/search.get.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const q = (getQuery(event).q as string | undefined)?.trim() || ''
  if (!q) return { items: [] }

  const items = await prisma.product.findMany({
    where: {
      name: { contains: q },
      OR: [{ name: { contains: q } }, { brand: { contains: q } }],
    },
    orderBy: { name: 'asc' },
    take: 20,
  })

  return { items }
})
