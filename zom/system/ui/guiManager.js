/**
 * ZerOS GUI 管理器
 * 负责窗口管理、焦点控制、窗口状态同步等功能
 */

class GUIManager {
    // 窗口映射
    static _windows = new Map();
    
    // 窗口 ID 计数器
    static _windowIdCounter = 1;
    
    // 焦点窗口 ID
    static _focusedWindowId = null;
    
    // 初始化标志
    static _initialized = false;
    
    /**
     * 初始化 GUI 管理器
     */
    static init() {
        if (this._initialized) {
            return;
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('GUIManager', 'GUI 管理器初始化');
        } else {
            console.log('GUIManager 初始化');
        }
        
        // 创建 GUI 容器
        this._createGUIContainer();
        
        this._initialized = true;
    }
    
    /**
     * 创建 GUI 容器
     */
    static _createGUIContainer() {
        let guiContainer = document.getElementById('gui-container');
        if (!guiContainer) {
            guiContainer = document.createElement('div');
            guiContainer.id = 'gui-container';
            guiContainer.style.position = 'fixed';
            guiContainer.style.top = '0';
            guiContainer.style.left = '0';
            guiContainer.style.width = '100%';
            guiContainer.style.height = '100%';
            guiContainer.style.pointerEvents = 'none';
            guiContainer.style.zIndex = '9999';
            document.body.appendChild(guiContainer);
        }
    }
    
    /**
     * 注册窗口
     * @param {number} pid - 进程 ID
     * @param {HTMLElement} windowElement - 窗口元素
     * @param {Object} options - 选项
     * @returns {number} 窗口 ID
     */
    static registerWindow(pid, windowElement, options = {}) {
        if (!this._initialized) {
            throw new Error('GUIManager 未初始化');
        }
        
        const windowId = this._windowIdCounter++;
        
        // 标记窗口元素
        windowElement.dataset.windowId = windowId.toString();
        windowElement.dataset.pid = pid.toString();
        
        // 设置窗口样式
        this._setupWindowStyle(windowElement, options);
        
        // 创建窗口信息
        const windowInfo = {
            windowId,
            pid,
            element: windowElement,
            options,
            title: options.title || '未命名窗口',
            icon: options.icon || null,
            isMaximized: false,
            isMinimized: false,
            zIndex: this._getNextZIndex(),
            position: { x: 100, y: 100 },
            size: { width: 800, height: 600 }
        };
        
        // 添加到窗口映射
        this._windows.set(windowId, windowInfo);
        
        // 添加到 GUI 容器
        const guiContainer = document.getElementById('gui-container');
        if (guiContainer) {
            guiContainer.appendChild(windowElement);
        }
        
        // 设置焦点
        this.focusWindow(windowId);
        
        // 添加窗口事件
        this._addWindowEvents(windowId, windowInfo);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('GUIManager', `已注册窗口: ${windowId}, PID: ${pid}, 标题: ${windowInfo.title}`);
        }
        
