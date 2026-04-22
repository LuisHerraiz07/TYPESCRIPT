/**
 * index.ts — Módulo 1
 * Punto de entrada: prueba de las funciones de math-utils.ts
 *
 * Ejecutar con: npx tsx src/index.ts
 * Compilar con: npx tsc
 */

import {
  calcularMedia,
  calcularMediana,
  filtrarAtipicos,
  calcularDesviacionEstandar,
  generarResumen,
} from './math-utils.js';

// ── Datos de prueba ─────────────────────────────────────────────

// Conjunto de métricas de rendimiento de un servidor (en ms)
const tiemposRespuesta: number[] = [12.4, 8.9, 15.0, 11.2, 9.8, 200.5, 13.1, 10.5, 8.1, 14.3];

// Conjunto vacío para comprobar el manejo de casos límite
const arrayVacio: number[] = [];

// Inferencia de tipo: TypeScript infiere que timestamp es 'number'
const timestamp = new Date().getTime();
console.log(`\n  Análisis iniciado: ${new Date(timestamp).toLocaleTimeString('es-ES')}`);
console.log('  ─────────────────────────────────────────────────────');

// ── Prueba 1: Media ─────────────────────────────────────────────

const media = calcularMedia(tiemposRespuesta);
console.log(`\n  📊 MEDIA`);
console.log(`     Datos:     [${tiemposRespuesta.join(', ')}]`);
console.log(`     Resultado: ${media !== null ? media.toFixed(2) + ' ms' : 'Sin datos'}`);

const mediaVacia = calcularMedia(arrayVacio);
console.log(`     Array vacío → ${mediaVacia}`); // null

// ── Prueba 2: Mediana ───────────────────────────────────────────

const mediana = calcularMediana(tiemposRespuesta);
console.log(`\n  📊 MEDIANA`);
console.log(`     Resultado: ${mediana !== null ? mediana.toFixed(2) + ' ms' : 'Sin datos'}`);

// ── Prueba 3: Filtrar atípicos ──────────────────────────────────

const sinAtipicos = filtrarAtipicos(tiemposRespuesta);
console.log(`\n  📊 FILTRAR ATÍPICOS (límite: 2σ)`);
console.log(`     Original: ${tiemposRespuesta.length} valores`);
console.log(`     Filtrado: [${sinAtipicos.join(', ')}]`);
console.log(`     Eliminados: ${tiemposRespuesta.length - sinAtipicos.length} valor(es) atípico(s)`);

// ── Prueba 4: Desviación estándar ───────────────────────────────

if (media !== null) {
  const desviacion = calcularDesviacionEstandar(tiemposRespuesta, media);
  console.log(`\n  📊 DESVIACIÓN ESTÁNDAR`);
  console.log(`     Resultado: ${desviacion.toFixed(2)} ms`);
}

// ── Prueba 5: Resumen completo ──────────────────────────────────

const resumen = generarResumen(tiemposRespuesta);
console.log('\n  📊 RESUMEN ESTADÍSTICO COMPLETO');
console.log(`     Conteo:  ${resumen.conteo}`);
console.log(`     Media:   ${resumen.media?.toFixed(2)} ms`);
console.log(`     Mediana: ${resumen.mediana?.toFixed(2)} ms`);
console.log(`     Mínimo:  ${resumen.minimo} ms`);
console.log(`     Máximo:  ${resumen.maximo} ms`);

const resumenVacio = generarResumen(arrayVacio);
console.log('\n  📊 RESUMEN ARRAY VACÍO');
console.log(`     Media: ${resumenVacio.media} (null esperado)`);

// ── Prueba 6: Tipos especiales ──────────────────────────────────

// unknown: la alternativa segura a any
const valorDesconocido: unknown = '42';
if (typeof valorDesconocido === 'string') {
  const numero = parseFloat(valorDesconocido);
  console.log(`\n  🔒 UNKNOWN → comprobado como string → parseFloat: ${numero}`);
}

// as const: estructura inmutable
const configuracion = { timeout: 5000, reintentos: 3 } as const;
// configuracion.timeout = 9000; // ← Error de compilación: readonly
console.log(`\n  🔒 AS CONST — timeout: ${configuracion.timeout} (readonly)`);

console.log('\n  ─────────────────────────────────────────────────────');
console.log('  ✅ Todos los tests completados sin errores de tipo.\n');
