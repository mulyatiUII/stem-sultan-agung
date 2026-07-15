import type { StemAspect } from "@/types/learning";
import { STEM_LABELS } from "@/types/learning";
import { cn } from "@/utils/cn";

const BADGE_STYLE: Record<StemAspect, string> = {
  S: "bg-mintsoft text-mintdeep",
  T: "bg-skysoft text-skydeep",
  E: "bg-sunsoft text-sundeep",
  M: "bg-lilacsoft text-lilacdeep",
};

/** Small S/T/E/M badges shown to teachers & parents on activity cards. */
export function StemBadges({ aspects, className }: { aspects: StemAspect[]; className?: string }) {
  return (
    <span className={cn("inline-flex gap-1", className)}>
      {aspects.map((a) => (
        <span
          key={a}
          title={STEM_LABELS[a]}
          className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-extrabold", BADGE_STYLE[a])}
        >
          {a}
        </span>
      ))}
    </span>
  );
}
