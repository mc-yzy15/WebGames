// Games Collection Main Program
// Following ZerOS Program Development Convention
(function(window) {
    'use strict';
    
    const GAMES = {
        pid: null,
        window: null,
        
        /**
         * 程序信息方法
         * @returns {Object} 程序元数据
         */
        __info__: function() {
            return {
                name: 'Games',
                type: 'GUI',
                version: '1.0.0',
                description: 'Collection of web-based games',
                author: 'mc-yzy15',
                copyright: '© 2026',
                permissions: [
                    PermissionManager.PERMISSION.GUI_WINDOW_CREATE,
                    PermissionManager.PERMISSION.DESKTOP_MANAGE,
                    PermissionManager.PERMISSION.PROCESS_CREATE
                ],
                metadata: {
                    allowMultipleInstances: true
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
            
            // 创建GUI窗口
            if (typeof GUIManager === 'undefined') {
                throw new Error('GUIManager is not available');
            }
            
            const guiContainer = ProcessManager.getGUIContainer();
            this.window = document.createElement('div');
            this.window.className = 'games-window zos-gui-window';
            
            // 注册窗口
            const windowInfo = GUIManager.registerWindow(pid, this.window, {
                title: 'Games Collection',
                icon: 'icon.svg',
                onClose: () => {
                    this.__exit__();
                }
            });
            
            // 创建游戏列表界面
            this.window.innerHTML = `
                <div class="games-container">
                    <h1>Games Collection</h1>
                    <div class="games-list">
                        <button class="game-item" data-game="2048">2048</button>
                        <button class="game-item" data-game="minesweeper">Minesweeper</button>
                        <button class="game-item" data-game="snake-eating">Snake</button>
                        <button class="game-item" data-game="stickman-adventure">Stickman Adventure</button>
                        <button class="game-item" data-game="2024-2027WordGames-MS">Word Games</button>
                    </div>
                </div>
            `;
            
            // 添加事件监听器
            this._addEventListeners();
        },
        
        /**
         * 添加事件监听器
         */
        _addEventListeners: function() {
            const gameButtons = this.window.querySelectorAll('.game-item');
            gameButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const gameName = e.target.dataset.game;
                    this._launchGame(gameName);
                });
            });
        },
        
        /**
         * 启动游戏
         * @param {string} gameName - 游戏名称
         */
        _launchGame: function(gameName) {
            // 使用ProcessManager API启动WebViewer程序
            if (typeof ProcessManager === 'undefined') {
                throw new Error('ProcessManager is not available');
            }
            
            // 根据游戏名称构建index.html路径
            const gamePath = `${gameName}/index.html`;
            
            try {
                // 使用ProcessManager.startProgram API启动WebViewer
                // 参数传游戏index.html目录
                ProcessManager.startProgram('WebViewer', {
                    metadata: {
                        gamePath: gamePath
                    }
                });
            } catch (error) {
                console.error('Failed to launch game:', error);
            }
        },
        
        /**
         * 退出方法
         */
        __exit__: async function() {
            // 清理资源
            if (this.window && typeof GUIManager !== 'undefined') {
                GUIManager.unregisterWindow(this.pid);
            }
        }
    };
    
    // 导出程序对象到window
    // ProcessManager会查找window.GAMES来注册程序
    if (typeof window !== 'undefined') {
        window.GAMES = GAMES;
    }
    
})(window);