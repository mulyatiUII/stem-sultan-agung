"use client";

import { useCallback } from "react";

/**
 * Reads text aloud in Indonesian via the Web Speech API.
 * Development stand-in for recorded teacher audio (Question.audioUrl) —
 * children in TK can't read, so every instruction must be speakable.
 */
export function useSpeech() {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech is an enhancement; never let it break the page.
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
