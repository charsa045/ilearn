import cloudinary from "@/lib/cloudinary";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  request: NextRequest
) {
  try {

    const formData =
      await request.formData();

    const file =
      formData.get("file") as File | null;

    if (!file) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "No se recibió ninguna imagen.",
        },
        {
          status: 400,
        }
      );
    }
    if (
      !file.type.startsWith("image/")
    ) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "El archivo debe ser una imagen.",
        },
        {
          status: 400,
        }
      );
    }

    const maxSizeInBytes =
      5 * 1024 * 1024;

    if (
      file.size > maxSizeInBytes
    ) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "La imagen no debe superar los 5 MB.",
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

    const result =
      await new Promise<any>(
        (resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder: "docentes",
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

    return NextResponse.json({
      ok: true,

      message:
        "Imagen subida correctamente.",

      data: {
        imageUrl:
          result.secure_url,

        publicId:
          result.public_id,
      },
    });

  } catch (error) {

    console.error(
      "Error subiendo imagen:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "No se pudo subir la imagen.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {

    const body =
      await request.json();

    const { publicId } = body;

    if (!publicId) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "publicId requerido.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await cloudinary.uploader.destroy(
        publicId
      );

    if (
      result.result !== "ok"
    ) {

      return NextResponse.json(
        {
          ok: false,
          message:
            "No se pudo eliminar la imagen.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Imagen eliminada correctamente.",
    });

  } catch (error) {

    console.error(
      "Error eliminando imagen:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "Error eliminando imagen.",
      },
      {
        status: 500,
      }
    );
  }
}