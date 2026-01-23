/**
 * ZerOS 对象池系统
 * 提供模块间数据共享和通信的统一接口
 */

class POOL {
    // 内部池存储
    static _pools = new Map();
    
    // 初始化标志
    static _initialized = false;
    
    /**
     * 初始化对象池系统
     */
    static init() {
        if (this._initialized) {
            return;
        }
        
        // 创建默认池
        this.__CREATE_POOL__("KERNEL_GLOBAL_POOL");
        this.__CREATE_POOL__("APPLICATION_POOL");
        this.__CREATE_POOL__("APPLICATION_SHARED_POOL");
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('POOL', '对象池系统初始化完成');
        } else {
            console.log('POOL 初始化完成');
        }
        
        this._initialized = true;
    }
    
    /**
     * 创建新的对象池
     * @param {string} poolName - 池名称
     */
    static __CREATE_POOL__(poolName) {
        if (!poolName) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('POOL', '池名称不能为空');
            } else {
                console.error('POOL: 池名称不能为空');
            }
            return;
        }
        
        if (!this._pools.has(poolName)) {
            this._pools.set(poolName, new Map());
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.debug('POOL', `已创建池: ${poolName}`);
            }
        }
    }
    
    /**
     * 销毁对象池
     * @param {string} poolName - 池名称
     */
    static __DESTROY_POOL__(poolName) {
        if (this._pools.has(poolName)) {
            this._pools.delete(poolName);
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.debug('POOL', `已销毁池: ${poolName}`);
            }
        }
    }
    
    /**
     * 设置池中的值
     * @param {string} poolName - 池名称
     * @param {string} key - 键
     * @param {any} value - 值
     */
    static __SET__(poolName, key, value) {
        if (!this._pools.has(poolName)) {
            this.__CREATE_POOL__(poolName);
        }
        
        const pool = this._pools.get(poolName);
        pool.set(key, value);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('POOL', `已设置值: ${poolName}.${key}`);
        }
    }
    
    /**
     * 获取池中的值
     * @param {string} poolName - 池名称
     * @param {string} key - 键
     * @returns {any} 值
     */
    static __GET__(poolName, key) {
        if (!this._pools.has(poolName)) {
            return undefined;
        }
        
        const pool = this._pools.get(poolName);
        const value = pool.get(key);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('POOL', `已获取值: ${poolName}.${key}`);
        }
        
        return value;
    }
    
    /**
     * 删除池中的值
     * @param {string} poolName - 池名称
     * @param {string} key - 键
     */
    static __DELETE__(poolName, key) {
        if (this._pools.has(poolName)) {
            const pool = this._pools.get(poolName);
            pool.delete(key);
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.debug('POOL', `已删除值: ${poolName}.${key}`);
            }
        }
    }
    
    /**
     * 检查池中是否存在键
     * @param {string} poolName - 池名称
     * @param {string} key - 键
     * @returns {boolean} 是否存在
     */
    static __HAS__(poolName, key) {
        if (!this._pools.has(poolName)) {
            return false;
        }
        
        const pool = this._pools.get(poolName);
        return pool.has(key);
    }
    
    /**
     * 清空池中的所有值
     * @param {string} poolName - 池名称
     */
    static __CLEAR__(poolName) {
        if (this._pools.has(poolName)) {
            const pool = this._pools.get(poolName);
            pool.clear();
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.debug('POOL', `已清空池: ${poolName}`);
            }
        }
    }
    
    /**
     * 获取池中的所有键
     * @param {string} poolName - 池名称
     * @returns {Array} 键数组
     */
    static __GET_KEYS__(poolName) {
        if (!this._pools.has(poolName)) {
            return [];
        }
        
        const pool = this._pools.get(poolName);
        return Array.from(pool.keys());
    }
    
    /**
     * 获取池中的所有值
     * @param {string} poolName - 池名称
     * @returns {Array} 值数组
     */
    static __GET_VALUES__(poolName) {
        if (!this._pools.has(poolName)) {
            return [];
        }
        
        const pool = this._pools.get(poolName);
        return Array.from(pool.values());
    }
    
    /**
     * 获取池中的所有键值对
     * @param {string} poolName - 池名称
     * @returns {Array} 键值对数组
     */
    static __GET_ENTRIES__(poolName) {
        if (!this._pools.has(poolName)) {
            return [];
        }
        
        const pool = this._pools.get(poolName);
        return Array.from(pool.entries());
    }
    
    /**
     * 获取池的大小
     * @param {string} poolName - 池名称
     * @returns {number} 大小
     */
    static __SIZE__(poolName) {
        if (!this._pools.has(poolName)) {
            return 0;
        }
        
        const pool = this._pools.get(poolName);
        return pool.size;
    }
    
    /**
     * 检查池是否存在
     * @param {string} poolName - 池名称
     * @returns {boolean} 是否存在
     */
    static __HAS_POOL__(poolName) {
        return this._pools.has(poolName);
    }
    
    /**
     * 获取所有池的名称
     * @returns {Array} 池名称数组
     */
    static __GET_ALL_POOLS__() {
        return Array.from(this._pools.keys());
    }
    
    /**
     * 导出池数据
     * @param {string} poolName - 池名称
     * @returns {Object} 池数据对象
     */
    static __EXPORT_POOL__(poolName) {
        if (!this._pools.has(poolName)) {
            return {};
        }
        
        const pool = this._pools.get(poolName);
        const data = {};
        
        for (const [key, value] of pool.entries()) {
            try {
                // 尝试序列化值
                if (typeof value === 'function') {
                    data[key] = '[Function]';
                } else if (value instanceof Object) {
                    data[key] = JSON.parse(JSON.stringify(value));
                } else {
                    data[key] = value;
                }
            } catch (error) {
                data[key] = '[Serializable Error]';
            }
        }
        
        return data;
    }
    
    /**
     * 导入池数据
     * @param {string} poolName - 池名称
     * @param {Object} data - 要导入的数据
     * @param {boolean} overwrite - 是否覆盖现有数据
     */
    static __IMPORT_POOL__(poolName, data, overwrite = true) {
        if (!this._pools.has(poolName)) {
            this.__CREATE_POOL__(poolName);
        }
        
        const pool = this._pools.get(poolName);
        
        for (const [key, value] of Object.entries(data)) {
            if (overwrite || !pool.has(key)) {
                pool.set(key, value);
            }
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('POOL', `已导入数据到池: ${poolName}`);
        }
    }
}

// 自动初始化
POOL.init();

// 导出对象池系统
if (typeof window !== 'undefined') {
    window.POOL = POOL;
} else if (typeof globalThis !== 'undefined') {
    globalThis.POOL = POOL;
}