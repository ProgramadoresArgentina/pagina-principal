# Organización de MinIO para Artículos e Imágenes

## Estructura Recomendada

```
programadores-argentina-blog/
├── articles/                    # Artículos markdown
│   ├── mi-primer-articulo.md
│   ├── tutorial-react.md
│   └── guia-typescript.md
├── images/                      # Imágenes organizadas por artículo
│   ├── mi-primer-articulo/      # Carpeta específica del artículo
│   │   ├── hero-image.webp
│   │   ├── diagrama-flujo.png
│   │   └── screenshot-1.jpg
│   ├── tutorial-react/
│   │   ├── hero-image.webp
│   │   ├── code-example.png
│   │   └── final-result.jpg
│   └── guia-typescript/
│       ├── hero-image.webp
│       └── type-definitions.png
└── shared/                      # Imágenes compartidas (opcional)
    ├── logos/
    └── icons/
```

## Ventajas de esta Estructura

1. **Organización Clara**: Cada artículo tiene su propia carpeta de imágenes
2. **Fácil Limpieza**: Al eliminar un artículo, solo eliminas su carpeta completa
3. **Escalabilidad**: No hay límite de imágenes por artículo
4. **Mantenimiento**: Fácil de gestionar manualmente
5. **Rendimiento**: Las imágenes se cargan con lazy loading automático

## Cómo Usar las Imágenes en tus Artículos

### 1. Imagen Principal del Artículo (Hero Image)

En el frontmatter de tu archivo `.md`:

```yaml
---
title: "Mi Artículo"
description: "Descripción del artículo"
date: "2024-01-15"
author: "Tu Nombre"
category: "Tutorial"
image: "hero-image.webp"  # Se buscará en images/[slug]/hero-image.webp
isPublic: true
---

# Contenido del artículo...
```

### 2. Imágenes dentro del Contenido

En el contenido markdown, puedes usar rutas relativas:

```markdown
# Mi Artículo

Aquí está mi diagrama:

![Diagrama de flujo](diagrama-flujo.png)

Y aquí un screenshot:

![Screenshot de la aplicación](screenshot-1.jpg)
```

**Nota**: Las rutas relativas se resuelven automáticamente a `images/[slug]/[nombre-imagen]`

### 3. Imágenes Compartidas

Para imágenes que se usan en múltiples artículos:

```markdown
![Logo de React](shared/logos/react-logo.png)
```

## Migración de Artículos Existentes

### Paso 1: Ejecutar el Script de Migración

```bash
# Ver la estructura actual
node scripts/organize-minio.js structure

# Migrar todos los artículos
node scripts/organize-minio.js migrate

# Organizar imágenes existentes
node scripts/organize-minio.js organize

# O ejecutar todo de una vez
node scripts/organize-minio.js all
```

### Paso 2: Organizar Imágenes Manualmente

Después de ejecutar el script, las imágenes estarán en `images/shared/`. Debes moverlas a las carpetas específicas de cada artículo:

1. Ve a tu panel de MinIO
2. Navega a `images/shared/`
3. Mueve cada imagen a la carpeta correspondiente del artículo
4. Por ejemplo: `screenshot-react.png` → `images/tutorial-react/screenshot-react.png`

## Ejemplos de Uso

### Artículo Completo

**Archivo**: `articles/tutorial-react.md`

```yaml
---
title: "Tutorial de React para Principiantes"
description: "Aprende React desde cero con este tutorial paso a paso"
date: "2024-01-15"
author: "Programadores Argentina"
category: "Tutorial"
image: "hero-image.webp"
isPublic: true
---

# Tutorial de React para Principiantes

React es una biblioteca de JavaScript para construir interfaces de usuario.

## Instalación

Primero, instala React:

![Instalación de React](instalacion-react.png)

## Primer Componente

Crea tu primer componente:

![Código del componente](codigo-componente.png)

## Resultado Final

Aquí está el resultado:

![Aplicación funcionando](resultado-final.jpg)
```

**Estructura de imágenes**:
```
images/tutorial-react/
├── hero-image.webp
├── instalacion-react.png
├── codigo-componente.png
└── resultado-final.jpg
```

## Configuración del Entorno

Asegúrate de que tu archivo `.env` tenga la configuración correcta:

```env
MINIO_ENDPOINT=http://localhost:9000
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=tu_access_key
MINIO_SECRET_KEY=tu_secret_key
MINIO_BUCKET_NAME=programadores-argentina-blog
```

## Mejores Prácticas

### 1. Nombres de Archivos
- Usa nombres descriptivos: `hero-image.webp` en lugar de `img1.jpg`
- Usa formato WebP para mejor compresión
- Mantén consistencia en el naming

### 2. Organización
- Una imagen principal por artículo (`hero-image.webp`)
- Agrupa imágenes relacionadas
- Usa subcarpetas si es necesario: `images/tutorial-react/screenshots/`

### 3. Optimización
- Comprime las imágenes antes de subirlas
- Usa formatos modernos (WebP, AVIF)
- Considera diferentes tamaños para responsive

### 4. Limpieza
- Elimina imágenes no utilizadas
- Revisa periódicamente las carpetas de artículos eliminados
- Mantén un backup antes de limpiar

## Comandos Útiles

```bash
# Ver estructura actual
node scripts/organize-minio.js structure

# Migrar solo artículos
node scripts/organize-minio.js migrate

# Organizar solo imágenes
node scripts/organize-minio.js organize

# Ejecutar todo
node scripts/organize-minio.js all
```

## Solución de Problemas

### Las imágenes no se muestran
1. Verifica que la imagen existe en MinIO
2. Revisa la ruta en el markdown
3. Confirma que el bucket es público o tiene las políticas correctas

### Error de permisos
1. Verifica las credenciales de MinIO en `.env`
2. Confirma que el bucket existe
3. Revisa las políticas de acceso del bucket

### Imágenes muy lentas
1. Optimiza el tamaño de las imágenes
2. Usa formatos modernos (WebP)
3. Considera usar un CDN

## Soporte

Si tienes problemas con la organización de MinIO:

1. Revisa los logs de la aplicación
2. Verifica la configuración del entorno
3. Confirma que MinIO está funcionando correctamente
4. Consulta la documentación de MinIO para políticas de acceso
