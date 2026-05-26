import AuthHeader from "@/components/layout/header";
import { getServerUser } from "@/lib/auth-server";
import { getAlumnos } from "@/lib/alumnos/alumno.repository";
import {
  getClases,
  getClasesByDocente,
} from "@/lib/clases/clase.repository";
import { getDocentes } from "@/lib/docentes/docente.repository";
import { adminDb } from "@/lib/firebase-admin";
import Link from "next/link";
import CambiarFotoPerfil from "@/components/CambiarFotoPerfil";

export default async function DashboardPage() {

  const user = await getServerUser();

  const rol =
    user?.rol?.toLowerCase();

  const isAdmin =
    rol === "admin";

  const isDocente =
    rol === "docente";

  let docentePerfil = null;

  if (
    isDocente &&
    user?.uid
  ) {

    const snap =
      await adminDb
        .collection("docentes")
        .where(
          "uid",
          "==",
          user.uid
        )
        .limit(1)
        .get();

    docentePerfil =
      snap.empty
        ? null
        : snap.docs[0].data();
  }

  const docentes =
    isAdmin
      ? await getDocentes()
      : [];

  const alumnos =
    isAdmin
      ? await getAlumnos()
      : [];

  let clasesDocente: any[] = [];

  if (
    isDocente &&
    user?.uid
  ) {

    clasesDocente =
      await getClasesByDocente(
        user.uid
      );

  } else if (isAdmin) {

    clasesDocente =
      await getClases();
  }

  const docentesLimpios =
    docentes;

  return (
    <>
      <AuthHeader />

      <main className="relative min-h-screen px-4 py-10">

        {/* 🔥 Fondo */}
        <div className="absolute inset-0">

          <img
            src="https://toluca.tecnm.mx/assets/images/img-landing.jpg"
            className="w-full h-full object-cover"
          />

          <div
            className="
              absolute
              inset-0
              bg-blue-900/70
            "
          />
        </div>

        <div
          className="
            relative
            z-10
            max-w-6xl
            mx-auto
            space-y-8
          "
        >

          {/* 🔥 HEADER USUARIO */}
          <section
            className="
              bg-white/90
              rounded-2xl
              p-6
              shadow-xl
              flex
              flex-col
              md:flex-row
              gap-6
              items-center
              justify-between
            "
          >

            {/* 🔥 INFO USUARIO */}
            <div
              className="
                flex
                items-center
                gap-5
                w-full
              "
            >

              {/* 🔥 FOTO */}
              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  overflow-hidden
                  border-4
                  border-blue-500
                  shadow-lg
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                {user?.imageUrl ? (

                  <img
                    src={user.imageUrl}
                    alt="Foto perfil"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <span
                    className="
                      text-4xl
                      font-bold
                      text-blue-600
                    "
                  >
                    {user?.nombre
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* 🔥 DATOS */}
              <div className="space-y-2">

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-gray-800
                  "
                >
                  {user?.nombre ||
                    "Usuario"}
                </h2>

                <p className="text-gray-600">
                  {user?.email}
                </p>

                <span
                  className="
                    inline-block
                    text-sm
                    bg-blue-600
                    text-white
                    px-4
                    py-1
                    rounded-full
                    font-semibold
                  "
                >
                  {user?.rol}
                </span>
              </div>
            </div>

            {/* 🔥 CAMBIAR FOTO */}
            <CambiarFotoPerfil
              imageUrlActual={user?.imageUrl}
            />
          </section>

          {/* 🔥 DOCENTE SIN PERFIL */}
          {isDocente &&
            !docentePerfil && (
              <section
                className="
                  bg-white/90
                  p-8
                  rounded-xl
                  text-center
                  space-y-4
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                  "
                >
                  Completa tu perfil docente
                </h2>

                <p className="text-gray-600">
                  Necesitas completar
                  tu información para
                  acceder a tus clases
                </p>

                <Link
                  href="/dashboard/docentes/nuevo"
                  className="
                    bg-blue-600
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    inline-block
                  "
                >
                  Completar perfil
                </Link>
              </section>
            )}

          {/* 🔥 ADMIN VIEW */}
          {isAdmin && (
            <>
              {/* DOCENTES */}
              <section
                className="
                  bg-white/90
                  p-6
                  rounded-xl
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    mb-4
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-red-800
                    "
                  >
                    Docentes
                  </h2>

                  <Link
                    href="/dashboard/docentes/nuevo"
                    className="
                      bg-purple-600
                      text-white
                      px-4
                      py-2
                      rounded
                    "
                  >
                    + Nuevo
                  </Link>
                </div>

                <table className="w-full text-sm">

                  <thead
                    className="
                      bg-gray-100
                      text-gray-500
                    "
                  >

                    <tr>
                      <th className="p-2 text-left">
                        Nombre
                      </th>

                      <th className="p-2 text-left">
                        Grado
                      </th>

                      <th className="p-2 text-left">
                        Especialidad
                      </th>

                      <th className="p-2 text-left">
                        Correo
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {docentesLimpios.map(
                      (d) => (
                        <tr
                          key={d.id}
                          className="text-blue-800"
                        >

                          <td className="p-2">
                            {d.nombre}
                          </td>

                          <td className="p-2">
                            {d.grado}
                          </td>

                          <td className="p-2">
                            {d.especialidad}
                          </td>

                          <td className="p-2">
                            {d.email}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </section>

              {/* ALUMNOS */}
              <section
                className="
                  bg-white/90
                  p-6
                  rounded-xl
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    mb-4
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-emerald-800
                    "
                  >
                    Alumnos
                  </h2>

                  <Link
                    href="/dashboard/alumnos/nuevo"
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded
                    "
                  >
                    + Nuevo
                  </Link>
                </div>

                <table className="w-full text-sm">

                  <thead
                    className="
                      bg-gray-100
                      text-gray-500
                    "
                  >

                    <tr>
                      <th className="p-2 text-left">
                        Matrícula
                      </th>

                      <th className="p-2 text-left">
                        Nombre
                      </th>

                      <th className="p-2 text-left">
                        Carrera
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {alumnos.map((a) => (
                      <tr
                        key={a.id}
                        className="
                          border-b
                          text-blue-800
                        "
                      >

                        <td className="p-2">
                          {a.matricula}
                        </td>

                        <td className="p-2">
                          {a.nombre}
                        </td>

                        <td className="p-2">
                          {a.carrera}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* 🔥 CLASES */}
          {(isAdmin ||
            docentePerfil) && (
            <section
              className="
                bg-white/90
                p-6
                rounded-xl
              "
            >

              <div
                className="
                  flex
                  justify-between
                  mb-4
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-fuchsia-800
                  "
                >
                  Clases
                </h2>

                {isAdmin && (
                  <Link
                    href="/dashboard/clases/nuevo"
                    className="
                      bg-green-600
                      text-white
                      px-4
                      py-2
                      rounded
                    "
                  >
                    + Nueva
                  </Link>
                )}
              </div>

              <table className="w-full text-sm">

                <thead
                  className="
                    bg-gray-100
                    text-gray-500
                  "
                >

                  <tr>
                    <th className="p-2 text-left">
                      Asignatura
                    </th>

                    <th className="p-2 text-left">
                      Carrera
                    </th>

                    <th className="p-2 text-left">
                      Alumnos
                    </th>

                    {isDocente && (
                      <th className="p-2 text-left">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>

                  {clasesDocente.map(
                    (c) => (
                      <tr
                        key={c.id}
                        className="
                          border-b
                          text-blue-800
                        "
                      >

                        <td className="p-2">
                          {c.asignatura}
                        </td>

                        <td className="p-2">
                          {c.carrera}
                        </td>

                        <td className="p-2">
                          {c.totalAlumnos}
                        </td>

                        {isDocente && (
                          <td className="p-2">

                            <Link
                              href={`/dashboard/clases/${c.id}/asistencia`}
                              className="
                                bg-blue-600
                                text-white
                                px-3
                                py-1
                                rounded
                                text-xs
                              "
                            >
                              Tomar asistencia
                            </Link>
                          </td>
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </>
  );
}