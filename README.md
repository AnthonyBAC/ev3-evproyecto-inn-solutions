# EV Proyecto EV3 — Innovatech MVP

Monorepo con **pnpm workspaces**. Backend REST API en NestJS + frontend SPA en React.

---

## Stack tecnológico

### Backend — Producción

| Librería | Versión | Rol |
|---|---|---|
| `@nestjs/common` | ^11.0.1 | Decoradores, pipes, guards, interfaces |
| `@nestjs/core` | ^11.0.1 | Motor de NestJS (módulos, DI, bootstrap) |
| `@nestjs/platform-express` | ^11.0.1 | Adaptador HTTP Express |
| `reflect-metadata` | ^0.2.2 | Metadatos para decoradores TS |
| `rxjs` | ^7.8.1 | Programación reactiva |

### Backend — Desarrollo

| Librería | Versión | Rol |
|---|---|---|
| `@nestjs/cli` | ^11.0.0 | CLI (nest build, nest start) |
| `@nestjs/schematics` | ^11.0.0 | Generadores de código |
| `@nestjs/testing` | ^11.0.1 | Utilidades de testing |
| `typescript` | ^5.7.3 | Lenguaje |
| `jest` | ^30.0.0 | Test runner |
| `ts-jest` | ^29.2.5 | Transformador TS para Jest |
| `supertest` | ^7.0.0 | HTTP assertions para tests e2e |
| `eslint` | ^9.18.0 | Linter |
| `typescript-eslint` | ^8.20.0 | Plugin TS para ESLint |
| `eslint-config-prettier` | ^10.0.1 | Desactiva reglas que chocan con Prettier |
| `eslint-plugin-prettier` | ^5.2.2 | Ejecuta Prettier como regla de ESLint |
| `prettier` | ^3.4.2 | Formateador de código |
| `ts-node` | ^10.9.2 | Ejecución directa de TS |
| `ts-loader` | ^9.5.2 | Loader TS para webpack (NestJS) |
| `tsconfig-paths` | ^4.2.0 | Resuelve aliases de tsconfig |
| `@types/express` | ^5.0.0 | Tipos para Express |
| `@types/jest` | ^30.0.0 | Tipos para Jest |
| `@types/node` | ^24.0.0 | Tipos de Node |
| `@types/supertest` | ^7.0.0 | Tipos para supertest |

### Frontend — Producción

| Librería | Versión | Rol |
|---|---|---|
| `react` | ^19.2.6 | UI |
| `react-dom` | ^19.2.6 | Renderizado en DOM |
| `antd` | ^6.4.4 | Componentes UI (Cards, Forms, Layout, Menu, Select, Table, Tag, Modal, etc.) |
| `lucide-react` | ^1.18.0 | Iconos |

### Frontend — Desarrollo

| Librería | Versión | Rol |
|---|---|---|
| `vite` | ^8.0.12 | Bundler + dev server |
| `@vitejs/plugin-react` | ^6.0.1 | Plugin React para Vite |
| `typescript` | ~6.0.2 | Lenguaje |
| `eslint` | ^10.3.0 | Linter |
| `typescript-eslint` | ^8.59.2 | Plugin TS para ESLint |
| `eslint-plugin-react-hooks` | ^7.1.1 | Reglas de hooks de React |
| `eslint-plugin-react-refresh` | ^0.5.2 | HMR con React Refresh |
| `@types/react` | ^19.2.14 | Tipos de React |
| `@types/react-dom` | ^19.2.3 | Tipos de ReactDOM |
| `@types/node` | ^24.12.3 | Tipos de Node |
| `globals` | ^17.6.0 | Variables globales para ESLint |

### Tooling monorepo

| Herramienta | Uso |
|---|---|
| **pnpm** | Gestor de paquetes + workspaces |

---

## Estructura del monorepo

