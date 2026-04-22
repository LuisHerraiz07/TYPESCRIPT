/**
 * domain/types/index.ts
 * Módulo 2 — Modelado del dominio universitario
 */

// ── Tipos primitivos con alias semántico ─────────────────────
export type UUID         = string;
export type Creditos     = number;
export type NotaMedia    = number;

// ── Enum: niveles de acceso ──────────────────────────────────
export enum NivelAcceso {
  Invitado       = 'GUEST',
  Estudiante     = 'STUDENT',
  Docente        = 'TEACHER',
  Administrador  = 'ADMIN',
}

// ── Entidades del dominio ────────────────────────────────────
export interface Asignatura {
  readonly id:   UUID;
  nombre:        string;
  creditos:      Creditos;
  departamento:  string;
  cuatrimestre:  1 | 2;
}

export interface Estudiante {
  readonly id:     UUID;
  nombre:          string;
  apellidos:       string;
  email:           string;
  fechaNacimiento: Date;
  nivelAcceso:     NivelAcceso;
}

// ── Intersección: entidad auditable ─────────────────────────
type EntidadAuditable = {
  creadoEn:       Date;
  modificadoEn?:  Date;
  modificadoPor?: string;
};

export type EstudianteAuditable = Estudiante & EntidadAuditable;

// ── Unión Discriminada: EstadoMatricula ──────────────────────
export interface MatriculaActiva {
  tipo:         'ACTIVA';
  estudianteId: UUID;
  asignaturas:  Asignatura[];
  fechaInicio:  Date;
}

export interface MatriculaSuspendida {
  tipo:             'SUSPENDIDA';
  estudianteId:     UUID;
  motivoSuspension: string;
  fechaSuspension:  Date;
}

export interface MatriculaFinalizada {
  tipo:         'FINALIZADA';
  estudianteId: UUID;
  notaMedia:    NotaMedia;
  fechaFin:     Date;
}

export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// ── Interfaz genérica: RespuestaAPI<T> ───────────────────────
export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito:        boolean;
  datos:        T;
  errores?:     string[];
  timestamp:    string;
}
