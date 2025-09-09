# Programadores Argentina

Una plataforma web moderna desarrollada con Next.js para la comunidad de programadores de Argentina. Incluye sistema de autenticación, chat en tiempo real, gestión de artículos y un club exclusivo para miembros.

## 🚀 Tecnologías

- **Frontend**: Next.js 14 con React 18 y TypeScript
- **Backend**: API Routes de Next.js
- **Base de datos**: PostgreSQL con Prisma ORM
- **Cache**: Redis
- **Autenticación**: JWT + bcrypt
- **Chat en tiempo real**: Socket.io
- **Almacenamiento**: MinIO (compatible con S3)
- **Contenedores**: Docker & Docker Compose
- **Estilos**: CSS personalizado + Bootstrap

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/neriheredia/pagina-principal.git
cd pagina-principal
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env con tus configuraciones
```

**Variables importantes en `.env`:**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/programadores_argentina?schema=public"

# JWT Secret (cambiar en producción)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"

# Admin API Key
ADMIN_API_KEY="your-super-secret-admin-key-change-in-production"
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Levantar servicios con Docker

```bash
# Levantar PostgreSQL, Redis y Adminer
docker-compose up -d

# Verificar que los contenedores estén funcionando
docker-compose ps
```

### 5. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push

# Poblar la base de datos con datos de prueba
npm run db:seed
```

### 6. Iniciar la aplicación

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

## 🌐 Acceso a la aplicación

Una vez que todo esté funcionando, podrás acceder a:

- **Aplicación principal**: http://localhost:3000 (o el puerto que se asigne automáticamente)
- **Adminer (Panel de base de datos)**: http://localhost:8080
- **Prisma Studio**: Ejecutar `npm run db:studio` y acceder a http://localhost:5555

### Credenciales para Adminer

- **Sistema**: PostgreSQL
- **Servidor**: postgres
- **Usuario**: postgres
- **Contraseña**: postgres123
- **Base de datos**: programadores_argentina

## 📊 Datos de prueba

El comando `npm run db:seed` crea automáticamente:

- **6 permisos** del sistema (crear, leer, actualizar, eliminar usuarios, moderar chat, etc.)
- **4 roles** (Super Admin, Admin, Moderador, Usuario)
- **3 usuarios** de prueba con diferentes roles
- **1 chat global** configurado

## 🔧 Scripts disponibles

```bash
# Desarrollo
npm run dev                 # Iniciar en modo desarrollo
npm run build              # Construir para producción
npm run start              # Iniciar en modo producción
npm run lint               # Ejecutar linter

# Base de datos
npm run db:generate        # Generar cliente de Prisma
npm run db:push           # Aplicar cambios del schema
npm run db:migrate        # Ejecutar migraciones
npm run db:studio         # Abrir Prisma Studio
npm run db:seed           # Poblar con datos de prueba

# Docker
npm run docker:up         # Levantar servicios
npm run docker:down       # Parar servicios
npm run docker:logs       # Ver logs de contenedores

# MinIO (opcional)
npm run minio:up          # Levantar MinIO
npm run minio:down        # Parar MinIO
npm run minio:upload      # Subir archivos a MinIO
```

## 🏗️ Estructura del proyecto

```
├── prisma/                 # Schema y migraciones de Prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/                 # Archivos estáticos
│   └── assets/             # CSS, JS, imágenes, fuentes
├── src/
│   ├── app/                # App Router de Next.js 13+
│   │   ├── components/     # Componentes React
│   │   ├── api/           # API Routes
│   │   ├── articulos/     # Páginas de artículos
│   │   ├── club/          # Páginas del club
│   │   └── ingresar/      # Páginas de autenticación
│   ├── contexts/          # Contextos de React
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades y configuraciones
│   ├── pages/             # Pages Router (legacy)
│   └── types/             # Definiciones de tipos TypeScript
├── docker-compose.yml     # Configuración de Docker
├── next.config.js         # Configuración de Next.js
└── tsconfig.json          # Configuración de TypeScript
```

## 🤝 Cómo contribuir

¡Nos encanta recibir contribuciones de la comunidad! Aquí te explicamos cómo puedes ayudar:

### 1. Fork del repositorio

```bash
# Hacer fork en GitHub y luego clonar tu fork
git clone https://github.com/TU_USUARIO/pagina-principal.git
cd pagina-principal
```

### 2. Crear una rama para tu feature

```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 3. Configurar el entorno de desarrollo

Sigue todos los pasos de instalación mencionados arriba.

### 4. Realizar cambios

- Mantén el código limpio y bien documentado
- Sigue las convenciones de naming existentes
- Agrega tests si es necesario
- Asegúrate de que tu código pase el linter: `npm run lint`

### 5. Commit de cambios

```bash
git add .
git commit -m "feat: descripción clara del cambio"

# Ejemplos de mensajes de commit:
# feat: agregar sistema de notificaciones
# fix: corregir error en login
# docs: actualizar README
# style: mejorar estilos del chat
```

### 6. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request desde GitHub explicando:

- Qué cambios realizaste
- Por qué son necesarios
- Cómo probar los cambios

### 📝 Guías para contribuir

#### Reportar bugs

- Usa el sistema de Issues de GitHub
- Incluye pasos para reproducir el error
- Menciona tu sistema operativo y versión de Node.js
- Adjunta screenshots si es necesario

#### Sugerir nuevas funcionalidades

- Abre un Issue con la etiqueta "enhancement"
- Describe claramente la funcionalidad
- Explica por qué sería útil para la comunidad

#### Áreas donde puedes contribuir

- 🐛 **Bug fixes**: Corregir errores reportados
- ✨ **Features**: Nuevas funcionalidades
- 📚 **Documentación**: Mejorar docs y comentarios
- 🎨 **UI/UX**: Mejorar diseño y experiencia de usuario
- ⚡ **Performance**: Optimizaciones de rendimiento
- 🧪 **Testing**: Agregar o mejorar tests
- 🔧 **DevOps**: Mejorar configuración de Docker/CI

## 🐛 Resolución de problemas

### Puerto ocupado

Si el puerto 3000 está ocupado, Next.js automáticamente usará el siguiente disponible (3001, 3002, etc.).

### Error de conexión a la base de datos

```bash
# Verificar que Docker esté funcionando
docker-compose ps

# Reiniciar servicios
docker-compose down
docker-compose up -d
```

### Error en migraciones de Prisma

```bash
# Resetear la base de datos (⚠️ solo en desarrollo)
npm run db:push --force-reset
npm run db:seed
```

### Limpiar caché

```bash
# Limpiar caché de Next.js
rm -rf .next
npm run dev
```

## 📞 Contacto y Comunidad

- **Discord**:
- **GitHub Issues**: Para reportar bugs o sugerir features
- **Email**:

---

Desarrollado con ❤️ por la comunidad de **Programadores Argentina**
