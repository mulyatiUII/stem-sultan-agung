import { PrismaClient } from "@prisma/client";
import { demoModules } from "../services/infrastructure/data/demoContent";

/**
 * Seeds PostgreSQL from the same demo content the in-memory mode serves —
 * one source of truth (services/infrastructure/data/demoContent.ts), two
 * storage backends. Run with: npm run prisma:seed
 */
const prisma = new PrismaClient();

async function main() {
  await prisma.activityResult.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.module.deleteMany();

  for (const [moduleOrder, mod] of demoModules.entries()) {
    await prisma.module.create({
      data: {
        slug: mod.slug,
        title: mod.title,
        category: mod.category,
        grade: mod.grade,
        description: mod.description,
        icon: mod.icon,
        colorTheme: mod.colorTheme,
        order: moduleOrder + 1,
        activities: {
          create: mod.activities.map((activity) => ({
            slug: activity.slug,
            title: activity.title,
            order: activity.order,
            instructionAudioUrl: activity.instructionAudioUrl,
            questions: {
              create: activity.questions.map((question) => ({
                type: question.type,
                prompt: question.prompt,
                audioUrl: question.audioUrl,
                imageUrl: question.imageUrl,
                order: question.order,
                choices: {
                  create: question.choices.map((choice) => ({
                    label: choice.label,
                    imageUrl: choice.imageUrl,
                    isCorrect: choice.isCorrect,
                    order: choice.order,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  const counts = await Promise.all([prisma.module.count(), prisma.activity.count(), prisma.question.count()]);
  console.log(`Seeded ${counts[0]} modules, ${counts[1]} activities, ${counts[2]} questions.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
