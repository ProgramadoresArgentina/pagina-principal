# Chat Global - Programadores Argentina

## Descripción

Se ha implementado un chat global en tiempo real para la plataforma Programadores Argentina con las siguientes características:

### Funcionalidades Principales

- **Chat en tiempo real** usando Socket.io y Redis
- **Diseño tipo Facebook** con botón flotante en la esquina inferior derecha
- **Responsive** - se adapta a mobile ocupando toda la pantalla
- **Sistema de autenticación** - usuarios logueados vs anónimos
- **Nombres anónimos** - usuarios no logueados aparecen como "anonimo-[número]"
- **Detección de links** - los links se detectan automáticamente y son clickeables
- **Moderación** - moderadores y admins pueden eliminar mensajes y banear usuarios
- **Bans por IP** - capacidad de banear direcciones IP completas
- **Reglas del chat** - visibles para todos los usuarios

### Requisitos

- Node.js 18+
- PostgreSQL
- Redis
- Docker (opcional)

## Configuración

### 1. Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/programadores_argentina?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### 2. Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev

# Ejecutar seed (crea usuarios de prueba y chat global)
npm run db:seed
```

### 3. Servicios

```bash
# Levantar servicios con Docker
docker compose up -d

# O instalar Redis localmente
# Ubuntu/Debian: sudo apt install redis-server
# macOS: brew install redis
```

### 4. Dependencias

```bash
npm install
```

## Uso

### Para Usuarios

1. **Acceder al chat**: Haz clic en el botón flotante de chat en la esquina inferior derecha
2. **Enviar mensajes**: 
   - Si estás logueado: aparecerás con tu nombre de usuario
   - Si no estás logueado: aparecerás como "anonimo-[número]"
3. **Ver reglas**: Haz clic en el ícono de información en el header del chat
4. **Links**: Los links se detectan automáticamente y son clickeables

### Para Moderadores/Admins

1. **Eliminar mensajes**: Haz clic en el ícono de basura junto a cualquier mensaje
2. **Banear usuarios**: 
   - Haz clic en el ícono de escudo en el header del chat
   - Selecciona "Banear Usuario" o "Banear IP"
   - Configura la duración y razón del ban

## Estructura del Código

### Backend

- `src/app/api/chat/` - Endpoints de la API
  - `messages/route.ts` - Enviar y obtener mensajes
  - `moderate/route.ts` - Funciones de moderación
  - `info/route.ts` - Información del chat y reglas
- `src/lib/socket.ts` - Servidor WebSocket con Socket.io
- `src/hooks/useSocket.ts` - Hook para conectar con Socket.io

### Frontend

- `src/app/components/ChatWidget.tsx` - Componente principal del chat
- `src/app/components/ChatMessage.tsx` - Componente para renderizar mensajes
- `src/app/components/ChatModeration.tsx` - Panel de moderación

### Base de Datos

- `Chat` - Modelo del chat global
- `ChatMessage` - Mensajes del chat
- `ChatBan` - Bans de usuarios e IPs

## Reglas del Chat

1. Respeta a todos los usuarios del chat
2. No envíes spam o mensajes repetitivos
3. No compartas contenido inapropiado o ofensivo
4. No hagas publicidad no solicitada
5. Mantén las conversaciones en español
6. Los moderadores pueden eliminar mensajes y banear usuarios
7. No es necesario estar suscrito para participar, solo estar logueado
8. Los usuarios anónimos aparecerán como 'anonimo-[número]'
9. Los links se detectan automáticamente y son clickeables
10. Los moderadores y admins pueden banear por IP

## Desarrollo

### Agregar Nuevas Funcionalidades

1. **Nuevos tipos de mensaje**: Modifica `ChatMessage` en el schema
2. **Nuevas acciones de moderación**: Agrega casos en `moderate/route.ts`
3. **Nuevos eventos de Socket**: Agrega listeners en `socket.ts` y `useSocket.ts`

### Testing

```bash
# Ejecutar en modo desarrollo
npm run dev

# El chat estará disponible en http://localhost:3000
```

## Producción

### Consideraciones de Seguridad

1. **Rate limiting**: Implementar límites de mensajes por usuario
2. **Validación de contenido**: Filtrar contenido inapropiado
3. **Logs de moderación**: Registrar todas las acciones de moderación
4. **Backup de mensajes**: Configurar respaldos regulares

### Escalabilidad

1. **Redis Cluster**: Para múltiples instancias
2. **Load balancing**: Distribuir conexiones WebSocket
3. **CDN**: Para assets estáticos del chat

## Troubleshooting

### Problemas Comunes

1. **Socket no conecta**: Verificar que Redis esté corriendo
2. **Mensajes no aparecen**: Revisar logs del servidor WebSocket
3. **Permisos de moderación**: Verificar roles y permisos en la base de datos

### Logs

```bash
# Ver logs de Docker
docker compose logs -f

# Logs de la aplicación
npm run dev
```