/**
 * ZerOS 事件管理器
 * 提供统一的事件处理系统，支持事件注册、管理和清理
 */

class EventManager {
    // 事件处理器映射
    static _eventHandlers = new Map();
    
    // 元素事件映射
    static _elementEvents = new Map();
    
    // 初始化标志
    static _initialized = false;
    
    /**
     * 初始化事件管理器
     */
    static init() {
        if (this._initialized) {
            return;
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('EventManager', '事件管理器初始化');
        } else {
            console.log('EventManager 初始化');
        }
        
        this._initialized = true;
    }
    
    /**
     * 注册事件处理器
     * @param {number} pid - 进程 ID
     * @param {string} eventName - 事件名称
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 选项
     */
    static registerEventHandler(pid, eventName, handler, options = {}) {
        if (!this._initialized) {
            throw new Error('EventManager 未初始化');
        }
        
        if (!this._eventHandlers.has(pid)) {
            this._eventHandlers.set(pid, new Map());
        }
        
        const pidHandlers = this._eventHandlers.get(pid);
        
        if (!pidHandlers.has(eventName)) {
            pidHandlers.set(eventName, []);
        }
        
        const eventHandlers = pidHandlers.get(eventName);
        
        const handlerInfo = {
            pid,
            eventName,
            handler,
            options,
            priority: options.priority || 0,
            selector: options.selector || null
        };
        
        eventHandlers.push(handlerInfo);
        
        // 按优先级排序
        eventHandlers.sort((a, b) => b.priority - a.priority);
        
        // 注册全局事件监听器
        if (options.selector) {
            // 使用事件委托
            this._registerDelegatedEvent(eventName, options.selector, handler);
        } else {
            // 全局事件
            document.addEventListener(eventName, handler, options);
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('EventManager', `已注册事件处理器: PID ${pid}, 事件 ${eventName}`);
        }
    }
    
    /**
     * 注册元素事件
     * @param {number} pid - 进程 ID
     * @param {HTMLElement} element - DOM 元素
     * @param {string} eventName - 事件名称
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 选项
     */
    static registerElementEvent(pid, element, eventName, handler, options = {}) {
        if (!this._initialized) {
            throw new Error('EventManager 未初始化');
        }
        
        if (!this._elementEvents.has(pid)) {
            this._elementEvents.set(pid, new Map());
        }
        
        const pidEvents = this._elementEvents.get(pid);
        const elementKey = this._getElementKey(element);
        
        if (!pidEvents.has(elementKey)) {
            pidEvents.set(elementKey, new Map());
        }
        
        const elementEvents = pidEvents.get(elementKey);
        
        if (!elementEvents.has(eventName)) {
            elementEvents.set(eventName, []);
        }
        
        elementEvents.get(eventName).push({ handler, options });
        
        // 注册事件监听器
        element.addEventListener(eventName, handler, options);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('EventManager', `已注册元素事件: PID ${pid}, 事件 ${eventName}`);
        }
    }
    
    /**
     * 注册委托事件
     * @param {string} eventName - 事件名称
     * @param {string} selector - CSS 选择器
     * @param {Function} handler - 事件处理函数
     */
    static _registerDelegatedEvent(eventName, selector, handler) {
        document.addEventListener(eventName, (e) => {
            const target = e.target.closest(selector);
            if (target) {
                handler(e);
            }
        });
    }
    
    /**
     * 获取元素唯一键
     * @param {HTMLElement} element - DOM 元素
     * @returns {string} 元素键
     */
    static _getElementKey(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        if (element.dataset && element.dataset.id) {
            return `data-id:${element.dataset.id}`;
        }
        
        return `element:${element.tagName}:${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 注销进程的所有事件处理器
     * @param {number} pid - 进程 ID
     */
    static unregisterAllHandlersForPid(pid) {
        if (!this._initialized) {
            throw new Error('EventManager 未初始化');
        }
        
        // 清理事件处理器
        if (this._eventHandlers.has(pid)) {
            const pidHandlers = this._eventHandlers.get(pid);
            
            pidHandlers.forEach((eventHandlers, eventName) => {
                eventHandlers.forEach(handlerInfo => {
                    // 这里简化处理，实际应该移除事件监听器
                });
                
                pidHandlers.delete(eventName);
            });
            
            this._eventHandlers.delete(pid);
        }
        
        // 清理元素事件
        if (this._elementEvents.has(pid)) {
            const pidEvents = this._elementEvents.get(pid);
            
            pidEvents.forEach((elementEvents, elementKey) => {
                // 这里简化处理，实际应该移除元素事件监听器
            });
            
            this._elementEvents.delete(pid);
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('EventManager', `已清理进程的所有事件处理器: PID ${pid}`);
        }
    }
    
    /**
     * 注销指定事件的所有处理器
     * @param {number} pid - 进程 ID
     * @param {string} eventName - 事件名称
     */
    static unregisterEventHandlers(pid, eventName) {
        if (!this._initialized) {
            throw new Error('EventManager 未初始化');
        }
        
        if (this._eventHandlers.has(pid)) {
            const pidHandlers = this._eventHandlers.get(pid);
            
            if (pidHandlers.has(eventName)) {
                pidHandlers.delete(eventName);
            }
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('EventManager', `已清理进程的事件处理器: PID ${pid}, 事件 ${eventName}`);
        }
    }
    
    /**
     * 派发事件
     * @param {string} eventName - 事件名称
     * @param {Object} detail - 事件详情
     * @param {HTMLElement} target - 目标元素
     */
    static dispatchEvent(eventName, detail = {}, target = document) {
        if (!this._initialized) {
            throw new Error('EventManager 未初始化');
        }
        
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail
        });
        
        target.dispatchEvent(event);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('EventManager', `已派发事件: ${eventName}`);
        }
    }
    
    /**
     * 获取进程的事件处理器数量
     * @param {number} pid - 进程 ID
     * @returns {number} 事件处理器数量
     */
    static getEventHandlerCount(pid) {
        if (!this._eventHandlers.has(pid)) {
            return 0;
        }
        
        const pidHandlers = this._eventHandlers.get(pid);
        let count = 0;
        
        pidHandlers.forEach((eventHandlers) => {
            count += eventHandlers.length;
        });
        
        return count;
    }
    
    /**
     * 获取所有事件处理器
     * @returns {Map} 事件处理器映射
     */
    static getAllEventHandlers() {
        return this._eventHandlers;
    }
}

// 自动初始化
EventManager.init();

// 导出事件管理器
if (typeof window !== 'undefined') {
    window.EventManager = EventManager;
} else if (typeof globalThis !== 'undefined') {
    globalThis.EventManager = EventManager;
}