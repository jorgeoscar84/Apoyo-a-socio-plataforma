# Backend - Plataforma de Capacitación y Apoyo para Socios

Este directorio contiene toda la configuración y código del backend para la plataforma de capacitación.

---

## 📁 Estructura de Archivos

```
backend/
├── config/
│   └── appwrite/
│       ├── .env.example          # Variables de entorno de ejemplo
│       └── docker-compose.yml    # Configuración de Docker para Appwrite
├── database/
│   ├── schema.md                 # Documentación del esquema de BD
│   └── init-collections.js       # Script para crear colecciones
└── README.md                     # Este archivo
```

---

## 🚀 Guía de Instalación

### Paso 1: Preparar el VPS

1. **Conectar al VPS**:
```bash
ssh usuario@tu-ip-vps
```

2. **Actualizar el sistema**:
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Instalar Docker**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

4. **Instalar Docker Compose**:
```bash
sudo apt install docker-compose-plugin
```

### Paso 2: Configurar Dominio

1. **Configurar DNS**:
   - Crear registro A para el dominio principal: `plataforma.tudominio.com`
   - Crear registro A para API: `api.tudominio.com`

2. **Verificar propagación DNS**:
```bash
nslookup plataforma.tudominio.com
```

### Paso 3: Instalar Appwrite

1. **Crear directorio para Appwrite**:
```bash
mkdir -p ~/appwrite
cd ~/appwrite
```

2. **Descargar docker-compose.yml**:
```bash
# Copiar el archivo docker-compose.yml de este proyecto
# o descargarlo directamente:
wget https://raw.githubusercontent.com/appwrite/appwrite/main/docker-compose.yml
```

3. **Configurar variables de entorno**:
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar el archivo con tus configuraciones
nano .env
```

4. **Iniciar Appwrite**:
```bash
docker-compose up -d
```

5. **Verificar que Appwrite está corriendo**:
```bash
docker-compose ps
```

### Paso 4: Configurar Appwrite Console

1. **Acceder a Appwrite Console**:
   - Abrir navegador: `http://tu-ip-vps` o `https://plataforma.tudominio.com`
   - Crear cuenta de administrador

2. **Crear Proyecto**:
   - Nombre: "Plataforma de Capacitación"
   - Anotar el Project ID

3. **Crear API Key**:
   - Ir a API Keys
   - Crear nueva key con todos los permisos
   - Anotar la API Key

4. **Crear Base de Datos**:
   - Ir a Databases
   - Crear nueva base de datos: "plataforma_capacitacion"
   - Anotar el Database ID

### Paso 5: Inicializar Colecciones

1. **Instalar Node.js** (si no está instalado):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

2. **Instalar dependencias**:
```bash
cd backend/database
npm init -y
npm install node-appwrite
```

3. **Configurar el script**:
   - Editar `init-collections.js`
   - Actualizar `ENDPOINT`, `PROJECT_ID`, `API_KEY`, `DATABASE_ID`

4. **Ejecutar el script**:
```bash
node init-collections.js
```

### Paso 6: Configurar Buckets de Almacenamiento

1. **Crear buckets en Appwrite Console**:
   - Ir a Storage
   - Crear los siguientes buckets:
     - `videos` (para videos de capacitación)
     - `imagenes` (para imágenes y thumbnails)
     - `documentos` (para PDFs y documentos)
     - `material-pop` (para material comercial)

2. **Configurar permisos de cada bucket**:
   - Videos: Lectura para todos, escritura para ASESOR y ADMIN
   - Imágenes: Lectura para todos, escritura para ASESOR y ADMIN
   - Documentos: Lectura para todos, escritura para ASESOR y ADMIN
   - Material POP: Lectura para todos, escritura para ASESOR y ADMIN

---

## 🔐 Configuración de Seguridad

### Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar estado
sudo ufw status
```

### SSH Keys

```bash
# Generar SSH key (en tu máquina local)
ssh-keygen -t rsa -b 4096 -C "tu_email@ejemplo.com"

# Copiar key al VPS
ssh-copy-id usuario@tu-ip-vps

# Deshabilitar login con password
sudo nano /etc/ssh/sshd_config
# Cambiar: PasswordAuthentication no

