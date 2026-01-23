/**
 * ZerOS 内核日志系统
 * 提供统一的日志记录功能，支持不同级别的日志输出
 */

class KernelLogger {
    // 日志级别枚举
    static LEVEL = {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR'
    };
    
    // 日志配置
    static _config = {
        enabled: true,
        level: this.LEVEL.INFO,
        showTimestamp: true,
        showModuleName: true,
        maxLogLength: 1000,
        suppressErrors: false
    };
    
    // 日志缓存
    static _logCache = [];
    static _maxCacheSize = 1000;
    
    /**
     * 初始化日志系统
     */
    static init() {
        console.log('📊 KernelLogger 初始化');
        
        // 加载配置
        this._loadConfig();
        
        // 测试日志输出
        this.info('KernelLogger', '日志系统初始化完成');
        
        return this;
    }
    
    /**
     * 加载配置
     */
    static _loadConfig() {
        try {
            if (typeof localStorage !== 'undefined') {
                const configStr = localStorage.getItem('kernelLogger.config');
                if (configStr) {
                    try {
                        const config = JSON.parse(configStr);
                        this._config = { ...this._config, ...config };
                    } catch (error) {
                        console.warn('解析日志配置失败:', error);
                    }
                }
            }
        } catch (error) {
            // 忽略配置加载错误
        }
    }
    
    /**
     * 保存配置
     */
    static _saveConfig() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('kernelLogger.config', JSON.stringify(this._config));
            }
        } catch (error) {
            // 忽略配置保存错误
        }
    }
    
    /**
     * 生成日志时间戳
     */
    static _getTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    /**
     * 格式化日志消息
     */
    static _formatMessage(level, moduleName, message, data) {
        let formattedMessage = '';
        
        // 添加时间戳
        if (this._config.showTimestamp) {
            formattedMessage += `[${this._getTimestamp()}] `;
        }
        
        // 添加日志级别
        formattedMessage += `[${level}] `;
        
        // 添加模块名
        if (this._config.showModuleName && moduleName) {
            formattedMessage += `[${moduleName}] `;
        }
        
        // 添加消息
        formattedMessage += message;
        
        // 添加数据
        if (data !== undefined) {
            try {
                const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                if (dataStr.length > 0) {
                    formattedMessage += `\n${dataStr}`;
                }
            } catch (error) {
                formattedMessage += `\n[数据序列化失败: ${error.message}]`;
            }
        }
        
        // 限制日志长度
        if (formattedMessage.length > this._config.maxLogLength) {
            formattedMessage = formattedMessage.substring(0, this._config.maxLogLength) + '...';
        }
        
        return formattedMessage;
    }
    
    /**
     * 检查日志级别是否启用
     */
    static _isLevelEnabled(level) {
        const levelOrder = [this.LEVEL.DEBUG, this.LEVEL.INFO, this.LEVEL.WARN, this.LEVEL.ERROR];
        const currentLevelIndex = levelOrder.indexOf(this._config.level);
        const targetLevelIndex = levelOrder.indexOf(level);
        
        return targetLevelIndex >= currentLevelIndex;
    }
    
    /**
     * 记录日志
     */
    static _log(level, moduleName, message, data) {
        if (!this._config.enabled) {
            return;
        }
        
        if (!this._isLevelEnabled(level)) {
            return;
        }
        
        try {
            const formattedMessage = this._formatMessage(level, moduleName, message, data);
            
            // 根据级别输出到控制台
            switch (level) {
                case this.LEVEL.DEBUG:
                    if (typeof console !== 'undefined' && console.debug) {
                        console.debug(formattedMessage);
                    } else {
                        console.log(formattedMessage);
                    }
                    break;
                case this.LEVEL.INFO:
                    if (typeof console !== 'undefined') {
                        console.log(formattedMessage);
                    }
                    break;
                case this.LEVEL.WARN:
                    if (typeof console !== 'undefined' && console.warn) {
                        console.warn(formattedMessage);
                    } else {
                        console.log(formattedMessage);
                    }
                    break;
                case this.LEVEL.ERROR:
                    if (typeof console !== 'undefined' && console.error) {
                        console.error(formattedMessage);
                    } else {
                        console.log(formattedMessage);
                    }
                    break;
            }
            
            // 缓存日志
            this._cacheLog({
                timestamp: Date.now(),
                level,
                moduleName,
                message,
                data
            });
            
        } catch (error) {
            // 防止日志系统本身出错导致系统崩溃
            if (!this._config.suppressErrors) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('KernelLogger 错误:', error);
                }
            }
        }
    }
    
    /**
     * 缓存日志
     */
    static _cacheLog(logEntry) {
        this._logCache.push(logEntry);
        
        // 限制缓存大小
        if (this._logCache.length > this._maxCacheSize) {
            this._logCache.shift();
        }
    }
    
    /**
     * 记录调试日志
     */
    static debug(moduleName, message, data) {
        this._log(this.LEVEL.DEBUG, moduleName, message, data);
    }
    
    /**
     * 记录信息日志
     */
    static info(moduleName, message, data) {
        this._log(this.LEVEL.INFO, moduleName, message, data);
    }
    
    /**
     * 记录警告日志
     */
    static warn(moduleName, message, data) {
        this._log(this.LEVEL.WARN, moduleName, message, data);
    }
    
    /**
     * 记录错误日志
     */
    static error(moduleName, message, data) {
        this._log(this.LEVEL.ERROR, moduleName, message, data);
    }
    
    /**
     * 设置日志级别
     */
    static setLevel(level) {
        if (Object.values(this.LEVEL).includes(level)) {
            this._config.level = level;
            this._saveConfig();
            this.info('KernelLogger', `日志级别已设置为: ${level}`);
        } else {
            this.warn('KernelLogger', `无效的日志级别: ${level}`);
        }
    }
    
    /**
     * 获取日志级别
     */
    static getLevel() {
        return this._config.level;
    }
    
    /**
     * 启用/禁用日志
     */
    static setEnabled(enabled) {
        this._config.enabled = enabled;
        this._saveConfig();
        this.info('KernelLogger', `日志系统已${enabled ? '启用' : '禁用'}`);
    }
    
    /**
     * 检查日志是否启用
     */
    static isEnabled() {
        return this._config.enabled;
    }
    
    /**
     * 获取日志缓存
     */
    static getLogCache() {
        return [...this._logCache];
    }
    
    /**
     * 清空日志缓存
     */
    static clearLogCache() {
        this._logCache = [];
        this.info('KernelLogger', '日志缓存已清空');
    }
    
    /**
     * 导出日志
     */
    static exportLogs() {
        const logs = this.getLogCache();
        const logStr = logs.map(log => {
            const date = new Date(log.timestamp);
            const timeStr = date.toISOString();
            return `[${timeStr}] [${log.level}] [${log.moduleName}] ${log.message}${log.data ? `\n${JSON.stringify(log.data)}` : ''}`;
        }).join('\n\n');
        
        return logStr;
    }
}

// 自动初始化
KernelLogger.init();

// 导出日志系统
if (typeof window !== 'undefined') {
    window.KernelLogger = KernelLogger;
} else if (typeof globalThis !== 'undefined') {
    globalThis.KernelLogger = KernelLogger;
}