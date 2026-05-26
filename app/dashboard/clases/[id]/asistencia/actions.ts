"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function crearAsistencia(formData: FormData) {
  const alumnoId = formData.get("alumnoId") as string;
  const claseId = formData.get("claseId") as string;
  const estado = formData.get("estado") as string;

  if (!alumnoId || !claseId || !estado) {
    throw new Error("Datos incompletos");
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const existente = await adminDb
    .collection("asistencias")
    .where("alumnoId", "==", alumnoId)
    .where("claseId", "==", claseId)
    .where("fecha", ">=", hoy)
    .where("fecha", "<", manana)
    .get();

  if (!existente.empty) {
    return;
  }

  await adminDb.collection("asistencias").add({
    alumnoId,
    claseId,
    estado,
    fecha: Timestamp.now(),
  });

  revalidatePath(`/dashboard/clases/${claseId}/asistencia`);
}