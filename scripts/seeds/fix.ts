import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function normalizeName(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
}

async function main() {
  const products = await prisma.product.findMany({ where: { nameKey: null }, take: 5000 })
  console.log(`Found ${products.length} products without nameKey`)

  for (const p of products) {
    const key = normalizeName(p.name)
    await prisma.product.update({
      where: { id: p.id },
      data: { nameKey: key }
    })
  }

  console.log('Updated all products with nameKey ✅')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
