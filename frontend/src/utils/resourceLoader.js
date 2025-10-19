// Утилиты для динамической загрузки ресурсов

/**
 * Динамически загружает CSS файл
 * @param {string} href - URL CSS файла
 * @param {string} integrity - SRI hash (опционально)
 * @returns {Promise<boolean>} - true если загружен успешно
 */
export const loadCSS = (href, integrity = null) => {
  return new Promise((resolve) => {
    // Проверяем, не загружен ли уже этот CSS
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    if (integrity) {
      link.integrity = integrity;
      link.crossOrigin = 'anonymous';
    }
    
    link.onload = () => resolve(true);
    link.onerror = () => resolve(false);
    
    document.head.appendChild(link);
  });
};

/**
 * Динамически загружает JavaScript файл
 * @param {string} src - URL JS файла
 * @returns {Promise<boolean>} - true если загружен успешно
 */
export const loadJS = (src) => {
  return new Promise((resolve) => {
    // Проверяем, не загружен ли уже этот JS
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    
    document.head.appendChild(script);
  });
};

/**
 * Предзагружает ресурс без блокировки
 * @param {string} href - URL ресурса
 * @param {string} as - тип ресурса (script, style, image, etc.)
 * @returns {Promise<boolean>} - true если предзагружен успешно
 */
export const preloadResource = (href, as) => {
  return new Promise((resolve) => {
    // Проверяем, не предзагружен ли уже этот ресурс
    if (document.querySelector(`link[href="${href}"][rel="preload"]`)) {
      resolve(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (as === 'script') {
      link.type = 'text/javascript';
    } else if (as === 'style') {
      link.type = 'text/css';
    }
    
    link.onload = () => resolve(true);
    link.onerror = () => resolve(false);
    
    document.head.appendChild(link);
  });
};

/**
 * Загружает Leaflet CSS только когда нужен
 */
export const loadLeafletCSS = () => {
  const href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  
  return loadCSS(href, integrity);
};

/**
 * Загружает Leaflet JS только когда нужен
 */
export const loadLeafletJS = () => {
  const href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  
  return loadJS(href);
};

/**
 * Умная загрузка ресурсов с кэшированием
 */
class ResourceLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  async load(href, as, options = {}) {
    const key = `${href}-${as}`;
    
    // Возвращаем из кэша если уже загружен
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Ждем если уже загружается
    if (this.loading.has(key)) {
      return this.loading.get(key);
    }
    
    // Начинаем загрузку
    const promise = this._loadResource(href, as, options);
    this.loading.set(key, promise);
    
    try {
      const result = await promise;
      this.cache.set(key, result);
      this.loading.delete(key);
      return result;
    } catch (error) {
      this.loading.delete(key);
      throw error;
    }
  }

  async _loadResource(href, as, options) {
    if (as === 'style') {
      return loadCSS(href, options.integrity);
    } else if (as === 'script') {
      return loadJS(href);
    } else {
      return preloadResource(href, as);
    }
  }
}

// Экспортируем singleton instance
export const resourceLoader = new ResourceLoader();
