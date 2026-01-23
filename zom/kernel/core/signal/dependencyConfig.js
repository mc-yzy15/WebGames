/**
 * ZerOS 模块依赖管理系统
 * 负责管理模块间的依赖关系，确保模块按正确顺序加载
 */

class DependencyConfig {
    // 模块依赖关系映射
    static _dependencies = {};
    
    // 模块加载状态
    static _moduleStatus = new Map();
    
    // 模块加载顺序
    static _loadOrder = [];
    
    // 加载中标志
    static _isLoading = false;
    
    // 加载完成标志
    static _isLoaded = false;
    
    /**
     * 初始化依赖管理系统
     */
    static init() {
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('DependencyConfig', '依赖管理系统初始化');
        } else {
            console.log('DependencyConfig 初始化');
        }
        
        return this;
    }
    
    /**
     * 注册模块依赖关系
     * @param {Object} dependencies - 模块依赖关系映射
     */
    static registerDependencies(dependencies) {
        this._dependencies = { ...this._dependencies, ...dependencies };
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('DependencyConfig', `已注册 ${Object.keys(dependencies).length} 个模块依赖关系`);
        }
    }
    
    /**
     * 计算模块加载顺序
     * @returns {Array} 模块加载顺序数组
     */
    static _calculateLoadOrder() {
        const visited = new Set();
        const temp = new Set();
        const order = [];
        
        // 深度优先搜索计算依赖顺序
        function dfs(module) {
            if (temp.has(module)) {
                throw new Error(`检测到循环依赖: ${module}`);
            }
            
            if (visited.has(module)) {
                return;
            }
            
            temp.add(module);
            
            const deps = DependencyConfig._dependencies[module] || [];
            for (const dep of deps) {
                dfs(dep);
            }
            
            temp.delete(module);
            visited.add(module);
            order.push(module);
        }
        
        // 对所有模块进行拓扑排序
        for (const module in DependencyConfig._dependencies) {
            if (!visited.has(module)) {
                dfs(module);
            }
        }
        
        this._loadOrder = order;
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('DependencyConfig', `计算出的加载顺序: ${order.length} 个模块`);
        }
        
        return order;
    }
    
    /**
     * 加载单个模块
     * @param {string} modulePath - 模块路径
     * @returns {Promise<boolean>} 加载是否成功
     */
    static async _loadModule(modulePath) {
        return new Promise((resolve) => {
            if (this._moduleStatus.get(modulePath) === 'loaded') {
                resolve(true);
                return;
            }
            
            if (this._moduleStatus.get(modulePath) === 'loading') {
                // 模块正在加载，等待完成
                const checkInterval = setInterval(() => {
                    if (this._moduleStatus.get(modulePath) === 'loaded') {
                        clearInterval(checkInterval);
                        resolve(true);
                    } else if (this._moduleStatus.get(modulePath) === 'error') {
                        clearInterval(checkInterval);
                        resolve(false);
                    }
                }, 50);
                
                return;
            }
            
            this._moduleStatus.set(modulePath, 'loading');
            
            try {
                // 创建 script 标签加载模块
                const script = document.createElement('script');
                script.src = modulePath;
                script.type = 'text/javascript';
                script.async = false; // 同步加载，确保顺序
                
                script.onload = () => {
                    this._moduleStatus.set(modulePath, 'loaded');
                    
                    // 发布模块加载完成信号
                    this.publishSignal(modulePath);
                    
                    if (typeof KernelLogger !== 'undefined') {
                        KernelLogger.debug('DependencyConfig', `模块加载成功: ${modulePath}`);
                    }
                    
                    resolve(true);
                };
                
                script.onerror = (error) => {
                    this._moduleStatus.set(modulePath, 'error');
                    
                    if (typeof KernelLogger !== 'undefined') {
                        KernelLogger.error('DependencyConfig', `模块加载失败: ${modulePath}`, error);
                    } else {
                        console.error(`模块加载失败: ${modulePath}`, error);
                    }
                    
                    resolve(false);
                };
                
                document.head.appendChild(script);
            } catch (error) {
                this._moduleStatus.set(modulePath, 'error');
                
                if (typeof KernelLogger !== 'undefined') {
                    KernelLogger.error('DependencyConfig', `模块加载异常: ${modulePath}`, error);
                } else {
                    console.error(`模块加载异常: ${modulePath}`, error);
                }
                
                resolve(false);
            }
        });
    }
    
    /**
     * 按顺序加载所有模块
     * @returns {Promise<boolean>} 所有模块加载是否成功
     */
    static async loadModules() {
        if (this._isLoading) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.warn('DependencyConfig', '模块加载已在进行中');
            }
            return false;
        }
        
        if (this._isLoaded) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('DependencyConfig', '模块已全部加载完成');
            }
            return true;
        }
        
        this._isLoading = true;
        
        try {
            // 计算加载顺序
            const loadOrder = this._calculateLoadOrder();
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('DependencyConfig', `开始加载 ${loadOrder.length} 个模块`);
            } else {
                console.log(`开始加载 ${loadOrder.length} 个模块`);
            }
            
            // 按顺序加载模块
            let allSuccess = true;
            
            for (const modulePath of loadOrder) {
                const success = await this._loadModule(modulePath);
                if (!success) {
                    allSuccess = false;
                }
            }
            
            this._isLoaded = allSuccess;
            
            if (typeof KernelLogger !== 'undefined') {
                if (allSuccess) {
                    KernelLogger.info('DependencyConfig', '所有模块加载完成');
                } else {
                    KernelLogger.warn('DependencyConfig', '部分模块加载失败');
                }
            } else {
                if (allSuccess) {
                    console.log('所有模块加载完成');
                } else {
                    console.warn('部分模块加载失败');
                }
            }
            
            return allSuccess;
        } catch (error) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('DependencyConfig', '模块加载过程中发生错误', error);
            } else {
                console.error('模块加载过程中发生错误', error);
            }
            
            return false;
        } finally {
            this._isLoading = false;
        }
    }
    
    /**
     * 发布模块加载完成信号
     * @param {string} modulePath - 模块路径
     */
    static publishSignal(modulePath) {
        try {
            // 优先使用自定义事件
            if (typeof document !== 'undefined' && document.body) {
                document.body.dispatchEvent(
                    new CustomEvent('dependencyLoaded', {
                        detail: {
                            name: modulePath,
                            timestamp: Date.now()
                        }
                    })
                );
            }
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.debug('DependencyConfig', `已发布模块加载信号: ${modulePath}`);
            }
        } catch (error) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('DependencyConfig', '发布信号失败', error);
            }
        }
    }
    
    /**
     * 等待模块加载完成
     * @param {string} modulePath - 模块路径
     * @param {Object} options - 选项
     * @param {number} options.timeout - 超时时间（毫秒）
     * @param {number} options.interval - 检查间隔（毫秒）
     * @returns {Promise<boolean>} 模块是否加载完成
     */
    static waitLoaded(modulePath, options = {}) {
        const { timeout = 5000, interval = 50 } = options;
        const startTime = Date.now();
        
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this._moduleStatus.get(modulePath) === 'loaded') {
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, interval);
        });
    }
    
    /**
     * 获取模块加载状态
     * @param {string} modulePath - 模块路径
     * @returns {string} 模块状态（'unloaded' | 'loading' | 'loaded' | 'error'）
     */
    static getModuleStatus(modulePath) {
        return this._moduleStatus.get(modulePath) || 'unloaded';
    }
    
    /**
     * 获取所有模块状态
     * @returns {Map} 模块状态映射
     */
    static getAllModuleStatuses() {
        return new Map(this._moduleStatus);
    }
    
    /**
     * 获取模块加载顺序
     * @returns {Array} 模块加载顺序数组
     */
    static getLoadOrder() {
        return [...this._loadOrder];
    }
    
    /**
     * 检查模块是否已加载
     * @param {string} modulePath - 模块路径
     * @returns {boolean} 是否已加载
     */
    static isModuleLoaded(modulePath) {
        return this._moduleStatus.get(modulePath) === 'loaded';
    }
    
    /**
     * 重置依赖管理系统
     */
    static reset() {
        this._dependencies = {};
        this._moduleStatus.clear();
        this._loadOrder = [];
        this._isLoading = false;
        this._isLoaded = false;
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('DependencyConfig', '依赖管理系统已重置');
        }
    }
}

// 自动初始化
DependencyConfig.init();

// 导出依赖管理系统
if (typeof window !== 'undefined') {
    window.DependencyConfig = DependencyConfig;
} else if (typeof globalThis !== 'undefined') {
    globalThis.DependencyConfig = DependencyConfig;
}