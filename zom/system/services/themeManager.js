/**
 * ThemeManager - 主题管理模块
 * 用于管理ZOM系统的主题
 */
class ThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = 'default';
    this.themeElements = [];
  }

  /**
   * 注册主题
   * @param {string} themeId - 主题ID
   * @param {Object} themeConfig - 主题配置
   */
  registerTheme(themeId, themeConfig) {
    this.themes.set(themeId, {
      id: themeId,
      name: themeConfig.name || themeId,
      description: themeConfig.description || '',
      colors: themeConfig.colors || {},
      styles: themeConfig.styles || {},
      registeredAt: Date.now()
    });
  }

  /**
   * 应用主题
   * @param {string} themeId - 主题ID
   */
  applyTheme(themeId) {
    if (!this.themes.has(themeId)) {
      console.warn(`Theme ${themeId} not found, using default theme`);
      themeId = 'default';
    }

    this.currentTheme = themeId;
    const theme = this.themes.get(themeId);

    // 应用主题颜色
    if (theme.colors) {
      Object.keys(theme.colors).forEach(colorName => {
        document.documentElement.style.setProperty(`--${colorName}`, theme.colors[colorName]);
      });
    }

    // 应用主题样式
    if (theme.styles) {
      this.themeElements.forEach(element => {
        document.head.removeChild(element);
      });
      this.themeElements = [];

      const styleElement = document.createElement('style');
      styleElement.textContent = theme.styles;
      document.head.appendChild(styleElement);
      this.themeElements.push(styleElement);
    }

    // 触发主题变更事件
    this._triggerThemeChange(themeId);
  }

  /**
   * 获取当前主题
   * @returns {Object} - 当前主题
   */
  getCurrentTheme() {
    return this.themes.get(this.currentTheme) || null;
  }

  /**
   * 获取所有主题
   * @returns {Array} - 主题列表
   */
  getAllThemes() {
    return Array.from(this.themes.values());
  }

  /**
   * 触发主题变更事件
   * @private
   * @param {string} themeId - 主题ID
   */
  _triggerThemeChange(themeId) {
    const event = new CustomEvent('themeChange', {
      detail: {
        themeId,
        theme: this.themes.get(themeId)
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 初始化默认主题
   */
  initDefaultTheme() {
    this.registerTheme('default', {
      name: 'Default Theme',
      description: 'ZOM Default Theme',
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        background: '#f0f0f0',
        foreground: '#333333',
        accent: '#e74c3c',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db'
      },
      styles: `
        body {
          font-family: Arial, sans-serif;
          background-color: var(--background);
          color: var(--foreground);
          margin: 0;
          padding: 0;
        }
        .window {
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background-color: white;
        }
        .window-header {
          background-color: var(--primary);
          color: white;
          padding: 8px;
          cursor: move;
        }
        .window-content {
          padding: 16px;
        }
        button {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          opacity: 0.8;
        }
      `
    });

    this.applyTheme('default');
  }
}

// 导出单例
const themeManager = new ThemeManager();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = themeManager;
} else if (typeof window !== 'undefined') {
  window.ThemeManager = themeManager;
}