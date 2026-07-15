import type { Metadata } from "next";
import { Baloo_2, Fredoka } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Petualang STEM — TK Sultan Agung",
  description: "Website pembelajaran interaktif STEM untuk siswa TK A dan TK B TK Sultan Agung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${baloo.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-body text-ink">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
