"use client";

import { useRouter } from "next/navigation";
import { useState, SubmitEvent } from "react";

export default function NuevoProductoPage() {

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const alumno = {
      matricula: Number(formData.get("matricula") || ""),
      nombre: String(formData.get("nombre") || ""),
      carrera: String(formData.get("carrera") || ""),
    };

    try {
      const response = await fetch("/api/alumnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alumno),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "No se pudo guardar el alumno.");
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const carreras = [
      "Ingeniería en Sistemas Computacionales",
      "Ingeniería en TICs"
    ];

  return (
    <main className="relative min-h-screen flex items-center justify-center">

      {/* Fondo con imagen */}
      <div className="absolute inset-0">
        <img
          src="https://www.meganoticias.mx/uploads/noticias/estudiantes-del-tecnologico-de-toluca-colocan-tendedero-por-acoso-131058.jpg"
          alt="Fondo estudiante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrar Alumno
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Matrícula */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Matrícula
            </label>
            <input
              name="matricula"
              type="number"
              placeholder="Ej. 20230001"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-blue-900"
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre del alumno
            </label>
            <input
              name="nombre"
              type="text"
              placeholder="Ej. Carlos Sánchez"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-blue-900"
              required
            />
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Carrera
            </label>
            <select
              name="carrera"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-blue-900"
              required
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            {isSaving ? "Guardando..." : "Guardar alumno"}
          </button>

        </form>
      </div>
    </main>
  );
}