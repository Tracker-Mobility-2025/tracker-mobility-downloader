// Configuración y variables globales
const CONFIG = {
    APK_FILE: 'src/downloads/app-tracker-mobility.apk',
    APK_FILENAME: 'app-tracker-mobility.apk',
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
function downloadAPK() {
    if (isDownloading) return;
    
    isDownloading = true;
    updateDownloadButton('downloading');
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = CONFIG.APK_FILE;
    link.download = CONFIG.APK_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showDownloadSuccess();
    setTimeout(() => {
        resetDownloadButton();
        isDownloading = false;
    }, 2000);
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
    showNotification('Descarga iniciada. Revisa tu carpeta de descargas.', 'success');
}

// Resetear botón a estado inicial
function resetDownloadButton() {
    updateDownloadButton('default');
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

// Detectar dispositivo iOS (incluye iPadOS)
function isIOSDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const iPadOS13Plus = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return iOS || iPadOS13Plus;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    downloadBtn.addEventListener('click', downloadAPK);
    handleIOSRestrictions();
});

// Deshabilitar descarga en iOS
function handleIOSRestrictions() {
    if (!isIOSDevice()) return;
    
    downloadBtn.disabled = true;
    const icon = downloadBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-ban';
    const label = downloadBtn.querySelector('.btn-text');
    if (label) label.textContent = 'Solo disponible en Android';
    
    showNotification('APK solo compatible con dispositivos Android', 'warning');
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