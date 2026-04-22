# TypeScript — Práctica 4

Repositorio de la Práctica 4 del bootcamp. Contiene los Módulos 1 y 2.

## Estructura

```
typescript/
├── modulo-1/          ← Tipos primitivos, inferencia, lógica pura
│   ├── src/
│   │   ├── math-utils.ts   Funciones estadísticas tipadas
│   │   └── index.ts        Punto de entrada y pruebas
│   ├── dist/               Código compilado (generado por tsc)
│   ├── tsconfig.json
│   └── package.json
│
├── modulo-2/          ← Modelado complejo, genéricos, patrones
│   ├── src/
│   │   ├── domain/types/index.ts   Interfaces y Uniones Discriminadas
│   │   ├── services/api-client.ts  Servicio genérico + generarReporte
│   │   └── index.ts                Punto de entrada
│   ├── docs/
│   │   └── arquitectura.md
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

## Cómo ejecutar

### Módulo 1
```bash
cd modulo-1
npm install
npm run dev       # npx tsx src/index.ts
npm run build     # npx tsc → genera dist/
```

### Módulo 2
```bash
cd modulo-2
npm install
npm run dev       # npx tsx src/index.ts
npm run typecheck # npx tsc --noEmit (0 errores)
```

## Conceptos aplicados

| Concepto | Módulo |
|---|---|
| Tipado explícito de funciones | 1 |
| `number \| null` para casos límite | 1 |
| `unknown` vs `any` | 1 |
| `as const` — estructuras inmutables | 1 |
| Tipo `never` | 1 y 2 |
| `interface` para entidades de dominio | 2 |
| `type` para uniones y alias | 2 |
| `readonly` en IDs | 2 |
| Uniones Discriminadas (`EstadoMatricula`) | 2 |
| Genéricos con restricción `extends` | 2 |
| `RespuestaAPI<T>` | 2 |
| Análisis exhaustivo con `never` | 2 |
