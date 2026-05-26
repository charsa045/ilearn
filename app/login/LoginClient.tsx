"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  configureAuthPersistence,
} from "@/lib/firebase-client";

export default function LoginClient() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [remember, setRemember] =
    useState(true);

  const [showPass, setShowPass] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [err, setErr] =
    useState<string | null>(null);

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const redirectTo =
    searchParams.get(
      "redirectTo"
    ) || "/dashboard";

  async function sessionLoginWithToken(
    idToken: string
  ) {

    const res =
      await fetch(
        "/api/sessionLogin",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            idToken,
            remember,
          }),
        }
      );

    if (!res.ok) {

      const data =
        await res
          .json()
          .catch(() => null);

      throw new Error(
        data?.error ||
          "No se pudo crear la sesión"
      );
    }
  }

  async function onSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setErr(null);

    setLoading(true);

    try {

      await configureAuthPersistence(
        remember
      );

      const cred =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const idToken =
        await cred.user.getIdToken(
          true
        );

      await sessionLoginWithToken(
        idToken
      );

      router.push(
        redirectTo
      );

      router.refresh();

    } catch (e: any) {

      setErr(
        e.message ||
        "Error al iniciar sesión"
      );

    } finally {

      setLoading(false);
    }
  }

  async function onGoogle() {

    setErr(null);

    setLoading(true);

    try {

      await configureAuthPersistence(
        remember
      );

      const provider =
        new GoogleAuthProvider();

      const cred =
        await signInWithPopup(
          auth,
          provider
        );

      const idToken =
        await cred.user.getIdToken(
          true
        );

      await sessionLoginWithToken(
        idToken
      );

      router.push(
        redirectTo
      );

      router.refresh();

    } catch (e: any) {

      setErr(
        e.message ||
        "Error con Google"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        relative
        overflow-hidden
      "
    >

      {/* Fondo */}
      <div
        className="
          absolute
          inset-0
          bg-[url('/bg-school.jpg')]
          bg-cover
          bg-center
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-blue-400
          via-blue-950
          to-emerald-600
        "
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >

        <form
          onSubmit={onSubmit}
          className="
            bg-white/90
            backdrop-blur-md
            rounded-2xl
            shadow-2xl
            p-8
            space-y-5
            border
            border-white/40
          "
        >

          <div
            className="
              text-center
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-blue-900
              "
            >
              Iniciar sesión
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Accede a tu cuenta
            </p>

          </div>

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            className="
              w-full
              px-4
              py-2
              border
              rounded-lg
              text-gray-700
            "
          />

          <div
            className="
              relative
            "
          >

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className="
                w-full
                px-4
                py-2
                border
                rounded-lg
                text-gray-700
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPass(
                  !showPass
                )
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-blue-600
                text-sm
              "
            >

              {showPass
                ? "Ocultar"
                : "Ver"}

            </button>

          </div>

          <label
            className="
              flex
              gap-2
              text-blue-700
            "
          >

            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(
                  e.target.checked
                )
              }
            />

            Recordarme

          </label>

          {err && (

            <p
              className="
                text-red-600
                text-sm
              "
            >
              {err}
            </p>

          )}

          <button
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-2
              rounded-lg
              font-bold
            "
          >

            {loading
              ? "Ingresando..."
              : "Entrar"}

          </button>

          <button
            type="button"
            onClick={onGoogle}
            disabled={loading}
            className="
              w-full
              border
              py-2
              rounded-lg
              text-gray-700
            "
          >

            Continuar con Google

          </button>

          <p
            className="
              text-center
              text-sm
              text-gray-600
            "
          >

            ¿No tienes cuenta?{" "}

            <Link
              href="/signup"
              className="
                text-blue-600
              "
            >
              Regístrate
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}