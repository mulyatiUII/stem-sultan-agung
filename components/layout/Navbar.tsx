"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChildProfile } from "@/hooks/useChildProfile";
import { cn } from "@/utils/cn";

/**
 * Main menu. Literacy links follow the child's chosen grade (from Profil),
 * defaulting to TK A. Adult areas sit at the far end, visually quieter.
 */
export function Navbar() {
  const pathname = usePathname();
  const { profile } = useChildProfile();
  const grade = profile.grade;

  const childLinks = [
    { href: "/", label: "🏡 Beranda", exact: true },
    { href: `/${grade}/bahasa`, label: "🏠 Bahasa" },
    { href: `/${grade}/numerik`, label: "🚀 Numerik" },
    { href: `/${grade}/sains`, label: "🌱 Sains" },
    { href: "/game", label: "🧩 Game" },
    { href: "/quiz", label: "⭐ Quiz" },
    { href: "/profil", label: `${profile.avatar || "🐱"} Profil` },
  ];

  const adultLinks = [
    { href: "/materi", label: "Materi Guru" },
    { href: "/ortu", label: "Orang Tua" },
    { href: "/admin", label: "Admin" },
  ];

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-ink/5 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-extrabold text-blushdeep">
          TK Sultan Agung
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Menu utama">
          {childLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition-colors",
                isActive(link.href, link.exact)
                  ? "bg-blush text-ink"
                  : "text-ink hover:bg-blushsoft"
              )}
            >
              {link.label}
            </Link>
          ))}

          <span aria-hidden className="mx-2 h-5 w-px shrink-0 bg-ink/10" />

          {adultLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive(link.href) ? "bg-lilac text-ink" : "text-inksoft hover:bg-lilacsoft"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
