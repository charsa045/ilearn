import { adminDb } from "@/lib/firebase-admin";
import { AsistenciaAlumno, CreateAsistenciaInput } from "./asistencia.type";

const COLLECTION = "asistencias";

function getHoy() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Mexico_City",
  }).format(new Date());
}

export async function getAsistenciaHoy(claseId: string) {

  if (!claseId) {
    throw new Error("claseId requerido");
  }

  const hoy = getHoy();

  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("claseId", "==", claseId)
    .where("fecha", "==", hoy)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function crearAsistencia(
  input: CreateAsistenciaInput
) {

  const { claseId, alumnos } = input;

  if (!claseId || !alumnos) {
    throw new Error("Datos incompletos");
  }

  const hoy = getHoy();

  const existente = await adminDb
    .collection(COLLECTION)
    .where("claseId", "==", claseId)
    .where("fecha", "==", hoy)
    .limit(1)
    .get();

  if (!existente.empty) {
    throw new Error(
      "La asistencia de hoy ya fue registrada"
    );
  }

  const docRef = await adminDb
    .collection(COLLECTION)
    .add({
      claseId,
      fecha: hoy,
      alumnos,
      createdAt: new Date(),
    });

  return {
    id: docRef.id,
    claseId,
    fecha: hoy,
    alumnos,
  };
}

export async function getAsistenciaByFecha(
  claseId: string,
  fecha: string
) {

  try {

    if (!claseId || !fecha) {
      throw new Error(
        "claseId y fecha son requeridos"
      );
    }

    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("claseId", "==", claseId)
      .where("fecha", "==", fecha)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return {
        id: null,
        claseId,
        fecha,
        alumnos: [],
      };
    }

    const doc = snapshot.docs[0];

    return {
      id: doc.id,
      ...doc.data(),
    };

  } catch (error) {

    console.error(
      "Error en getAsistenciaByFecha:",
      error
    );

    throw new Error(
      "No se pudo obtener la asistencia por fecha"
    );
  }
}

export async function editarAsistencia({
  asistenciaId,
  alumnos,
}: {
  asistenciaId: string;
  alumnos: AsistenciaAlumno[];
}) {

  if (!asistenciaId || !alumnos) {
    throw new Error("Datos incompletos");
  }

  await adminDb
    .collection(COLLECTION)
    .doc(asistenciaId)
    .update({
      alumnos,
      updatedAt: new Date(),
    });

  return {
    success: true,
  };
}

export async function getAsistenciasByClase(
  claseId: string
) {

  if (!claseId) {
    throw new Error("claseId requerido");
  }

  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("claseId", "==", claseId)
    .orderBy("fecha", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}