import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Live } from "@/lib/lives";

function toLocalDate(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export default async function Page() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("lives")
    .select("id, artist, live_date, venue, open_time, start_time")
    .order("live_date", { ascending: true });

  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  const lives = (data ?? []) as Live[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureLives = lives.filter((l) => toLocalDate(l.live_date) >= today);
  const nextLive = futureLives[0];
  const scheduleLives = futureLives.slice(1);

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28">
      <div className="mb-4">
        <h1 className="text-2xl font-black">HOME</h1>
      </div>

      <div className="mb-8">
        <div className="text-4xl font-black tracking-tight mb-3">NEXT LIVE</div>

        {nextLive ? (
          <Link
            href={`/lives/${nextLive.id}/edit`}
            className="block rounded-3xl border border-lime-400/60 overflow-hidden hover:border-lime-400 transition"
          >
            <div className="bg-lime-400 text-black p-6">
              <div className="text-2xl font-black">{nextLive.live_date}</div>
              <div className="text-4xl font-black mt-2">{nextLive.artist}</div>
            </div>

            <div className="p-6 bg-zinc-950">
              <div className="text-lime-400 font-black tracking-wide mb-2">VENUE</div>
              <div className="text-2xl font-black">{nextLive.venue ?? "TBD"}</div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-lime-400 font-black">OPEN</div>
                  <div className="text-2xl font-black">{nextLive.open_time ?? "-"}</div>
                </div>
                <div>
                  <div className="text-lime-400 font-black">START</div>
                  <div className="text-2xl font-black">{nextLive.start_time ?? "-"}</div>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-zinc-400 border border-zinc-800 rounded-2xl p-4">
            No upcoming live. Add one from the + button.
          </div>
        )}
      </div>

      <div className="mb-10">
        <div className="text-4xl font-black tracking-tight mb-3">SCHEDULE</div>

        {scheduleLives.length === 0 ? (
          <div className="text-zinc-400 border border-zinc-800 rounded-2xl p-4">
            Only NEXT LIVE is scheduled.
          </div>
        ) : (
          <div className="grid gap-3">
            {scheduleLives.map((live) => (
              <Link key={live.id} href={`/lives/${live.id}/edit`}>
                <div className="border border-zinc-800 rounded-2xl p-4 bg-black/40 hover:border-lime-400 transition">
                  <div className="inline-block bg-lime-400 text-black font-black px-3 py-1 rounded-lg">
                    {live.live_date}
                  </div>
                  <div className="text-2xl font-black mt-2">{live.artist}</div>
                  <div className="text-zinc-300 mt-1">{live.venue ?? ""}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/lives/new"
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-lime-400 text-black flex items-center justify-center text-4xl font-black shadow-lg"
        aria-label="Add live"
      >
        +
      </Link>
    </div>
  );
}
