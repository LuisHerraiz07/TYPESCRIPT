/**
 * services/api-client.ts
 * Módulo 2 — Servicio de datos genérico
 *
 * Aplica los conceptos:
 * - Método genérico con restricción `extends`
 * - Promesas fuertemente tipadas: Promise<T>
 * - RespuestaAPI<T>
 * - Simulación de base de datos con setTimeout
 */

import type { RespuestaAPI, Estudiante, Asignatura, EstadoMatricula } from '../domain/types/index.js';
import { NivelAcceso } from '../domain/types/index.js';

// ── Base de datos simulada en memoria ──────────────────────────

const DB_ESTUDIANTES: Estudiante[] = [
  {
    id:              'est-001',
    nombre:          'Luis',
    apellidos:       'Herraiz García',
    email:           'luis@universidad.es',
    fechaNacimiento: new Date('2000-03-15'),
    nivelAcceso:     NivelAcceso.Estudiante,
  },
  {
    id:              'est-002',
    nombre:          'Ana',
    apellidos:       'Martínez López',
    email:           'ana@universidad.es',
    fechaNacimiento: new Date('1999-07-22'),
    nivelAcceso:     NivelAcceso.Estudiante,
  },
];

const DB_ASIGNATURAS: Asignatura[] = [
  { id: 'asig-001', nombre: 'Fundamentos de Programación', creditos: 6, departamento: 'Informática', cuatrimestre: 1 },
  { id: 'asig-002', nombre: 'Estructuras de Datos',        creditos: 6, departamento: 'Informática', cuatrimestre: 2 },
  { id: 'asig-003', nombre: 'Cálculo I',                   creditos: 6, departamento: 'Matemáticas', cuatrimestre: 1 },
];

// ── Función helper: construye una RespuestaAPI<T> ───────────────

function construirRespuesta<T>(datos: T, codigo: number = 200): RespuestaAPI<T> {
  return {
    codigoEstado: codigo,
    exito:        codigo >= 200 && codigo < 300,
    datos,
    timestamp:    new Date().toISOString(),
  };
}

function construirError<T>(mensaje: string, codigo: number): RespuestaAPI<T> {
  return {
    codigoEstado: codigo,
    exito:        false,
    datos:        null as unknown as T, // null tipado como T para el contrato de retorno
    errores:      [mensaje],
    timestamp:    new Date().toISOString(),
  };
}

// ── ApiClient: servicio genérico ────────────────────────────────

export class ApiClient {

  /**
   * Método genérico que simula una llamada a la "base de datos".
   * La restricción `extends object` impide pasar primitivos.
   * Retorna una promesa tipada con la respuesta estándar.
   */
  async obtenerRecurso<T extends object>(endpoint: string): Promise<RespuestaAPI<T>> {
    return new Promise((resolve) => {
      // Simulamos latencia de red (50–150ms)
      const latencia = Math.floor(Math.random() * 100) + 50;

      setTimeout(() => {
        if (endpoint.startsWith('/estudiantes')) {
          const id = endpoint.split('/')[2];

          if (id) {
            const estudiante = DB_ESTUDIANTES.find(e => e.id === id);
            if (!estudiante) {
              resolve(construirError<T>(`Estudiante ${id} no encontrado`, 404));
            } else {
              resolve(construirRespuesta<T>(estudiante as unknown as T));
            }
          } else {
            resolve(construirRespuesta<T>(DB_ESTUDIANTES as unknown as T));
          }

        } else if (endpoint.startsWith('/asignaturas')) {
          resolve(construirRespuesta<T>(DB_ASIGNATURAS as unknown as T));

        } else {
          resolve(construirError<T>(`Endpoint '${endpoint}' no reconocido`, 404));
        }
      }, latencia);
    });
  }

  /**
   * Obtiene todos los estudiantes.
   * Tipo fuertemente especificado en el call-site.
   */
  async getEstudiantes(): Promise<RespuestaAPI<Estudiante[]>> {
    return this.obtenerRecurso<Estudiante[]>('/estudiantes');
  }

  /**
   * Obtiene un estudiante por ID.
   */
  async getEstudiante(id: string): Promise<RespuestaAPI<Estudiante>> {
    return this.obtenerRecurso<Estudiante>(`/estudiantes/${id}`);
  }

  /**
   * Obtiene todas las asignaturas.
   */
  async getAsignaturas(): Promise<RespuestaAPI<Asignatura[]>> {
    return this.obtenerRecurso<Asignatura[]>('/asignaturas');
  }
}

// ── Función generarReporte con Unión Discriminada ───────────────

export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case 'ACTIVA':
      return (
        `📗 MATRÍCULA ACTIVA\n` +
        `   Estudiante: ${estado.estudianteId}\n` +
        `   Asignaturas: ${estado.asignaturas.length}\n` +
        `   Inicio: ${estado.fechaInicio.toLocaleDateString('es-ES')}`
      );

    case 'SUSPENDIDA':
      return (
        `📙 MATRÍCULA SUSPENDIDA\n` +
        `   Estudiante: ${estado.estudianteId}\n` +
        `   Motivo: ${estado.motivoSuspension}\n` +
        `   Fecha: ${estado.fechaSuspension.toLocaleDateString('es-ES')}`
      );

    case 'FINALIZADA':
      return (
        `📘 MATRÍCULA FINALIZADA\n` +
        `   Estudiante: ${estado.estudianteId}\n` +
        `   Nota media: ${estado.notaMedia.toFixed(2)}\n` +
        `   Fin: ${estado.fechaFin.toLocaleDateString('es-ES')}`
      );

    default:
      // Análisis exhaustivo con never — si se añade un estado nuevo
      // y no se maneja aquí, el compilador lanza un error.
      const comprobacionExhaustiva: never = estado;
      throw new Error(`Estado no manejado: ${JSON.stringify(comprobacionExhaustiva)}`);
  }
}
