import {
  createClase,
  getClases,
} from "@/lib/clases/clase.repository";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET() {
  try {

    const clases =
      await getClases();

    return NextResponse.json(
      {
        ok: true,
        data: clases,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "Error obteniendo las clases:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "No se pudieron obtener las clases",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {

    const body =
      await request.json();

    const asignatura = String(
      body.asignatura ?? ""
    ).trim();

    const carrera = String(
      body.carrera ?? ""
    ).trim();

    const alumnos = Array.isArray(
      body.alumnos
    )
      ? body.alumnos
      : [];

    const docente =
      body.docente;
    const imageUrl = body.imageUrl
    ? String(body.imageUrl).trim()
    : undefined;

  const imagePublicId = body.imagePublicId
    ? String(body.imagePublicId).trim()
    : undefined;

    if (!asignatura) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "La asignatura es obligatoria",
        },
        {
          status: 400,
        }
      );
    }

    if (!carrera) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "La carrera es obligatoria",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !docente ||
      !docente.id ||
      !docente.nombre
    ) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "Debes seleccionar un docente",
        },
        {
          status: 400,
        }
      );
    }

    if (
      alumnos.length === 0
    ) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "Debes seleccionar al menos un alumno",
        },
        {
          status: 400,
        }
      );
    }

    const clase =
      await createClase({
        asignatura,
        carrera,
        docente,
        alumnos,
        imageUrl,
        imagePublicId,
      });

    return NextResponse.json(
      {
        ok: true,
        message:
          "Clase creada correctamente",
        data: clase,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "Error al crear la clase:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "No se pudo crear la clase",
      },
      {
        status: 500,
      }
    );
  }
}