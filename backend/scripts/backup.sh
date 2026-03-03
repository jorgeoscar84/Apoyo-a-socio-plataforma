#!/bin/bash
# =============================================================================
# Script de Backup Automático para Appwrite
# Plataforma de Capacitación y Apoyo para Socios
# =============================================================================
# 
# Este script realiza backups automáticos de:
# - Base de datos MariaDB
# - Volúmenes de uploads
# - Configuraciones
#
# Uso: ./backup.sh
# Configurar en crontab: 0 2 * * * /home/usuario/appwrite/backup.sh
# =============================================================================

# =============================================================================
# CONFIGURACIÓN - CAMBIAR ESTOS VALORES
# =============================================================================

# Fecha actual
DATE=$(date +%Y%m%d_%H%M%S)

# Directorio de backups
BACKUP_DIR="/home/usuario/backups/appwrite"

# Directorio de Appwrite (donde está docker-compose.yml)
APPWRITE_DIR="/home/usuario/appwrite"

# Password de MariaDB (debe coincidir con docker-compose.yml)
MARIADB_PASSWORD="password_segura_appwrite"

# Días a mantener (backups más antiguos serán eliminados)
RETENTION_DAYS=7

# Nombre del contenedor de MariaDB
MARIADB_CONTAINER="appwrite-mariadb"

# =============================================================================
# FUNCIONES
# =============================================================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# =============================================================================
# INICIO DEL SCRIPT
# =============================================================================

log "========================================"
log "Iniciando backup de Appwrite"
log "========================================"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# =============================================================================
# BACKUP DE BASE DE DATOS
# =============================================================================

log "Iniciando backup de base de datos..."

# Verificar que el contenedor está corriendo
if ! docker ps | grep -q $MARIADB_CONTAINER; then
    error "El contenedor $MARIADB_CONTAINER no está corriendo"
    exit 1
fi

# Realizar backup de la base de datos
docker exec $MARIADB_CONTAINER mysqldump -u root -p$MARIADB_PASSWORD appwrite > $BACKUP_DIR/db_$DATE.sql 2>/dev/null

if [ $? -eq 0 ]; then
    # Comprimir backup
    gzip $BACKUP_DIR/db_$DATE.sql
    log "✓ Backup de base de datos completado: db_$DATE.sql.gz"
else
    error "✗ Error en backup de base de datos"
    rm -f $BACKUP_DIR/db_$DATE.sql
fi

# =============================================================================
# BACKUP DE VOLÚMENES
# =============================================================================

log "Iniciando backup de volúmenes..."

# Backup de uploads
log "Backup de uploads..."
docker run --rm \
    -v appwrite_appwrite-uploads:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/uploads_$DATE.tar.gz -C /data .

if [ $? -eq 0 ]; then
    log "✓ Backup de uploads completado: uploads_$DATE.tar.gz"
else
    error "✗ Error en backup de uploads"
fi

# Backup de configuraciones
log "Backup de configuraciones..."
docker run --rm \
    -v appwrite_appwrite-config:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/config_$DATE.tar.gz -C /data .

if [ $? -eq 0 ]; then
    log "✓ Backup de configuraciones completado: config_$DATE.tar.gz"
else
    error "✗ Error en backup de configuraciones"
fi

# Backup de certificados
log "Backup de certificados..."
docker run --rm \
    -v appwrite_appwrite-certificates:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/certificates_$DATE.tar.gz -C /data .

if [ $? -eq 0 ]; then
    log "✓ Backup de certificados completado: certificates_$DATE.tar.gz"
else
    error "✗ Error en backup de certificados"
fi

# =============================================================================
# BACKUP DE FUNCIONES
# =============================================================================

log "Backup de funciones serverless..."
docker run --rm \
    -v appwrite_appwrite-functions:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/functions_$DATE.tar.gz -C /data .

if [ $? -eq 0 ]; then
    log "✓ Backup de funciones completado: functions_$DATE.tar.gz"
else
    error "✗ Error en backup de funciones"
fi

# =============================================================================
# LIMPIEZA DE BACKUPS ANTIGUOS
# =============================================================================

log "Limpiando backups antiguos (más de $RETENTION_DAYS días)..."

# Eliminar backups de base de datos antiguos
find $BACKUP_DIR -type f -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
count_db=$(find $BACKUP_DIR -type f -name "db_*.sql.gz" -mtime +$RETENTION_DAYS | wc -l)
log "Eliminados $count_db backups de base de datos antiguos"

# Eliminar backups de uploads antiguos
find $BACKUP_DIR -type f -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete
count_uploads=$(find $BACKUP_DIR -type f -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS | wc -l)
log "Eliminados $count_uploads backups de uploads antiguos"

# Eliminar backups de configuraciones antiguos
find $BACKUP_DIR -type f -name "config_*.tar.gz" -mtime +$RETENTION_DAYS -delete
count_config=$(find $BACKUP_DIR -type f -name "config_*.tar.gz" -mtime +$RETENTION_DAYS | wc -l)
log "Eliminados $count_config backups de configuraciones antiguos"

# Eliminar backups de certificados antiguos
find $BACKUP_DIR -type f -name "certificates_*.tar.gz" -mtime +$RETENTION_DAYS -delete
count_certs=$(find $BACKUP_DIR -type f -name "certificates_*.tar.gz" -mtime +$RETENTION_DAYS | wc -l)
log "Eliminados $count_certs backups de certificados antiguos"

# Eliminar backups de funciones antiguos
find $BACKUP_DIR -type f -name "functions_*.tar.gz" -mtime +$RETENTION_DAYS -delete
count_functions=$(find $BACKUP_DIR -type f -name "functions_*.tar.gz" -mtime +$RETENTION_DAYS | wc -l)
log "Eliminados $count_functions backups de funciones antiguos"

# =============================================================================
# RESUMEN
# =============================================================================

log "========================================"
log "Resumen del backup"
log "========================================"

# Calcular tamaño total
total_size=$(du -sh $BACKUP_DIR | cut -f1)
log "Tamaño total de backups: $total_size"

# Listar backups creados hoy
log "Backups creados hoy:"
ls -lh $BACKUP_DIR/*$DATE* 2>/dev/null | while read line; do
    log "  $line"
done

# Espacio en disco
disk_usage=$(df -h $BACKUP_DIR | tail -1 | awk '{print $5}')
log "Espacio utilizado en disco: $disk_usage"

log "========================================"
log "Backup completado exitosamente"
log "========================================"

# =============================================================================
# RESTAURACIÓN (instrucciones)
# =============================================================================
#
# Para restaurar un backup:
#
# 1. Base de datos:
#    gunzip -c db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i appwrite-mariadb mysql -u root -pPASSWORD appwrite
#
# 2. Volúmenes:
#    docker run --rm -v appwrite_appwrite-uploads:/data -v /path/to/backups:/backup alpine tar xzf /backup/uploads_YYYYMMDD_HHMMSS.tar.gz -C /data
#
# =============================================================================
