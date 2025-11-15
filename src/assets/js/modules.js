// Módulos adicionales para la aplicación

// Módulo de utilidades
const Utils = {
    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validar email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Generar ID único
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Copiar al portapapeles
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error al copiar:', err);
            return false;
        }
    }
};

// Módulo de validaciones
const Validator = {
    // Validar dispositivo Android
    isAndroidDevice() {
        return /Android/i.test(navigator.userAgent);
    },

    // Validar versión de Android
    getAndroidVersion() {
        const match = navigator.userAgent.match(/Android\s([0-9\.]*)/);
        return match ? parseFloat(match[1]) : null;
    },

    // Verificar compatibilidad
    isCompatible() {
        const androidVersion = this.getAndroidVersion();
        return androidVersion ? androidVersion >= 7.0 : false;
    },

    // Validar conexión de red
    isOnline() {
        return navigator.onLine;
    }
};

// Módulo de localStorage
const Storage = {
    // Guardar datos
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
            return false;
        }
    },

    // Cargar datos
    load(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error al cargar de localStorage:', e);
            return null;
        }
    },

    // Eliminar datos
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error al eliminar de localStorage:', e);
            return false;
        }
    },

    // Limpiar todo
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error al limpiar localStorage:', e);
            return false;
        }
    }
};

// Módulo de analytics
const Analytics = {
    // Configurar eventos
    events: {
        DOWNLOAD_STARTED: 'download_started',
        DOWNLOAD_COMPLETED: 'download_completed',
        DOWNLOAD_FAILED: 'download_failed',
        PAGE_VIEWED: 'page_viewed',
        BUTTON_CLICKED: 'button_clicked'
    },

    // Enviar evento
    track(eventName, properties = {}) {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...properties
        };

        // Guardar localmente para análisis
        this.saveEvent(eventData);

        // Enviar a servicios externos si están configurados
        this.sendToExternalServices(eventData);

        console.log('Analytics Event:', eventData);
    },

    // Guardar evento localmente
    saveEvent(eventData) {
        const events = Storage.load('analytics_events') || [];
        events.push(eventData);
        
        // Mantener solo los últimos 100 eventos
        if (events.length > 100) {
            events.shift();
        }
        
        Storage.save('analytics_events', events);
    },

    // Enviar a servicios externos
    sendToExternalServices(eventData) {
        // Aquí puedes integrar con Google Analytics, Mixpanel, etc.
        
        // Ejemplo para Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventData.event, {
                custom_parameter: eventData.properties
            });
        }

        // Ejemplo para Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventData.event, eventData.properties);
        }
    },

    // Obtener métricas
    getMetrics() {
        const events = Storage.load('analytics_events') || [];
        
        const metrics = {
            totalEvents: events.length,
            downloads: events.filter(e => e.event === this.events.DOWNLOAD_STARTED).length,
            completedDownloads: events.filter(e => e.event === this.events.DOWNLOAD_COMPLETED).length,
            failedDownloads: events.filter(e => e.event === this.events.DOWNLOAD_FAILED).length,
            pageViews: events.filter(e => e.event === this.events.PAGE_VIEWED).length
        };

        return metrics;
    }
};

// Exportar módulos para uso global
window.AppModules = {
    Utils,
    Validator,
    Storage,
    Analytics
};