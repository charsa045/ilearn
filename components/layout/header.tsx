"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  name?: string;
  email?: string;
  imageUrl?: string;
};

export default function PublicHeader() {

  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadUser = async () => {

  try {

    const res = await fetch(
      "/api/me",
      {
        cache: "no-store",
      }
    );

    if (res.ok) {

      const data =
        await res.json();

      setUser(data.user);

    } else {

      setUser(null);
    }

  } catch {

    setUser(null);

  } finally {

    setLoading(false);
  }
};

useEffect(() => {

  loadUser();

  // 🔥 Escuchar actualización foto
  const refreshListener =
    () => loadUser();

  window.addEventListener(
    "user-updated",
    refreshListener
  );

  return () => {

    window.removeEventListener(
      "user-updated",
      refreshListener
    );
  };

}, []);

  // 🔥 Logout
  const handleLogout = async () => {

    await fetch(
      "/api/sessionLogout",
      {
        method: "POST",
      }
    );

    setUser(null);

    router.refresh();
  };

  return (

    <header
      className="
        sticky
        top-0
        z-50
        flex
        items-center
        px-6
        py-5
        rounded-b-2xl
        border-b-4
        border-b-gray-400
        hover:border-b-blue-500
        duration-300
        bg-white
        hover:shadow-2xl
      "
    >

      {/* 🔷 LOGO */}
      <Link
        href="/"
        className="
          text-2xl
          font-extrabold
          tracking-wide
          text-blue-600
        "
      >

        <span
          className="
            bg-blue-600
            text-white
            px-4
            py-1
            rounded-md
            mr-1
          "
        >
          i
        </span>

        Learn
      </Link>

      {/* 🔷 NAV */}
      <nav
        className="
          ml-auto
          flex
          items-center
          gap-6
          text-sm
          font-semibold
          text-gray-600
        "
      >

        <Link
          href="/"
          className="
            hover:text-blue-600
            hover:font-extrabold
            hover:italic
          "
        >
          Inicio
        </Link>

        {/* 🔥 SIN SESIÓN */}
        {!loading && !user && (
          <>

            <Link
              href="/signup"
              className="
                hover:text-blue-600
                hover:font-extrabold
                hover:italic
              "
            >
              Registrarse
            </Link>

            <Link
              href="/login"
              className="
                bg-white
                text-blue-600
                py-1
                rounded-full
                font-bold
                transition
                hover:text-blue-600
                hover:font-extrabold
                hover:italic
              "
            >
              Acceder
            </Link>
          </>
        )}

        {/* 🔥 CON SESIÓN */}
        {!loading && user && (

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* 🔥 AVATAR */}
            {user.imageUrl ? (

              <img
                src={user.imageUrl}
                alt="Foto perfil"
                className="
                  w-10
                  h-10
                  rounded-full
                  object-cover
                  border-2
                  border-blue-500
                  shadow
                "
              />

            ) : (

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-lg
                  shadow
                "
              >
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )}

            {/* 🔥 NOMBRE */}
            <span
              className="
                hidden
                sm:block
                font-semibold
              "
            >
              {user.name || user.email}
            </span>

            {/* 🔥 PORTAL */}
            <Link
              href="/dashboard"
              className="
                bg-white
                text-gray-600
                py-1
                rounded-full
                font-bold
                transition
                hover:text-blue-600
                hover:font-extrabold
                hover:italic
              "
            >
              Portal
            </Link>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="
                bg-white
                text-red-600
                px-3
                py-1
                rounded-full
                font-bold
                hover:bg-gray-200
                transition
              "
            >
              Salir
            </button>

          </div>
        )}
      </nav>
    </header>
  );
}