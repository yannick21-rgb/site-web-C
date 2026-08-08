"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        className="w-full max-w-[380px] bg-surface border border-line rounded-[12px] p-8"
      >
        <div className="font-chakra text-lg font-bold mb-6">
          PC<span className="text-cyan">Store</span> <span className="text-muted mono text-xs">admin</span>
        </div>
        <h1 className="text-[1.4rem] mb-1">Connexion</h1>
        <p className="text-muted text-[0.85rem] mb-6">Accès réservé à l&apos;équipe PCStore.</p>

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

        {error && <div className="mono text-[0.78rem] text-red mt-3">{error}</div>}

        <button type="submit" className="btn-primary w-full mt-5" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
