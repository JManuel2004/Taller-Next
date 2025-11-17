# Informe de Funcionalidades - Sistema de Gestión de Proyectos y Tareas

## 1. Descripción General del Sistema

### 1.1 Propósito
Sistema web para la gestión de proyectos y tareas con control de acceso basado en roles, permitiendo a los usuarios organizar sus proyectos y a los administradores supervisar la actividad general.

### 1.2 Tecnologías Utilizadas
- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Context API
- **Autenticación**: JWT (JSON Web Tokens)
- **Testing**: Jest, Playwright
- **Backend**: NestJS, PostgreSQL

---

## 2. Funcionalidades Implementadas

### 2.1 Autenticación y Autorización

#### 2.1.1 Sistema de Autenticación
**Implementación:**
- Tokens JWT almacenados en `localStorage` y cookies HTTP-only
- Duración del token: 7 días
- Renovación automática mediante endpoint `/auth/check`

**Flujo:**
1. Usuario ingresa credenciales en `/login`
2. Backend valida y genera JWT
3. Token se almacena en cliente
4. Middleware protege rutas en cada navegación
5. Token se incluye en header `Authorization: Bearer <token>`

**Archivos clave:**
- `src/context/AuthContext.tsx` - Gestión de estado de autenticación
- `src/services/auth.service.ts` - Servicios de autenticación
- `src/middleware.ts` - Protección de rutas

#### 2.1.2 Sistema de Autorización por Roles

**Roles Implementados:**
1. **Superadmin**: Acceso total al sistema
   - Gestión de usuarios (CRUD)
   - Visualización de todos los proyectos y tareas
   - Estadísticas globales

2. **Usuario**: Acceso limitado
   - Gestión de sus propios proyectos
   - Gestión de sus propias tareas
   - Estadísticas personales

**Implementación:**
```typescript
// Middleware que verifica rol
export function middleware(request: NextRequest) {
  const payload = decodeJwt(token);
  
  if (pathname.startsWith('/users') && payload.role !== 'superadmin') {
    return NextResponse.redirect('/dashboard/user');
  }
}
```

**Permisos por Ruta:**
- `/dashboard/admin` → Solo superadmin
- `/users` → Solo superadmin
- `/projects` → Ambos roles (filtrado por usuario)
- `/tasks` → Ambos roles (filtrado por usuario)

---

### 2.2 Gestión de Proyectos

#### Funcionalidades:
- **Crear proyecto**: Formulario con validación (título requerido)
- **Listar proyectos**: 
  - Superadmin: Todos los proyectos
  - Usuario: Solo sus proyectos
- **Editar proyecto**: Modal con formulario pre-llenado
- **Eliminar proyecto**: Confirmación con `ConfirmDialog`
- **Ver detalle**: Página dedicada con tareas asociadas
- **Estados**: `pending`, `in-progress`, `completed`

#### Implementación de Estado:
```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (user) {
    loadProjects(); // Carga según rol
  }
}, [user?.id]);
```

---

### 2.3 Gestión de Tareas

#### Funcionalidades:
- **Crear tarea**: Asignación a proyecto, prioridad, fecha límite
- **Listar tareas**: Filtradas por proyecto o usuario
- **Editar tarea**: Cambio de estado, prioridad, asignación
- **Eliminar tarea**: Con confirmación
- **Estados**: `pending`, `in-progress`, `completed`, `cancelled`
- **Prioridades**: `low`, `medium`, `high`
- **Indicadores visuales**: Tareas vencidas (rojo), urgentes (naranja)

#### Lógica de Fechas:
```typescript
const daysUntilDue = Math.ceil(
  (new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
);
const isOverdue = daysUntilDue < 0;
const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;
```

---

### 2.4 Gestión de Usuarios (Solo Superadmin)

#### Funcionalidades:
- **Listar usuarios**: Tabla con paginación
- **Editar usuario**: 
  - Cambio de rol
  - Activar/desactivar cuenta
  - Resetear contraseña (opcional)
- **Eliminar usuario**: Soft delete

**Restricción de Seguridad:**
- No se permite auto-registro como superadmin
- Solo superadmin puede promover usuarios

---

### 2.5 Dashboards Dinámicos

#### Dashboard de Admin:
- **Estadísticas globales**:
  - Total usuarios (con filtro de activos)
  - Total proyectos (con proyectos en progreso)
  - Total tareas (con tareas pendientes)
  - Tareas completadas (con porcentaje)
- **Actividad reciente**: Últimas 5 tareas actualizadas
- **Acciones rápidas**: Links a gestión de usuarios, proyectos, tareas

#### Dashboard de Usuario:
- **Estadísticas personales**:
  - Mis proyectos
  - Mis tareas (pendientes + en progreso)
  - Tareas completadas (con porcentaje)
- **Próximas tareas**: Ordenadas por fecha límite
- **Actividad reciente**: Últimas actualizaciones

---

## 3. Gestión del Estado

### 3.1 Context API

**Implementación:**
```typescript

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  
}
```

**Beneficios:**
- Estado global accesible desde cualquier componente
- Evita prop drilling
- Sincronización automática entre componentes

### 3.2 Estado Local

Para datos específicos de página:
```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingProject, setEditingProject] = useState<Project | null>(null);
```

---

## 4. Interfaz de Usuario

### 4.1 Componentes Reutilizables

**Componentes UI:**
- `Button` - 4 variantes, 3 tamaños, estados de loading
- `Card` - Contenedor con header/content
- `Modal` - Overlay con tamaño configurable
- `ConfirmDialog` - Diálogo de confirmación
- `Input/Textarea` - Con validación y mensajes de error
- `LoadingSpinner` - 3 tamaños

**Componentes de Negocio:**
- `ProjectCard` - Tarjeta de proyecto con acciones
- `TaskCard` - Tarjeta de tarea con badges
- `ProjectForm/TaskForm` - Formularios con validación
- `Navbar` - Navegación dinámica según rol

### 4.2 Validación de Formularios

**Ejemplo - Login:**
```typescript
const validateForm = (): boolean => {
  const errors: typeof fieldErrors = {};
  
  if (!formData.email) {
    errors.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'El email no es válido';
  }
  
  if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### 4.3 Manejo de Errores

**Sin `window.alert`**, usando:
- Cards de error con fondo rojo
- Mensajes inline en formularios
- Toast notifications (futura mejora)

---

## 5. Seguridad

### 5.1 Protección de Rutas

**Middleware:**
- Verifica token en cada navegación
- Decodifica JWT para obtener rol
- Redirige según permisos

### 5.2 Validación Cliente y Servidor

- **Cliente**: Validación inmediata con feedback visual
- **Servidor**: Validación con `class-validator` en DTOs

### 5.3 Almacenamiento Seguro

- Tokens en `localStorage` + cookies HTTP-only
- Limpieza automática en logout
- No se exponen contraseñas en frontend

---

## 6. Pruebas

### 6.1 Pruebas Unitarias (Jest)
- AuthContext
- Servicios (auth, projects, tasks, users)
- Componentes UI
- Validaciones de formularios

### 6.2 Pruebas E2E (Playwright)
- Flujo de autenticación completo
- Protección de rutas
- CRUD de proyectos y tareas
- Roles y permisos

---

## 7. Conclusiones

El sistema implementa exitosamente:
-  Autenticación robusta con JWT
-  Autorización granular por roles
-  Interfaz intuitiva y responsiva
-  Gestión de estado eficiente
-  Validaciones exhaustivas
-  Cobertura de pruebas adecuada

