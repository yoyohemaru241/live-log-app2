"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewLivePage() {
  const router = useRouter();

  const [artist, setArtist] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [venue, setVenue] = useState("");
  const [openTime, setOpenTime] = useState("18:00");
  const [startTime, setStartTime] = useState("19:00");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("lives").insert({
      artist,
      live_date: liveDate,
      venue: venue || null,
      open_time: openTime || null,
      start_time: startTime || null,
      memo: memo || null,
    });

    setLoading(false);

    if (error) {
      alert(`登録失敗: ${error.message}`);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-2xl font-black mb-4">NEW LIVE</div>

      <form onSubmit={onSubmit} className="space-y-3 max-w-md">
        {/* ARTIST */}
        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="ARTIST"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />

        {/* DATE */}
        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          type="date"
          value={liveDate}
          onChange={(e) => setLiveDate(e.target.value)}
          required
        />

        {/* VENUE */}
        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="VENUE"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        {/* OPEN / START */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="mb-2 text-xs font-black tracking-widest text-zinc-400">
              OPEN
            </div>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-zinc-800 p-3 font-black"
            />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="mb-2 text-xs font-black tracking-widest text-zinc-400">
              START
            </div>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-zinc-800 p-3 font-black"
            />
          </div>
        </div>

        {/* MEMO */}
        <textarea
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 min-h-[120px]"
          placeholder="形式メモ（例：スタンディング / 整番 / セトリ覚え書き など）"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {/* SAVE BUTTON */}
        <button
          disabled={loading}
          className="rounded-xl bg-lime-400 text-black font-black px-4 py-3 disabled:opacity-60"
        >
          {loading ? "..." : "保存"}
        </button>
      </form>
    </div>
  );
}
