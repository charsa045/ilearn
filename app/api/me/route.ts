import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase-admin";

import { getDocenteByUid } from "@/lib/docentes/docente.repository";

import { getUsuarioByUid } from "@/lib/usuarios/usuario.respository";

const COOKIE =
  process.env.SESSION_COOKIE_NAME ??
  "__session";

export async function GET(
  req: Request
) {
  try {

    // 🔥 Obtener cookie de sesión
    const cookie = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) =>
        c.startsWith(
          COOKIE + "="
        )
      )
      ?.split("=")[1];

    if (!cookie) {

      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // 🔥 Verificar sesión
    const decoded =
      await adminAuth.verifySessionCookie(
        cookie,
        true
      );

    // 🔥 Obtener usuario
    const usuario =
      await getUsuarioByUid(
        decoded.uid
      );

    // 🔥 Obtener docente (si existe)
    const docente =
      await getDocenteByUid(
        decoded.uid
      );

    return NextResponse.json({
      user: {
        uid: decoded.uid,

        // 🔥 DATOS USUARIO
        name:
          usuario?.nombre ||
          decoded.name ||
          "",

        email:
          usuario?.email ||
          decoded.email ||
          "",

        imageUrl:
          usuario?.imageUrl ||
          "",

        rol:
          usuario?.rol ||
          "docente",

        activo:
          usuario?.activo ??
          true,

        // 🔥 DATOS DOCENTE
        grado:
          docente?.grado ||
          "",

        titulo:
          docente?.titulo ||
          "",

        especialidad:
          docente?.especialidad ||
          "",

        institucion:
          docente?.institucion ||
          "",
      },
    });

  } catch (error) {

    console.error(
      "Error obteniendo usuario:",
      error
    );

    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}