import { NextRequest, NextResponse } from "next/server";

import {
  createDocente,
  getDocentes,
} from "@/lib/docentes/docente.repository";

import { adminAuth } from "@/lib/firebase-admin";
import { GradoEstudios } from "@/lib/docentes/docente.type";

export async function GET() {
  try {
    const docentes = await getDocentes();

    return NextResponse.json(docentes, {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener docentes:", error);

    return NextResponse.json(
      {
        error: "Error al obtener docentes",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      uid?: string;
      email?: string;
      password?: string;
      nombre?: string;
      grado?: GradoEstudios;
      titulo?: string;
      especialidad?: string;
      institucion?: string;
    };

    const {
      uid,
      email,
      password,
      nombre,
      grado,
      titulo,
      especialidad,
      institucion,
    } = body;

    let finalUid = uid;

    if (!finalUid) {
      if (!email || !password) {
        return NextResponse.json(
          {
            error: "Email y password requeridos",
          },
          {
            status: 400,
          }
        );
      }

      const user = await adminAuth.createUser({
        email,
        password,
        displayName: nombre || "Sin nombre",
      });

      finalUid = user.uid;
    }

    if (!finalUid) {
      return NextResponse.json(
        {
          error: "UID requerido",
        },
        {
          status: 400,
        }
      );
    }

    if (!grado || !titulo || !especialidad || !institucion) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios",
        },
        {
          status: 400,
        }
      );
    }

    const docente = await createDocente({
      uid: finalUid,
      nombre,
      grado,
      titulo,
      especialidad,
      institucion,
    });

    return NextResponse.json(docente, {
      status: 201,
    });
  } catch (error: any) {
    console.error("Error creando docente:", error);

    return NextResponse.json(
      {
        error: error.message || "Error al crear docente",
      },
      {
        status: 500,
      }
    );
  }
}