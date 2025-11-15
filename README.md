# Tracker Mobility – Sitio de Descarga de APK

Sitio web estático, moderno y responsivo para distribuir la app Android de Tracker Mobility a trabajadores de campo.

## 📁 Estructura del proyecto (actual)

```
tracker-mobility-downloader/
├── index.html                         # Página principal
├── README.md                          # Esta documentación
└── src/
        ├── assets/
        │   ├── css/
        │   │   ├── components.css
        │   │   └── main.css
        │   ├── js/
        │   │   ├── app.js                # Lógica de descarga y UI
        │   │   ├── config.js             # Configuración del sitio (SITE_CONFIG)
        │   │   └── modules.js            # Utilidades y analytics locales
        │   └── styles/
        │       └── main.css              # Estilos principales
        └── downloads/
                └── app-tracker-movility-release.apk  # APK de la app (archivo real)
```

Nota: El APK se sirve desde `src/downloads/` y el botón de descarga apunta a esa ruta.

## 🚀 Cómo ejecutar localmente

Para evitar limitaciones del navegador con archivos locales (`file://`), usa un servidor HTTP simple.

```powershell
# Desde la carpeta del proyecto

# Opción Python 3
python -m http.server 8080

# Opción Node.js
npx http-server -p 8080
```

Luego abre en el navegador: `http://localhost:8080`

Acceso desde móvil en la misma red: `http://<IP_DE_TU_PC>:8080` (por ejemplo, `http://192.168.1.50:8080`).

## 📲 Descarga en Android (móviles/tablets)

- El botón “Descargar APK” inicia la descarga directamente en Android dentro del mismo gesto del usuario (evita bloqueos del navegador).
- Se agrega automáticamente un enlace “Descarga directa (APK)” como respaldo cuando se detecta Android.
- Requiere permitir “Instalar apps de fuentes desconocidas” en el dispositivo.

## ⚙️ Configuración relevante

En `src/assets/js/app.js` se usa la ruta real del APK:

```javascript
const CONFIG = {
    APK_FILE: 'src/downloads/app-tracker-movility-release.apk',
    DOWNLOAD_DELAY: 2000,
    VERSION: '1.0.0',
    APP_SIZE: '~25 MB',
    MIN_ANDROID: '7.0+'
};
```

En `src/assets/js/config.js` puedes personalizar textos, colores y el nombre de archivo sugerido:

```javascript
window.SITE_CONFIG = {
    download: {
        fileName: 'app-tracker-movility-release.apk',
        folder: 'src/downloads/',
        delayMs: 2000
    },
    // ... otros textos/tema/features
};
```

## 🧩 Personalización rápida

- Título, textos y colores: `src/assets/js/config.js` y `src/assets/styles/main.css`.
- Iconos (Font Awesome) y secciones: `index.html`.
- Notificaciones y tracking local: funciones en `src/assets/js/app.js` y `modules.js`.

## 🛠️ Solución de problemas

- No descarga en móvil: asegúrate de acceder vía `http://` (no `file://`). El sitio dispara la descarga inmediatamente en Android y añade un enlace de respaldo bajo el botón.
- Ruta del APK: verifica que el archivo exista en `src/downloads/app-tracker-movility-release.apk`.
- Navegador ignora “download”: algunos navegadores móviles abren el archivo en una pestaña; usa el enlace “Descarga directa (APK)” o mantén presionado y selecciona “Descargar”.
- Caché: si cambiaste el APK, fuerza recarga (Ctrl+F5) o limpia caché del navegador móvil.

## 🌐 Despliegue

Este sitio es 100% estático. Puedes publicarlo en GitHub Pages, Netlify o Vercel subiendo el contenido tal cual.

## 🔒 Aviso

La app es para trabajadores autorizados de Tracker Mobility y requiere credenciales corporativas.

---

¿Dudas o mejoras? Actualiza este README y los archivos en `src/assets/js` según tus necesidades.