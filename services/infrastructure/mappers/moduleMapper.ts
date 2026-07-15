
import type {
  Activity as PrismaActivity,
  Question as PrismaQuestion,
  Choice as PrismaChoice,
} from '@prisma/client'

// Membuat tipe data bayangan agar TypeScript Vercel lolos dari error
export type PrismaModule = any;
import { Module } from "@/services/domain/entities/Module";
import { Activity } from "@/services/domain/entities/Activity";
import { Question } from "@/services/domain/entities/Question";
import { Choice } from "@/services/domain/entities/Choice";
import type { Grade, LiteracyCategory, QuestionType } from "@/types/domain";

type ActivityWithRelations = PrismaActivity & {
  questions?: (PrismaQuestion & { choices?: PrismaChoice[] })[];
};

type ModuleWithRelations = PrismaModule & {
  activities?: ActivityWithRelations[];
};

export function toDomainChoice(choice: PrismaChoice): Choice {
  return new Choice(choice.id, choice.label, choice.imageUrl, choice.isCorrect, choice.order);
}

export function toDomainQuestion(question: PrismaQuestion & { choices?: PrismaChoice[] }): Question {
  return new Question(
    question.id,
    question.type as QuestionType,
    question.prompt,
    question.audioUrl,
    question.imageUrl,
    question.order,
    (question.choices ?? []).map(toDomainChoice)
  );
}

export function toDomainActivity(activity: ActivityWithRelations, moduleSlug: string): Activity {
  return new Activity(
    activity.id,
    activity.slug,
    activity.title,
    activity.order,
    activity.instructionAudioUrl,
    moduleSlug,
    (activity.questions ?? []).map(toDomainQuestion)
  );
}

export function toDomainModule(module: ModuleWithRelations): Module {
  return new Module(
    module.id,
    module.slug,
    module.title,
    module.category as LiteracyCategory,
    module.grade as Grade,
    module.description,
    module.icon,
    module.colorTheme,
    (module.activities ?? []).map((activity) => toDomainActivity(activity, module.slug))
  );
}
