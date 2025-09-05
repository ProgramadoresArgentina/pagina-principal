-- Archivo de inicialización para PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Crear base de datos si no existe (aunque ya se crea con POSTGRES_DB)
-- SELECT 'CREATE DATABASE programadores_argentina' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'programadores_argentina')\gexec
