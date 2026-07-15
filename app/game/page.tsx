import { BeadGame } from "@/components/features/game/BeadGame";
import { BackButton } from "@/components/ui/BackButton";

export const metadata = { title: "Game — Petualang STEM" };

export default function GamePage() {
  return (
    <div className="min-h-full bg-blushsoft">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <BackButton href="/" label="Beranda" />
        <div className="mt-6">
          <BeadGame />
        </div>
      </div>
    </div>
  );
}