```
ev3-evproyecto-inn-solutions/
├── pnpm-workspace.yaml          # Define los workspaces: frontend y backend
├── pnpm-lock.yaml                # Lockfile único para todo el monorepo
├── README.md                     # Este archivo
├── LOCAL_RESUMEN.md              # Resumen técnico detallado del código
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── src/
│       ├── main.ts               # Bootstrap: puerto 3000, prefijo /api
│       ├── app.module.ts         # Módulo raíz
│       └── modules/
│           ├── projects/         # CRUD proyectos (controller + service + entity)
│           ├── tasks/            # CRUD tareas (controller + service + entity)
│           └── system-status/    # Health check
└── frontend/
    ├── package.json
    ├── vite.config.ts            # Proxy /api → localhost:3000
    ├── index.html
    └── src/
        ├── main.tsx              # Entry point
        ├── app/
        │   ├── App.tsx           # Estado global, auth, routing
        │   └── styles/global.css
        ├── pages/
        │   ├── DashboardPage/
        │   ├── LoginPage/
        │   ├── ProjectsPage/
        │   └── TasksPage/
        ├── components/
        │   ├── SystemStatusCard/
        │   └── TasksPanel/CreateTaskForm/
        ├── layouts/
        │   └── AppLayout/        # Sidebar + header
        ├── services/             # Capa HTTP (fetch nativo)
        ├── types/                # Interfaces + type guards
        └── mocks/                # Datos mock (trabajadores)
```

---

## Cómo levantar el proyecto

### Requisitos previos

- Node.js >= 18
- pnpm instalado globalmente (`npm install -g pnpm`)

### 1. Instalar dependencias

Desde la raíz del monorepo:

```bash
pnpm install
```

Esto instala las dependencias de `frontend/` y `backend/` en un solo paso gracias al workspace.

### 2. Levantar backend

```bash
pnpm --filter backend start:dev
```

El backend arranca en **`http://localhost:3000`** con el prefijo global `/api`.

### 3. Levantar frontend (en otra terminal)

```bash
pnpm --filter frontend dev
```

El frontend arranca en **`http://localhost:5173`**.

### 4. Abrir en el navegador

Ir a **`http://localhost:5173`**. Credenciales:

```
Usuario:   admin
Contraseña: admin123
```

---

## Gestión de paquetes (pnpm workspace)

| Comando | Qué hace |
|---|---|
| `pnpm install` | Instala dependencias de todos los workspaces |
| `pnpm --filter backend <script>` | Ejecuta un script solo en backend |
| `pnpm --filter frontend <script>` | Ejecuta un script solo en frontend |
| `pnpm --filter backend add <pkg>` | Agrega dependencia al backend |
| `pnpm --filter frontend add <pkg>` | Agrega dependencia al frontend |

No se usa npm ni yarn. Todo se maneja con pnpm en la raíz.

---

## Cómo se conecta frontend ↔ backend

El frontend nunca llama directo al backend. El flujo es:

```
Navegador → localhost:5173/api/projects → Proxy de Vite → localhost:3000/api/projects → NestJS
```

El proxy está definido en `frontend/vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

Esto evita problemas de CORS porque la petición sale del servidor de Vite, no del navegador.

---

## API Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/api/system-status` | Health check del backend |
| `GET` | `/api/projects` | Listar proyectos |
| `POST` | `/api/projects` | Crear proyecto `{ name, description }` |
| `PATCH` | `/api/projects/:id/close` | Cerrar proyecto |
| `GET` | `/api/tasks` | Listar tareas |
| `POST` | `/api/tasks` | Crear tarea `{ projectId, title, description, assignee }` |
| `PATCH` | `/api/tasks/:id/status` | Actualizar estado `{ status }` |

**Archivos donde están los endpoints:**

| Endpoint | Controller (backend) |
|---|---|
| `GET /api/system-status` | `backend/src/modules/system-status/controllers/system-status/system-status.controller.ts` |
| `GET/POST/PATCH /api/projects` | `backend/src/modules/projects/controllers/projects/projects.controller.ts` |
| `GET/POST/PATCH /api/tasks` | `backend/src/modules/tasks/controllers/tasks/tasks.controller.ts` |

