import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Item = { name: string; grams: number; kcal: number; protein: number; carbs: number; fat: number; productId?: string };

export default defineEventHandler( async (event) => {
  const userId = event.context.user.id as string;
  const body = await readBody<{ name: string; items: Item[]; servings?: number }>(event);

  const s = body.items.reduce((a, x) => {
    a.kcal += x.kcal; a.p += x.protein; a.c += x.carbs; a.f += x.fat; return a;
  }, {kcal:0, p:0, c:0, f:0});

  const rec = await prisma.recipe.create({
    data: {
      userId, name: body.name,
      itemsJson: body.items,
      totalKcal: s.kcal, totalP: s.p, totalC: s.c, totalF: s.f,
      servings: body.servings ?? 1
    }
  });
  return { recipe: rec };
});
