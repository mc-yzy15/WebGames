/**
 * WebGames Menu - ZerOS 游戏菜单程序
 * 
 * 专为 ZerOS 系统优化的游戏菜单，支持完整的 ZerOS API 集成
 * 
 * @author mc-yzy15
 * @version 1.0.0
 * @license MIT
 */

(function(window) {
    'use strict';

    const PROGRAM_NAME = 'WebGamesMenu';
    const VERSION = '1.0.0';

    // 游戏配置 - 使用相对于 ZerOS application 目录的路径
    const GAMES_CONFIG = {
        '2048': {
            name: '2048',
            path: 'D:/application/WebGamesMenu/2048/index.html',
            icon: '🔢',
            description: '数字益智游戏，滑动方块合并相同数字',
            category: 'puzzle'
        },
        'minesweeper': {
            name: '扫雷',
            path: 'D:/application/WebGamesMenu/minesweeper/index.html',
            icon: '💣',
            description: '经典扫雷游戏，找出所有地雷位置',
            category: 'puzzle'
        },
        'snake-eating': {
            name: '贪吃蛇',
            path: 'D:/application/WebGamesMenu/snake-eating/index.html',
            icon: '🐍',
            description: '经典贪吃蛇，挑战你的反应速度',
            category: 'arcade'
        },
        'word': {
            name: '单词句子消消乐',
            path: 'D:/application/WebGamesMenu/word/index.html',
            icon: '📝',
            description: '猜单词游戏，组合单词句子',
            category: 'word'
        }
    };

    // 程序主对象
    const WebGamesMenu = {
        pid: null,
        window: null,
        windowId: null,
        _isZerOSEnv: false,
        _gameWindows: new Map(),

        /**
         * 程序信息 - ZerOS 必需
         * @returns {Object} 程序信息对象
         */
        __info__: function() {
            return {
                name: PROGRAM_NAME,
                type: 'GUI',
                version: VERSION,
                description: 'WebGames 游戏菜单 - 一个集成了多款小游戏的游戏平台',
                author: 'mc-yzy15',
                copyright: '© 2025 mc-yzy15',
                permissions: [
                    PermissionManager.PERMISSION.GUI_WINDOW_CREATE,
                    PermissionManager.PERMISSION.GUI_WINDOW_MANAGE,
                    PermissionManager.PERMISSION.KERNEL_DISK_READ
                ],
                metadata: {
                    allowMultipleInstances: false,
                    supportsPreview: true,
                    category: 'game',
                    autoStart: false
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
            this._isZerOSEnv = this._detectZerOSEnv();

            KernelLogger.info(PROGRAM_NAME, `程序初始化，PID: ${pid}`);

            try {
                // 创建主窗口
                await this._createMainWindow();
                
                // 初始化事件监听
                this._initEventListeners();
                
                // 记录启动日志
                if (typeof ProcessManager !== 'undefined') {
                    ProcessManager.logProcessActivity(pid, '启动游戏菜单');
                }

                KernelLogger.info(PROGRAM_NAME, '菜单初始化完成');
            } catch (error) {
                KernelLogger.error(PROGRAM_NAME, '初始化失败', error);
                throw error;
            }
        },

        /**
         * 退出方法 - ZerOS 必需
         */
        __exit__: async function() {
            KernelLogger.info(PROGRAM_NAME, '程序正在退出...');

            // 关闭所有游戏窗口
            for (const [gameId, windowId] of this._gameWindows) {
                try {
                    if (typeof GUIManager !== 'undefined' && windowId) {
                        GUIManager.unregisterWindow(windowId);
                    }
                } catch (e) {
                    KernelLogger.warn(PROGRAM_NAME, `关闭游戏窗口失败: ${gameId}`, e);
                }
            }
            this._gameWindows.clear();

            // 注销主窗口
            if (this.windowId && typeof GUIManager !== 'undefined') {
                GUIManager.unregisterWindow(this.windowId);
            }

            // 清理资源
            this.pid = null;
            this.window = null;
            this.windowId = null;

            KernelLogger.info(PROGRAM_NAME, '程序已退出');
        },

        /**
         * 检测是否在 ZerOS 环境中
         * @returns {boolean}
         */
        _detectZerOSEnv: function() {
            return typeof ProcessManager !== 'undefined' && 
                   typeof GUIManager !== 'undefined' && 
                   typeof PermissionManager !== 'undefined';
        },

        /**
         * 创建主窗口
         */
        _createMainWindow: async function() {
            if (!this._isZerOSEnv) {
                // 非 ZerOS 环境，使用原生 HTML
                this._initNativeMenu();
                return;
            }

            // ZerOS 环境 - 使用 GUIManager
            const container = document.createElement('div');
            container.className = 'webgames-menu-container';
            container.innerHTML = this._generateMenuHTML();

            // 应用 ZerOS 主题样式
            container.style.cssText = `
                width: 100%;
                height: 100%;
                overflow: auto;
                background: var(--theme-background, linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%));
                color: var(--theme-text, #fff);
            `;

            // 注册窗口
            const windowInfo = GUIManager.registerWindow(this.pid, container, {
                title: '🎮 WebGames',
                icon: 'icon.svg',
                width: 900,
                height: 700,
                minWidth: 600,
                minHeight: 500,
                resizable: true,
                onClose: () => {
                    this.__exit__();
                }
            });

            this.window = container;
            this.windowId = windowInfo ? windowInfo.id : this.pid;

            // 初始化菜单交互
            this._initMenuInteractions(container);
        },

        /**
         * 生成菜单 HTML
         * @returns {string}
         */
        _generateMenuHTML: function() {
            const games = Object.entries(GAMES_CONFIG).map(([id, game]) => `
                <div class="game-card" data-game="${id}">
                    <div class="game-icon">${game.icon}</div>
                    <h3>${game.name}</h3>
                    <p class="game-desc">${game.description}</p>
                    <button class="play-btn" data-game="${id}">开始游戏</button>
                </div>
            `).join('');

            return `
                <div class="menu-container">
                    <header class="menu-header">
                        <h1>🎮 WebGames</h1>
                        <p class="subtitle">选择你喜欢的游戏开始玩</p>
                    </header>
                    <main class="games-grid">
                        ${games}
                    </main>
                    <footer class="menu-footer">
                        <p>© 2025 WebGames by mc-yzy15</p>
                        <div class="social-links">
                            <a href="https://github.com/mc-yzy15/WebGames" target="_blank">GitHub</a>
                            <a href="https://space.bilibili.com/1338637552" target="_blank">Bilibili</a>
                            <a href="https://blog.csdn.net/m0_68339835" target="_blank">CSDN</a>
                        </div>
                    </footer>
                </div>
            `;
        },

        /**
         * 初始化原生菜单（非 ZerOS 环境）
         */
        _initNativeMenu: function() {
            // 原生环境已由 HTML 中的脚本处理
            console.log('WebGames Menu 在浏览器模式下运行');
        },

        /**
         * 初始化菜单交互
         * @param {HTMLElement} container - 容器元素
         */
        _initMenuInteractions: function(container) {
            const cards = container.querySelectorAll('.game-card');
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.classList.contains('play-btn')) {
                        const gameId = e.target.getAttribute('data-game');
                        this.launchGame(gameId);
                    }
                });
            });

            // 键盘快捷键
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.__exit__();
                }
            });
        },

        /**
         * 初始化事件监听
         */
        _initEventListeners: function() {
            if (typeof EventManager !== 'undefined') {
                // 监听系统主题变化
                EventManager.subscribe('theme.changed', (theme) => {
                    this._applyTheme(theme);
                });
            }
        },

        /**
         * 应用主题
         * @param {Object} theme - 主题配置
         */
        _applyTheme: function(theme) {
            if (this.window) {
                // 应用 ZerOS 主题变量
                const root = this.window;
                if (theme && theme.colors) {
                    Object.entries(theme.colors).forEach(([key, value]) => {
                        root.style.setProperty(`--theme-${key}`, value);
                    });
                }
            }
        },

        /**
         * 启动游戏
         * @param {string} gameId - 游戏ID
         */
        launchGame: async function(gameId) {
            const game = GAMES_CONFIG[gameId];
            if (!game) {
                KernelLogger.warn(PROGRAM_NAME, `未知游戏: ${gameId}`);
                return;
            }

            KernelLogger.info(PROGRAM_NAME, `启动游戏: ${game.name}`);

            if (this._isZerOSEnv) {
                await this._launchGameInZerOS(game, gameId);
            } else {
                this._launchGameInBrowser(game);
            }
        },

        /**
         * 在 ZerOS 中启动游戏
         * @param {Object} game - 游戏配置
         * @param {string} gameId - 游戏ID
         */
        _launchGameInZerOS: async function(game, gameId) {
            try {
                // 检查是否已有该游戏的窗口
                if (this._gameWindows.has(gameId)) {
                    const existingWindowId = this._gameWindows.get(gameId);
                    if (typeof GUIManager !== 'undefined') {
                        GUIManager.focusWindow(existingWindowId);
                        KernelLogger.info(PROGRAM_NAME, `聚焦到已有窗口: ${game.name}`);
                        return;
                    }
                }

                // 创建游戏窗口容器
                const gameContainer = document.createElement('div');
                gameContainer.style.cssText = `
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                `;

                // 创建 iframe 加载游戏
                const iframe = document.createElement('iframe');
                iframe.src = game.path;
                iframe.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: #fff;
                `;

                // 错误处理
                iframe.onerror = () => {
                    KernelLogger.error(PROGRAM_NAME, `加载游戏失败: ${game.name}`);
                    gameContainer.innerHTML = `
                        <div style="
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            height: 100%; 
                            color: var(--theme-text, #fff);
                            padding: 20px;
                        ">
                            <h3>无法加载游戏</h3>
                            <p>请确保游戏文件已正确安装</p>
                            <p style="color: #888; font-size: 0.9rem; margin-top: 10px;">
                                路径: ${game.path}
                            </p>
                        </div>
                    `;
                };

                gameContainer.appendChild(iframe);

                // 注册游戏窗口
                const windowInfo = GUIManager.registerWindow(
                    `webgames_${gameId}_${Date.now()}`, 
                    gameContainer, 
                    {
                        title: `${game.icon} ${game.name}`,
                        icon: null,
                        width: 850,
                        height: 700,
                        minWidth: 400,
                        minHeight: 300,
                        resizable: true,
                        onClose: () => {
                            this._gameWindows.delete(gameId);
                            KernelLogger.info(PROGRAM_NAME, `关闭游戏: ${game.name}`);
                        }
                    }
                );

                if (windowInfo && windowInfo.id) {
                    this._gameWindows.set(gameId, windowInfo.id);
                    KernelLogger.info(PROGRAM_NAME, `游戏窗口已创建: ${game.name}`);
                }

            } catch (error) {
                KernelLogger.error(PROGRAM_NAME, `启动游戏失败: ${game.name}`, error);
                if (typeof NotificationManager !== 'undefined') {
                    NotificationManager.show({
                        title: '启动失败',
                        message: `无法启动 ${game.name}`,
                        type: 'error'
                    });
                }
            }
        },

        /**
         * 在浏览器中启动游戏
         * @param {Object} game - 游戏配置
         */
        _launchGameInBrowser: function(game) {
            // 使用相对路径
            const relativePath = game.path.replace('D:/application/WebGamesMenu/', '');
            window.open(relativePath, '_blank');
        }
    };

    // 导出到全局
    window.WebGamesMenu = WebGamesMenu;

    // 为了兼容 ZerOS 的命名查找，同时导出为大写
    window.WEBGAMESMENU = WebGamesMenu;
    window[PROGRAM_NAME.toUpperCase()] = WebGamesMenu;

})(typeof window !== 'undefined' ? window : globalThis);
