/**
 * WebGames Menu - 游戏菜单控制器
 * 
 * 此文件提供游戏菜单的交互功能
 * 支持ZerOS系统集成和普通浏览器运行
 * 
 * @author mc-yzy15
 * @version 1.0.0
 */

(function(window) {
    'use strict';

    // 游戏配置
    const GAMES_CONFIG = {
        '2048': {
            name: '2048',
            path: '../2048/index.html',
            icon: '🔢',
            description: '数字益智游戏'
        },
        'minesweeper': {
            name: '扫雷',
            path: '../minesweeper/index.html',
            icon: '💣',
            description: '经典扫雷游戏'
        },
        'snake-eating': {
            name: '贪吃蛇',
            path: '../snake-eating/index.html',
            icon: '🐍',
            description: '经典贪吃蛇游戏'
        },
        'word': {
            name: '猜单词',
            path: '../2024-2027WordGames-MS/word/index.html',
            icon: '📝',
            description: '猜单词游戏'
        },
        'jvzi': {
            name: '猜字',
            path: '../2024-2027WordGames-MS/jvzi/index.html',
            icon: '🀄',
            description: '中文猜字游戏'
        }
    };

    /**
     * 启动游戏
     * @param {string} gameId - 游戏ID
     */
    function launchGame(gameId) {
        const game = GAMES_CONFIG[gameId];
        if (!game) {
            console.error('未知游戏:', gameId);
            return;
        }

        // 检查是否在ZerOS环境中运行
        if (typeof ProcessManager !== 'undefined' && typeof GUIManager !== 'undefined') {
            // ZerOS环境 - 使用系统API启动
            launchGameInZerOS(game);
        } else {
            // 普通浏览器环境
            launchGameInBrowser(game);
        }
    }

    /**
     * 在ZerOS环境中启动游戏
     * @param {Object} game - 游戏配置对象
     */
    function launchGameInZerOS(game) {
        try {
            // 使用GUIManager创建新窗口
            const gameWindow = document.createElement('div');
            gameWindow.className = 'game-window zos-gui-window';
            gameWindow.style.width = '800px';
            gameWindow.style.height = '600px';
            
            const iframe = document.createElement('iframe');
            iframe.src = game.path;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            
            gameWindow.appendChild(iframe);
            
            // 注册窗口
            if (typeof GUIManager !== 'undefined') {
                GUIManager.registerWindow('webgames_' + Date.now(), gameWindow, {
                    title: game.name,
                    icon: null,
                    width: 800,
                    height: 600,
                    resizable: true
                });
            }
        } catch (error) {
            console.error('ZerOS启动游戏失败:', error);
            // 降级到浏览器方式
            launchGameInBrowser(game);
        }
    }

    /**
     * 在浏览器环境中启动游戏
     * @param {Object} game - 游戏配置对象
     */
    function launchGameInBrowser(game) {
        // 在新标签页打开游戏
        window.open(game.path, '_blank');
    }

    /**
     * 初始化菜单
     */
    function initMenu() {
        // 添加卡片点击效果
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                // 如果点击的是按钮，不处理
                if (e.target.classList.contains('play-btn')) {
                    return;
                }
                // 点击卡片其他区域也启动游戏
                const gameId = this.getAttribute('data-game');
                if (gameId) {
                    launchGame(gameId);
                }
            });
        });

        // 添加键盘导航支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // ESC键可以关闭菜单（如果在ZerOS中）
                if (typeof window.MENU !== 'undefined' && window.MENU.__exit__) {
                    window.MENU.__exit__();
                }
            }
        });

        console.log('WebGames Menu 已初始化');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }

    // 导出到全局
    window.launchGame = launchGame;
    window.GAMES_CONFIG = GAMES_CONFIG;

    // ZerOS程序结构（如果在ZerOS中运行）
    const MENU = {
        pid: null,
        window: null,

        /**
         * 程序信息
         * @returns {Object} 程序信息对象
         */
        __info__: function() {
            return {
                name: 'WebGamesMenu',
                type: 'GUI',
                version: '1.0.0',
                description: 'WebGames游戏菜单',
                author: 'mc-yzy15',
                copyright: '© 2025 mc-yzy15',
                permissions: [
                    'GUI_WINDOW_CREATE',
                    'GUI_WINDOW_MANAGE'
                ],
                metadata: {
                    allowMultipleInstances: false,
                    category: 'game'
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
            console.log('WebGames Menu 已启动，PID:', pid);
            
            // 如果在ZerOS中，可以在这里创建窗口
            if (typeof GUIManager !== 'undefined') {
                // 菜单已经在HTML中定义，这里可以添加额外的初始化
            }
        },

        /**
         * 退出方法
         */
        __exit__: async function() {
            console.log('WebGames Menu 正在关闭');
            
            // 清理资源
            if (typeof GUIManager !== 'undefined' && this.pid) {
                GUIManager.unregisterWindow(this.pid);
            }
            
            this.pid = null;
            this.window = null;
        }
    };

    // 导出MENU对象到全局（供ZerOS使用）
    window.MENU = MENU;

})(window);
