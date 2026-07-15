import type { ExplorerItem } from "../engines/ExplorerBoard";
import type { PickRound } from "../engines/PickAnswerGame";
import type { SequenceRound } from "../engines/SequenceBuilder";
import type { LabObject } from "../engines/SinkFloatLab";

/** Content for Literasi Sains learning features. */

export const animalItems: ExplorerItem[] = [
  { key: "kucing", display: "🐱", name: "Kucing", detail: "Tinggal di rumah · Suka ikan", speak: "Kucing! Meong! Kucing suka makan ikan" },
  { key: "ikan", display: "🐟", name: "Ikan", detail: "Tinggal di air · Bernapas dengan insang", speak: "Ikan! Ikan tinggal di dalam air" },
  { key: "burung", display: "🐦", name: "Burung", detail: "Bersarang di pohon · Bisa terbang", speak: "Burung! Cuit cuit! Burung bisa terbang" },
  { key: "katak", display: "🐸", name: "Katak", detail: "Hidup di air dan darat", speak: "Katak! Katak bisa hidup di air dan di darat" },
  { key: "gajah", display: "🐘", name: "Gajah", detail: "Hewan darat terbesar · Punya belalai", speak: "Gajah! Gajah punya belalai yang panjang" },
  { key: "lebah", display: "🐝", name: "Lebah", detail: "Membuat madu · Membantu bunga", speak: "Lebah! Lebah membuat madu yang manis" },
  { key: "sapi", display: "🐄", name: "Sapi", detail: "Memberi kita susu · Makan rumput", speak: "Sapi! Susu berasal dari sapi" },
  { key: "kupu", display: "🦋", name: "Kupu-kupu", detail: "Dulunya ulat, lalu berubah!", speak: "Kupu-kupu! Kupu-kupu dulunya adalah ulat" },
];

export function makeTumbuhanRounds(grade: "tk-a" | "tk-b"): SequenceRound[] {
  const growth: SequenceRound = {
    hint: "🌸",
    hintLabel: "Bunga tumbuh",
    tiles: grade === "tk-a" ? ["🌰", "🌱", "🌸"] : ["🌰", "🌱", "🌿", "🌸"],
    speak: "Urutkan dari biji sampai menjadi bunga!",
  };
  const butterfly: SequenceRound = {
    hint: "🦋",
    hintLabel: "Kupu-kupu tumbuh",
    tiles: grade === "tk-a" ? ["🥚", "🐛", "🦋"] : ["🥚", "🐛", "🟤", "🦋"],
    speak: "Urutkan dari telur sampai menjadi kupu-kupu!",
  };
  return [growth, butterfly];
}

export function makeCuacaRounds(): PickRound[] {
  return [
    {
      prompt: "Hujan turun! Apa yang kita pakai?",
      visual: "🌧️",
      options: [{ label: "☂️", correct: true }, { label: "🕶️" }, { label: "🧢" }],
    },
    {
      prompt: "Matahari terik! Apa yang melindungi kepala?",
      visual: "☀️",
      options: [{ label: "🧢", correct: true }, { label: "🧤" }, { label: "🧣" }],
    },
    {
      prompt: "Udara dingin! Apa yang kita pakai?",
      visual: "🥶",
      options: [{ label: "🧥", correct: true }, { label: "🩳" }, { label: "🕶️" }],
    },
    {
      prompt: "Setelah hujan dan matahari muncul, ada apa di langit?",
      visual: "🌦️",
      options: [{ label: "🌈", correct: true }, { label: "⭐" }, { label: "☁️" }],
    },
    {
      prompt: "Malam hari, apa yang bersinar di langit?",
      visual: "🌃",
      options: [{ label: "🌙", correct: true }, { label: "☀️" }, { label: "🌈" }],
    },
  ];
}

