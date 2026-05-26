"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TomarAsistencia({
  alumnos,
  claseId,
  fechas = [],
  yaTomada,
}: any) {

  const [asistencia, setAsistencia] = useState<
    Record<string, boolean>
  >({});

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const mostrarTabla =
    !yaTomada ||
    (modoEdicion && !!fechaSeleccionada);

  const metodo =
    modoEdicion ? "PUT" : "POST";

  const getFechaMX = () => {
    return new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: "America/Mexico_City",
      }
    ).format(new Date());
  };

  useEffect(() => {

    if (modoEdicion) return;

    const inicial: Record<string, boolean> = {};

    alumnos.forEach((al: any) => {
      inicial[al.id] = false;
    });

    setAsistencia(inicial);

  }, [alumnos, modoEdicion]);

  const toggleAsistencia = (
    alumnoId: string
  ) => {

    setAsistencia((prev) => ({
      ...prev,
      [alumnoId]: !prev[alumnoId],
    }));
  };

  const guardarAsistencia = async () => {

    try {

      if (
        modoEdicion &&
        !fechaSeleccionada
      ) {

        alert(
          "Selecciona una fecha para editar"
        );

        return;
      }

      setLoading(true);

      const data = alumnos.map(
        (al: any) => ({
          alumnoId: al.id,
          presente:
            asistencia[al.id] ?? false,
        })
      );

      const fechaFinal =
        fechaSeleccionada ||
        getFechaMX();

      const res = await fetch(
        "/api/asistencias",
        {
          method: metodo,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            claseId,
            fecha: fechaFinal,
            alumnos: data,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {

        alert(
          result.message ||
            "Error guardando asistencia"
        );

        return;
      }

      alert("Asistencia guardada");

      router.refresh();

      cancelarEdicion();

    } catch (error) {

      console.error(error);

      alert(
        "Ocurrió un error al guardar"
      );

    } finally {

      setLoading(false);
    }
  };

  const cargarAsistencia = async (
    fecha: string
  ) => {

    try {

      setLoading(true);

      const res = await fetch(
        `/api/asistencias?claseId=${claseId}&fecha=${fecha}`
      );

      const data = await res.json();

      const nueva: Record<
        string,
        boolean
      > = {};

      if (
        data?.alumnos &&
        Array.isArray(data.alumnos)
      ) {

        data.alumnos.forEach(
          (al: any) => {

            nueva[al.alumnoId] =
              al.presente;
          }
        );
      }

      setAsistencia(nueva);

    } catch (error) {

      console.error(error);

      alert(
        "Error cargando asistencia"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleSeleccionFecha = async (
    fecha: string
  ) => {

    if (!fecha) {

      setFechaSeleccionada(null);

      return;
    }

    setFechaSeleccionada(fecha);

    await cargarAsistencia(fecha);
  };

  const activarEdicion = () => {

    setModoEdicion(true);
  };

  const cancelarEdicion = () => {

    setModoEdicion(false);

    setFechaSeleccionada(null);

    const limpio: Record<
      string,
      boolean
    > = {};

    alumnos.forEach((al: any) => {

      limpio[al.id] = false;
    });

    setAsistencia(limpio);
  };

  return (

    <div className="border p-4 rounded space-y-4 shadow-md bg-white">

      <div className="flex justify-between items-center">

        <h2 className="font-bold text-lg text-emerald-800">
          {modoEdicion
            ? "Editar asistencia"
            : "Tomar asistencia"}
        </h2>

        {/* BOTÓN EDITAR */}
        {!modoEdicion && (

          <button
            onClick={activarEdicion}
            className="
              text-sm
              bg-yellow-500
              hover:bg-yellow-600
              text-white
              px-3
              py-1
              rounded
            "
          >
            Editar
          </button>
        )}

        {/* BOTÓN CANCELAR */}
        {modoEdicion && (

          <button
            onClick={cancelarEdicion}
            className="
              text-sm
              bg-gray-500
              hover:bg-gray-600
              text-white
              px-3
              py-1
              rounded
            "
          >
            Cancelar
          </button>
        )}
      </div>

      {/* MENSAJE YA REGISTRADA */}
      {yaTomada && !modoEdicion && (

        <div className="
          p-4
          rounded-lg
          bg-green-100
          text-green-700
          font-semibold
          text-center
        ">
          La asistencia de hoy ya fue registrada.
        </div>
      )}

      {/* MENSAJE FALTA TOMAR */}
      {!yaTomada && !modoEdicion && (

        <div className="
          p-4
          rounded-lg
          bg-yellow-100
          text-yellow-700
          font-semibold
          text-center
        ">
          Falta tomar asistencia hoy
        </div>
      )}

      {/* SELECCIÓN DE FECHAS */}
      {modoEdicion && fechas.length > 0 && (

        <div>

          <label className="
            text-sm
            font-semibold
            text-gray-700
          ">
            Seleccionar fecha:
          </label>

          <select
            className="
              w-full
              border
              p-2
              rounded
              mt-1
              text-gray-900
            "
            value={fechaSeleccionada || ""}
            onChange={(e) =>
              handleSeleccionFecha(
                e.target.value
              )
            }
          >

            <option value="">
              -- Selecciona una fecha --
            </option>

            {fechas.map((f: string) => (

              <option
                key={f}
                value={f}
              >
                {new Date(
                  `${f}T00:00:00`
                ).toLocaleDateString(
                  "es-MX"
                )}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TABLA DE CUMPLIMIENTO */}
      {mostrarTabla && (

        <div className="
          space-y-2
          max-h-96
          overflow-auto
          border
          rounded
          p-2
          text-gray-800
        ">

          {alumnos.map((al: any) => (

            <div
              key={al.id}
              onClick={() =>
                toggleAsistencia(al.id)
              }
              className={`
                p-3
                rounded
                cursor-pointer
                flex
                justify-between
                transition
                ${
                  asistencia[al.id]
                    ? "bg-green-50 hover:bg-green-200"
                    : "bg-red-50 hover:bg-red-200"
                }
              `}
            >

              <span>
                {al.nombre}
              </span>

              <span>
                {asistencia[al.id]
                  ? "✔️"
                  : "❌"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* GUARDAR */}
      {mostrarTabla && (

        <button
          onClick={guardarAsistencia}
          disabled={loading}
          className="
            w-full
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            py-2
            rounded
            font-bold
            disabled:opacity-50
          "
        >
          {loading
            ? "Guardando..."
            : modoEdicion
            ? "Actualizar asistencia"
            : "Guardar asistencia"}
        </button>
      )}
    </div>
  );
}