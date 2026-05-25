import { NextRequest, NextResponse } from "next/server";

import {
  getUsuarioByUid,
  getOrCreateUsuario,
  updateUsuario,
} from "@/lib/usuarios/usuario.respository";

export async function GET(
  req: NextRequest
) {

  try {

    const { searchParams } =
      new URL(req.url);

    const uid =
      searchParams.get("uid");

    if (!uid) {

      return NextResponse.json(
        {
          error: "uid es requerido",
        },
        {
          status: 400,
        }
      );
    }

    const usuario =
      await getUsuarioByUid(uid);

    if (!usuario) {

      return NextResponse.json(
        {
          error:
            "usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      usuario,
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "GET /usuarios error:",
      error
    );

    return NextResponse.json(
      {
        error: "error interno",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest
) {

  try {

    const body = await req.json();

    const {
      uid,
      nombre,
      email,
      rol,
      imageUrl,
    } = body;

    if (
      !uid ||
      !nombre ||
      !email
    ) {

      return NextResponse.json(
        {
          error: "faltan datos",
        },
        {
          status: 400,
        }
      );
    }

    const usuario =
      await getOrCreateUsuario({

        uid,

        nombre,

        email,

        imageUrl:
          imageUrl || "",
      });

    return NextResponse.json(
      usuario,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "POST /usuarios error:",
      error
    );

    return NextResponse.json(
      {
        error: "error interno",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: NextRequest
) {

  try {

    const body = await req.json();

    const {
      uid,
      nombre,
      imageUrl,
      rol,
      activo,
    } = body;

    if (!uid) {

      return NextResponse.json(
        {
          error: "uid requerido",
        },
        {
          status: 400,
        }
      );
    }

    await updateUsuario(uid, {

      ...(nombre !== undefined && {
        nombre,
      }),

      ...(imageUrl !== undefined && {
        imageUrl,
      }),

      ...(rol !== undefined && {
        rol,
      }),

      ...(activo !== undefined && {
        activo,
      }),
    });

    const usuarioActualizado =
      await getUsuarioByUid(uid);

    return NextResponse.json(
      usuarioActualizado,
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(
      "PUT /usuarios error:",
      error
    );

    return NextResponse.json(
      {
        error: "error interno",
      },
      {
        status: 500,
      }
    );
  }
}