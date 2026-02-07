/**
 * WebGames Menu 安装脚本
 * 
 * 专为 ZerOS 系统优化的安装程序，提供完整的安装选项和错误处理
 * 
 * @author mc-yzy15
 * @version 1.0.0
 */

(function(window) {
    'use strict';

    const SETUP_NAME = 'WebGamesMenuSetup';
    const VERSION = '1.0.0';

    /**
     * 安装程序对象
     * 重要：必须命名为 SETUP 并导出到 window.SETUP
     */
    const SETUP = {
        pid: null,
        window: null,
        windowId: null,
        _installContext: null,
        _isInstalling: false,

        /**
         * 程序信息 - ZerOS 必需
         * @returns {Object} 程序信息对象
         */
        __info__: function() {
            return {
                name: SETUP_NAME,
                type: 'GUI',
                version: VERSION,
                description: 'WebGames Menu 安装程序',
                author: 'mc-yzy15',
                copyright: '© 2025 mc-yzy15',
                permissions: [
                    PermissionManager.PERMISSION.GUI_WINDOW_CREATE,
                    PermissionManager.PERMISSION.DESKTOP_MANAGE,
                    PermissionManager.PERMISSION.DESKTOP_SHORTCUT,
                    PermissionManager.PERMISSION.TASKBAR_MANAGE,
                    PermissionManager.PERMISSION.KERNEL_DISK_READ,
                    PermissionManager.PERMISSION.KERNEL_DISK_WRITE,
                    PermissionManager.PERMISSION.LSTORAGE_ACCESS
                ],
                metadata: {
                    allowMultipleInstances: false,
                    supportsPreview: false
                }
            };
        },

        /**
         * 初始化方法 - ZerOS 必需
         * @param {number} pid - 进程ID
         * @param {Object} initArgs - 初始化参数
         */
        __init__: async function(pid, initArgs) {
            this.pid = pid;

            KernelLogger.info(SETUP_NAME, `安装程序初始化，PID: ${pid}`);

            // 获取安装上下文
            if (initArgs && initArgs.metadata && initArgs.metadata.installContext) {
                this._installContext = initArgs.metadata.installContext;
                KernelLogger.info(SETUP_NAME, `安装上下文: ${JSON.stringify({
                    programName: this._installContext.programName,
                    tempDir: this._installContext.tempDir
                })}`);
            }

            // 检查权限
            if (!this._checkPermissions()) {
                this._showError('权限不足', '需要管理员权限才能安装程序');
                return;
            }

            // 创建安装界面
            await this._createSetupUI();
        },

        /**
         * 退出方法 - ZerOS 必需
         */
        __exit__: async function() {
            KernelLogger.info(SETUP_NAME, '安装程序退出');

            if (this.windowId && typeof GUIManager !== 'undefined') {
                GUIManager.unregisterWindow(this.windowId);
            }

            this.pid = null;
            this.window = null;
            this.windowId = null;
            this._installContext = null;
            this._isInstalling = false;
        },

        /**
         * 检查安装权限
         * @returns {boolean}
         */
        _checkPermissions: function() {
            // 检查是否为管理员用户
            if (typeof UserControl !== 'undefined') {
                const currentUser = UserControl.getCurrentUser();
                if (!currentUser || (currentUser.level !== 'ADMIN' && currentUser.level !== 'DEFAULT_ADMIN')) {
                    KernelLogger.error(SETUP_NAME, '非管理员用户尝试安装程序');
                    return false;
                }
            }

            // 检查 APPLICATION_INSTALL 权限
            if (typeof PermissionManager !== 'undefined') {
                const hasPermission = PermissionManager.hasPermission(
                    this.pid, 
                    PermissionManager.PERMISSION.APPLICATION_INSTALL
                );
                if (!hasPermission) {
                    KernelLogger.error(SETUP_NAME, '缺少 APPLICATION_INSTALL 权限');
                    return false;
                }
            }

            return true;
        },

        /**
         * 创建安装界面
         */
        _createSetupUI: async function() {
            if (typeof GUIManager === 'undefined') {
                KernelLogger.error(SETUP_NAME, 'GUIManager 不可用');
                return;
            }

            const programName = this._installContext ? 
                this._installContext.programName : 'WebGamesMenu';

            // 创建窗口容器
            const container = document.createElement('div');
            container.className = 'webgames-setup-container';
            container.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: var(--theme-background-elevated, linear-gradient(135deg, #1a1a2e 0%, #16213e 100%));
                color: var(--theme-text, #fff);
                padding: 30px;
                font-family: 'Segoe UI', sans-serif;
            `;

            // 标题
            const title = document.createElement('h2');
            title.textContent = `安装 ${programName}`;
            title.style.cssText = `
                margin-bottom: 30px;
                background: linear-gradient(45deg, #00d4ff, #7b2cbf);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 1.8rem;
            `;
            container.appendChild(title);

            // 版本信息
            const versionInfo = document.createElement('p');
            versionInfo.textContent = `版本: ${VERSION}`;
            versionInfo.style.cssText = 'color: #888; margin-bottom: 30px; font-size: 0.9rem;';
            container.appendChild(versionInfo);

            // 安装选项
            const optionsContainer = document.createElement('div');
            optionsContainer.style.cssText = `
                width: 100%;
                max-width: 350px;
                margin-bottom: 30px;
            `;

            // 选项1：创建桌面快捷方式
            const desktopOption = this._createCheckbox('createDesktopShortcut', '创建桌面快捷方式', true);
            optionsContainer.appendChild(desktopOption);

            // 选项2：固定到任务栏
            const taskbarOption = this._createCheckbox('pinToTaskbar', '固定到任务栏', true);
            optionsContainer.appendChild(taskbarOption);

            // 选项3：开机自启动
            const autoStartOption = this._createCheckbox('autoStart', '开机自动启动', false);
            optionsContainer.appendChild(autoStartOption);

            container.appendChild(optionsContainer);

            // 进度条（初始隐藏）
            const progressContainer = document.createElement('div');
            progressContainer.id = 'setup-progress-container';
            progressContainer.style.cssText = `
                width: 100%;
                max-width: 350px;
                margin-bottom: 20px;
                display: none;
            `;

            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            `;

            const progressFill = document.createElement('div');
            progressFill.id = 'setup-progress-fill';
            progressFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #7b2cbf);
                transition: width 0.3s ease;
            `;

            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);

            const progressText = document.createElement('p');
            progressText.id = 'setup-progress-text';
            progressText.textContent = '准备安装...';
            progressText.style.cssText = 'text-align: center; margin-top: 10px; font-size: 0.9rem; color: #888;';
            progressContainer.appendChild(progressText);

            container.appendChild(progressContainer);

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 15px;';

            // 安装按钮
            const installBtn = document.createElement('button');
            installBtn.textContent = '安装';
            installBtn.id = 'setup-install-btn';
            installBtn.style.cssText = `
                background: linear-gradient(45deg, #00d4ff, #7b2cbf);
                border: none;
                padding: 12px 40px;
                border-radius: 25px;
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            installBtn.onmouseover = () => {
                if (!this._isInstalling) installBtn.style.transform = 'scale(1.05)';
            };
            installBtn.onmouseout = () => installBtn.style.transform = 'scale(1)';
            installBtn.onclick = () => this._performInstall();
            buttonContainer.appendChild(installBtn);

            // 取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.id = 'setup-cancel-btn';
            cancelBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 12px 40px;
                border-radius: 25px;
                color: #fff;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            cancelBtn.onmouseout = () => cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            cancelBtn.onclick = () => this._cancelInstall();
            buttonContainer.appendChild(cancelBtn);

            container.appendChild(buttonContainer);

            // 注册窗口
            const windowInfo = GUIManager.registerWindow(this.pid, container, {
                title: `安装 ${programName}`,
                icon: null,
                width: 450,
                height: 450,
                resizable: false,
                onClose: () => this._cancelInstall()
            });

            this.window = container;
            this.windowId = windowInfo ? windowInfo.id : this.pid;
        },

        /**
         * 创建复选框
         * @param {string} id - 复选框ID
         * @param {string} label - 标签文本
         * @param {boolean} checked - 默认选中状态
         * @returns {HTMLElement} 复选框容器
         */
        _createCheckbox: function(id, label, checked) {
            const container = document.createElement('label');
            container.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                cursor: pointer;
                font-size: 0.95rem;
                color: var(--theme-text, #fff);
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = checked;
            checkbox.style.cssText = `
                width: 18px;
                height: 18px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #00d4ff;
            `;

            const labelText = document.createElement('span');
            labelText.textContent = label;

            container.appendChild(checkbox);
            container.appendChild(labelText);

            return container;
        },

        /**
         * 执行安装
         */
        _performInstall: async function() {
            if (this._isInstalling) return;
            this._isInstalling = true;

            const programName = this._installContext ? 
                this._installContext.programName : 'WebGamesMenu';

            const createDesktopShortcut = document.getElementById('createDesktopShortcut').checked;
            const pinToTaskbar = document.getElementById('pinToTaskbar').checked;
            const autoStart = document.getElementById('autoStart').checked;

            // 禁用按钮
            const installBtn = document.getElementById('setup-install-btn');
            const cancelBtn = document.getElementById('setup-cancel-btn');
            if (installBtn) installBtn.disabled = true;
            if (cancelBtn) cancelBtn.disabled = true;

            // 显示进度条
            const progressContainer = document.getElementById('setup-progress-container');
            if (progressContainer) progressContainer.style.display = 'block';

            try {
                // 步骤1：创建桌面快捷方式
                this._updateProgress(25, '创建桌面快捷方式...');
                if (createDesktopShortcut) {
                    await this._createDesktopShortcut(programName);
                    await this._sleep(300);
                }

                // 步骤2：固定到任务栏
                this._updateProgress(50, '固定到任务栏...');
                if (pinToTaskbar) {
                    await this._pinToTaskbar(programName);
                    await this._sleep(300);
                }

                // 步骤3：设置开机自启动
                this._updateProgress(75, '配置启动选项...');
                if (autoStart) {
                    await this._setAutoStart(programName);
                    await this._sleep(300);
                }

                // 完成
                this._updateProgress(100, '安装完成！');
                KernelLogger.info(SETUP_NAME, '安装完成');

                // 显示成功消息
                this._showSuccess('安装成功', `${programName} 已成功安装`);

                // 延迟关闭
                setTimeout(() => {
                    this.__exit__();
                }, 2000);

            } catch (error) {
                KernelLogger.error(SETUP_NAME, '安装失败', error);
                this._showError('安装失败', error.message || '未知错误');
                this._isInstalling = false;
                
                // 恢复按钮
                if (installBtn) installBtn.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
            }
        },

        /**
         * 更新进度条
         * @param {number} percent - 进度百分比
         * @param {string} text - 进度文本
         */
        _updateProgress: function(percent, text) {
            const progressFill = document.getElementById('setup-progress-fill');
            const progressText = document.getElementById('setup-progress-text');
            
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (progressText) progressText.textContent = text;
        },

        /**
         * 创建桌面快捷方式
         * @param {string} programName - 程序名称
         */
        _createDesktopShortcut: async function(programName) {
            if (typeof DesktopManager === 'undefined') {
                KernelLogger.warn(SETUP_NAME, 'DesktopManager 不可用');
                return;
            }

            try {
                await DesktopManager.createShortcut(programName, {
                    name: 'WebGames Menu',
                    icon: 'icon.svg',
                    description: 'WebGames 游戏菜单'
                });
                KernelLogger.info(SETUP_NAME, '桌面快捷方式创建成功');
            } catch (error) {
                KernelLogger.error(SETUP_NAME, '创建桌面快捷方式失败', error);
                throw error;
            }
        },

        /**
         * 固定到任务栏
         * @param {string} programName - 程序名称
         */
        _pinToTaskbar: async function(programName) {
            if (typeof TaskbarManager === 'undefined') {
                KernelLogger.warn(SETUP_NAME, 'TaskbarManager 不可用');
                return;
            }

            try {
                await TaskbarManager.pinProgram(programName, {
                    name: 'WebGames Menu',
                    icon: 'icon.svg'
                });
                KernelLogger.info(SETUP_NAME, '已固定到任务栏');
            } catch (error) {
                KernelLogger.error(SETUP_NAME, '固定到任务栏失败', error);
                throw error;
            }
        },

        /**
         * 设置开机自启动
         * @param {string} programName - 程序名称
         */
        _setAutoStart: async function(programName) {
            if (typeof LStorage === 'undefined') {
                KernelLogger.warn(SETUP_NAME, 'LStorage 不可用');
                return;
            }

            try {
                const autoStartList = await LStorage.getItem('system/autostart') || [];
                if (!autoStartList.includes(programName)) {
                    autoStartList.push(programName);
                    await LStorage.setItem('system/autostart', autoStartList);
                }
                KernelLogger.info(SETUP_NAME, '开机自启动设置成功');
            } catch (error) {
                KernelLogger.error(SETUP_NAME, '设置开机自启动失败', error);
                throw error;
            }
        },

        /**
         * 取消安装
         */
        _cancelInstall: function() {
            if (this._isInstalling) return;
            KernelLogger.info(SETUP_NAME, '用户取消安装');
            this.__exit__();
        },

        /**
         * 显示成功消息
         * @param {string} title - 标题
         * @param {string} message - 消息内容
         */
        _showSuccess: function(title, message) {
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.show({
                    title: title,
                    message: message,
                    type: 'success'
                });
            }
        },

        /**
         * 显示错误消息
         * @param {string} title - 标题
         * @param {string} message - 消息内容
         */
        _showError: function(title, message) {
            KernelLogger.error(SETUP_NAME, `${title}: ${message}`);
            
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.show({
                    title: title,
                    message: message,
                    type: 'error'
                });
            }
        },

        /**
         * 延时函数
         * @param {number} ms - 毫秒数
         * @returns {Promise}
         */
        _sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // 重要：必须导出到 window.SETUP
    window.SETUP = SETUP;

})(typeof window !== 'undefined' ? window : globalThis);
