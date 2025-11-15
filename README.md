# Tracker Mobility - Sitio de Descarga

Un sitio web estático moderno y responsivo para la descarga de la aplicación móvil Tracker Mobility para trabajadores de campo.

## 📁 Estructura del Proyecto

```
tracker-mobility-downloader/
├── index.html                          # Página principal
├── README.md                          # Documentación del proyecto
├── src/                               # Código fuente
│   └── assets/                        # Recursos estáticos
│       ├── css/                       # Archivos CSS adicionales
│       ├── js/                        # Scripts JavaScript
│       │   └── app.js                 # Lógica principal de la aplicación
│       ├── styles/                    # Estilos CSS
│       │   └── main.css               # Hoja de estilos principal
│       └── img/                       # Imágenes y recursos gráficos
├── docs/                              # Documentación
│   └── worker-instructions.md         # Instrucciones para trabajadores
└── downloads/                         # Archivos de descarga
    └── tracker-mobility-worker.apk    # Archivo APK (colocar aquí)
```

## 🛠️ Instalación y Uso

### Opción 1: Servidor Local Simple

1. Abre PowerShell en el directorio del proyecto
2. Ejecuta uno de estos comandos:

```powershell
# Con Python (si está instalado)
python -m http.server 8000

# Con Node.js (si está instalado)
npx http-server -p 8000

# Con PHP (si está instalado)
php -S localhost:8000
```

3. Abre tu navegador en `http://localhost:8000`

### Opción 2: Archivo Local

1. Simplemente abre `index.html` directamente en tu navegador
2. La funcionalidad básica funcionará, pero para descargas reales es recomendable usar un servidor

## 📱 Cómo Agregar tu APK

1. **Coloca tu archivo APK** en el directorio raíz del proyecto
2. **Renómbralo** a `tracker-mobility.apk` o edita la variable `CONFIG.APK_FILE` en `script.js`
3. **Actualiza la información** en `index.html` si es necesario (versión, tamaño, etc.)

## ⚙️ Configuración

### Personalizar la Aplicación

Edita las variables en `src/assets/js/app.js`:

```javascript
const CONFIG = {
    APK_FILE: 'downloads/tu-aplicacion.apk',    // Ruta de tu archivo APK
    DOWNLOAD_DELAY: 2000,                       // Tiempo de animación (ms)
    VERSION: '2.0.0',                          // Versión de tu app
    APP_SIZE: '~30 MB',                        // Tamaño del archivo
    MIN_ANDROID: '8.0+'                        // Versión mínima de Android
};
```

### Personalizar Estilos

Los colores y estilos se pueden modificar en `src/assets/styles/main.css` usando las variables CSS:

```css
:root {
    --primary-color: #6366f1;        /* Color principal */
    --secondary-color: #10b981;      /* Color secundario */
    --accent-color: #f59e0b;         /* Color de acento */
    /* ... más variables */
}
```

## 🎨 Personalización

### Cambiar Información de la App

1. **Título y descripción**: Edita el contenido en `index.html`
2. **Iconos**: Cambia las clases de Font Awesome por otros iconos
3. **Colores**: Modifica las variables CSS en `src/assets/styles/main.css`
4. **Características**: Actualiza la lista de features en la sección `.features`

### Agregar Analytics

Para agregar seguimiento de descargas, edita la función `trackDownload()` en `src/assets/js/app.js`:

```javascript
function trackDownload(status) {
    // Google Analytics
    gtag('event', 'download', {
        'event_category': 'APK',
        'event_label': status,
        'value': 1
    });
}
```

## 🌐 Despliegue

### GitHub Pages

1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama principal como fuente
4. Tu sitio estará disponible en `https://tuusuario.github.io/tu-repositorio`

### Netlify

1. Arrastra la carpeta del proyecto a [netlify.com](https://netlify.com)
2. Tu sitio se desplegará automáticamente

### Vercel

1. Conecta tu repositorio de GitHub con [vercel.com](https://vercel.com)
2. El despliegue es automático con cada commit

## 📱 Características Técnicas

- **Framework**: Vanilla HTML, CSS, JavaScript (sin dependencias)
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Inter)
- **Responsive**: Mobile-first design
- **Browser Support**: Navegadores modernos (Chrome, Firefox, Safari, Edge)
- **File Size**: ~15KB total (sin el APK)

## 🔧 Funcionalidades Avanzadas

### Sistema de Notificaciones

El sitio incluye un sistema de notificaciones personalizable:

```javascript
// Mostrar notificación
showNotification('Mensaje personalizado', 'success');
// Tipos: 'success', 'error', 'warning', 'info'
```

### Detección de Dispositivos

Detecta automáticamente dispositivos Android y muestra información relevante.

### Animaciones de Progreso

Incluye animaciones suaves para simular el progreso de descarga y mejorar la experiencia del usuario.

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature: `git checkout -b feature/nueva-caracteristica`
3. Commit tus cambios: `git commit -am 'Agrega nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para tus propios proyectos.

## 🚀 Próximas Características

- [ ] Soporte para múltiples idiomas
- [ ] Integración con Firebase Analytics
- [ ] Modo oscuro
- [ ] Capturas de pantalla de la aplicación
- [ ] Sistema de versiones múltiples
- [ ] QR code para descarga móvil

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.