// src/app/tap/[id]/page.tsx   ← FINAL FIX – COPY-PASTE THIS EXACTLY
"use client";

import { use } from "react";
import { useEffect, useState, useRef } from "react";
import { getDrop } from "@/lib/dropStore";
import type { Drop } from "@/lib/dropStore";

export default function TapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [drop, setDrop] = useState<Drop | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setDrop(getDrop(id));
  }, [id]);

  // Force video & audio to reload and play when drop loads
  useEffect(() => {
    if (videoRef.current && drop?.type === "video" && drop.videoURL) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    if (audioRef.current && drop?.type === "imgaudio" && drop.audioURL) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [drop]);

  if (drop === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white text-4xl font-bold animate-pulse">
        Loading drop…
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white text-6xl font-black">
        Drop Not Found
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* VIDEO – key + ref + load() fixes frozen MP4 */}
      {drop.type === "video" && drop.videoURL && (
        <video
          ref={videoRef}
          key={drop.videoURL}
          src={drop.videoURL}
          autoPlay
          loop
          playsInline
          muted={false}
          controls={false}
          className="absolute inset-0 w-full h-full object-cover -z-10"
          preload="auto"
        />
      )}

      {/* IMAGE + AUDIO – key + ref + load() fixes silent MP3 */}
      {drop.type === "imgaudio" && (
        <>
          {drop.imageURL && (
            <img
              src={drop.imageURL}
              alt="cover"
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />
          )}
          {drop.audioURL && (
            <audio
              ref={audioRef}
              key={drop.audioURL}
              src={drop.audioURL}
              autoPlay
              loop
            />
          )}
        </>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white">
        <div className="space-y-6 sm:space-y-8 text-center max-w-2xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl opacity-60 blur-lg group-hover:opacity-80 transition duration-500" />
            <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 p-6 sm:p-8 md:p-10 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.4)]">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                {drop.title}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-4 text-purple-200/90">
                by <strong className="font-black text-pink-300">{drop.artist}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <a
                href={`https://pay.crossmint.com/?price=${drop.priceSOL}&title=${encodeURIComponent(drop.title)}&artist=${encodeURIComponent(drop.artist)}&network=solana`}
                target="_blank"
                rel="noreferrer"
                className="relative block w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-2xl sm:text-3xl md:text-4xl font-black rounded-xl transition-all duration-300 border border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)]"
              >
                Mint & Own — {drop.priceSOL} SOL
              </a>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white to-purple-200 rounded-xl blur-lg opacity-60 group-hover:opacity-90 transition duration-500" />
              <a
                href={drop.social}
                target="_blank"
                rel="noreferrer"
                className="relative block w-full py-6 bg-white/95 hover:bg-white text-black text-2xl sm:text-3xl md:text-4xl font-black rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.7)]"
              >
                Follow Artist
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}