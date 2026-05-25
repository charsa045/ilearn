import { adminDb } from "@/lib/firebase-admin";

import { Timestamp } from "firebase-admin/firestore";

import { Usuario } from "./usuario.type";

const COLLECTION_NAME = "usuarios";


function mapDocToUsuario(
  doc: FirebaseFirestore.DocumentSnapshot
): Usuario {

  const data = doc.data();

  if (!data) {
    throw new Error("Usuario sin data");
  }

  return {

    uid: doc.id,

    nombre: data.nombre ?? "Sin nombre",

    email: data.email ?? "Sin correo",

    rol: data.rol ?? "docente",

    imageUrl: data.imageUrl ?? "",

    activo: data.activo ?? true,

    createdAt:
      data.createdAt?.toDate?.() ??
      new Date(),

    updatedAt:
      data.updatedAt?.toDate?.() ??
      undefined,
  };
}

export async function getUsuarioByUid(
  uid: string
): Promise<Usuario | null> {

  if (!uid) return null;

  const doc = await adminDb
    .collection(COLLECTION_NAME)
    .doc(uid)
    .get();

  if (!doc.exists) {
    return null;
  }

  return mapDocToUsuario(doc);
}

export async function createUsuario(
  data: Omit<Usuario, "createdAt" | "updatedAt">
) {

  const docRef = adminDb
    .collection(COLLECTION_NAME)
    .doc(data.uid);

  const doc = await docRef.get();

  if (doc.exists) {
    return;
  }

  const now = Timestamp.now();

  await docRef.set({

    ...data,

    activo: data.activo ?? true,

    createdAt: now,

    updatedAt: now,
  });
}

export async function getOrCreateUsuario({
  uid,
  nombre,
  email,
  imageUrl = "",
}: {
  uid: string;
  nombre: string;
  email: string;
  imageUrl?: string;
}): Promise<Usuario> {

  const existente =
    await getUsuarioByUid(uid);

  if (existente) {
    return existente;
  }

  const nuevoUsuario: Omit<
    Usuario,
    "createdAt" | "updatedAt"
  > = {

    uid,

    nombre,

    email,

    rol: "docente",

    imageUrl,

    activo: true,
  };

  await createUsuario(nuevoUsuario);

  return {

    ...nuevoUsuario,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}

export async function updateUsuario(
  uid: string,
  data: Partial<Usuario>
) {

  if (!uid) {
    throw new Error("UID requerido");
  }

  await adminDb
    .collection(COLLECTION_NAME)
    .doc(uid)
    .update({

      ...data,

      updatedAt: Timestamp.now(),
    });
}

export async function desactivarUsuario(
  uid: string
) {

  await adminDb
    .collection(COLLECTION_NAME)
    .doc(uid)
    .update({

      activo: false,

      updatedAt: Timestamp.now(),
    });
}