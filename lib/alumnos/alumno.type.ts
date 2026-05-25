export interface Alumno {
    id: string;
    matricula: number;
    nombre: string;
    carrera: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAlumnoInput {
    matricula: number;
    nombre: string;
    carrera: string;
}