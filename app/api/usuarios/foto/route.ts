import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

import { adminAuth, adminDb } from "@/lib/firebase-admin";

const COOKIE =
  process.env.SESSION_COOKIE_NAME ??
  "__session";

export async function POST(
  req: NextRequest
) {

  try {

    const cookie = req.cookies.get(
      COOKIE
    )?.value;

    if (!cookie) {

      return NextResponse.json(
        {
          error: "No autenticado",
        },
        {
          status: 401,
        }
      );
    }

    const decoded =
      await adminAuth.verifySessionCookie(
        cookie,
        true
      );

    const userDoc =
      await adminDb
        .collection("usuarios")
        .doc(decoded.uid)
        .get();

    if (!userDoc.exists) {

      return NextResponse.json(
        {
          error:
            "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const userData =
      userDoc.data();

    const formData =
      await req.formData();

    const file =
      formData.get(
        "file"
      ) as File | null;

    if (!file) {

      return NextResponse.json(
        {
          error:
            "No se recibió imagen",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      return NextResponse.json(
        {
          error:
            "El archivo debe ser imagen",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    if (
      userData?.imagePublicId
    ) {

      try {

        await cloudinary.uploader.destroy(
          userData.imagePublicId
        );

      } catch (error) {

        console.error(
          "Error eliminando imagen:",
          error
        );
      }
    }

    const result =
      await new Promise<any>(
        (
          resolve,
          reject
        ) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder:
                  "usuarios",
                resource_type:
                  "image",
              },

              (
                error,
                result
              ) => {

                if (error) {

                  reject(error);

                  return;
                }

                resolve(result);
              }
            )
            .end(buffer);
        }
      );

    await adminDb
      .collection("usuarios")
      .doc(decoded.uid)
      .update({
        imageUrl:
          result.secure_url,

        imagePublicId:
          result.public_id,
      });

    return NextResponse.json({
      ok: true,

      imageUrl:
        result.secure_url,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error actualizando foto",
      },
      {
        status: 500,
      }
    );
  }
}