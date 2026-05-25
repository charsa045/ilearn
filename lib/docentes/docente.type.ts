export type GradoEstudios =
  | "Licenciatura"
  | "Maestría"
  | "Doctorado";

export interface Docente {
  id: string;
  uid: string;
  nombre: string;
  email: string;
  imageUrl?: string;
  imagePublicId?: string;
  grado: GradoEstudios;
  titulo: string;
  especialidad: string;
  institucion: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocenteInput {
  uid: string;
  nombre?: string;
  imageUrl?: string;
  imagePublicId?: string;
  grado: GradoEstudios;
  titulo: string;
  especialidad: string;
  institucion: string;
}

export interface UpdateDocenteInput {
  nombre?: string;
  grado?: GradoEstudios;
  titulo?: string;
  especialidad?: string;
  institucion?: string;
  activo?: boolean;
}
