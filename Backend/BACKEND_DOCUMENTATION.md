# ProTalent - Documentación del Backend

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Base de Datos](#base-de-datos)
4. [API Endpoints](#api-endpoints)
5. [Autenticación y Autorización](#autenticación-y-autorización)
6. [Configuración de Entorno](#configuración-de-entorno)
7. [Funcionalidades Principales](#funcionalidades-principales)
8. [Testing](#testing)
9. [Despliegue](#despliegue)

---

## Descripción General

**ProTalent** es una plataforma web que conecta estudiantes universitarios y egresados con empresas que ofrecen oportunidades laborales y de prácticas profesionales. El backend está construido con **Node.js**, **Express.js**, **Prisma ORM** y **PostgreSQL**.

### Tecnologías Utilizadas
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticación**: JWT + Google OAuth 2.0
- **Almacenamiento de Archivos**: Cloudinary
- **Testing**: Jest + Supertest
- **Validación**: Middleware personalizado

---

## Arquitectura del Sistema

```
src/
├── config/           # Configuración de servicios
├── controllers/      # Lógica de negocio
├── middlewares/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Servicios auxiliares
├── utils/           # Utilidades
├── app.js          # Configuración de Express
└── server.js       # Punto de entrada
```

### Patrón de Arquitectura
- **MVC (Model-View-Controller)**: Separación clara de responsabilidades
- **Middleware Pipeline**: Validación, autenticación y autorización
- **Service Layer**: Lógica de negocio reutilizable
- **Repository Pattern**: Abstracción de acceso a datos con Prisma

---

## Base de Datos

### Esquema de Base de Datos

El sistema utiliza PostgreSQL con el siguiente esquema de relaciones:

```mermaid
erDiagram
    Usuario ||--o{ Estudiante : tiene
    Usuario ||--o{ Empresa : tiene
    Empresa ||--o{ Oferta : publica
    Estudiante ||--o{ Postulacion : hace
    Oferta ||--o{ Postulacion : recibe
    Oferta ||--o{ RequisitoOferta : tiene
    Oferta ||--o{ PreguntaOferta : contiene
    Postulacion ||--o{ RespuestaPostulacion : tiene
    PreguntaOferta ||--o{ RespuestaPostulacion : responde
    Categoria ||--o{ BlogPost : categoriza
    BlogPost ||--o{ Comentario : tiene
```

### Modelos Principales

#### **Usuario**
```javascript
{
  id: Int (PK)
  nombre: String
  email: String (unique)
  password: String? (null para Google OAuth)
  googleId: String? (unique)
  rol: Enum (ESTUDIANTE, EGRESADO, EMPRESA, ADMIN)
  perfilCompleto: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### **Estudiante**
```javascript
{
  id: Int (PK)
  usuarioId: Int (FK -> Usuario)
  cv: String? (URL Cloudinary)
  foto_perfil: String? (URL Cloudinary)
  carrera: String
  año_egreso: Int?
  telefono: String?
  tipo: Enum (ESTUDIANTE, EGRESADO)
}
```

#### **Empresa**
```javascript
{
  id: Int (PK)
  usuarioId: Int (FK -> Usuario)
  ruc: String (unique)
  nombre_empresa: String
  rubro: String
  descripcion: String?
  direccion: String?
  telefono: String?
  logo_url: String? (URL Cloudinary)
}
```

#### **Oferta**
```javascript
{
  id: Int (PK)
  titulo: String
  descripcion: String?
  duracion: String?
  requiereCV: Boolean
  requiereCarta: Boolean
  empresaId: Int (FK -> Empresa)
  requisitos: RequisitoOferta[]
  postulaciones: Postulacion[]
  preguntas: PreguntaOferta[]
}
```

#### **Postulacion**
```javascript
{
  id: Int (PK)
  mensaje: String?
  estado: Enum (PENDIENTE, ACEPTADA, RECHAZADA)
  estudianteId: Int (FK -> Estudiante)
  ofertaId: Int (FK -> Oferta)
  respuestas: RespuestaPostulacion[]
}
```

---

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| POST | `/register` | Registro de usuario | ❌ | - |
| POST | `/login` | Inicio de sesión | ❌ | - |
| POST | `/google` | Autenticación con Google OAuth | ❌ | - |
| GET | `/perfil` | Obtener perfil de usuario | ✅ | verifyToken |
| GET | `/verificar-perfil` | Verificar estado del perfil | ✅ | verifyToken |
| POST | `/completar-perfil-empresa` | Completar perfil de empresa | ✅ | verifyToken |
| POST | `/logout` | Cerrar sesión | ✅ | verifyToken |

### Ofertas (`/api/ofertas`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar todas las ofertas | ❌ | - |
| GET | `/:id` | Obtener oferta por ID | ❌ | - |
| POST | `/` | Crear nueva oferta | ✅ | verifyToken, requireCompleteProfile |
| PUT | `/:id` | Actualizar oferta | ✅ | verifyToken, requireCompleteProfile |
| DELETE | `/:id` | Eliminar oferta | ✅ | verifyToken, requireCompleteProfile |

### Postulaciones (`/api/postulaciones`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar postulaciones (context-aware) | ❌ | - |
| GET | `/:id` | Obtener postulación por ID | ❌ | - |
| POST | `/` | Crear postulación | ✅ | verifyToken, requireCompleteProfile |
| GET | `/mis-postulaciones` | Postulaciones del estudiante | ✅ | verifyToken, requireCompleteProfile |
| GET | `/empresa-postulaciones` | Postulaciones de la empresa | ✅ | verifyToken, requireCompleteProfile |
| PUT | `/:id` | Actualizar postulación | ✅ | verifyToken, requireCompleteProfile |
| DELETE | `/:id` | Eliminar postulación | ✅ | verifyToken, requireCompleteProfile |

### Estudiantes (`/api/estudiantes`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar estudiantes | ❌ | - |
| GET | `/:id` | Obtener estudiante por ID | ❌ | - |
| PUT | `/:id` | Actualizar perfil de estudiante | ✅ | verifyToken |
| DELETE | `/:id` | Eliminar estudiante | ✅ | verifyToken |

### Empresas (`/api/empresas`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar empresas | ❌ | - |
| GET | `/:id` | Obtener empresa por ID | ❌ | - |
| PUT | `/:id` | Actualizar perfil de empresa | ✅ | verifyToken |
| DELETE | `/:id` | Eliminar empresa | ✅ | verifyToken |

### Preguntas de Oferta (`/api/preguntas-oferta`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/oferta/:ofertaId` | Obtener preguntas de una oferta | ❌ | - |
| POST | `/` | Crear pregunta para oferta | ✅ | verifyToken, requireCompleteProfile |
| PUT | `/:id` | Actualizar pregunta | ✅ | verifyToken, requireCompleteProfile |
| DELETE | `/:id` | Eliminar pregunta | ✅ | verifyToken, requireCompleteProfile |

### Upload (`/api/upload`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| POST | `/foto-perfil` | Subir foto de perfil | ✅ | verifyToken, multer |
| POST | `/logo` | Subir logo de empresa | ✅ | verifyToken, multer |
| POST | `/cv` | Subir CV de estudiante | ✅ | verifyToken, multer |
| POST | `/blog-image` | Subir imagen para blog | ✅ | verifyToken, multer |
| DELETE | `/:publicId` | Eliminar archivo | ✅ | verifyToken |

### Blog (`/api/posts`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar posts del blog | ❌ | - |
| GET | `/:id` | Obtener post por ID | ❌ | - |
| POST | `/` | Crear nuevo post | ✅ | verifyToken |
| PUT | `/:id` | Actualizar post | ✅ | verifyToken |
| DELETE | `/:id` | Eliminar post | ✅ | verifyToken |

### Categorías (`/api/categorias`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/` | Listar categorías | ❌ | - |
| GET | `/:id` | Obtener categoría por ID | ❌ | - |
| POST | `/` | Crear categoría | ✅ | verifyToken |
| PUT | `/:id` | Actualizar categoría | ✅ | verifyToken |
| DELETE | `/:id` | Eliminar categoría | ✅ | verifyToken |

### Comentarios (`/api/comentarios`)

| Método | Ruta | Descripción | Auth | Middleware |
|--------|------|-------------|------|------------|
| GET | `/post/:postId` | Obtener comentarios de un post | ❌ | - |
| POST | `/` | Crear comentario | ❌ | - |
| PUT | `/:id` | Actualizar comentario | ✅ | verifyToken |
| DELETE | `/:id` | Eliminar comentario | ✅ | verifyToken |

---

## Autenticación y Autorización

### Estrategias de Autenticación

1. **JWT (JSON Web Tokens)**
   - Tokens firmados con `JWT_SECRET`
   - Expiración configurable
   - Payload incluye `id` y `rol` del usuario

2. **Google OAuth 2.0**
   - Integración completa con Google
   - Verificación de tokens del lado del servidor
   - Creación automática de cuentas

### Middleware de Autenticación

#### `verifyToken`
```javascript
// Verifica la validez del JWT token
// Decodifica y almacena información del usuario en req.user
// Redirige a login si no es válido
```

#### `requireCompleteProfile`
```javascript
// Verifica que el usuario tenga perfil completo
// Redirige a completar perfil si es necesario
// Solo aplica para usuarios autenticados
```

### Roles y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ESTUDIANTE** | Estudiante universitario | Postular a ofertas, ver ofertas, actualizar perfil |
| **EGRESADO** | Egresado universitario | Postular a ofertas, ver ofertas, actualizar perfil |
| **EMPRESA** | Empresa contratante | Crear ofertas, ver postulaciones, gestionar postulaciones |
| **ADMIN** | Administrador del sistema | Acceso completo (futuro) |

---

## Configuración de Entorno

### Variables de Entorno Requeridas

```bash
# Servidor
NODE_ENV=development|production
PORT=5000

# Base de Datos PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_URL_UNPOOLED=postgresql://user:password@host:port/database

# Autenticación
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Cloudinary (Almacenamiento de archivos)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Configuración de Base de Datos

La aplicación utiliza **Neon PostgreSQL** con dos configuraciones:

1. **Pooled Connection** (`DATABASE_URL`): Para uso general
2. **Unpooled Connection** (`DATABASE_URL_UNPOOLED`): Para migraciones y operaciones específicas

#### Migraciones con Prisma
```bash
# Generar migración
npx prisma migrate dev --name migration_name

# Aplicar migraciones en producción
npx prisma migrate deploy

# Generar cliente Prisma
npx prisma generate

# Visualizar base de datos
npx prisma studio
```

---

## Funcionalidades Principales

### 1. Gestión de Usuarios

#### Registro
- **Estudiantes/Egresados**: Requiere nombre, email, password, carrera
- **Empresas**: Requiere nombre, email, password, RUC, nombre_empresa, rubro
- Validación de emails únicos
- Hash de contraseñas con bcrypt

#### Autenticación Dual
- **Tradicional**: Email/Password
- **Google OAuth**: Integración completa con verificación de tokens

#### Perfiles Específicos
- **Estudiantes**: CV, foto, carrera, año de egreso
- **Empresas**: Logo, descripción, información de contacto

### 2. Sistema de Ofertas Laborales

#### Creación y Gestión
- Título, descripción, duración
- Requisitos personalizados con categorización
- Preguntas específicas para candidatos
- Solo empresas con perfil completo pueden crear ofertas

#### Visibilidad Pública
- Todas las ofertas son públicas
- Filtrado por empresa, rubro, requisitos
- Información detallada incluyendo empresa y requisitos

### 3. Sistema de Postulaciones

#### Proceso de Postulación
1. Estudiante ve oferta pública
2. Completa mensaje personalizado
3. Responde preguntas específicas de la oferta
4. Sistema previene postulaciones duplicadas

#### Gestión por Empresa
- Vista de todas las postulaciones recibidas
- Actualización de estado (PENDIENTE → ACEPTADA/RECHAZADA)
- Acceso a respuestas de preguntas específicas

#### Estados de Postulación
- **PENDIENTE**: Estado inicial
- **ACEPTADA**: Aprobada por la empresa
- **RECHAZADA**: Rechazada por la empresa

### 4. Sistema de Preguntas Personalizadas

#### Tipos de Preguntas
- **TEXT**: Respuesta de texto libre
- **NUMBER**: Respuesta numérica
- **SELECT**: Opción múltiple
- **TEXTAREA**: Texto largo

#### Características
- Preguntas opcionales u obligatorias
- Orden personalizable
- Opciones configurables para tipo SELECT

### 5. Gestión de Archivos

#### Integración con Cloudinary
- **CV**: Documentos PDF para estudiantes
- **Fotos de Perfil**: Imágenes de estudiantes
- **Logos**: Imágenes para empresas
- **Imágenes de Blog**: Contenido multimedia

#### Características
- Transformación automática de imágenes
- URLs seguras con CDN
- Eliminación automática de archivos obsoletos

### 6. Blog Corporativo

#### Funcionalidades
- Publicación de contenido por categorías
- Sistema de comentarios públicos
- Imágenes destacadas
- Estados de publicación

#### Gestión
- Creación y edición de posts (requiere autenticación)
- Categorización de contenido
- Moderación de comentarios

---

## Testing

### Estructura de Tests

```
tests/
├── helpers/
│   └── testSetup.js      # Configuración y utilidades
├── unit/
│   ├── auth.test.js      # Tests de autenticación
│   ├── ofertas.test.js   # Tests de ofertas
│   └── postulaciones.test.js # Tests de postulaciones
└── integration/
    └── complete-flow.test.js # Tests de flujo completo
```

### Configuración de Testing

#### Jest Configuration
```javascript
{
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/testSetup.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/app.js']
}
```

#### Scripts de Testing
```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Ejecutar tests en modo watch
npm run test:coverage # Ejecutar tests con coverage
```

### Casos de Prueba Principales

#### Unit Tests
- **Autenticación**: Registro, login, Google OAuth
- **Ofertas**: CRUD completo, autorización
- **Postulaciones**: Creación, gestión, validación

#### Integration Tests
- **Flujo Completo**: Registro → Creación de Oferta → Postulación → Aceptación
- **Flujo de Rechazo**: Gestión de postulaciones rechazadas
- **Validación de Permisos**: Tests de autorización

### Test Database
- Utiliza la misma base de datos que desarrollo
- Limpieza automática entre tests
- Generadores de datos de prueba

---

## Despliegue

### Estructura de Producción

#### Requisitos del Sistema
- Node.js 18+
- PostgreSQL 13+
- Redis (opcional, para sesiones)
- Cloudinary account

#### Variables de Entorno de Producción
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=secure_production_secret
# ... resto de variables
```

#### Proceso de Despliegue

1. **Preparación**
   ```bash
   npm install --production
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Compilación**
   ```bash
   npm run build  # si existe proceso de build
   ```

3. **Inicio**
   ```bash
   npm start
   ```

#### Consideraciones de Seguridad

- **CORS**: Configurado para dominios específicos
- **Rate Limiting**: Implementado para endpoints críticos
- **Helmet**: Headers de seguridad
- **Input Validation**: Validación estricta de datos de entrada
- **Password Hashing**: bcrypt con salt rounds altos
- **JWT Security**: Secrets seguros y expiración apropiada

#### Monitoring y Logs

- **Morgan**: Logging de requests HTTP
- **Winston**: Logging estructurado (recomendado para producción)
- **Health Checks**: Endpoint `/health` para monitoreo

---

## Conclusión

Este backend provee una base sólida y escalable para la plataforma ProTalent, con:

- ✅ **Arquitectura Robusta**: MVC con separación clara de responsabilidades
- ✅ **Base de Datos Normalizada**: Relaciones bien definidas con Prisma ORM
- ✅ **Autenticación Dual**: JWT tradicional + Google OAuth
- ✅ **API RESTful Completa**: Endpoints bien documentados y testeados
- ✅ **Testing Comprehensive**: Unit e integration tests
- ✅ **Seguridad**: Middleware de autenticación y autorización
- ✅ **Escalabilidad**: Configuración para múltiples entornos

La plataforma está preparada para manejar el crecimiento y agregar nuevas funcionalidades de manera eficiente.

---

**Última Actualización**: Enero 2025  
**Versión del Backend**: 1.0.0  
**Tecnologías**: Node.js, Express, Prisma, PostgreSQL