export const bodyItems: ExplorerItem[] = [
  { key: "mata", display: "👁️", name: "Mata", detail: "Untuk melihat", speak: "Mata! Kita melihat dengan mata" },
  { key: "telinga", display: "👂", name: "Telinga", detail: "Untuk mendengar", speak: "Telinga! Kita mendengar dengan telinga" },
  { key: "hidung", display: "👃", name: "Hidung", detail: "Untuk mencium bau", speak: "Hidung! Kita mencium bau dengan hidung" },
  { key: "lidah", display: "👅", name: "Lidah", detail: "Untuk mengecap rasa", speak: "Lidah! Kita merasakan manis dan asin dengan lidah" },
  { key: "tangan", display: "🖐️", name: "Tangan", detail: "Untuk meraba dan memegang", speak: "Tangan! Kita memegang dengan tangan" },
  { key: "kaki", display: "🦶", name: "Kaki", detail: "Untuk berjalan dan berlari", speak: "Kaki! Kita berjalan dengan kaki" },
  { key: "gigi", display: "🦷", name: "Gigi", detail: "Untuk mengunyah · Sikat 2 kali sehari!", speak: "Gigi! Jangan lupa sikat gigi dua kali sehari" },
  { key: "jantung", display: "❤️", name: "Jantung", detail: "Berdetak memompa darah", speak: "Jantung! Coba rasakan, jantungmu berdetak!" },
];

export const planetItems: ExplorerItem[] = [
  { key: "matahari", display: "☀️", name: "Matahari", detail: "Bintang kita — sumber cahaya", speak: "Matahari! Matahari adalah bintang yang menyinari bumi" },
  { key: "merkurius", display: "🟤", name: "Merkurius", detail: "Planet paling dekat Matahari", speak: "Merkurius, planet paling dekat dengan matahari" },
  { key: "venus", display: "🟠", name: "Venus", detail: "Planet paling panas", speak: "Venus, planet yang paling panas" },
  { key: "bumi", display: "🌍", name: "Bumi", detail: "Rumah kita! Ada air dan udara", speak: "Bumi! Ini rumah kita" },
  { key: "mars", display: "🔴", name: "Mars", detail: "Planet merah", speak: "Mars, si planet merah" },
  { key: "jupiter", display: "🟡", name: "Jupiter", detail: "Planet paling besar", speak: "Jupiter, planet yang paling besar" },
  { key: "saturnus", display: "🪐", name: "Saturnus", detail: "Punya cincin cantik", speak: "Saturnus, planet yang punya cincin" },
  { key: "bulan", display: "🌙", name: "Bulan", detail: "Teman Bumi di malam hari", speak: "Bulan! Bulan menemani bumi di malam hari" },
];

export const labObjects: LabObject[] = [
  { emoji: "🪨", name: "Batu", floats: false, fact: "Batu berat dan padat, jadi tenggelam." },
  { emoji: "🍃", name: "Daun", floats: true, fact: "Daun sangat ringan, jadi terapung." },
  { emoji: "⚽", name: "Bola", floats: true, fact: "Bola penuh udara, jadi terapung." },
  { emoji: "🥄", name: "Sendok besi", floats: false, fact: "Besi lebih berat dari air, jadi tenggelam." },
  { emoji: "🦆", name: "Bebek karet", floats: true, fact: "Bebek karet berongga dan ringan, jadi terapung." },
  { emoji: "🔑", name: "Kunci", floats: false, fact: "Kunci terbuat dari logam, jadi tenggelam." },
  { emoji: "🍎", name: "Apel", floats: true, fact: "Apel punya rongga udara kecil — makanya terapung!" },
];

export function makePuzzleSainsRounds(): PickRound[] {
  return [
    {
      prompt: "Di mana rumah ikan?",
      visual: "🐟",
      options: [{ label: "💧", correct: true }, { label: "🌳" }, { label: "🏠" }],
    },
    {
      prompt: "Anak ayam menetas dari…?",
      visual: "🐤",
      options: [{ label: "🥚", correct: true }, { label: "🌰" }, { label: "🎁" }],
    },
    {
      prompt: "Siapa yang membuat madu?",
      visual: "🍯",
      options: [{ label: "🐝", correct: true }, { label: "🦋" }, { label: "🐜" }],
    },
    {
      prompt: "Tanaman butuh apa agar tumbuh?",
      visual: "🌱",
      options: [{ label: "💧☀️", correct: true }, { label: "🍬" }, { label: "📺" }],
    },
    {
      prompt: "Kupu-kupu dulunya adalah…?",
      visual: "🦋",
      options: [{ label: "🐛", correct: true }, { label: "🐟" }, { label: "🐭" }],
    },
  ];
}
