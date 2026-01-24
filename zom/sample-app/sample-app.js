(function(window) {
    'use strict';
    
    const PROGRAM_NAME = 'SAMPLE_APP';
    
    const SAMPLE_APP = {
        pid: null,
        window: null,
        
        __init__: async function(pid, initArgs) {
            this.pid = pid;
            
            // 获取 GUI 容器
            const guiContainer = initArgs.guiContainer || document.getElementById('gui-container');
            
            // 创建窗口
            this.window = document.createElement('div');
            this.window.className = 'sample-app-window zos-gui-window';
            this.window.dataset.pid = pid.toString();
            
            // 添加窗口内容
            this.window.innerHTML = `
                <div class="sample-app-content">
                    <h1>示例应用程序</h1>
                    <p>这是一个用于展示如何创建 ZOM 软件包的示例应用程序。</p>
                    <div class="sample-app-features">
                        <h2>功能特点</h2>
                        <ul>
                            <li>标准的 ZerOS GUI 程序结构</li>
                            <li>完整的生命周期管理</li>
                            <li>支持主题变量</li>
                            <li>正确的资源清理</li>
                        </ul>
                    </div>
                    <div class="sample-app-info">
                        <h2>程序信息</h2>
                        <p>名称: sample-app</p>
                        <p>版本: 1.0.0</p>
                        <p>类型: GUI 程序</p>
                    </div>
                </div>
            `;
            
            // 注册到 GUIManager
            if (typeof GUIManager !== 'undefined') {
                GUIManager.registerWindow(pid, this.window, {
                    title: '示例应用',
                    icon: 'application/sample-app/icon.svg',
                    onClose: () => {
                        // onClose 回调只用于执行清理工作，不应调用 unregisterWindow 或 _closeWindow
                        // 窗口关闭流程由 GUIManager 统一管理
                    }
                });
            }
            
            // 添加到容器
            guiContainer.appendChild(this.window);
        },
        
        __exit__: async function() {
            try {
                // 取消注册 GUI 窗口
                if (typeof GUIManager !== 'undefined') {
                    if (this.pid) {
                        await GUIManager.unregisterWindow(this.pid);
                    }
                }
                
                // 清理 DOM 元素
                if (this.window && this.window.parentElement) {
                    this.window.parentElement.removeChild(this.window);
                }
                
                // 清理所有对象引用
                this.window = null;
                
            } catch (error) {
                if (typeof KernelLogger !== 'undefined') {
                    KernelLogger.error("SAMPLE_APP", `清理资源失败: ${error.message}`, error);
                } else {
                    console.error('清理资源失败:', error);
                }
            }
        },
        
        __info__: function() {
            return {
                name: 'sample-app',
                type: 'GUI',
                version: '1.0.0',
                description: '示例应用程序，展示如何创建 ZOM 软件包',
                author: 'ZerOS Team',
                copyright: '© 2025',
                permissions: typeof PermissionManager !== 'undefined' ? [
                    PermissionManager.PERMISSION.GUI_WINDOW_CREATE
                ] : [],
                metadata: {
                    allowMultipleInstances: true
                }
            };
        }
    };
    
    // 导出到全局作用域
    if (typeof window !== 'undefined') {
        window[PROGRAM_NAME] = SAMPLE_APP;
    } else if (typeof globalThis !== 'undefined') {
        globalThis[PROGRAM_NAME] = SAMPLE_APP;
    }
    
})(typeof window !== 'undefined' ? window : globalThis);