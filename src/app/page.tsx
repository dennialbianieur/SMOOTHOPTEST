"use client";
import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="mb-10">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            The best AI tools, curated weekly.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every week, our agents scan Product Hunt, GitHub and Hacker News.
            Claude ranks the signal from the noise. You get the top 5, no fluff.
          </p>
        </div>

        {state === "success" ? (
          <p className="text-green-700 font-medium text-base">
            You&apos;re in. See you next week.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-base outline-none focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded bg-black px-5 py-2 text-base font-medium text-white disabled:opacity-50"
            >
              {state === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {state === "error" && (
          <p className="mt-3 text-red-600 text-sm">
            Something went wrong. Try again.
          </p>
        )}

        <div className="mt-16 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 p-4 text-center">
            <p className="font-semibold text-gray-900 text-sm">Sourced from</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            <p className="text-gray-500 text-sm mt-1">platforms</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 text-center">
            <p className="font-semibold text-gray-900 text-sm">Ranked by</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Claude</p>
            <p className="text-gray-500 text-sm mt-1">AI-curated</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 text-center">
            <p className="font-semibold text-gray-900 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Weekly</p>
            <p className="text-gray-500 text-sm mt-1">every Monday</p>
          </div>
        </div>
      </div>
    </main>
  );
}
