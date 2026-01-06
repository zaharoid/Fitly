import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id as string;
  const today = new Date();
  const dateToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dateY = new Date(dateToday); dateY.setUTCDate(dateY.getUTCDate() - 1);

  const yMeals = await prisma.meal.findMany({ where: { userId, date: dateY } });
  for (const m of yMeals) {
    const time = new Date(); // текущее время или сдвигай по порядку
    await prisma.meal.create({
      data: {
        userId,
        date: dateToday,
        time,
        itemsJson: m.itemsJson,
        kcal: m.kcal, protein: m.protein, carbs: m.carbs, fat: m.fat,
      }
    });
  }
  return { copied: yMeals.length };
});
