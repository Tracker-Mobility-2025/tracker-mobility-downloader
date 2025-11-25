// Archivo de configuración global para personalización fácil
window.SITE_CONFIG = {
    // Información de la aplicación
    app: {
        name: 'Tracker Mobility',
        version: '1.0.0',
        size: '~25 MB',
        minAndroid: '7.0+',
        description: 'Herramienta especializada para trabajadores de Tracker Mobility que realizan visitas domiciliarias para validación de identidad y recopilación de información de clientes.'
    },
    
    // Configuración de descarga
    download: {
        fileName: 'app-tracker-mobility.apk',
        folder: 'src/downloads/',
        delayMs: 2000
    },
    
    // Textos personalizables
    texts: {
        title: 'Tracker Mobility',
        subtitle: 'Herramienta para Trabajadores de Campo',
        downloadButton: 'Descargar APK',
        downloadingText: 'Descargando...',
        successText: '¡Descarga iniciada!',
        errorText: 'Error en la descarga'
    },
    
    // Características de la aplicación
    features: [
        {
            icon: 'fas fa-user-check',
            text: 'Validación de identidad'
        },
        {
            icon: 'fas fa-clipboard-list',
            text: 'Recolección de datos'
        },
        {
            icon: 'fas fa-map-marker-alt',
            text: 'Geolocalización de visitas'
        }
    ],
    
    // Información adicional
    appInfo: [
        {
            icon: 'fas fa-mobile-alt',
            text: 'Versión: 1.0.0'
        },
        {
            icon: 'fas fa-download',
            text: 'Tamaño: ~25 MB'
        },
        {
            icon: 'fab fa-android',
            text: 'Android 7.0+'
        },
        {
            icon: 'fas fa-users',
            text: 'Solo trabajadores'
        }
    ],
    
    // Configuración de colores (puede sobrescribir CSS)
    theme: {
        primaryColor: '#6366f1',
        secondaryColor: '#10b981',
        accentColor: '#f59e0b',
        textDark: '#1f2937',
        textLight: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb'
    },
    
    // Configuración de analytics
    analytics: {
        enabled: true,
        googleAnalyticsId: '', // Agregar tu ID de Google Analytics aquí
        facebookPixelId: ''    // Agregar tu ID de Facebook Pixel aquí
    },
    
    // URLs y enlaces
    links: {
        support: 'mailto:soporte@trackermobility.com',
        documentation: 'docs/worker-instructions.md',
        privacy: '#',
        terms: '#'
    }
};

// Función para aplicar la configuración a los elementos del DOM
function applyConfiguration() {
    const config = window.SITE_CONFIG;
    
    // Actualizar textos
    const titleElement = document.querySelector('.header h1');
    if (titleElement) titleElement.textContent = config.texts.title;
    
    const subtitleElement = document.querySelector('.subtitle');
    if (subtitleElement) subtitleElement.textContent = config.texts.subtitle;
    
    const downloadBtnText = document.querySelector('.btn-text');
    if (downloadBtnText) downloadBtnText.textContent = config.texts.downloadButton;
    
    // Actualizar información de la app
    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) descriptionElement.textContent = config.app.description;
    
    // Aplicar colores personalizados
    const root = document.documentElement;
    if (config.theme.primaryColor) {
        root.style.setProperty('--primary-color', config.theme.primaryColor);
    }
    if (config.theme.secondaryColor) {
        root.style.setProperty('--secondary-color', config.theme.secondaryColor);
    }
    if (config.theme.accentColor) {
        root.style.setProperty('--accent-color', config.theme.accentColor);
    }
}

// Aplicar configuración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', applyConfiguration);