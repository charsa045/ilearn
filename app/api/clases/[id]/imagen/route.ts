import cloudinary from "@/lib/cloudinary";

import { adminDb } from "@/lib/firebase-admin";

import { NextRequest, NextResponse }
from "next/server";

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    const oldPublicId =
      String(
        formData.get(
          "oldPublicId"
        ) || ""
      );

    if (!file) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "Imagen requerida",
        },
        {
          status: 400,
        }
      );
    }

    if (oldPublicId) {

      await cloudinary.uploader.destroy(
        oldPublicId
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const result =
      await new Promise<any>(
        (resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder: "clases",
              },

              (error, result) => {

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
      .collection("clases")
      .doc(id)
      .update({

        imageUrl:
          result.secure_url,

        imagePublicId:
          result.public_id,
      });

    return NextResponse.json({
      ok: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "Error actualizando imagen",
      },
      {
        status: 500,
      }
    );
  }
}