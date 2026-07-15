"use client";

import { Robo } from "@/components/ui/Robo";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
      <Robo size={130} />
      <h1 className="text-3xl font-extrabold text-ink">Aduh, ada yang tersandung! 🙈</h1>
      <p className="max-w-[46ch] text-inksoft">
        Terjadi kesalahan kecil. Tenang, progres belajarmu aman — coba lagi ya!
      </p>
      <Button onClick={reset}>🔄 Coba lagi</Button>
    </div>
  );
}
