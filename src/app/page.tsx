import Link from 'next/link';
import { Button } from '../components/ui/button'; // Asumsi kamu punya komponen button dari shadcn

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Publik */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-bold">Physics Festival 2026</h1>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/register">
            <Button>Daftar Sekarang</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Olimpiade Fisika Terbesar di Sumatera
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl">
          Tunjukkan kemampuanmu, bentuk tim terbaik, dan menangkan total hadiah puluhan juta rupiah.
          Pendaftaran gelombang pertama telah dibuka!
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8">Mulai Perjalananmu</Button>
        </Link>
      </main>

      {/* Footer Publik */}
      <footer className="py-6 text-center text-sm text-slate-500 border-t">
        © 2026 Physics Festival Committee.
      </footer>
    </div>
  );
}