        return windowId;
    }
    
    /**
     * 注销窗口
     * @param {number} windowId - 窗口 ID
     * @returns {boolean} 是否成功注销
     */
    static unregisterWindow(windowId) {
        if (!this._initialized) {
            throw new Error('GUIManager 未初始化');
        }
        
        const windowInfo = this._windows.get(windowId);
        if (!windowInfo) {
            return false;
        }
        
        try {
            // 移除窗口事件
            this._removeWindowEvents(windowId, windowInfo);
            
            // 从 GUI 容器移除
            const guiContainer = document.getElementById('gui-container');
            if (guiContainer && windowInfo.element && windowInfo.element.parentElement === guiContainer) {
                guiContainer.removeChild(windowInfo.element);
            }
            
            // 从窗口映射移除
            this._windows.delete(windowId);
            
            // 如果是焦点窗口，清除焦点
            if (this._focusedWindowId === windowId) {
                this._focusedWindowId = null;
            }
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('GUIManager', `已注销窗口: ${windowId}, PID: ${windowInfo.pid}`);
            }
            
            return true;
        } catch (error) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('GUIManager', `注销窗口失败: ${windowId}`, error);
            }
            return false;
        }
    }
    
    /**
     * 设置窗口样式
     * @param {HTMLElement} windowElement - 窗口元素
     * @param {Object} options - 选项
     */
    static _setupWindowStyle(windowElement, options) {
        windowElement.style.position = 'absolute';
        windowElement.style.left = options.left || '100px';
        windowElement.style.top = options.top || '100px';
        windowElement.style.width = options.width || '800px';
        windowElement.style.height = options.height || '600px';
        windowElement.style.backgroundColor = 'var(--theme-background-elevated, rgba(37, 43, 53, 0.98))';
        windowElement.style.border = '1px solid var(--theme-border, rgba(139, 92, 246, 0.3))';
        windowElement.style.borderRadius = '8px';
        windowElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        windowElement.style.display = 'flex';
        windowElement.style.flexDirection = 'column';
        windowElement.style.overflow = 'hidden';
        windowElement.style.pointerEvents = 'auto';
    }
    
    /**
     * 添加窗口事件
     * @param {number} windowId - 窗口 ID
     * @param {Object} windowInfo - 窗口信息
     */
    static _addWindowEvents(windowId, windowInfo) {
        // 点击事件 - 设置焦点
        windowInfo.element.addEventListener('click', () => {
            this.focusWindow(windowId);
        });
        
        // 鼠标按下事件 - 开始拖动
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        const titleBar = windowInfo.element.querySelector('.window-titlebar') || windowInfo.element;
        
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(windowInfo.element.style.left) || 100;
            startTop = parseInt(windowInfo.element.style.top) || 100;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        function onMouseMove(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            windowInfo.element.style.left = (startLeft + deltaX) + 'px';
            windowInfo.element.style.top = (startTop + deltaY) + 'px';
        }
        
        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }
    
    /**
     * 移除窗口事件
     * @param {number} windowId - 窗口 ID
     * @param {Object} windowInfo - 窗口信息
     */
    static _removeWindowEvents(windowId, windowInfo) {
        // 这里简化处理，实际应该移除所有添加的事件监听器
    }
    
    /**
     * 聚焦窗口
     * @param {number} windowId - 窗口 ID
     * @returns {boolean} 是否成功聚焦
     */
    static focusWindow(windowId) {
        const windowInfo = this._windows.get(windowId);
        if (!windowInfo) {
            return false;
        }
        
        // 更新 z-index
        const newZIndex = this._getNextZIndex();
        windowInfo.zIndex = newZIndex;
        windowInfo.element.style.zIndex = newZIndex;
        
        // 更新焦点
        this._focusedWindowId = windowId;
        
        // 添加聚焦样式
        this._windows.forEach((info) => {
            if (info.windowId === windowId) {
                info.element.classList.add('window-focused');
            } else {
                info.element.classList.remove('window-focused');
            }
        });
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.debug('GUIManager', `已聚焦窗口: ${windowId}`);
        }
        
        return true;
    }
    
    /**
     * 获取下一个 z-index
     * @returns {number} z-index 值
     */
    static _getNextZIndex() {
        let maxZIndex = 1000;
        
        this._windows.forEach((windowInfo) => {
            if (windowInfo.zIndex > maxZIndex) {
                maxZIndex = windowInfo.zIndex;
            }
        });
        
        return maxZIndex + 1;
    }
    
    /**
     * 获取窗口信息
     * @param {number} windowId - 窗口 ID
     * @returns {Object|null} 窗口信息
     */
    static getWindowInfo(windowId) {
        return this._windows.get(windowId);
    }
    
    /**
     * 获取指定进程的所有窗口
     * @param {number} pid - 进程 ID
     * @returns {Array} 窗口 ID 数组
     */
    static getWindowsByPid(pid) {
        const windowIds = [];
        
        this._windows.forEach((windowInfo, windowId) => {
            if (windowInfo.pid === pid) {
                windowIds.push(windowId);
            }
        });
        
        return windowIds;
    }
    
    /**
     * 获取所有窗口
     * @returns {Array} 窗口信息数组
     */
    static getAllWindows() {
        return Array.from(this._windows.values());
    }
    
    /**
     * 关闭所有窗口
     */
    static closeAllWindows() {
        const windowIds = Array.from(this._windows.keys());
        
        windowIds.forEach(windowId => {
            this.unregisterWindow(windowId);
        });
    }
    
    /**
     * 显示消息框
     * @param {string} message - 消息
     * @param {string} title - 标题
     * @param {string} type - 类型 (info, warning, error, success)
     * @returns {Promise<boolean>} 用户是否确认
     */
    static showAlert(message, title = '提示', type = 'info') {
        return new Promise((resolve) => {
            const alertElement = document.createElement('div');
            alertElement.className = `zom-alert zom-alert-${type}`;
            alertElement.style.position = 'fixed';
            alertElement.style.top = '50%';
            alertElement.style.left = '50%';
            alertElement.style.transform = 'translate(-50%, -50%)';
            alertElement.style.padding = '20px';
            alertElement.style.backgroundColor = 'var(--theme-background-elevated, rgba(37, 43, 53, 0.98))';
            alertElement.style.border = '1px solid var(--theme-border, rgba(139, 92, 246, 0.3))';
            alertElement.style.borderRadius = '8px';
            alertElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            alertElement.style.zIndex = '99999';
            alertElement.style.pointerEvents = 'auto';
            alertElement.innerHTML = `
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="alert-ok">确定</button>
            `;
            
            document.body.appendChild(alertElement);
            
            const okButton = alertElement.querySelector('.alert-ok');
            okButton.addEventListener('click', () => {
                document.body.removeChild(alertElement);
                resolve(true);
            });
        });
    }
    
    /**
     * 显示权限请求对话框
     * @param {string} programName - 程序名称
     * @param {string} permission - 权限名称
     * @param {string} description - 权限描述
     * @returns {Promise<boolean>} 用户是否授权
     */
    static showPermissionDialog(programName, permission, description) {
        return new Promise((resolve) => {
            const dialogElement = document.createElement('div');
            dialogElement.className = 'zom-permission-dialog';
            dialogElement.style.position = 'fixed';
            dialogElement.style.top = '50%';
            dialogElement.style.left = '50%';
            dialogElement.style.transform = 'translate(-50%, -50%)';
            dialogElement.style.padding = '20px';
            dialogElement.style.backgroundColor = 'var(--theme-background-elevated, rgba(37, 43, 53, 0.98))';
            dialogElement.style.border = '1px solid var(--theme-border, rgba(139, 92, 246, 0.3))';
            dialogElement.style.borderRadius = '8px';
            dialogElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            dialogElement.style.zIndex = '99999';
            dialogElement.style.pointerEvents = 'auto';
            dialogElement.innerHTML = `
                <h3>权限请求</h3>
                <p>程序 <strong>${programName}</strong> 请求以下权限：</p>
                <p><strong>${permission}</strong></p>
                <p>${description}</p>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="perm-deny">拒绝</button>
                    <button class="perm-allow">允许</button>
                </div>
            `;
            
            document.body.appendChild(dialogElement);
            
            const denyButton = dialogElement.querySelector('.perm-deny');
            const allowButton = dialogElement.querySelector('.perm-allow');
            
            denyButton.addEventListener('click', () => {
                document.body.removeChild(dialogElement);
                resolve(false);
            });
            
            allowButton.addEventListener('click', () => {
                document.body.removeChild(dialogElement);
                resolve(true);
            });
        });
    }
}

// 自动初始化
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            GUIManager.init();
        });
    } else {
        GUIManager.init();
    }
}

// 导出 GUI 管理器
if (typeof window !== 'undefined') {
    window.GUIManager = GUIManager;
} else if (typeof globalThis !== 'undefined') {
    globalThis.GUIManager = GUIManager;
}