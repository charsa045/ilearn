export interface AsistenciaAlumno {
  alumnoId: string;
  nombre: string;
  presente: boolean;
}

export interface Asistencia {
  id: string;
  claseId: string;
  fecha: string;
  alumnos: AsistenciaAlumno[];
  createdAt: string;
}

export interface CreateAsistenciaInput {
  claseId: string;
  alumnos: AsistenciaAlumno[];
}