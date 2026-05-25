import { Timestamp } from "firebase-admin/firestore";
import { CreateAlumnoInput, Alumno } from "./alumno.type";
import { adminDb } from "../firebase-admin";

const COLLECTION_NAME = "alumnos";

export async function createAlumno(
  input: CreateAlumnoInput
): Promise<Alumno> {
  if (!input.nombre || !input.matricula || !input.carrera) {
    throw new Error("Datos incompletos para crear alumno");
  }

  const now = Timestamp.now();

  const alumnoData = {
    matricula: input.matricula,
    nombre: input.nombre,
    carrera: input.carrera,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb
    .collection(COLLECTION_NAME)
    .add(alumnoData);

  return {
    id: docRef.id,
    matricula: alumnoData.matricula,
    nombre: alumnoData.nombre,
    carrera: alumnoData.carrera,
    createdAt: now.toDate().toISOString(),
    updatedAt: now.toDate().toISOString(),
  };
}

export async function getAlumnosPorClase(claseId: string) {
  const doc = await adminDb.collection("clases").doc(claseId).get();

  if (!doc.exists) return [];

  const data = doc.data();

  return data?.alumnos || [];
}

export async function getAlumnos(): Promise<Alumno[]> {
  const snapshot = await adminDb
    .collection(COLLECTION_NAME)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      matricula: Number(data.matricula ?? 0),
      nombre: String(data.nombre ?? ""),
      carrera: String(data.carrera ?? ""),
      claseId: String(data.claseId ?? ""),
      createdAt: data.createdAt?.toDate?.().toISOString() ?? "",
      updatedAt: data.updatedAt?.toDate?.().toISOString() ?? "",
    };
  });
}