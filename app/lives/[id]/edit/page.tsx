"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function EditLivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [artist, setArtist] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [venue, setVenue] = useState("");
  const [openTime, setOpenTime] = useState("18:00");
  const [startTime, setStartTime] = useState("19:00");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const fetchLive = async () => {
      const { data, error } = await supabase
        .from("lives")
        .select("id, artist, live_date, venue, open_time, start_time, memo")
        .eq("id", id)
        .single();

      if (error) {
        alert(`読み込み失敗: ${error.message}`);
        router.replace("/");
        return;
      }

      setArtist(data.artist ?? "");
      setLiveDate(data.live_date ?? "");
      setVenue(data.venue ?? "");
      setOpenTime(data.open_time ?? "18:00");
      setStartTime(data.start_time ?? "19:00");
      setMemo(data.memo ?? "");

      setLoading(false);
    };

    fetchLive();
  }, [id, router]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("lives")
      .update({
        artist,
        live_date: liveDate,
        venue: venue || null,
        open_time: openTime || null,
        start_time: startTime || null,
        memo: memo || null,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(`更新失敗: ${error.message}`);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">読み込み中...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-2xl font-black mb-4">EDIT LIVE</div>

      <form onSubmit={handleUpdate} className="space-y-3 max-w-md">
        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="ARTIST"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          type="date"
          value={liveDate}
          onChange={(e) => setLiveDate(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="VENUE"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        {/* OPEN / START：NEW LIVEと同じ見た目 */}
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

        <textarea
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 min-h-[120px]"
          placeholder="形式メモ（例：スタンディング / 整番 / セトリ覚え書き など）"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <button
          disabled={saving}
          className="rounded-xl bg-lime-400 text-black font-black px-4 py-3 disabled:opacity-60"
        >
          {saving ? "..." : "更新"}
        </button>
      </form>
    </div>
  );
}
