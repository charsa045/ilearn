import { createAlumno, getAlumnos } from "@/lib/alumnos/alumno.repository";
import { adminDb } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const alumnos = await getAlumnos();
        return NextResponse.json({
            ok: true,
            data: alumnos,
        });
    }catch(error){
        console.error("Error obteniendo los alumnos: ", error);

        return NextResponse.json(
            {
                ok: false,
                message: "No se pudieron obtener los productos"
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();

        const matriculaRaw = body.matricula;

        if (!matriculaRaw || isNaN(Number(matriculaRaw))) {
        return NextResponse.json(
            { ok: false, message: "Matrícula inválida" },
            { status: 400 }
        );
        }

        const matricula = Number(matriculaRaw);
        const nombre = String(body.nombre ?? "").trim();
        const carrera = String(body.carrera ?? "").trim();

        if(!matricula){
            return NextResponse.json(
                { ok: false, message: "La matrícula es obligatoria" },
                { status: 400 }
            );
        }

        const existe = await adminDb
        .collection("alumnos")
        .doc(String(matricula))
        .get();

        if (existe.exists) {
        throw new Error("La matrícula ya está registrada");
        }

        if(!nombre){
            return NextResponse.json(
                { ok: false, message: "El nombre es obligatorio" },
                { status: 400 }
            );
        }

        if(!carrera){
            return NextResponse.json(
                { ok: false, message: "La carrera es obligatoria" },
                { status: 400 }
            );
        }

        const alumno = await createAlumno({
            matricula,
            nombre,
            carrera,
        });

        return NextResponse.json(
            {
                ok: true,
                message: "Alumno creado correctamente.",
                data: alumno
            },
            { status: 201 }
        );

    }catch (error: any) {
    console.error("ERROR:", error);

    return NextResponse.json(
        {
        ok: false,
        message: error.message || "Error interno",
        },
        { status: 500 }
    );
    }
}