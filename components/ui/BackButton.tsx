import Link from "next/link";
import { cn } from "@/utils/cn";

/** Home/back control — always top-left, same position on every child screen. */
export function BackButton({ href, label = "Kembali", className }: { href: string; label?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-ink shadow-md transition-transform hover:scale-105 hover:bg-blushsoft",
        className
      )}
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}
