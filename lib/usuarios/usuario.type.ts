export type RolUsuario = "admin" | "docente";

export interface Usuario {
  uid: string;

  nombre: string;

  email: string;

  rol: RolUsuario;

  imageUrl: string;

  activo: boolean;

  createdAt: Date;

  updatedAt?: Date;
}