"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || "Login failed");
        return;
      }

      // توجيه حسب الدور
      //window.location.href = data.role === "ADMIN" ? "/admin/approvals" : "/dashboard";

      if (data.role === "ADMIN") window.location.href = "/admin/approvals";
      else if (data.role === "STOREKEEPER") window.location.href = "/warehouse/issue";
      else window.location.href = "/dashboard";


    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border bg-white/5 p-5 shadow"
      >
        <h1 className="text-xl font-semibold mb-1">تسجيل الدخول</h1>
        <p className="text-sm opacity-80 mb-4">أدخل اسم المستخدم وكلمة المرور</p>

        <label className="block text-sm mb-1">اسم المستخدم</label>
        <input
          className="w-full rounded-xl border px-3 py-2 mb-3 bg-transparent"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="block text-sm mb-1">كلمة المرور</label>
        <input
          className="w-full rounded-xl border px-3 py-2 mb-3 bg-transparent"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {err && <div className="text-sm text-red-400 mb-3">{err}</div>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black text-white py-2 disabled:opacity-60"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
