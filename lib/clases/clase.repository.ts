import { Timestamp } from "firebase-admin/firestore";

import {
  Clase,
  CreateClaseInput,
  UpdateClaseImageInput,
} from "./clase.type";

import { adminDb } from "../firebase-admin";

const COLLECTION_NAME = "clases";

export async function createClase(
  input: CreateClaseInput
): Promise<Clase> {

  const now = Timestamp.now();

  const claseData = {

    asignatura: input.asignatura,

    carrera: input.carrera,

    docente: input.docente,

    alumnos: input.alumnos,

    totalAlumnos:
      input.alumnos.length,

    // 🔥 OPCIONAL
    imageUrl:
      input.imageUrl || "",

    imagePublicId:
      input.imagePublicId || "",

    createdAt: now,

    updatedAt: now,
  };

  const docRef =
    await adminDb
      .collection(
        COLLECTION_NAME
      )
      .add(claseData);

  return {

    id: docRef.id,

    asignatura:
      claseData.asignatura,

    carrera:
      claseData.carrera,

    docente:
      claseData.docente,

    alumnos:
      claseData.alumnos,

    totalAlumnos:
      claseData.totalAlumnos,

    imageUrl:
      claseData.imageUrl,

    imagePublicId:
      claseData.imagePublicId,

    createdAt:
      now
        .toDate()
        .toISOString(),

    updatedAt:
      now
        .toDate()
        .toISOString(),
  };
}

export async function getClases(): Promise<Clase[]> {

  const snapshot =
    await adminDb
      .collection(
        COLLECTION_NAME
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .get();

  return snapshot.docs.map(
    (doc) => {

      const data =
        doc.data();

      return {

        id: doc.id,

        asignatura: String(
          data.asignatura ?? ""
        ),

        carrera: String(
          data.carrera ?? ""
        ),

        docente: data.docente
          ? {
              id: String(
                data.docente.id ??
                  ""
              ),

              nombre: String(
                data.docente
                  .nombre ?? ""
              ),
            }
          : {
              id: "",
              nombre:
                "Sin docente",
            },

        alumnos:
          Array.isArray(
            data.alumnos
          )
            ? data.alumnos
            : [],

        totalAlumnos: Number(
          data.totalAlumnos ??
            0
        ),

        // 🔥 NUEVO
        imageUrl: String(
          data.imageUrl ?? ""
        ),

        imagePublicId: String(
          data.imagePublicId ??
            ""
        ),

        createdAt:
          data.createdAt
            ?.toDate?.()
            .toISOString() ??
          "",

        updatedAt:
          data.updatedAt
            ?.toDate?.()
            .toISOString() ??
          "",
      };
    }
  );
}

export async function getClasesByDocente(
  docenteId: string
) {

  if (!docenteId) {

    throw new Error(
      "docenteId requerido"
    );
  }

  const snapshot =
    await adminDb
      .collection("clases")
      .where(
        "docente.id",
        "==",
        docenteId
      )
      .get();

  return snapshot.docs.map(
    (doc) => {

      const data =
        doc.data();

      return {

        id: doc.id,

        asignatura: String(
          data.asignatura ?? ""
        ),

        carrera: String(
          data.carrera ?? ""
        ),

        docente:
          data.docente,

        alumnos:
          Array.isArray(
            data.alumnos
          )
            ? data.alumnos
            : [],

        totalAlumnos: Number(
          data.totalAlumnos ??
            0
        ),

        // 🔥 NUEVO
        imageUrl: String(
          data.imageUrl ?? ""
        ),

        imagePublicId: String(
          data.imagePublicId ??
            ""
        ),

        createdAt:
          data.createdAt
            ?.toDate?.()
            .toISOString() ??
          "",

        updatedAt:
          data.updatedAt
            ?.toDate?.()
            .toISOString() ??
          "",
      };
    }
  );
}

export async function getClaseById(
  claseId: string
): Promise<Clase | null> {

  const doc = await adminDb
    .collection(COLLECTION_NAME)
    .doc(claseId)
    .get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  if (!data) {
    return null;
  }

  return {
    id: doc.id,

    asignatura: String(data.asignatura ?? ""),
    carrera: String(data.carrera ?? ""),

    docente: data.docente
      ? {
          id: String(data.docente.id ?? ""),
          nombre: String(data.docente.nombre ?? ""),
        }
      : {
          id: "",
          nombre: "",
        },

    alumnos: Array.isArray(data.alumnos)
      ? data.alumnos
      : [],

    totalAlumnos: Number(
      data.totalAlumnos ?? 0
    ),

    imageUrl: String(
      data.imageUrl ?? ""
    ),

    imagePublicId: String(
      data.imagePublicId ?? ""
    ),

    createdAt:
      data.createdAt
        ?.toDate?.()
        ?.toISOString?.() ?? "",

    updatedAt:
      data.updatedAt
        ?.toDate?.()
        ?.toISOString?.() ?? "",
  };
}
export async function updateClaseImage(
  claseId: string,
  data: UpdateClaseImageInput
) {

  await adminDb
    .collection(
      COLLECTION_NAME
    )
    .doc(claseId)
    .update({

      imageUrl:
        data.imageUrl || "",

      imagePublicId:
        data.imagePublicId ||
        "",

      updatedAt:
        Timestamp.now(),
    });
}

export async function removeClaseImage(
  claseId: string
) {

  await adminDb
    .collection(
      COLLECTION_NAME
    )
    .doc(claseId)
    .update({

      imageUrl: "",

      imagePublicId: "",

      updatedAt:
        Timestamp.now(),
    });
}