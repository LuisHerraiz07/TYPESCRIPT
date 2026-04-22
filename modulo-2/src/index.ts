/**
 * domain/types/index.ts
 * Módulo 2 — Modelado del dominio universitario
 *
 * Aplica los conceptos:
 * - interface vs type
 * - readonly para IDs
 * - Uniones Discriminadas (Tagged Unions)
 * - Enums
 * - Tipos de intersección
 */

// ── 1. Tipos primitivos con alias semántico ─────────────────────
// Usando `type` para primitivos (semántica > estructura)
export type UUID         = string;
export type Creditos     = number;
export type NotaMedia    = number; // 0.0 – 10.0

// ── 2. Enum: niveles de acceso ──────────────────────────────────
export enum NivelAcceso {
  Invitado       = 'GUEST',
  Estudiante     = 'STUDENT',
  Docente        = 'TEACHER',
  Administrador  = 'ADMIN',
}

// ── 3. Entidades del dominio (interfaces) ───────────────────────
// Usamos `interface` para objetos de dominio porque permiten herencia
// y declaration merging. El `readonly` en los IDs garantiza inmutabilidad.

export interface Asignatura {
  readonly id:   UUID;
  nombre:        string;
  creditos:      Creditos;
  departamento:  string;
  cuatrimestre:  1 | 2;            // Tipo literal: solo acepta 1 o 2
}

export interface Estudiante {
  readonly id:    UUID;
  nombre:         string;
  apellidos:      string;
  email:          string;
  fechaNacimiento: Date;
  nivelAcceso:    NivelAcceso;
}

// ── 4. Tipo de intersección: entidad auditable ──────────────────
// Usamos `type` para la intersección porque combina dos contratos.
type EntidadAuditable = {
  creadoEn:      Date;
  modificadoEn?: Date;
  modificadoPor?: string;
};

export type EstudianteAuditable = Estudiante & EntidadAuditable;

// ── 5. Unión Discriminada: EstadoMatricula ──────────────────────
// Patrón fundamental. Cada estado tiene una propiedad `tipo` literal
// que actúa como discriminante. TypeScript estrecha el tipo en cada rama.

export interface MatriculaActiva {
  tipo:         'ACTIVA';
  estudianteId: UUID;
  asignaturas:  Asignatura[];
  fechaInicio:  Date;
}

export interface MatriculaSuspendida {
  tipo:            'SUSPENDIDA';
  estudianteId:    UUID;
  motivoSuspension: string;
  fechaSuspension: Date;
}

export interface MatriculaFinalizada {
  tipo:         'FINALIZADA';
  estudianteId: UUID;
  notaMedia:    NotaMedia;
  fechaFin:     Date;
}

// La unión de los tres estados posibles
export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// ── 6. Interfaz genérica: RespuestaAPI<T> ──────────────────────
export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito:        boolean;
  datos:        T;
  errores?:     string[];
  timestamp:    string;
}
