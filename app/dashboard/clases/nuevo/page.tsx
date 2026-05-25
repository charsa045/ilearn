"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Alumno {
  id: string;
  nombre: string;
  matricula: number;
  carrera: string;
}

interface Docente {
  id: string;
  nombre: string;
}

export default function NuevaClasePage() {

  const router = useRouter();

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<Docente | null>(null);

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState<Alumno[]>([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState<Alumno[]>([]);

  const [carrera, setCarrera] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const carreras = [
    "Ingeniería en Sistemas Computacionales",
    "Ingeniería en TICs"
  ];

  useEffect(() => {
    async function fetchDocentes() {
      const res = await fetch("/api/docentes");
      const data = await res.json();
      setDocentes(data || []);
    }

    fetchDocentes();
  }, []);

  useEffect(() => {
    async function fetchAlumnos() {
      const res = await fetch("/api/alumnos");
      const data = await res.json();
      setAlumnos(data.data || []);
    }

    fetchAlumnos();
  }, []);

  useEffect(() => {
    if (!carrera) {
      setAlumnosFiltrados([]);
      return;
    }

    const filtrados = alumnos.filter(
      (alumno) => alumno.carrera === carrera
    );

    setAlumnosFiltrados(filtrados);
    setSelectedAlumnos([]);
  }, [carrera, alumnos]);

  function toggleAlumno(alumno: Alumno) {
    const exists = selectedAlumnos.find((a) => a.id === alumno.id);

    if (exists) {
      setSelectedAlumnos(selectedAlumnos.filter((a) => a.id !== alumno.id));
    } else {
      setSelectedAlumnos([...selectedAlumnos, alumno]);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const asignatura = String(formData.get("asignatura") || "").trim();

    if (!asignatura || !carrera || selectedAlumnos.length === 0) {
      setError("Todos los campos son obligatorios");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/clases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asignatura,
          carrera,
          alumnos: selectedAlumnos,
          docente: docenteSeleccionado,
          imageUrl: "",
          imagePublicId: "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      setError("Error al crear la clase");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <img
          src="https://sic.cultura.gob.mx/images/136722"
          alt="Fondo clases"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear Clase
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Asignatura */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Asignatura
            </label>
            <input
              name="asignatura"
              type="text"
              placeholder="Ej. Programación Web"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 text-blue-900"
              required
            />
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Carrera
            </label>
            <select
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 text-blue-900"
              required
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Docente */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Docente
            </label>

            <select
              onChange={(e) => {
                const docente = docentes.find(d => d.id === e.target.value);
                setDocenteSeleccionado(docente || null);
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 text-blue-900"
              required
            >
              {docentes.length === 0 ? (
                <option value="">Sin docentes</option>
              ) : (
                <>
                  <option value="">Selecciona un docente</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombre}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Lista de alumnos */}
          {carrera && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Seleccionar alumnos
              </label>

              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">

                {alumnosFiltrados.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No hay alumnos en esta carrera
                  </p>
                ) : (
                  alumnosFiltrados.map((alumno) => {
                    const checked = selectedAlumnos.some(
                      (a) => a.id === alumno.id
                    );

                    return (
                      <label
                        key={alumno.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAlumno(alumno)}
                        />
                        <span className="text-sm text-gray-700">
                          {alumno.nombre} ({alumno.matricula})
                        </span>
                      </label>
                    );
                  })
                )}

              </div>

              <p className="text-xs text-gray-500 mt-1">
                Seleccionados: {selectedAlumnos.length}
              </p>
            </div>
          )}

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
            {isSaving ? "Guardando..." : "Crear clase"}
          </button>

        </form>
      </div>
    </main>
  );
}