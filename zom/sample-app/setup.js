(function(window) {
    'use strict';
    
    const SETUP = {
        pid: null,
        window: null,
        _installContext: null,
        
        __info__: function() {
            return {
                name: 'Setup',
                type: 'GUI',
                version: '1.0.0',
                description: '安装脚本',
                author: 'ZerOS Team',
                copyright: '© 2025',
                permissions: [
                    'GUI_WINDOW_CREATE',
                    'DESKTOP_MANAGE'
                ],
                metadata: {
                    allowMultipleInstances: false
                }
            };
        },
        
        __init__: async function(pid, initArgs) {
            this.pid = pid;
            
            // 从 initArgs.metadata.installContext 获取安装上下文
            if (initArgs && initArgs.metadata && initArgs.metadata.installContext) {
                this._installContext = initArgs.metadata.installContext;
            }
            
            const programName = this._installContext ? this._installContext.programName : 'unknown';
            
            // 创建 GUI 窗口，提供安装选项
            if (typeof GUIManager === 'undefined') {
                throw new Error('GUIManager 不可用');
            }
            
            const guiContainer = initArgs.guiContainer || document.getElementById('gui-container');
            this.window = document.createElement('div');
            this.window.className = 'setup-window zos-gui-window';
            this.window.dataset.pid = pid.toString();
            
            // 注册窗口
            GUIManager.registerWindow(pid, this.window, {
                title: `安装 ${programName}`,
                icon: null,
                onClose: () => {
                    // 窗口关闭处理
                }
            });
            
            // 创建安装选项界面
            this.window.innerHTML = `
                <div class="setup-content">
                    <h1>安装 ${programName}</h1>
                    <p>欢迎安装示例应用程序。</p>
                    <div class="setup-options">
                        <h2>安装选项</h2>
                        <div class="option-item">
                            <input type="checkbox" id="create-desktop-shortcut" checked>
                            <label for="create-desktop-shortcut">创建桌面图标</label>
                        </div>
                        <div class="option-item">
                            <input type="checkbox" id="pin-to-taskbar">
                            <label for="pin-to-taskbar">固定到任务栏</label>
                        </div>
                        <div class="option-item">
                            <input type="checkbox" id="auto-start">
                            <label for="auto-start">系统启动时自动运行</label>
                        </div>
                    </div>
                    <div class="setup-actions">
                        <button id="install-btn" class="primary-btn">安装</button>
                        <button id="cancel-btn">取消</button>
                    </div>
                </div>
            `;
            
            // 添加到容器
            guiContainer.appendChild(this.window);
            
            // 绑定事件
            this._bindEvents();
        },
        
        _bindEvents: function() {
            const installBtn = this.window.querySelector('#install-btn');
            const cancelBtn = this.window.querySelector('#cancel-btn');
            
            if (installBtn) {
                installBtn.addEventListener('click', () => this._handleInstall());
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this._handleCancel());
            }
        },
        
        _handleInstall: async function() {
            // 获取用户选择的选项
            const createDesktopShortcut = this.window.querySelector('#create-desktop-shortcut').checked;
            const pinToTaskbar = this.window.querySelector('#pin-to-taskbar').checked;
            const autoStart = this.window.querySelector('#auto-start').checked;
            
            // 执行安装操作
            if (createDesktopShortcut) {
                // 创建桌面图标（实际实现需要调用相应的 API）
                console.log('创建桌面图标');
            }
            
            if (pinToTaskbar) {
                // 固定到任务栏（实际实现需要调用相应的 API）
                console.log('固定到任务栏');
            }
            
            if (autoStart) {
                // 设置自启动（实际实现需要调用相应的 API）
                console.log('设置自启动');
            }
            
            // 安装完成后关闭窗口
            await this.__exit__();
        },
        
        _handleCancel: async function() {
            // 取消安装并关闭窗口
            await this.__exit__();
        },
        
        __exit__: async function() {
            // 清理资源
            try {
                if (this.window && typeof GUIManager !== 'undefined') {
                    GUIManager.unregisterWindow(this.pid);
                }
                
                // 清理窗口引用
                this.window = null;
            } catch (error) {
                console.error('清理资源失败:', error);
            }
        }
    };
    
    // 重要：必须导出到 window.SETUP，不能使用其他名称
    if (typeof window !== 'undefined') {
        window.SETUP = SETUP;
    }
    
})(window);