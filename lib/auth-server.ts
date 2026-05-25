import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";
import { Usuario } from "./usuarios/usuario.type";

const COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";

export async function getServerUser(): Promise<Usuario | null> {
  const token = (await cookies()).get(COOKIE)?.value;

  if (!token) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);

    const authUser = await adminAuth.getUser(decoded.uid);

    const doc = await adminDb
      .collection("usuarios")
      .doc(decoded.uid)
      .get();

    const data = doc.exists ? doc.data() : null;

    return {
      uid: decoded.uid,

      nombre:
        data?.nombre ||
        authUser.displayName ||
        "Sin nombre",

      email:
        data?.email ||
        authUser.email ||
        "",

      rol: data?.rol || "docente",
    };
  } catch (error) {
    console.error("getServerUser error:", error);
    return null;
  }
}