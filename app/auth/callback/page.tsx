"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // まず今のURLに含まれる認証結果をSupabaseが処理できるように待つ
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        router.replace("/login");
        return;
      }

      if (data.session) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      認証中...
    </div>
  );
}
