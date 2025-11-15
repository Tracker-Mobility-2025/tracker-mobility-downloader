// Configuración y variables globales
const CONFIG = {
    APK_FILE: 'src/downloads/app-tracker-movility-release.apk', // Nombre del archivo APK
    DOWNLOAD_DELAY: 2000, // Tiempo de simulación de descarga en ms
    VERSION: '1.0.0',
    APP_SIZE: '~25 MB',
    MIN_ANDROID: '7.0+'
};

// Estado de la aplicación
let isDownloading = false;

// Elementos del DOM
const downloadBtn = document.getElementById('downloadBtn');
const downloadProgress = document.getElementById('downloadProgress');
const btnText = downloadBtn.querySelector('.btn-text');

// Función principal de descarga
async function downloadAPK() {
    if (isDownloading) return;
    
    try {
        isDownloading = true;
        updateDownloadButton('downloading');
        
        // Simular proceso de descarga
        await simulateDownload();
        
        // Iniciar descarga real
        initiateFileDownload();
        
        // Mostrar éxito
        showDownloadSuccess();
        
    } catch (error) {
        console.error('Error en la descarga:', error);
        showDownloadError();
    } finally {
        setTimeout(() => {
            resetDownloadButton();
            isDownloading = false;
        }, 3000);
    }
}

// Simular progreso de descarga
function simulateDownload() {
    return new Promise((resolve) => {
        downloadBtn.classList.add('downloading');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                resolve();
            }
            
            updateProgress(progress);
        }, 200);
    });
}

// Actualizar barra de progreso
function updateProgress(percentage) {
    downloadProgress.style.transform = `translateX(-${100 - percentage}%)`;
    btnText.textContent = `Descargando... ${Math.round(percentage)}%`;
}

