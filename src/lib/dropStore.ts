// src/lib/dropStore.ts  ← FINAL VERSION — NO VERCEL KV
export type DropType = "video" | "imgaudio";

export type Drop = {
  id: string;
  title: string;
  artist: string;
  priceSOL: string;
  social: string;
  type: DropType;
  videoURL?: string;
  imageURL?: string;
  audioURL?: string;
};

const memoryStore = new Map<string, Drop>();

const generateId = () => Math.random().toString(36).substring(2, 10);

export const createDrop = (data: Omit<Drop, "id">): Drop => {
  const id = generateId();
  const drop = { ...data, id };
  memoryStore.set(id, drop);
  if (typeof window !== "undefined") {
    localStorage.setItem(`drop_${id}`, JSON.stringify(drop));
  }
  return drop;
};

export const getDrop = (id: string): Drop | null => {
  if (memoryStore.has(id)) return memoryStore.get(id)!;
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`drop_${id}`);
    if (saved) {
      const drop = JSON.parse(saved) as Drop;
      memoryStore.set(id, drop);
      return drop;
    }
  }
  return null;
};

export {};