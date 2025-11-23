// src/app/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDrop } from "@/lib/dropStore";

export default function CreateDrop() {
  const { connected } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [priceUSD, setPriceUSD] = useState("10");
  const [socialLink, setSocialLink] = useState("");
  const [status, setStatus] = useState("");
  const [tapLink, setTapLink] = useState("");

  const [solPrice, setSolPrice] = useState(180);

  useEffect(() => {
    setIsMounted(true);
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      .then(r => r.json())
      .then(d => setSolPrice(d.solana.usd || 180));
  }, []);

  const priceInSOL = (parseFloat(priceUSD) || 0) / solPrice;

  const handleMint = async () => {
    // Reset status
    setStatus("");
    setTapLink("");

    // Validation
    if (!title.trim() || !artist.trim()) {
      setStatus("Track Title and Artist Name are required");
      return;
    }

    if (!videoFile && (!imageFile || !audioFile)) {
      setStatus("Please upload an MP4 video OR both a cover image + audio file");
      return;
    }

    setStatus("Preparing your phygital drop...");

    try {
      // Create object URLs (instant, works in browser)
      const videoURL = videoFile ? URL.createObjectURL(videoFile) : undefined;
      const imageURL = imageFile ? URL.createObjectURL(imageFile) : undefined;
      const audioURL = audioFile ? URL.createObjectURL(audioFile) : undefined;

      // Save to global store and get back the full drop with ID
      const drop = createDrop({
        title: title.trim(),
        artist: artist.trim(),
        priceSOL: priceInSOL.toFixed(6),
        social: socialLink.trim() || "https://x.com/bumbacat",
        type: videoFile ? "video" : "imgaudio",
        videoURL,
        imageURL,
        audioURL,
      });

      const link = `${window.location.origin}/tap/${drop.id}`;

      setTapLink(link);
      setStatus("MINTED SUCCESSFULLY! Your drop is live:");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-10">
        <h1 className="text-center text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Create Phygital Track
        </h1>

        <div className="flex justify-center">
          {isMounted && <WalletMultiButton className="h-14 px-10 text-lg font-bold bg-purple-600 rounded-xl shadow-lg" />}
        </div>

        {connected && (
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 md:p-10 shadow-2xl space-y-8">

            <div>
              <Label className="text-purple-300 font-bold text-lg">Track Title</Label>
              <Input placeholder="420 ff" value={title} onChange={e => setTitle(e.target.value)} className="mt-3 bg-black/60 border-purple-500/40 h-14 text-white" />
            </div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">Artist Name</Label>
              <Input placeholder="bumbacat" value={artist} onChange={e => setArtist(e.target.value)} className="mt-3 bg-black/60 border-purple-500/40 h-14 text-white" />
            </div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">Option 1 — Upload MP4 (video + audio)</Label>
              <Input
                type="file"
                accept="video/mp4,.mp4"
                onChange={e => {
                  setVideoFile(e.target.files?.[0] || null);
                  if (e.target.files?.[0]) {
                    setImageFile(null);
                    setAudioFile(null);
                  }
                }}
                className="mt-3 bg-black/60 border-purple-500/40 h-14"
              />
            </div>

            <div className="text-center text-2xl text-purple-400 font-bold">OR</div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">Option 2 — Cover Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => {
                  setImageFile(e.target.files?.[0] || null);
                  if (e.target.files?.[0]) setVideoFile(null);
                }}
                className="mt-3 bg-black/60 border-purple-500/40 h-14"
              />
            </div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">Option 2 — Audio (MP3, M4A, WAV)</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={e => {
                  setAudioFile(e.target.files?.[0] || null);
                  if (e.target.files?.[0]) setVideoFile(null);
                }}
                className="mt-3 bg-black/60 border-purple-500/40 h-14"
              />
            </div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">
                Price in USD <span className="text-sm text-purple-400">≈ {priceInSOL.toFixed(4)} SOL</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-purple-400">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="10"
                  value={priceUSD}
                  onChange={e => setPriceUSD(e.target.value)}
                  className="mt-3 pl-10 bg-black/60 border-purple-500/40 h-14 text-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-purple-300 font-bold text-lg">Social Link (optional)</Label>
              <Input
                placeholder="https://x.com/bumbacat"
                value={socialLink}
                onChange={e => setSocialLink(e.target.value)}
                className="mt-3 bg-black/60 border-purple-500/40 h-14"
              />
            </div>

            <Button
              onClick={handleMint}
              disabled={status.includes("Preparing") || status.includes("MINTED")}
              className="w-full h-16 text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl hover:scale-105 transition disabled:opacity-70"
            >
              {status.includes("Preparing") ? "Creating Drop..." : "Mint & Bind to Chip"}
            </Button>

            {status && (
              <div className={`p-6 rounded-xl text-center ${tapLink ? "bg-green-900/60" : "bg-red-900/60"}`}>
                <p className="text-lg">{status}</p>
                {tapLink && (
                  <>
                    <a
                      href={tapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-lg break-all"
                    >
                      Open Your Drop
                    </a>
                    <p className="mt-4 text-sm opacity-80">Program this URL into your NFC chip</p>
                    <p className="mt-2 text-xs opacity-60 break-all">{tapLink}</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}