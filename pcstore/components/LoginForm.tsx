"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[6%]">
      <form
        onSubmit={submit}
        className="w-full max-w-[400px] bg-white border border-line rounded-[28px] p-9 shadow-[0_30px_70px_-30px_rgba(107,91,216,0.5)]"
      >
        <div className="font-sora font-extrabold text-[1.2rem] mb-6">
          CAPIE GROUP{" "}
          <span className="text-muted text-[0.72rem] font-semibold uppercase tracking-[2px]">admin</span>
        </div>
        <h1 className="font-sora font-bold text-[1.4rem] mb-1">Connexion</h1>
        <p className="text-muted text-[0.85rem] mb-7">Accès réservé à l&apos;équipe CAPIE GROUP.</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            className="field"
            placeholder="admin@pcstore.bj"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            className="field"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <div className="text-[0.82rem] font-medium text-red mt-3">{error}</div>}

        <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 text-[0.8rem] font-medium text-muted hover:text-ink transition-colors mt-6"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour au site
        </Link>
      </form>
    </div>
  );
}