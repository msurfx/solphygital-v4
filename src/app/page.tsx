// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.2),transparent_60%)]" />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          SOLPHYGITAL
        </h1>
        <p className="text-2xl md:text-4xl mt-6 text-purple-300/80 tracking-widest">
          fusing tech with culture
        </p>
        <p className="text-lg md:text-xl mt-10 max-w-2xl text-gray-400">
          Turn any song into a physical collectible. One tap — full-screen video, instant mint with card or SOL.
        </p>

        <Link href="/create" className="inline-block mt-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative px-16 py-8 bg-black rounded-full border border-purple-500/50 text-3xl font-bold hover:scale-105 transition-all shadow-2xl">
              Create Your Drop
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
