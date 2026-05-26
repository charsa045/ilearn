"use client";

import { useState } from "react";

import PublicHeader from "@/components/layout/header";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  auth,
  configureAuthPersistence,
} from "@/lib/firebase-client";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function SignUp() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirm, setConfirm] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [err, setErr] =
    useState<string | null>(null);

  const router = useRouter();

  async function sessionLogin() {

    const idToken =
      await auth.currentUser?.getIdToken(
        true
      );

    if (!idToken) {
      throw new Error("No idToken");
    }

    await fetch("/api/sessionLogin", {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        idToken,
      }),
    });
  }

  async function uploadImage() {

    if (!imageFile) {
      throw new Error(
        "Debes seleccionar una imagen"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      imageFile
    );

    const res = await fetch(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(
        data.message ||
          "Error subiendo imagen"
      );
    }

    return {
      imageUrl:
        data.data.imageUrl,
      publicId:
        data.data.publicId,
    };
  }

  async function onSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setErr(null);

    if (
      password !== confirm
    ) {

      setErr(
        "Las contraseñas no coinciden"
      );

      return;
    }

    if (!imageFile) {

      setErr(
        "Debes seleccionar una foto de perfil"
      );

      return;
    }

    setLoading(true);

    try {

      await configureAuthPersistence(
        true
      );

      const {
        imageUrl,
      } = await uploadImage();

      const cred =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        cred.user;

      await updateProfile(user, {

        displayName: name,

        photoURL: imageUrl,
      });

      const res =
        await fetch(
          "/api/usuarios",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              uid: user.uid,

              nombre: name,

              email,

              rol: "docente",

              imageUrl,
            }),
          }
        );

      if (!res.ok) {

        throw new Error(
          "Error creando usuario"
        );
      }

      await sessionLogin();

      router.push(
        "/dashboard"
      );

      router.refresh();

    } catch (e: any) {

      console.error(e);

      setErr(
        e.message ||
          "Error al registrarse"
      );

    } finally {

      setLoading(false);
    }
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const inputClassName =
    `
      w-full
      px-4
      py-2
      rounded-lg
      border
      border-gray-300
      bg-white
      text-gray-900
      hover:text-blue-500
      placeholder-gray-400
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      outline-none
      transition
      appearance-none
    `;

  return (
    <>

      <PublicHeader />

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gradient-to-br
          from-blue-400
          via-blue-950
          to-emerald-600
          px-4
        "
      >

        <form
          onSubmit={onSubmit}
          className="
            w-full
            max-w-md
            bg-white/80
            backdrop-blur-md
            border
            shadow-xl
            rounded-2xl
            p-8
            space-y-5
          "
        >

          {/* Título */}
          <div className="text-center space-y-1">

            <h2
              className="
                text-2xl
                font-bold
                text-blue-900
              "
            >
              Crear cuenta
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Regístrate para comenzar
            </p>
          </div>

          {/* FOTO */}
          <div className="flex flex-col items-center space-y-3">

            <label
              className="
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Foto de perfil
            </label>

            <div
              className="
                w-28
                h-28
                rounded-full
                overflow-hidden
                border-4
                border-blue-200
                shadow
                bg-gray-100
                flex
                items-center
                justify-center
              "
            >

              {preview ? (

                <img
                  src={preview}
                  alt="Preview"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <span className="text-gray-400 text-sm">
                  Sin foto
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              required
              onChange={
                handleImageChange
              }
              className="
                text-sm
                text-gray-700
              "
            />
          </div>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
              className={
                inputClassName
              }
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className={
                inputClassName
              }
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className={
                inputClassName
              }
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) =>
                setConfirm(
                  e.target.value
                )
              }
              required
              className={
                inputClassName
              }
            />
          </div>

          {err && (

            <p
              className="
                text-sm
                text-red-600
                bg-red-50
                border
                border-red-200
                rounded-md
                px-3
                py-2
              "
            >
              {err}
            </p>
          )}

          <button
            disabled={loading}
            className="
              w-full
              py-2.5
              rounded-lg
              bg-blue-600
              text-white
              font-semibold
              hover:bg-blue-700
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >

            {loading
              ? "Creando cuenta..."
              : "Registrarse"}
          </button>

          {/* 🔹 Footer */}
          <p
            className="
              text-sm
              text-center
              text-gray-600
            "
          >

            ¿Ya tienes cuenta?{" "}

            <Link
              href="/login"
              className="
                text-blue-600
                hover:underline
                font-medium
              "
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}