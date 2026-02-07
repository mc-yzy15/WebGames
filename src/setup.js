/**
 * WebGames Menu 安装脚本
 * 
 * 此脚本在ZOM包安装时执行，提供安装选项界面
 * 
 * @author mc-yzy15
 * @version 1.0.0
 */

(function(window) {
    'use strict';

    // 重要：程序对象必须命名为 SETUP
    const SETUP = {
        pid: null,
        window: null,
        _installContext: null,

        /**
         * 程序信息
         * @returns {Object} 程序信息对象
         */
        __info__: function() {
            return {
                name: 'WebGamesMenuSetup',
                type: 'GUI',
                version: '1.0.0',
                description: 'WebGames Menu 安装程序',
                author: 'mc-yzy15',
                copyright: '© 2025 mc-yzy15',
                permissions: [
                    'GUI_WINDOW_CREATE',
                    'DESKTOP_MANAGE',
                    'DESKTOP_SHORTCUT',
                    'TASKBAR_MANAGE'
                ],
                metadata: {
                    allowMultipleInstances: false
                }
            };
        },

        /**
         * 初始化方法
         * @param {number} pid - 进程ID
         * @param {Object} initArgs - 初始化参数
         */
        __init__: async function(pid, initArgs) {
            this.pid = pid;

            // 获取安装上下文
            if (initArgs && initArgs.metadata && initArgs.metadata.installContext) {
                this._installContext = initArgs.metadata.installContext;
            }

            const programName = this._installContext ? this._installContext.programName : 'WebGamesMenu';

            // 创建安装选项界面
            await this.createSetupUI(programName);
        },

        /**
         * 创建安装选项界面
         * @param {string} programName - 程序名称
         */
        createSetupUI: async function(programName) {
            if (typeof GUIManager === 'undefined') {
                console.error('GUIManager 不可用');
                return;
            }

            const guiContainer = ProcessManager.getGUIContainer();
            
            // 创建窗口
            this.window = document.createElement('div');
            this.window.className = 'setup-window zos-gui-window';
            this.window.style.cssText = `
                width: 400px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 15px;
                padding: 30px;
                color: #fff;
                font-family: 'Segoe UI', sans-serif;
            `;

            // 标题
            const title = document.createElement('h2');
            title.textContent = `安装 ${programName}`;
            title.style.cssText = `
                text-align: center;
                margin-bottom: 25px;
                background: linear-gradient(45deg, #00d4ff, #7b2cbf);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            `;
            this.window.appendChild(title);

            // 安装选项
            const optionsContainer = document.createElement('div');
            optionsContainer.style.cssText = 'margin-bottom: 25px;';

            // 选项1：创建桌面快捷方式
            const desktopOption = this.createCheckbox('createDesktopShortcut', '创建桌面快捷方式', true);
            optionsContainer.appendChild(desktopOption);

            // 选项2：固定到任务栏
            const taskbarOption = this.createCheckbox('pinToTaskbar', '固定到任务栏', true);
            optionsContainer.appendChild(taskbarOption);

            // 选项3：开机自启动
            const autoStartOption = this.createCheckbox('autoStart', '开机自动启动', false);
            optionsContainer.appendChild(autoStartOption);

            this.window.appendChild(optionsContainer);

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center;';

            // 安装按钮
            const installBtn = document.createElement('button');
            installBtn.textContent = '安装';
            installBtn.style.cssText = `
                background: linear-gradient(45deg, #00d4ff, #7b2cbf);
                border: none;
                padding: 12px 35px;
                border-radius: 25px;
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            installBtn.onmouseover = () => installBtn.style.transform = 'scale(1.05)';
            installBtn.onmouseout = () => installBtn.style.transform = 'scale(1)';
            installBtn.onclick = () => this.performInstall();
            buttonContainer.appendChild(installBtn);

            // 取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 12px 35px;
                border-radius: 25px;
                color: #fff;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            cancelBtn.onmouseout = () => cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            cancelBtn.onclick = () => this.cancelInstall();
            buttonContainer.appendChild(cancelBtn);

            this.window.appendChild(buttonContainer);

            // 注册窗口
            const windowInfo = GUIManager.registerWindow(this.pid, this.window, {
                title: `安装 ${programName}`,
                icon: null,
                width: 400,
                height: 300,
                resizable: false,
                onClose: () => this.cancelInstall()
            });

            // 居中显示
            if (windowInfo && windowInfo.element) {
                windowInfo.element.style.position = 'absolute';
                windowInfo.element.style.left = '50%';
                windowInfo.element.style.top = '50%';
                windowInfo.element.style.transform = 'translate(-50%, -50%)';
            }
        },

        /**
         * 创建复选框
         * @param {string} id - 复选框ID
         * @param {string} label - 标签文本
         * @param {boolean} checked - 默认选中状态
         * @returns {HTMLElement} 复选框容器
         */
        createCheckbox: function(id, label, checked) {
            const container = document.createElement('label');
            container.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                cursor: pointer;
                font-size: 0.95rem;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = checked;
            checkbox.style.cssText = `
                width: 18px;
                height: 18px;
                margin-right: 10px;
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
        performInstall: async function() {
            const createDesktopShortcut = document.getElementById('createDesktopShortcut').checked;
            const pinToTaskbar = document.getElementById('pinToTaskbar').checked;
            const autoStart = document.getElementById('autoStart').checked;

            try {
                // 获取程序名称
                const programName = this._installContext ? this._installContext.programName : 'WebGamesMenu';

                // 1. 创建桌面快捷方式
                if (createDesktopShortcut && typeof DesktopManager !== 'undefined') {
                    await DesktopManager.createShortcut(programName, {
                        name: 'WebGames Menu',
                        icon: 'icon.svg',
                        onDoubleClick: () => {
                            ProcessManager.startProgram(programName);
                        }
                    });
                }

                // 2. 固定到任务栏
                if (pinToTaskbar && typeof TaskbarManager !== 'undefined') {
                    await TaskbarManager.pinProgram(programName, {
                        name: 'WebGames Menu',
                        icon: 'icon.svg'
                    });
                }

                // 3. 设置开机自启动
                if (autoStart && typeof LStorage !== 'undefined') {
                    const autoStartList = await LStorage.getItem('system/autostart') || [];
                    if (!autoStartList.includes(programName)) {
                        autoStartList.push(programName);
                        await LStorage.setItem('system/autostart', autoStartList);
                    }
                }

                // 显示安装成功提示
                this.showMessage('安装成功！', 'success');

                // 延迟关闭安装窗口
                setTimeout(() => {
                    this.__exit__();
                }, 1500);

            } catch (error) {
                console.error('安装失败:', error);
                this.showMessage('安装失败: ' + error.message, 'error');
            }
        },

        /**
         * 取消安装
         */
        cancelInstall: function() {
            this.__exit__();
        },

        /**
         * 显示消息
         * @param {string} message - 消息内容
         * @param {string} type - 消息类型 (success/error)
         */
        showMessage: function(message, type) {
            const msgDiv = document.createElement('div');
            msgDiv.textContent = message;
            msgDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 40px;
                border-radius: 10px;
                color: #fff;
                font-weight: 600;
                z-index: 9999;
                background: ${type === 'success' ? 'linear-gradient(45deg, #00d4ff, #7b2cbf)' : 'linear-gradient(45deg, #ff6b6b, #ee5a5a)'};
            `;
            document.body.appendChild(msgDiv);

            setTimeout(() => {
                msgDiv.remove();
            }, 2000);
        },

        /**
         * 退出方法
         */
        __exit__: async function() {
            // 清理资源
            if (this.window && typeof GUIManager !== 'undefined') {
                GUIManager.unregisterWindow(this.pid);
            }

            this.pid = null;
            this.window = null;
            this._installContext = null;
        }
    };

    // 重要：必须导出到 window.SETUP
    if (typeof window !== 'undefined') {
        window.SETUP = SETUP;
    }

})(window);
