import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id as string;
  const body = await readBody<{ date: string; weightKg?: number|null; steps?: number|null }>(event);
  const [y,m,d] = body.date.split('-').map(Number);
  const date = new Date(Date.UTC(y, m-1, d));

  const metric = await prisma.metric.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, weightKg: body.weightKg ?? null, steps: body.steps ?? null },
    update: { weightKg: body.weightKg ?? null, steps: body.steps ?? null }
  });
  return { metric };
});