---

## Cómo se manejan los datos

### NO hay base de datos

El proyecto **no usa PostgreSQL, MySQL, MongoDB ni SQLite**. No hay ORM (TypeORM, Prisma, etc.). No hay archivo `.env`.

### Datos en memoria

Toda la data vive en arrays privados dentro de los servicios:

- `ProjectsService` → `private readonly projects: ProjectEntity[]`
- `TasksService` → `private readonly tasks: TaskEntity[]`

### Datos iniciales (mock)

Al iniciar el backend, los constructores de los servicios cargan datos mock:

- **6 proyectos** predefinidos en `ProjectsService.buildMockProjects()`
  - `backend/src/modules/projects/services/projects/projects.service.ts:136`
- **11 tareas** predefinidas en `TasksService.buildMockTasks()`
  - `backend/src/modules/tasks/services/tasks/tasks.service.ts:161`

Los IDs de proyectos mock están en `backend/src/modules/projects/constants/project-ids/project-ids.ts`.

### Sincronización automática proyecto ↔ tareas

Cuando se crea, actualiza o elimina una tarea, el `TasksService` llama a `ProjectsService.syncProjectMetrics()` que recalcula:

- `taskCount` — total de tareas del proyecto
- `completedTaskCount` — tareas con status `completada`
- `progress` — porcentaje (0-100)
- `status` — se calcula automáticamente:
  - 0 tareas → `abierto`
  - 0% completado → `pendiente`
  - 100% completado → `completado`
  - resto → `en-progreso`
  - Solo se pone `cerrado` manualmente vía endpoint `PATCH /api/projects/:id/close`

### Persistencia

**No hay.** Todo se pierde al reiniciar el backend. Los datos mock se regeneran desde cero cada vez que arranca.

---

## Autenticación (login)

El login es **exclusivamente frontend**. El backend no participa en la autenticación.

- Las credenciales hardcodeadas son `admin` / `admin123` (`frontend/src/app/App.tsx:40-41`).
- Al validar, se guarda `'true'` en `sessionStorage` bajo la key `ev-proyecto-ev3-authenticated`.
- Al recargar, se lee de `sessionStorage` para mantener la sesión.
- No hay JWT, tokens, cookies ni backend de auth. Es un flujo puramente demostrativo de MVP.

---

## Navegación

No se usa React Router. La navegación se maneja con un `useState<AppPageKey>` en `App.tsx` que alterna entre 3 páginas:

| Página | Key | Contenido |
|---|---|---|
| Principal | `dashboard` | Métricas, proyectos/tareas recientes, estado del sistema |
| Proyectos | `projects` | CRUD proyectos, filtros, cierre |
| Tareas | `tasks` | CRUD tareas, filtros, cambio de estado |

---

## Scripts disponibles

### Backend

```bash
pnpm --filter backend start:dev     # Desarrollo con hot reload
pnpm --filter backend build         # Compilar TypeScript
pnpm --filter backend start:prod    # Producción (node dist/main)
pnpm --filter backend test          # Tests unitarios (Jest)
pnpm --filter backend lint          # ESLint
```

### Frontend

```bash
pnpm --filter frontend dev          # Desarrollo (Vite dev server)
pnpm --filter frontend build        # Build de producción
pnpm --filter frontend preview      # Previsualizar build
pnpm --filter frontend lint         # ESLint
```

---

## Notas

- Proyecto de tipo **MVP/demostración**. No está listo para producción.
- Los datos son efímeros (en memoria). Para producción se necesitaría una base de datos real.
- La autenticación es ficticia. Para producción se necesitaría JWT, bcrypt, refresh tokens, etc.
- El backend no tiene CORS habilitado porque en desarrollo el proxy de Vite lo resuelve. En producción habría que configurarlo.
