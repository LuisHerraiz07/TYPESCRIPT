# Arquitectura del Módulo 2 — Modelado de datos

## Decisiones de diseño

### `interface` vs `type`

Se ha seguido la regla de diseño del enunciado:

- **`interface`** para entidades del dominio (`Estudiante`, `Asignatura`, `RespuestaAPI<T>`): permiten herencia con `extends`, son descriptivas y admiten declaration merging. Son el estándar para modelar objetos de negocio.
- **`type`** para alias semánticos (`UUID`, `Creditos`), uniones (`EstadoMatricula`) e intersecciones (`EstudianteAuditable`): expresan con mayor claridad combinaciones de tipos y primitivos con significado.

### `readonly` en los IDs

Los campos `id` de `Estudiante` y `Asignatura` son `readonly`. Esto garantiza a nivel de compilador que una vez creada una entidad, su identificador no puede ser modificado. Simula la inmutabilidad de las claves primarias en bases de datos relacionales.

### Unión Discriminada `EstadoMatricula`

En vez de una sola interfaz con propiedades opcionales (`asignaturas?: Asignatura[]`, `notaMedia?: number`), se separan tres interfaces con un campo literal `tipo` como discriminante:

```typescript
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;
```

**Ventajas:**
- TypeScript estrecha el tipo automáticamente en cada rama del `switch`.
- Imposible acceder a `notaMedia` en una `MatriculaActiva` — error de compilación.
- Con `never` en el `default`, si se añade un cuarto estado, el compilador obliga a actualizarlo.

### Genéricos en `ApiClient`

```typescript
async obtenerRecurso<T extends object>(endpoint: string): Promise<RespuestaAPI<T>>
```

La restricción `extends object` impide pasar primitivos como `string` o `number`. Cada llamada especializada (`getEstudiantes()`, `getAsignaturas()`) define el tipo concreto en el call-site, lo que garantiza que el consumidor recibe datos fuertemente tipados sin usar `any`.

### `RespuestaAPI<T>`

Interfaz genérica que envuelve cualquier respuesta del servidor. El campo `datos: T` se especializa en cada llamada. Esto permite un patrón unificado de manejo de errores y metadatos sin duplicar código.
