import { Timestamp } from "firebase-admin/firestore";
import {
  CreateDocenteInput,
  Docente,
} from "./docente.type";
import { adminAuth, adminDb } from "../firebase-admin";
import { UpdateDocenteInput } from "./docente.type";

const COLLECTION_NAME = "docentes";

function mapDocToDocente(
  doc: FirebaseFirestore.DocumentSnapshot
): Docente {
  const data = doc.data();

  if (!data) {
    throw new Error("Docente sin data");
  }

  return {
    id: doc.id,
    uid: data.uid,

    nombre: data.nombre ?? "Sin nombre",
    email: data.email ?? "Sin correo",

    grado: data.grado,
    titulo: data.titulo,
    especialidad: data.especialidad,
    institucion: data.institucion,

    activo: data.activo ?? true,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function createDocente(
  input: CreateDocenteInput
): Promise<Docente> {
  const now = Timestamp.now();

  const docRef = adminDb
    .collection(COLLECTION_NAME)
    .doc(input.uid);

  const doc = await docRef.get();

  if (doc.exists) {
    return mapDocToDocente(doc);
  }

  const authUser = await adminAuth.getUser(input.uid);

  const docenteData = {
    uid: input.uid,
    nombre:
      authUser.displayName ||
      input.nombre ||
      "Sin nombre",

    email: authUser.email || "Sin correo",

    grado: input.grado,
    titulo: input.titulo,
    especialidad: input.especialidad,
    institucion: input.institucion,

    activo: true,
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(docenteData);

  return {
    id: docRef.id,
    ...docenteData,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };
}

export async function getDocentes(): Promise<Docente[]> {
  const snapshot = await adminDb.collection(COLLECTION_NAME).get();

  return snapshot.docs.map(mapDocToDocente);
}

export async function getDocenteByUid(
  uid: string
): Promise<Docente | null> {
  if (!uid) return null;

  const doc = await adminDb
    .collection(COLLECTION_NAME)
    .doc(uid)
    .get();

  if (!doc.exists) return null;

  return mapDocToDocente(doc);
}

export async function updateDocente(
  uid: string,
  data: UpdateDocenteInput
) {
  const docRef = adminDb
    .collection(COLLECTION_NAME)
    .doc(uid);

  await docRef.update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}


export async function desactivarDocente(uid: string) {
  await adminDb
    .collection(COLLECTION_NAME)
    .doc(uid)
    .update({
      activo: false,
      updatedAt: Timestamp.now(),
    });
}