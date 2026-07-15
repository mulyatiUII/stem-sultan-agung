import Link from "next/link";
import { Robo } from "@/components/ui/Robo";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
      <Robo size={130} />
      <h1 className="text-3xl font-extrabold text-ink">Waduh, Robo tersesat! 🗺️</h1>
      <p className="max-w-[46ch] text-inksoft">Halaman yang dicari tidak ada. Yuk kembali ke beranda!</p>
      <Link
        href="/"
        className="rounded-3xl bg-blush px-8 py-4 text-lg font-bold text-ink shadow-lg shadow-blush/40 transition-transform hover:scale-105"
      >
        🏡 Kembali ke Beranda
      </Link>
    </div>
  );
}
