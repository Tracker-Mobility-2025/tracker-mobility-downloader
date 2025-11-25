// Configuración y variables globales
const CONFIG = {
    APK_FILE: 'src/downloads/app-tracker-mobility.apk', // Nombre del archivo APK
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

        // En móviles (Android), iniciar descarga inmediatamente
        // para evitar que el navegador bloquee la acción
        if (isAndroidDevice()) {
            // Pequeño delay solo para mostrar feedback visual
            await new Promise(resolve => setTimeout(resolve, 500));
            await initiateFileDownload();
            showDownloadSuccess();
            setTimeout(() => {
                resetDownloadButton();
                isDownloading = false;
            }, 3000);
            return;
        }

        // En escritorio, mantener animación de progreso
        simulateDownload()
            .then(async () => {
                await initiateFileDownload();
                showDownloadSuccess();
            })
            .catch((error) => {
                console.error('Error en la descarga:', error);
                showDownloadError();
            })
            .finally(() => {
                setTimeout(() => {
                    resetDownloadButton();
                    isDownloading = false;
                }, 3000);
            });
    } catch (error) {
        console.error('Error en la descarga (bloque try):', error);
        showDownloadError();
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
    try {
        const suggestedName = (window.SITE_CONFIG && window.SITE_CONFIG.download && window.SITE_CONFIG.download.fileName)
            ? window.SITE_CONFIG.download.fileName
            : 'tracker-mobility-app.apk';

        // Método mejorado para móviles: usar fetch + blob para forzar descarga
        if (isAndroidDevice()) {
            downloadViaBlob(CONFIG.APK_FILE, suggestedName);
        } else {
            // Método tradicional para escritorio
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = CONFIG.APK_FILE;
            link.setAttribute('download', suggestedName);
            link.target = '_self';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        }
    } catch (err) {
        console.error('Fallo al iniciar descarga directa:', err);
        // Fallback: abrir en nueva pestaña
        window.open(CONFIG.APK_FILE, '_blank');
    }
}

// Descarga mediante Blob para mejor compatibilidad móvil
async function downloadViaBlob(url, filename) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al obtener el archivo');
        }
        
        const blob = await response.blob();
        
        // Crear URL temporal del blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Crear enlace temporal y forzar descarga
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = filename;
        
        // Para Android: algunos navegadores requieren que el elemento esté en el DOM
        document.body.appendChild(link);
        
        // Forzar el click
        link.click();
        
        // Limpiar después de un breve delay
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 250);
        
    } catch (error) {
        console.error('Error en descarga via blob:', error);
        // Fallback final: abrir directamente el archivo
        window.location.href = url;
    }
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

// Detectar dispositivo iOS (incluye iPadOS)
function isIOSDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const iPadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1; // iPadOS
    return iOS || iPadOS13Plus;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar botón de descarga
    downloadBtn.addEventListener('click', downloadAPK);

    // Mostrar nota para usuarios móviles
    const mobileNote = document.querySelector('.mobile-note');
    if (mobileNote && (isAndroidDevice() || /Mobile/i.test(navigator.userAgent))) {
        mobileNote.style.display = 'flex';
    }

    // (Sin enlace de respaldo) Solo el botón gestiona la descarga
    
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

    // Manejo específico para iOS: no es compatible con archivos APK
    handleIOSRestrictions();
});

// UI/UX para iOS: deshabilitar descarga y ofrecer compartir/copiar enlace
function handleIOSRestrictions() {
    if (!isIOSDevice()) return;

    try {
        // Deshabilitar botón y cambiar texto
        downloadBtn.disabled = true;
        const icon = downloadBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-ban';
        const label = downloadBtn.querySelector('.btn-text');
        if (label) label.textContent = 'Disponible solo en Android';

        // Mostrar aviso con opciones para compartir/copiar
        const downloadSection = document.querySelector('.download-section');
        if (!downloadSection) return;

        const box = document.createElement('div');
        box.className = 'ios-info-box';
        const absoluteApkUrl = new URL(CONFIG.APK_FILE, window.location.origin).toString();
        box.innerHTML = `
            <div class="ios-info-title">
                <i class="fas fa-info-circle"></i>
                <strong>Descarga de APK no compatible en iOS</strong>
            </div>
            <p>Estás usando iPhone/iPad. Los archivos APK solo pueden descargarse e instalarse en dispositivos Android.
            Comparte o copia el enlace para abrirlo desde un teléfono/tablet Android.</p>
            <div class="ios-actions">
                <button id="shareApkLink" class="ios-action-btn"><i class="fas fa-share-alt"></i> Compartir enlace</button>
                <button id="copyApkLink" class="ios-action-btn"><i class="fas fa-link"></i> Copiar enlace</button>
            </div>
            <code class="ios-link">${absoluteApkUrl}</code>
        `;
        downloadSection.appendChild(box);

        // Estilos mínimos
        const styles = document.createElement('style');
        styles.textContent = `
            .ios-info-box { margin-top: 1rem; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; padding: 1rem; border-radius: .5rem; }
            .ios-info-title { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
            .ios-actions { display: flex; gap: .5rem; margin: .5rem 0; }
            .ios-action-btn { background: var(--primary-color); color: white; border: none; padding: .5rem .75rem; border-radius: .375rem; cursor: pointer; }
            .ios-action-btn:hover { opacity: .9; }
            .ios-link { display: block; margin-top: .5rem; user-select: all; word-break: break-all; }
        `;
        document.head.appendChild(styles);

        // Handlers de compartir/copiar
        const shareBtn = document.getElementById('shareApkLink');
        const copyBtn = document.getElementById('copyApkLink');
        if (shareBtn && navigator.share) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.share({ title: 'Tracker Mobility APK', text: 'Descarga la app para Android', url: absoluteApkUrl });
                } catch (_) {}
            });
        } else if (shareBtn) {
            // Si no hay Web Share API, deshabilitar botón
            shareBtn.disabled = true;
            shareBtn.title = 'Compartir no soportado';
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(absoluteApkUrl);
                    showNotification('Enlace copiado. Ábrelo en un dispositivo Android.', 'success');
                } catch (e) {
                    showNotification('No se pudo copiar el enlace.', 'error');
                }
            });
        }
    } catch (_) {}
}

// ========================================
// CARRUSEL DE IMÁGENES
// ========================================

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
let autoSlideInterval;

function showSlide(index) {
    // Asegurar que el índice esté dentro del rango
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Actualizar slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });

    // Actualizar indicadores
    indicators.forEach((indicator, i) => {
        indicator.classList.remove('active');
        if (i === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

function moveCarousel(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
}

function goToSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// Iniciar carrusel automático
if (slides.length > 0) {
    autoSlideInterval = setInterval(nextSlide, 4000);
    
    // Pausar al hacer hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }
}

// Exportar funciones para uso global si es necesario
window.TrackerMobility = {
    downloadAPK,
    showNotification,
    CONFIG
};

// Exportar funciones del carrusel para los onclick en HTML
window.moveCarousel = moveCarousel;
window.goToSlide = goToSlide;