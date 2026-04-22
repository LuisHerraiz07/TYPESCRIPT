"use strict";
/**
 * domain/types/index.ts
 * Módulo 2 — Modelado del dominio universitario
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NivelAcceso = void 0;
// ── Enum: niveles de acceso ──────────────────────────────────
var NivelAcceso;
(function (NivelAcceso) {
    NivelAcceso["Invitado"] = "GUEST";
    NivelAcceso["Estudiante"] = "STUDENT";
    NivelAcceso["Docente"] = "TEACHER";
    NivelAcceso["Administrador"] = "ADMIN";
})(NivelAcceso || (exports.NivelAcceso = NivelAcceso = {}));
