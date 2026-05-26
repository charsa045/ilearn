import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {getClaseById,} from "@/lib/clases/clase.repository";
import CambiarImagenClase from "@/components/CambiarImagenClase";

import { getAlumnosPorClase } from "@/lib/alumnos/alumno.repository";

import {
  getAsistenciaHoy,
  getAsistenciasByClase,
} from "@/lib/asistencias/asistencia.repository";

import TomarAsistencia from "./TomarAsistencia";

import PublicHeader from "@/components/layout/header";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
  type RegistroAsistencia = {
  alumnoId: string;
  presente: boolean;
};

type Asistencia = {
  id: string;
  fecha: string;
  alumnos: RegistroAsistencia[];
};
    
    const { id: claseId } = await params;

    const clase = await getClaseById(claseId);

    if (!clase) {
      throw new Error("Clase no encontrada");
    }

    if (!claseId) {
      throw new Error("claseId undefined");
    }

    const session = (await cookies()).get("__session");

    if (!session) {
      redirect("/");
    }

    const alumnos = await getAlumnosPorClase(claseId);

    const asistenciaHoy = await getAsistenciaHoy(claseId) as Asistencia | null;

    const asistencias = await getAsistenciasByClase(claseId);

    const alumnosOrdenados = [...alumnos].sort(
      (a: any, b: any) =>
        a.nombre.localeCompare(b.nombre)
    );

    const asistenciasOrdenadas = [...asistencias].sort(
      (a: any, b: any) =>
        new Date(a.fecha).getTime() -
        new Date(b.fecha).getTime()
    ) as any[];

    const yaTomada =
      !!asistenciaHoy &&
      Array.isArray(asistenciaHoy.alumnos) &&
      asistenciaHoy.alumnos.length > 0;

    const fechas = [
      ...new Set(
        asistenciasOrdenadas.map(
          (a: any) => a.fecha
        )
      ),
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-700 flex flex-col">

        <PublicHeader />

        <div className="max-w-6xl mx-auto w-full px-6 py-10 space-y-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>

              <div className="flex items-center gap-5">

              {/* FOTO CLASE */}
              <div
                className="
                  w-28
                  h-28
                  my-4
                  rounded-2xl
                  overflow-hidden
                  border-4
                  border-white
                  shadow-xl
                  bg-white
                  shrink-0
                "
              >

                {clase.imageUrl ? (

                  <img
                    src={clase.imageUrl}
                    alt={clase.asignatura}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                      text-4xl
                      font-black
                      text-blue-700
                      bg-yellow-100
                    "
                  >
                    {clase.asignatura.charAt(0)}
                  </div>
                )}
              </div>

              {/* DATOS */}
              <div className="space-y-1">

                <h1
                  className="
                    text-3xl
                    font-extrabold
                    text-yellow-200
                    drop-shadow
                  "
                >
                  {clase.asignatura}
                </h1>

                <p className="text-blue-100 font-medium">
                  {clase.carrera}
                </p>

                <p className="text-sm text-white/90">
                  {clase.docente.nombre}
                </p>

                <p className="text-sm text-white/90">
                  {clase.totalAlumnos} alumnos
                </p>

              </div>
            </div>

            <CambiarImagenClase
              claseId={clase.id}
              imageUrl={clase.imageUrl}
              imagePublicId={clase.imagePublicId}
            />

            </div>

            {/* BOTÓN REGRESAR */}
            <a
              href="/dashboard"
              className="
                bg-white
                text-blue-700
                border-2 border-white
                px-5 py-2
                rounded-full
                font-bold
                hover:bg-blue-700
                hover:text-white
                hover:border-white
                transition
                text-center
                shadow
              "
            >
              ← Regresar
            </a>

          </div>

          {/* PRINCIPAL */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Tomar / Editar asistencia
            </h2>

            <TomarAsistencia
              alumnos={alumnosOrdenados}
              claseId={claseId}
              fechas={fechas}
              yaTomada={yaTomada}
            />

          </div>

          {/* HISTORIAL */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 overflow-auto">

            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Historial de asistencia
            </h2>

            {/* MENSAJE SIN HISTORIAL */}
            {fechas.length === 0 ? (

              <div className="text-center py-10 text-gray-500">
                No hay asistencias registradas
              </div>

            ) : (

              <table className="min-w-full text-sm border-collapse">

                <thead>

                  <tr className="bg-gray-100 text-gray-700">

                    <th className="p-3 text-left sticky left-0 bg-gray-100 z-10">
                      Alumno
                    </th>

                    {fechas.map((f: string) => (

                      <th
                        key={f}
                        className="p-3 text-center whitespace-nowrap"
                      >
                        {f}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {/* SIN ALUMNOS */}
                  {alumnosOrdenados.length === 0 ? (

                    <tr>

                      <td
                        colSpan={fechas.length + 1}
                        className="p-6 text-center text-gray-500"
                      >
                        No hay alumnos registrados
                      </td>

                    </tr>

                  ) : (

                    alumnosOrdenados.map((alumno: any) => (

                      <tr
                        key={alumno.id}
                        className="
                          border-t
                          bg-gray-50
                          hover:bg-yellow-50
                          transition
                        "
                      >

                        {/* NOMBRE */}
                        <td
                          className="
                            p-3
                            font-medium
                            whitespace-nowrap
                            text-gray-800
                            sticky
                            left-0
                            bg-gray-50
                          "
                        >
                          {alumno.nombre}
                        </td>

                        {/* ASISTENCIAS */}
                        {fechas.map((fecha: string) => {

                          // Buscar asistencia por fecha
                          const asistencia =
                            asistenciasOrdenadas.find(
                              (a: any) =>
                                a.fecha === fecha
                            );

                          // Buscar registro del alumno
                          const registro =
                            asistencia?.alumnos?.find(
                              (al: any) =>
                                al.alumnoId === alumno.id
                            );

                          return (

                            <td
                              key={`${alumno.id}-${fecha}`}
                              className="p-3 text-center"
                            >

                              {!registro ? (

                                <span className="text-gray-400">
                                  —
                                </span>

                              ) : registro.presente ? (

                                <span
                                  className="
                                    inline-block
                                    px-2 py-1
                                    text-xs
                                    font-bold
                                    bg-green-100
                                    text-green-700
                                    rounded-full
                                  "
                                >
                                  Presente
                                </span>

                              ) : (

                                <span
                                  className="
                                    inline-block
                                    px-2 py-1
                                    text-xs
                                    font-bold
                                    bg-red-100
                                    text-red-700
                                    rounded-full
                                  "
                                >
                                  Ausente
                                </span>

                              )}

                            </td>
                          );
                        })}

                      </tr>

                    ))
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>
    );

  } catch (error) {

    console.error("Error en asistencia:", error);

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">

          <p className="text-red-600 text-lg font-bold">
            Error cargando la asistencia
          </p>

          <p className="text-gray-500 mt-2 text-sm">
            Ocurrió un problema al obtener los datos.
          </p>

        </div>

      </div>
    );
  }
}
