"use strict";
/**
 * services/api-client.ts
 * Módulo 2 — Servicio de datos genérico
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
exports.generarReporte = generarReporte;
const index_1 = require("../domain/types/index");
const DB_ESTUDIANTES = [
    {
        id: 'est-001',
        nombre: 'Luis',
        apellidos: 'Herraiz García',
        email: 'luis@universidad.es',
        fechaNacimiento: new Date('2000-03-15'),
        nivelAcceso: index_1.NivelAcceso.Estudiante,
    },
    {
        id: 'est-002',
        nombre: 'Ana',
        apellidos: 'Martínez López',
        email: 'ana@universidad.es',
        fechaNacimiento: new Date('1999-07-22'),
        nivelAcceso: index_1.NivelAcceso.Estudiante,
    },
];
const DB_ASIGNATURAS = [
    { id: 'asig-001', nombre: 'Fundamentos de Programación', creditos: 6, departamento: 'Informática', cuatrimestre: 1 },
    { id: 'asig-002', nombre: 'Estructuras de Datos', creditos: 6, departamento: 'Informática', cuatrimestre: 2 },
    { id: 'asig-003', nombre: 'Cálculo I', creditos: 6, departamento: 'Matemáticas', cuatrimestre: 1 },
];
function construirRespuesta(datos, codigo = 200) {
    return {
        codigoEstado: codigo,
        exito: codigo >= 200 && codigo < 300,
        datos,
        timestamp: new Date().toISOString(),
    };
}
function construirError(mensaje, codigo) {
    return {
        codigoEstado: codigo,
        exito: false,
        datos: null,
        errores: [mensaje],
        timestamp: new Date().toISOString(),
    };
}
class ApiClient {
    async obtenerRecurso(endpoint) {
        return new Promise((resolve) => {
            const latencia = Math.floor(Math.random() * 100) + 50;
            setTimeout(() => {
                if (endpoint.startsWith('/estudiantes')) {
                    const id = endpoint.split('/')[2];
                    if (id) {
                        const estudiante = DB_ESTUDIANTES.find(e => e.id === id);
                        if (!estudiante) {
                            resolve(construirError(`Estudiante ${id} no encontrado`, 404));
                        }
                        else {
                            resolve(construirRespuesta(estudiante));
                        }
                    }
                    else {
                        resolve(construirRespuesta(DB_ESTUDIANTES));
                    }
                }
                else if (endpoint.startsWith('/asignaturas')) {
                    resolve(construirRespuesta(DB_ASIGNATURAS));
                }
                else {
                    resolve(construirError(`Endpoint '${endpoint}' no reconocido`, 404));
                }
            }, latencia);
        });
    }
    async getEstudiantes() {
        return this.obtenerRecurso('/estudiantes');
    }
    async getEstudiante(id) {
        return this.obtenerRecurso(`/estudiantes/${id}`);
    }
    async getAsignaturas() {
        return this.obtenerRecurso('/asignaturas');
    }
}
exports.ApiClient = ApiClient;
function generarReporte(estado) {
    switch (estado.tipo) {
        case 'ACTIVA':
            return `📗 MATRÍCULA ACTIVA\n   Estudiante: ${estado.estudianteId}\n   Asignaturas: ${estado.asignaturas.length}\n   Inicio: ${estado.fechaInicio.toLocaleDateString('es-ES')}`;
        case 'SUSPENDIDA':
            return `📙 MATRÍCULA SUSPENDIDA\n   Estudiante: ${estado.estudianteId}\n   Motivo: ${estado.motivoSuspension}\n   Fecha: ${estado.fechaSuspension.toLocaleDateString('es-ES')}`;
        case 'FINALIZADA':
            return `📘 MATRÍCULA FINALIZADA\n   Estudiante: ${estado.estudianteId}\n   Nota media: ${estado.notaMedia.toFixed(2)}\n   Fin: ${estado.fechaFin.toLocaleDateString('es-ES')}`;
        default:
            const comprobacionExhaustiva = estado;
            throw new Error(`Estado no manejado: ${JSON.stringify(comprobacionExhaustiva)}`);
    }
}
