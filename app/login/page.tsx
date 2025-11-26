"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Email atau password salah");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2 style={{ fontSize: 28, marginBottom: 20 }}>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
