/**
 * index.ts — Módulo 2
 * Demuestra el uso de interfaces, genéricos y Uniones Discriminadas.
 *
 * Ejecutar con: npx tsx src/index.ts
 */

import { ApiClient, generarReporte } from '../../services/api-client.js';
import type { EstadoMatricula, Asignatura } from './domain/types/index.js';

const cliente = new ApiClient();

async function main(): Promise<void> {
  console.log('\n  ═══════════════════════════════════════════════');
  console.log('  MÓDULO 2 — Modelado de datos y genéricos');
  console.log('  ═══════════════════════════════════════════════\n');

  // ── 1. Obtener todos los estudiantes ──────────────────────────
  console.log('  1. GET /estudiantes');
  const respEstudiantes = await cliente.getEstudiantes();
  console.log(`     Estado: ${respEstudiantes.codigoEstado} | Éxito: ${respEstudiantes.exito}`);
  respEstudiantes.datos.forEach(e =>
    console.log(`     → ${e.id}: ${e.nombre} ${e.apellidos} <${e.email}>`)
  );

  // ── 2. Obtener estudiante por ID ──────────────────────────────
  console.log('\n  2. GET /estudiantes/est-001');
  const respUno = await cliente.getEstudiante('est-001');
  console.log(`     Estado: ${respUno.codigoEstado}`);
  console.log(`     Nombre: ${respUno.datos.nombre} ${respUno.datos.apellidos}`);

  // ── 3. Obtener recurso inexistente (404) ──────────────────────
  console.log('\n  3. GET /estudiantes/est-999 (no existe)');
  const respError = await cliente.getEstudiante('est-999');
  console.log(`     Estado: ${respError.codigoEstado} | Éxito: ${respError.exito}`);
  console.log(`     Error: ${respError.errores?.[0]}`);

  // ── 4. Obtener asignaturas ────────────────────────────────────
  console.log('\n  4. GET /asignaturas');
  const respAsig = await cliente.getAsignaturas();
  respAsig.datos.forEach((a: Asignatura) =>
    console.log(`     → ${a.id}: ${a.nombre} (${a.creditos} créditos, Q${a.cuatrimestre})`)
  );

  // ── 5. Uniones Discriminadas — generarReporte ─────────────────
  console.log('\n  5. UNIONES DISCRIMINADAS — generarReporte()\n');

  const estados: EstadoMatricula[] = [
    {
      tipo:         'ACTIVA',
      estudianteId: 'est-001',
      asignaturas:  respAsig.datos.slice(0, 2),
      fechaInicio:  new Date('2024-09-15'),
    },
    {
      tipo:             'SUSPENDIDA',
      estudianteId:     'est-002',
      motivoSuspension: 'Impago de matrícula',
      fechaSuspension:  new Date('2024-11-01'),
    },
    {
      tipo:         'FINALIZADA',
      estudianteId: 'est-001',
      notaMedia:    8.35,
      fechaFin:     new Date('2025-06-30'),
    },
  ];

  estados.forEach(e => {
    console.log(generarReporte(e));
    console.log('');
  });

  console.log('  ═══════════════════════════════════════════════');
  console.log('  ✅ Módulo 2 completado sin errores de tipo.\n');
}

main().catch(console.error);
