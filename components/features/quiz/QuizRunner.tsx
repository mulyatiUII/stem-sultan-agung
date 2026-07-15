"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActivityDetailDTO, ActivityResultDTO, SubmitAnswerInput } from "@/types/dto";
import { ResultCelebration } from "./ResultCelebration";
import { OptionButton } from "@/components/ui/OptionButton";
import { Button } from "@/components/ui/Button";
import { ProgressLights } from "@/components/ui/ProgressLights";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useSpeech } from "@/hooks/useSpeech";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiPost } from "@/lib/apiClient";

type Feedback = "idle" | "checking" | "correct" | "retry" | "moveon";

const ENCOURAGEMENTS = ["Betul! Hebat!", "Pintar sekali!", "Yeay, tepat!"];

export function QuizRunner({ activity }: { activity: ActivityDetailDTO }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SubmitAnswerInput[]>([]);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [pickedChoiceId, setPickedChoiceId] = useState<string | null>(null);
  const [hasRetried, setHasRetried] = useState(false);
  const [result, setResult] = useState<ActivityResultDTO | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const { speak } = useSpeech();
  const { recordResult, profile } = useChildProfile();

  const question = activity.questions[step];

  // Read every question aloud when it appears — children can't read yet.
  useEffect(() => {
    if (question) speak(question.prompt);
  }, [question, speak]);

  const finish = useCallback(
    async (finalAnswers: SubmitAnswerInput[]) => {
      try {
        const submitted = await apiPost<ActivityResultDTO>("/api/results", {
          activityId: activity.id,
          nickname: profile.name || undefined,
          answers: finalAnswers,
        });
        setConnectionError(false);
        setResult(submitted);
        recordResult(activity.slug, {
          stars: submitted.stars,
          correct: submitted.correct,
          total: submitted.total,
          completedAt: submitted.completedAt,
        });
        speak(`Kerja bagus! Kamu mendapat ${submitted.stars} bintang!`);
      } catch {
        setConnectionError(true);
      }
    },
    [activity.id, activity.slug, profile.name, recordResult, speak]
  );

  const advance = useCallback(
    (finalAnswers: SubmitAnswerInput[]) => {
      if (step + 1 < activity.questions.length) {
        setStep((s) => s + 1);
        setFeedback("idle");
        setPickedChoiceId(null);
        setHasRetried(false);
      } else {
        void finish(finalAnswers);
      }
    },
    [step, activity.questions.length, finish]
  );

  async function handleSelect(choiceId: string) {
    if (feedback === "checking" || feedback === "correct") return;

    setPickedChoiceId(choiceId);
    setFeedback("checking");

    let correct: boolean;
    try {
      const verdict = await apiPost<{ correct: boolean }>("/api/answers/check", {
        activityId: activity.id,
        questionId: question.id,
        choiceId,
      });
      correct = verdict.correct;
    } catch {
      // Network hiccup: return to idle so the child can simply tap again.
      setFeedback("idle");
      setPickedChoiceId(null);
      return;
    }

    const nextAnswers = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, choiceId },
    ];
    setAnswers(nextAnswers);

    if (correct) {
      setFeedback("correct");
      speak(ENCOURAGEMENTS[step % ENCOURAGEMENTS.length]);
      setTimeout(() => advance(nextAnswers), 1200);
    } else if (!hasRetried) {
      // One gentle second chance — wrong answers are never punished.
      setFeedback("retry");
      setHasRetried(true);
      speak("Hmm, coba lagi yuk!");
    } else {
      setFeedback("moveon");
      speak("Tidak apa-apa, kita lanjut ya!");
      setTimeout(() => advance(nextAnswers), 1400);
    }
  }

  if (result) {
    return <ResultCelebration result={result} />;
  }

  if (connectionError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-4xl">😴</p>
        <p className="text-xl font-extrabold text-ink">Aduh, koneksinya tersendat!</p>
        <p className="text-sm text-inksoft">Jawabanmu aman — coba kirim lagi ya.</p>
        <Button onClick={() => void finish(answers)}>🔄 Kirim lagi</Button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <ProgressLights total={activity.questions.length} current={step} />
        <SpeakButton text={question.prompt} label="dengarkan" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          <motion.div
            animate={feedback === "retry" ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-ink/5"
          >
            <h2 className="text-3xl font-extrabold text-ink" style={{ textWrap: "balance" }}>
              {question.prompt}
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {question.choices.map((choice) => (
              <OptionButton
                key={choice.id}
                label={choice.label}
                imageUrl={choice.imageUrl}
                picked={pickedChoiceId === choice.id}
                dimmed={feedback === "correct" && pickedChoiceId !== choice.id}
                onSelect={() => handleSelect(choice.id)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 min-h-12 text-center" aria-live="polite">
        {feedback === "correct" && (
          <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-extrabold text-mintdeep">
            ✅ Betul! Hebat! 🎉
          </motion.p>
        )}
        {feedback === "retry" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-sundeep">
            💛 Hmm… coba lagi yuk!
          </motion.p>
        )}
        {feedback === "moveon" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-skydeep">
            💙 Tidak apa-apa, lanjut ya!
          </motion.p>
        )}
      </div>
    </div>
  );
}
