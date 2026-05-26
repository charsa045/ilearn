"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";

export default function NuevoDocentePage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState({
    grado: "",
    area: "",
    titulo: "",
    correo: "",
    password: "",
    especialidad: "",
    institucion: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.push("/login");
      return;
    }

    fetch(`/api/usuarios?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);

        setForm((prev) => ({
          ...prev,
          correo: user.email || "",
        }));
      })
      .finally(() => setLoadingUser(false));
  }, [router]);

  if (loadingUser) {
    return (
      <p className="text-white text-center mt-10">
        Cargando...
      </p>
    );
  }

  const isAdmin = usuario?.rol === "admin";

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "grado" || name === "area") {
      const newForm = {
        ...form,
        [name]: value,
      };

      if (newForm.grado && newForm.area) {
        newForm.titulo = `${newForm.grado} en ${newForm.area}`;
      }

      setForm(newForm);
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!usuario) {
        throw new Error("Usuario no cargado aún");
      }

      const body = isAdmin
        ? {
            email: form.correo,
            password: form.password,
            nombre: form.correo.split("@")[0],

            grado: form.grado,
            titulo: form.titulo,
            especialidad: form.especialidad,
            institucion: form.institucion,
          }
        : {
            uid: usuario.uid,

            grado: form.grado,
            titulo: form.titulo,
            especialidad: form.especialidad,
            institucion: form.institucion,
          };

      const res = await fetch("/api/docentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar docente");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al guardar docente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        relative
        py-10
        px-4
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-blue-300
          via-blue-950
          to-emerald-800
          -z-10
        "
      />

      <form
        onSubmit={handleSubmit}
        className="
          relative
          z-10
          backdrop-blur-md
          bg-white/90
          p-8
          rounded-2xl
          shadow-xl
          space-y-4
          w-full
          max-w-md
        "
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {isAdmin ? "Registrar docente" : "Completa tu perfil"}
        </h1>

        <select
          name="grado"
          value={form.grado}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        >
          <option value="">Grado</option>
          <option value="Licenciatura">Licenciatura</option>
          <option value="Maestría">Maestría</option>
          <option value="Doctorado">Doctorado</option>
        </select>

        <input
          name="area"
          placeholder="Área"
          value={form.area}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        <input
          value={form.titulo}
          readOnly
          className="
            w-full
            border
            p-2
            rounded
            bg-gray-200
            text-blue-800
          "
        />

        {isAdmin && (
          <>
            <input
              name="correo"
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="
                w-full
                border
                p-2
                rounded
                text-blue-800
              "
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="
                w-full
                border
                p-2
                rounded
                text-blue-800
              "
            />
          </>
        )}

        <input
          name="especialidad"
          placeholder="Especialidad"
          value={form.especialidad}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        <input
          name="institucion"
          placeholder="Institución"
          value={form.institucion}
          onChange={handleChange}
          required
          className="
            w-full
            border
            p-2
            rounded
            text-blue-800
          "
        />

        <button
          disabled={loading}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            p-2
            rounded
            font-bold
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </main>
  );
}