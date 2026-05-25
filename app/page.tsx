import PublicHeader from "@/components/layout/header";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* 🔷 HEADER */}
      <PublicHeader />

      {/* 🔷 HERO CON IMAGEN */}
      <section
        className="relative py-32 px-6 text-white"
        style={{
          backgroundImage:
            "url('https://i0.wp.com/edomexahora.com/wp-content/uploads/2026/01/estudiantes-del-tecnologico-de-toluca-exigen-rendicion-de-cuentas-tras-aumentos-de-colegiatura.png?resize=1200%2C580&ssl=1')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🔥 OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-700/70 to-indigo-700/80"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Gestión escolar <br />
              <span className="text-blue-300">
                inteligente
              </span>
            </h1>

            <p className="text-lg text-blue-100">
              Plataforma web enfocada en optimizar el control escolar,
              permitiendo administrar alumnos, docentes, clases,
              asistencias y calificaciones en un solo sistema
              centralizado.
            </p>
          </div>
        </div>
      </section>

      {/* 🔷 DESCRIPCIÓN */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Sistema de Control Escolar
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Esta aplicación web permite gestionar de manera eficiente
            todos los procesos académicos de una institución educativa.
            Desde la administración de usuarios hasta el control de
            asistencia y evaluación, todo se encuentra integrado en una
            sola plataforma.
          </p>

          <div className="flex flex-row gap-5 mt-10 ">

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-gray-700 hover:text-blue-600 transition">
              <h3 className="font-bold text-lg mb-2">
                📚 Gestión de clases
              </h3>
              <p className="text-sm">
                Organización de materias por carrera con asignación de
                docentes y alumnos.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-gray-700 hover:text-blue-600 transition">
              <h3 className="font-bold text-lg mb-2">
                ✅ Control de asistencia
              </h3>
              <p className="text-sm">
                Registro dinámico de asistencia con historial por fecha.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🔷 ROLES */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto space-y-12">

          <h2 className="text-3xl font-bold text-center">
            Roles del sistema
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {/* 🔹 ADMIN */}
            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl hover:bg-white/20 transition">
              <h3 className="text-2xl font-bold mb-4">
                Administrador
              </h3>

              <ul className="space-y-2 text-sm">
                <li>✔ Registro de estudiantes y docentes</li>
                <li>✔ Suspensión o eliminación de usuarios</li>
                <li>✔ Creación de clases por carrera</li>
                <li>✔ Asignación de profesores</li>
                <li>✔ Inscripción de alumnos</li>
                <li>✔ Generación de reportes académicos</li>
              </ul>
            </div>

            {/* 🔹 PROFESOR */}
            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl hover:bg-white/20 transition">
              <h3 className="text-2xl font-bold mb-4">
                Profesor
              </h3>

              <ul className="space-y-2 text-sm">
                <li>✔ Gestión de temas pendientes</li>
                <li>✔ Registro de asistencia por clase</li>
                <li>✔ Control de presentes y ausentes</li>
                <li>✔ Registro de calificaciones</li>
                <li>✔ Integración con reportes</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 🔷 FOOTER */}
      <footer className="mt-auto bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* INFO */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">
              Programación Web
            </h3>
            <p>Grupo 186602</p>
            <p>Docente: Julio Cesar Santana Becerril</p>
          </div>

          {/* ALUMNOS */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">

            {[
              { nombre: "Martínez Sánchez Miguel Ángel", matricula: "22280600" },
              { nombre: "Melo Sámano Carlos Daniel", matricula: "25280359" },
              { nombre: "Ramírez García José Alejandro", matricula: "21280595" },
              { nombre: "Ramírez Olivares Héctor", matricula: "22280236" },
            ].map((alumno, i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-xl text-center 
                hover:bg-blue-600 hover:scale-105 transition cursor-pointer"
              >
                <p className="font-bold">
                  {alumno.nombre}
                </p>
                <p className="text-sm opacity-80">
                  {alumno.matricula}
                </p>
              </div>
            ))}

          </div>

          {/* ESCUELA */}
          <div className="text-center text-sm text-gray-400 space-y-1">
            <p>Instituto Tecnológico de Toluca</p>
            <p>Enero - Junio 2026</p>
          </div>
        </div>
      </footer>

    </div>
  );
}