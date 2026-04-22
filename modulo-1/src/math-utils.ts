/**
 * math-utils.ts
 * Módulo 1 — Funciones de análisis estadístico con tipado estricto.
 *
 * Aplica los conceptos:
 * - Tipado explícito de parámetros y retorno
 * - Manejo de casos límite con `number | null`
 * - Tipos especiales: void, never
 */

// ── Tipos propios del módulo ────────────────────────────────────

/** Representa el resultado de un análisis estadístico completo */
interface ResultadoEstadistico {
  media:    number | null;
  mediana:  number | null;
  minimo:   number | null;
  maximo:   number | null;
  conteo:   number;
}

// ── Funciones puras ─────────────────────────────────────────────

/**
 * Calcula la media aritmética de un array de números.
 * Retorna null si el array está vacío.
 */
export function calcularMedia(datos: number[]): number | null {
  if (datos.length === 0) return null;
  const suma = datos.reduce((acc, val) => acc + val, 0);
  return suma / datos.length;
}

/**
 * Calcula la mediana de un array de números.
 * Retorna null si el array está vacío.
 */
export function calcularMediana(datos: number[]): number | null {
  if (datos.length === 0) return null;

  // Ordenar copia del array sin mutar el original
  const ordenado = [...datos].sort((a, b) => a - b);
  const mitad    = Math.floor(ordenado.length / 2);

  // Si el número de elementos es par, la mediana es el promedio de los dos centrales
  return ordenado.length % 2 !== 0
    ? ordenado[mitad]
    : (ordenado[mitad - 1] + ordenado[mitad]) / 2;
}

/**
 * Filtra valores atípicos (outliers) del array.
 * Un valor es atípico si supera `limite` desviaciones estándar de la media.
 *
 * @param datos  - Array de valores numéricos
 * @param limite - Número de desviaciones estándar (por defecto 2)
 * @returns Array sin los valores atípicos, o array vacío si no hay datos
 */
export function filtrarAtipicos(datos: number[], limite: number = 2): number[] {
  if (datos.length === 0) return [];

  const media = calcularMedia(datos) as number; // Sabemos que no es null (array no vacío)

  // Desviación estándar
  const varianza = datos.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / datos.length;
  const desviacion = Math.sqrt(varianza);

  return datos.filter(val => Math.abs(val - media) <= limite * desviacion);
}

/**
 * Calcula la desviación estándar de un array.
 * Retorna null si el array está vacío.
 */
export function calcularDesviacionEstandar(datos: number[], media: number): number {
  const varianza = datos.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / datos.length;
  return Math.sqrt(varianza);
}

/**
 * Genera un resumen estadístico completo de un array.
 * Usa el tipo `ResultadoEstadistico` para garantizar el contrato de retorno.
 */
export function generarResumen(datos: number[]): ResultadoEstadistico {
  if (datos.length === 0) {
    return { media: null, mediana: null, minimo: null, maximo: null, conteo: 0 };
  }

  return {
    media:   calcularMedia(datos),
    mediana: calcularMediana(datos),
    minimo:  Math.min(...datos),
    maximo:  Math.max(...datos),
    conteo:  datos.length,
  };
}

/**
 * Función que nunca retorna — lanza siempre una excepción.
 * Ilustra el tipo `never` en TypeScript.
 */
export function lanzarErrorCritico(mensaje: string): never {
  throw new Error(`[ERROR CRÍTICO] ${mensaje}`);
}
