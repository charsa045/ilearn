import { NextRequest, NextResponse } from "next/server";

import {
  createDocente,
  getDocentes,
} from "@/lib/docentes/docente.repository";

import { adminAuth } from "@/lib/firebase-admin";
import { GradoEstudios } from "@/lib/docentes/docente.types"; // 👈 ajusta ruta si es necesario

// 🔹 GET
export async function GET() {
  try {
    const docentes = await getDocentes();

    return NextResponse.json(docentes, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Error al obtener docentes:",
      error
    );

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

// 🔹 POST
export async function POST(req: NextRequest) {
  try {
    // ✅ TIPADO DEL BODY (CLAVE)
    const body = (await req.json()) as {
      uid?: string;
      email?: string;
      password?: string;
      nombre?: string;
      imageUrl?: string;
      grado: GradoEstudios;
      titulo: string;
      especialidad: string;
      institucion: string;
    };

    const {
      uid,
      email,
      password,
      nombre,
      imageUrl,
      grado,
      titulo,
      especialidad,
      institucion,
    } = body;

    let finalUid = uid;

    // 🔥 Crear usuario en Firebase si no existe
    if (!uid) {
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

    // 🔥 Validación básica
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

    // 🔥 Crear docente
    const docente = await createDocente({
      uid: finalUid,
      nombre,
      imageUrl, // ✅ ya correcto
      grado,
      titulo,
      especialidad,
      institucion,
    });

    return NextResponse.json(docente, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "Error creando docente:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Error al crear docente",
      },
      {
        status: 500,
      }
    );
  }
}
