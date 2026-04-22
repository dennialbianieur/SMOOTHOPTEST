"use client";
import { useState, useEffect } from "react";
import type { RawTool, Newsletter } from "@/lib/types";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tools, setTools] = useState<RawTool[] | null>(null);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [newsletterId, setNewsletterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jsonOpen, setJsonOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (!saved) return;
    // Re-verify saved token on mount — if it fails, clear it and show login
    setToken(saved);
    fetch("/api/fetch-tools", {
      method: "POST",
      headers: { Authorization: `Bearer ${saved}`, "Content-Type": "application/json" },
      body: "{}",
    }).then((res) => {
      if (res.ok) {
        setIsAuthed(true);
      } else {
        localStorage.removeItem("admin_token");
        setToken("");
      }
    }).catch(() => {
      localStorage.removeItem("admin_token");
      setToken("");
    });
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/fetch-tools", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}",
    });
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("admin_token", token);
      setIsAuthed(true);
      const data = await res.json();
      setTools(data.tools);
      setMessage(`Found ${data.count} tools`);
      setStep(2);
    } else {
      setMessage("Invalid password");
    }
  }

  async function fetchTools() {
    setLoading(true);
    setMessage("Fetching tools...");
    const res = await fetch("/api/fetch-tools", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}",
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setTools(data.tools);
      setMessage(`Found ${data.count} tools`);
      setStep(2);
    } else {
      setMessage("Failed to fetch tools");
    }
  }

  async function generate() {
    if (!tools) return;
    setLoading(true);
    setMessage("Generating newsletter...");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ tools }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setNewsletter(data.newsletter);
      setNewsletterId(data.id);
      setMessage("Newsletter generated");
      setStep(3);
    } else {
      setMessage("Failed to generate");
    }
  }

  async function send() {
    if (!newsletterId) return;
    setLoading(true);
    setMessage("Sending...");
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ newsletterId }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setMessage(`Sent to ${data.sent} subscribers`);
    } else {
      setMessage("Send failed");
    }
  }

  // Render password form if not authed
  if (!isAuthed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={login} className="flex flex-col gap-4 w-full max-w-sm">
          <h1 className="text-xl font-bold">Admin</h1>
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <button type="submit" disabled={loading} className="bg-black text-white rounded px-4 py-2">
            {loading ? "Checking..." : "Login"}
          </button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
      </main>
    );
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken("");
    setIsAuthed(false);
    setStep(1);
    setTools(null);
    setNewsletter(null);
    setNewsletterId(null);
    setMessage("");
  }

  // Pipeline UI
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Newsletter Pipeline</h1>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600 underline">
          Logout
        </button>
      </div>

      {/* Step 1 */}
      <div className="border rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Step 1: Fetch Tools</span>
          <button onClick={fetchTools} disabled={loading} className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Run →
          </button>
        </div>
        {tools && <p className="text-green-600 text-sm mt-2">✓ Found {tools.length} tools</p>}
      </div>

      {/* Step 2 */}
      <div className={`border rounded-lg p-6 mb-4 ${step < 2 ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">Step 2: Generate</span>
          <button onClick={generate} disabled={loading || step < 2} className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Run →
          </button>
        </div>
        {newsletter && (
          <div className="mt-2">
            <p className="text-green-600 text-sm">✓ Newsletter generated: {newsletter.subject}</p>
            <button onClick={() => setJsonOpen(!jsonOpen)} className="text-blue-500 text-sm underline mt-1">
              {jsonOpen ? "Hide" : "Show"} JSON preview
            </button>
            {jsonOpen && (
              <pre className="bg-gray-50 rounded p-3 mt-2 text-xs overflow-auto max-h-64">
                {JSON.stringify(newsletter, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div className={`border rounded-lg p-6 mb-4 ${step < 3 ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">Step 3: Send</span>
          <button onClick={send} disabled={loading || step < 3} className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Send →
          </button>
        </div>
      </div>

      {/* Status */}
      {message && <p className="text-gray-600 text-sm mt-4">{message}</p>}
      {loading && <p className="text-gray-400 text-sm">Working...</p>}
    </main>
  );
}