# Reiniciar SSH
sudo systemctl restart ssh
```

### SSL/TLS

Appwrite usa Traefik para SSL automático con Let's Encrypt. Solo necesitas:
1. Configurar el dominio correctamente
2. Asegurar que el puerto 80 y 443 estén abiertos
3. Configurar `_APP_SYSTEM_SECURITY_EMAIL_ADDRESS` en `.env`

---

## 📧 Configuración de Email

### Opción 1: Gmail SMTP

1. **Habilitar 2FA en tu cuenta de Google**
2. **Generar App Password**:
   - Ir a https://myaccount.google.com/security
   - App passwords > Generar nueva
3. **Configurar en `.env`**:
```
_APP_SMTP_HOST=smtp.gmail.com
_APP_SMTP_PORT=587
_APP_SMTP_SECURE=tls
_APP_SMTP_USERNAME=tu_email@gmail.com
_APP_SMTP_PASSWORD=tu_app_password
```

### Opción 2: SendGrid / Mailgun / Amazon SES

1. Crear cuenta en el proveedor
2. Obtener credenciales SMTP
3. Configurar en `.env`

---

## 🔄 Backups

### Backup Automático con Cron

```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /home/usuario/appwrite/backup.sh
```

### Script de Backup (backup.sh)

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/usuario/backups"
mkdir -p $BACKUP_DIR

# Backup de base de datos
docker exec appwrite-mariadb mysqldump -u root -pPASSWORD appwrite > $BACKUP_DIR/db_$DATE.sql

# Backup de volúmenes
docker run --rm -v appwrite_appwrite-uploads:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/uploads_$DATE.tar.gz /data

# Eliminar backups antiguos (más de 7 días)
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -delete
```

---

## 🔧 Mantenimiento

### Comandos Útiles de Docker

```bash
# Ver contenedores corriendo
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Actualizar Appwrite
docker-compose pull
docker-compose up -d

# Ver uso de recursos
docker stats
```

### Monitoreo

```bash
# Instalar htop
sudo apt install htop

# Ver uso de disco
df -h

# Ver uso de memoria
free -h
```

---

## 📊 Datos de Prueba

Para cargar datos de prueba, usar el siguiente script:

```javascript
// En Appwrite Console > Functions
// Crear función con el siguiente código

const { Client, Databases, ID } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const DB_ID = 'plataforma_capacitacion';

    // Crear categorías de ejemplo
    const categorias = [
        { nombre: 'Uso de Plataforma', slug: 'uso-plataforma', icono: 'smartphone', orden: 1 },
        { nombre: 'Producto', slug: 'producto', icono: 'laptop', orden: 2 },
        { nombre: 'Capacitación Comercial', slug: 'capacitacion-comercial', icono: 'dollar-sign', orden: 3 },
        { nombre: 'Liderazgo', slug: 'liderazgo', icono: 'crown', orden: 4 }
    ];

    for (const cat of categorias) {
        await databases.createDocument(DB_ID, 'categorias', ID.unique(), {
            ...cat,
            activo: true,
            creadoEn: new Date().toISOString(),
            actualizadoEn: new Date().toISOString()
        });
    }

    res.json({ message: 'Datos de prueba creados' });
};
```

---

## ✅ Checklist de Verificación

- [ ] VPS accesible por SSH
- [ ] Docker y Docker Compose instalados
- [ ] Dominio configurado y propagado
- [ ] Appwrite corriendo en el VPS
- [ ] Proyecto creado en Appwrite Console
- [ ] API Key generada
- [ ] Base de datos creada
- [ ] Colecciones inicializadas
- [ ] Buckets de almacenamiento creados
- [ ] Email configurado y funcionando
- [ ] SSL funcionando (HTTPS)
- [ ] Firewall configurado
- [ ] Backups automáticos configurados
- [ ] Datos de prueba cargados

---

## 📞 Soporte

Si tienes problemas durante la instalación:

1. **Revisar logs**:
```bash
docker-compose logs -f appwrite
```

2. **Verificar conectividad**:
```bash
curl -I http://localhost/v1/health
```

3. **Documentación de Appwrite**:
   - https://appwrite.io/docs
   - https://github.com/appwrite/appwrite

---

**FIN DEL README**
