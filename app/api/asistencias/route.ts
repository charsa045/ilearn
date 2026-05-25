import { NextRequest, NextResponse } from "next/server";

import {
  crearAsistencia,
  getAsistenciaHoy,
  editarAsistencia,
  getAsistenciasByClase,
  getAsistenciaByFecha,
} from "@/lib/asistencias/asistencia.repository";

// 🔥 FECHA LOCAL MÉXICO
function getHoy() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Mexico_City",
  }).format(new Date());
}

/* =========================================================
   🔥 POST -> CREAR ASISTENCIA
========================================================= */
export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const { claseId, alumnos } = body;

    // 🔥 VALIDACIONES
    if (!claseId || !alumnos) {

      return NextResponse.json(
        {
          message: "Datos incompletos",
        },
        {
          status: 400,
        }
      );
    }

    // 🔥 FECHA DEL SERVIDOR
    const hoy = getHoy();

    // 🔥 VALIDAR SI YA EXISTE
    const existente =
      await getAsistenciaByFecha(
        claseId,
        hoy
      );

    if (existente?.id) {

      return NextResponse.json(
        {
          message:
            "La asistencia de hoy ya fue registrada",
        },
        {
          status: 400,
        }
      );
    }

    // 🔥 CREAR ASISTENCIA
    const asistencia =
      await crearAsistencia({
        claseId,
        alumnos,
      });

    return NextResponse.json(
      {
        ok: true,
        asistencia,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "ERROR POST ASISTENCIA:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Error al guardar asistencia",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   🔥 PUT -> EDITAR ASISTENCIA
========================================================= */
export async function PUT(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      claseId,
      alumnos,
      fecha,
    } = body;

    // 🔥 VALIDACIONES
    if (
      !claseId ||
      !alumnos ||
      !fecha
    ) {

      return NextResponse.json(
        {
          message: "Datos incompletos",
        },
        {
          status: 400,
        }
      );
    }

    // 🔥 BUSCAR ASISTENCIA
    const existente =
      await getAsistenciaByFecha(
        claseId,
        fecha
      );

    if (!existente?.id) {

      return NextResponse.json(
        {
          message:
            "No existe asistencia para editar",
        },
        {
          status: 404,
        }
      );
    }

    // 🔥 ACTUALIZAR
    await editarAsistencia({
      asistenciaId: existente.id,
      alumnos,
    });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {

    console.error(
      "ERROR PUT ASISTENCIA:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Error al actualizar asistencia",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   🔥 GET
========================================================= */
export async function GET(
  req: NextRequest
) {

  try {

    const { searchParams } =
      new URL(req.url);

    const claseId =
      searchParams.get("claseId");

    const hoy =
      searchParams.get("hoy");

    const fecha =
      searchParams.get("fecha");

    // 🔥 VALIDAR claseId
    if (!claseId) {

      return NextResponse.json(
        {
          message:
            "claseId es requerido",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       🔥 ASISTENCIA DE HOY
    ========================================= */
    if (hoy === "true") {

      const asistencia =
        await getAsistenciaHoy(
          claseId
        );

      return NextResponse.json(
        asistencia
      );
    }

    /* =========================================
       🔥 ASISTENCIA POR FECHA
    ========================================= */
    if (fecha) {

      const asistencia =
        await getAsistenciaByFecha(
          claseId,
          fecha
        );

      return NextResponse.json(
        asistencia
      );
    }

    /* =========================================
       🔥 HISTORIAL COMPLETO
    ========================================= */
    const asistencias =
      await getAsistenciasByClase(
        claseId
      );

    return NextResponse.json(
      asistencias
    );

  } catch (error) {

    console.error(
      "ERROR GET ASISTENCIAS:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Error al obtener asistencias",
      },
      {
        status: 500,
      }
    );
  }
}