// Iniciar descarga del archivo
function initiateFileDownload() {
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.style.display = 'none';
    
    // Descargar el archivo APK real
    link.href = CONFIG.APK_FILE;
    link.download = 'tracker-mobility-app.apk';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Verificar si el archivo existe (simulado para el ejemplo)
function fileExists(filename) {
    // En un entorno real, esto se verificaría con el servidor
    // Para este ejemplo, retornamos false para usar el archivo de ejemplo
    return false;
}

// Crear un archivo APK de ejemplo (solo para demostración)
function createDummyAPK() {
    const content = `Tracker Mobility - Aplicación para Trabajadores de Campo v${CONFIG.VERSION}
    
Este es un archivo de ejemplo para demostración.
En un entorno de producción, aquí iría el archivo APK real.

Información de la aplicación:
- Nombre: Tracker Mobility Worker App
- Versión: ${CONFIG.VERSION}
- Tamaño: ${CONFIG.APP_SIZE}
- Plataforma: Android ${CONFIG.MIN_ANDROID}
- Propósito: Visitas domiciliarias y validación de identidad

Funcionalidades principales:
✓ Formularios de validación de identidad
✓ Captura de fotografías y documentos
✓ Geolocalización de visitas
✓ Sincronización de datos en tiempo real
✓ Modo offline para áreas sin conexión
✓ Reportes automáticos de actividad

Para usar esta descarga con un APK real:
1. Coloca tu archivo APK en el mismo directorio que index.html
2. Renómbralo a '${CONFIG.APK_FILE}' o actualiza la variable CONFIG.APK_FILE
3. El botón de descarga funcionará automáticamente

⚠️ IMPORTANTE: Esta aplicación es exclusiva para trabajadores autorizados
de Tracker Mobility y requiere credenciales corporativas para su uso.

Fecha de generación: ${new Date().toLocaleString()}
`;
    
    return new Blob([content], { type: 'application/vnd.android.package-archive' });
}

// Actualizar estado del botón
function updateDownloadButton(state) {
    const icon = downloadBtn.querySelector('i');
    
    switch (state) {
        case 'downloading':
            btnText.textContent = 'Preparando descarga...';
            icon.className = 'fas fa-spinner fa-spin';
            downloadBtn.disabled = true;
            break;
            
        case 'success':
            btnText.textContent = '¡Descarga iniciada!';
            icon.className = 'fas fa-check';
            downloadBtn.style.background = 'var(--success)';
            break;
            
        case 'error':
            btnText.textContent = 'Error en la descarga';
            icon.className = 'fas fa-exclamation-triangle';
            downloadBtn.style.background = 'var(--error)';
            break;
            
        default:
            btnText.textContent = 'Descargar APK';
            icon.className = 'fas fa-download';
            downloadBtn.disabled = false;
            downloadBtn.style.background = '';
            downloadBtn.classList.remove('downloading');
    }
}

// Mostrar éxito en la descarga
function showDownloadSuccess() {
    updateDownloadButton('success');
    showNotification('La descarga ha comenzado. Revisa tu carpeta de descargas. Recuerda que necesitas credenciales corporativas para usar la aplicación.', 'success');
    
    // Analytics o tracking (opcional)
    trackDownload('success');
}

// Mostrar error en la descarga
function showDownloadError() {
    updateDownloadButton('error');
    showNotification('Error al iniciar la descarga. Por favor, intenta nuevamente.', 'error');
    
    // Analytics o tracking (opcional)
    trackDownload('error');
}

// Resetear botón a estado inicial
function resetDownloadButton() {
    updateDownloadButton('default');
    downloadProgress.style.transform = 'translateX(-100%)';
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar estilos si no existen
    addNotificationStyles();
    
    // Mostrar notificación
    document.body.appendChild(notification);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

// Obtener icono de notificación según el tipo
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Cerrar notificación
function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.style.animation = 'slideOutRight 0.3s ease-in-out';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Agregar estilos de notificación dinámicamente
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            border-left: 4px solid var(--primary-color);
        }
        
        .notification-success {
            border-left-color: var(--success);
        }
        
        .notification-error {
            border-left-color: var(--error);
        }
        
        .notification-warning {
            border-left-color: var(--accent-color);
        }
        
        .notification i:first-child {
            color: var(--primary-color);
            font-size: 1.2rem;
        }
        
        .notification-success i:first-child {
            color: var(--success);
        }
        
        .notification-error i:first-child {
            color: var(--error);
        }
        
        .notification-warning i:first-child {
            color: var(--accent-color);
        }
        
        .notification span {
            flex: 1;
            color: var(--text-dark);
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
        }
        
        .notification-close:hover {
            background: var(--surface);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Función de tracking/analytics (opcional)
function trackDownload(status) {
    // Aquí puedes integrar con Google Analytics, Mixpanel, etc.
    console.log(`Descarga ${status}:`, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        version: CONFIG.VERSION
    });
}

// Detectar dispositivo Android
function isAndroidDevice() {
    return /Android/i.test(navigator.userAgent);
}

// Mostrar información específica para Android
function showAndroidInfo() {
    if (isAndroidDevice()) {
        const androidInfo = document.createElement('div');
        androidInfo.className = 'android-detected';
        androidInfo.innerHTML = `
            <i class="fab fa-android"></i>
            <span>Dispositivo Android detectado - Ideal para trabajo de campo</span>
        `;
        
        // Insertar antes del botón de descarga
        const downloadSection = document.querySelector('.download-section');
        const downloadBtn = document.querySelector('.download-btn');
        downloadSection.insertBefore(androidInfo, downloadBtn);
        
        // Agregar estilos
        const styles = document.createElement('style');
        styles.textContent = `
            .android-detected {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                background: linear-gradient(135deg, #a7f3d0, #34d399);
                color: #047857;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 2rem;
                font-weight: 500;
                animation: pulse 2s infinite;
            }
            
            .android-detected i {
                font-size: 1.5rem;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar botón de descarga
    downloadBtn.addEventListener('click', downloadAPK);
    
    // Mostrar información para Android
    showAndroidInfo();
    
    // Prevenir múltiples clics
    downloadBtn.addEventListener('click', (e) => {
        if (isDownloading) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    // Agregar efecto de hover mejorado
    downloadBtn.addEventListener('mouseenter', () => {
        if (!isDownloading) {
            downloadBtn.style.transform = 'translateY(-3px)';
        }
    });
    
    downloadBtn.addEventListener('mouseleave', () => {
        if (!isDownloading) {
            downloadBtn.style.transform = 'translateY(0)';
        }
    });
});

// Funciones de utilidad adicionales
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDeviceInfo() {
    return {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
    };
}

// Exportar funciones para uso global si es necesario
window.TrackerMobility = {
    downloadAPK,
    showNotification,
    CONFIG
};