"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Login failed: ${error.message}`);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(`Sign up failed: ${error.message}`);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    alert("Sign up completed. Check your email and verify your account.");
    setMode("login");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      await handleLogin();
    } else {
      await handleSignup();
    }

    setLoading(false);
  }

  const title = mode === "login" ? "LOGIN" : "SIGN UP";
  const submitLabel = mode === "login" ? "Log in" : "Create account";
  const helperText =
    mode === "login"
      ? "Use your existing account."
      : "Create a new account with email and password.";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="flex rounded-xl border border-zinc-800 p-1 bg-zinc-950">
          <button
            type="button"
            onClick={() => !loading && setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              mode === "login"
                ? "bg-lime-400 text-black"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => !loading && setMode("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
              mode === "signup"
                ? "bg-lime-400 text-black"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            SIGN UP
          </button>
        </div>

        <div className="text-2xl font-black">{title}</div>
        <div className="text-zinc-400 text-sm">{helperText}</div>

        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-lime-400 text-black font-black p-3 disabled:opacity-60"
        >
          {loading ? "..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
