"use client";

import PublicHeader from "@/components/layout/header";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, configureAuthPersistence } from "@/lib/firebase-client";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirectTo") ?? "/dashboard";

  async function sessionLogin() {
    const idToken = await auth.currentUser?.getIdToken(true);
    if (!idToken) throw new Error("No idToken");

    const res = await fetch("/api/sessionLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken, remember }),
    });

    if (!res.ok) {
      throw new Error("No se pudo crear la sesión");
    }
  }

  async function sessionLoginWithToken(idToken: string) {
    const res = await fetch("/api/sessionLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken, remember }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      console.log("🔥 ERROR BACKEND:", data);

      throw new Error(data?.error || "No se pudo crear la sesión");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      await configureAuthPersistence(remember);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken(true);

      await sessionLoginWithToken(idToken);

      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      setErr(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setErr(null);
    setLoading(true);

    try {
      await configureAuthPersistence(remember);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      await sessionLogin();

      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      setErr(e.message || "Error con Google");
    } finally {
      setLoading(false);
    }
  }

  return (
      <>
      <PublicHeader isLogin />

      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

        {/* 🔥 FONDO */}
        <div className="absolute inset-0 bg-[url('/bg-school.jpg')] bg-cover bg-center" />

        {/* 🔥 OVERLAY DEGRADADO */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-950 to-emerald-600" />

        {/* 🔥 CONTENIDO */}
        <div className="relative z-10 w-full max-w-md">

          <form
            onSubmit={onSubmit}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-5 border border-white/40"
          >

            {/* 🔹 TITULO */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900">
                Iniciar sesión
              </h2>
              <p className="text-sm text-gray-500">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* 🔹 INPUTS */}
            <div className="space-y-4">

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg text-gray-600 hover:text-blue-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-20 rounded-lg text-gray-600 hover:text-blue-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium hover:underline"
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            {/* 🔹 RECORDAR */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-blue-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-blue-600"
                />
                Recordarme
              </label>
            </div>

            {/* 🔹 ERROR */}
            {err && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {err}
              </p>
            )}

            {/* 🔹 BOTÓN LOGIN */}
            <button
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>

            {/* 🔹 DIVISOR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-400">O</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* 🔹 GOOGLE */}
            <button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-gray-600 hover:text-black border border-gray-300 bg-white hover:bg-gray-100 transition"
            >
              Continuar con Google
            </button>

            {/* 🔹 FOOTER */}
            <p className="text-sm text-center text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Regístrate
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}