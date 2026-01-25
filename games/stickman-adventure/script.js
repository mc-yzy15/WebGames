// 火柴人冒险游戏 - 优化版本
const StickmanAdventure = (() => {
    // DOM元素
    let canvas, ctx;
    let jumpBtn, attackBtn;
    let healthFill;
    let tutorialBtn, difficultyBtn, levelBtn, exportBtn;
    let tutorialPanel, difficultyPanel, levelPanel;
    let currentLevelEl, scoreEl, difficultyEl;
    let levelGrid;
    let modalCloseBtns;

    // 游戏配置
    const CONFIG = {
        canvasWidth: 800,
        canvasHeight: 500,
        gravity: 0.8,
        playerSpeed: 5,
        playerJumpForce: -15,
        attackDuration: 200,
        enemyRespawnTime: 3000
    };

    // 难度配置
    const DIFFICULTY_CONFIG = {
        easy: {
            enemySpeed: 1.5,
            playerHealth: 150,
            enemyHealth: 1
        },
        medium: {
            enemySpeed: 2.5,
            playerHealth: 100,
            enemyHealth: 1
        },
        hard: {
            enemySpeed: 3.5,
            playerHealth: 75,
            enemyHealth: 1
        }
    };

    // 15个关卡设计，包含多样化的敌人组合和平台布局
    const LEVELS = [
        // 关卡1 - 简单介绍，普通敌人
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 200, y: 380, width: 150, height: 20 },
                { x: 400, y: 300, width: 150, height: 20 },
                { x: 600, y: 220, width: 150, height: 20 }
            ],
            enemies: [
                { x: 600, y: 390, width: 30, height: 50, speed: 1, direction: 1, type: 'normal' },
                { x: 300, y: 310, width: 30, height: 50, speed: 1.5, direction: 1, type: 'normal' }
            ]
        },
        // 关卡2 - 加入跳跃敌人
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 100, y: 380, width: 100, height: 20 },
                { x: 300, y: 310, width: 100, height: 20 },
                { x: 500, y: 240, width: 100, height: 20 },
                { x: 700, y: 170, width: 100, height: 20 }
            ],
            enemies: [
                { x: 500, y: 390, width: 30, height: 50, speed: 1.2, direction: 1, type: 'normal' },
                { x: 200, y: 310, width: 30, height: 50, speed: 1.5, direction: 1, type: 'jumping', velocityY: 0, jumpForce: -12 },
                { x: 600, y: 180, width: 30, height: 50, speed: 1.3, direction: 1, type: 'normal' }
            ]
        },
        // 关卡3 - 加入飞行敌人
        {
            platforms: [
                { x: 0, y: 450, width: 200, height: 50 },
                { x: 300, y: 380, width: 150, height: 20 },
                { x: 550, y: 310, width: 250, height: 20 },
                { x: 100, y: 240, width: 150, height: 20 },
                { x: 400, y: 170, width: 150, height: 20 }
            ],
            enemies: [
                { x: 100, y: 390, width: 30, height: 50, speed: 1.4, direction: 1, type: 'normal' },
                { x: 400, y: 310, width: 30, height: 50, speed: 1.6, direction: 1, type: 'jumping', velocityY: 0, jumpForce: -12 },
                { x: 200, y: 180, width: 30, height: 50, speed: 1.5, direction: 1, type: 'flying', baseY: 180 }
            ]
        },
        // 关卡4 - 加入追踪敌人
        {
            platforms: [
                { x: 0, y: 450, width: 150, height: 50 },
                { x: 250, y: 400, width: 150, height: 20 },
                { x: 500, y: 350, width: 150, height: 20 },
                { x: 700, y: 300, width: 100, height: 20 },
                { x: 150, y: 250, width: 150, height: 20 },
                { x: 400, y: 200, width: 150, height: 20 }
            ],
            enemies: [
                { x: 50, y: 400, width: 30, height: 50, speed: 1.5, direction: 1, type: 'normal' },
                { x: 350, y: 350, width: 30, height: 50, speed: 1.7, direction: 1, type: 'tracking', velocityY: 0 },
                { x: 600, y: 300, width: 30, height: 50, speed: 1.6, direction: 1, type: 'jumping', velocityY: 0, jumpForce: -12 },
                { x: 250, y: 200, width: 30, height: 50, speed: 1.5, direction: 1, type: 'flying', baseY: 200 }
            ]
        },
        // 关卡5 - 加入射手敌人
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 50, y: 380, width: 100, height: 20 },
                { x: 250, y: 310, width: 100, height: 20 },
                { x: 450, y: 240, width: 100, height: 20 },
                { x: 650, y: 170, width: 100, height: 20 },
                { x: 150, y: 100, width: 100, height: 20 }
            ],
            enemies: [
                { x: 100, y: 390, width: 30, height: 50, speed: 1.6, direction: 1, type: 'normal' },
                { x: 350, y: 310, width: 30, height: 50, speed: 1.8, direction: 1, type: 'tracking' },
                { x: 550, y: 240, width: 30, height: 50, speed: 1.5, direction: 1, type: 'shooter' },
                { x: 750, y: 170, width: 30, height: 50, speed: 1.6, direction: 1, type: 'flying' }
            ]
        },
        // 关卡6 - 加入爆炸敌人
        {
            platforms: [
                { x: 0, y: 450, width: 150, height: 50 },
                { x: 300, y: 400, width: 100, height: 20 },
                { x: 550, y: 350, width: 250, height: 20 },
                { x: 100, y: 300, width: 150, height: 20 },
                { x: 400, y: 250, width: 150, height: 20 },
                { x: 250, y: 200, width: 150, height: 20 },
                { x: 600, y: 150, width: 150, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 1.7, direction: 1, type: 'normal' },
                { x: 400, y: 350, width: 30, height: 50, speed: 1.9, direction: 1, type: 'exploder' },
                { x: 200, y: 300, width: 30, height: 50, speed: 1.8, direction: 1, type: 'jumping' },
                { x: 500, y: 250, width: 30, height: 50, speed: 1.7, direction: 1, type: 'shooter' },
                { x: 700, y: 150, width: 30, height: 50, speed: 1.6, direction: 1, type: 'flying' }
            ]
        },
        // 关卡7 - 多样化敌人组合
        {
            platforms: [
                { x: 0, y: 450, width: 200, height: 50 },
                { x: 300, y: 380, width: 150, height: 20 },
                { x: 550, y: 310, width: 250, height: 20 },
                { x: 100, y: 240, width: 150, height: 20 },
                { x: 400, y: 170, width: 150, height: 20 },
                { x: 250, y: 100, width: 150, height: 20 },
                { x: 600, y: 30, width: 150, height: 20 }
            ],
            enemies: [
                { x: 100, y: 390, width: 30, height: 50, speed: 1.8, direction: 1, type: 'normal' },
                { x: 400, y: 310, width: 30, height: 50, speed: 2.0, direction: 1, type: 'tracking' },
                { x: 200, y: 240, width: 30, height: 50, speed: 1.9, direction: 1, type: 'exploder' },
                { x: 500, y: 170, width: 30, height: 50, speed: 1.8, direction: 1, type: 'shooter' },
                { x: 350, y: 100, width: 30, height: 50, speed: 1.7, direction: 1, type: 'jumping' },
                { x: 700, y: 30, width: 30, height: 50, speed: 1.6, direction: 1, type: 'flying' }
            ]
        },
        // 关卡8 - 复杂平台布局
        {
            platforms: [
                { x: 0, y: 450, width: 150, height: 50 },
                { x: 250, y: 400, width: 150, height: 20 },
                { x: 500, y: 350, width: 150, height: 20 },
                { x: 700, y: 300, width: 100, height: 20 },
                { x: 150, y: 250, width: 150, height: 20 },
                { x: 400, y: 200, width: 150, height: 20 },
                { x: 250, y: 150, width: 150, height: 20 },
                { x: 600, y: 100, width: 150, height: 20 }
            ],
            enemies: [
                { x: 50, y: 400, width: 30, height: 50, speed: 1.9, direction: 1, type: 'normal' },
                { x: 350, y: 350, width: 30, height: 50, speed: 2.1, direction: 1, type: 'tracking' },
                { x: 600, y: 300, width: 30, height: 50, speed: 2.0, direction: 1, type: 'jumping' },
                { x: 250, y: 250, width: 30, height: 50, speed: 1.9, direction: 1, type: 'exploder' },
                { x: 500, y: 200, width: 30, height: 50, speed: 1.8, direction: 1, type: 'shooter' },
                { x: 350, y: 150, width: 30, height: 50, speed: 1.7, direction: 1, type: 'flying' }
            ]
        },
        // 关卡9 - 高空平台挑战
        {
            platforms: [
                { x: 0, y: 450, width: 100, height: 50 },
                { x: 200, y: 400, width: 100, height: 20 },
                { x: 400, y: 350, width: 100, height: 20 },
                { x: 600, y: 300, width: 100, height: 20 },
                { x: 100, y: 250, width: 100, height: 20 },
                { x: 300, y: 200, width: 100, height: 20 },
                { x: 500, y: 150, width: 100, height: 20 },
                { x: 200, y: 100, width: 100, height: 20 },
                { x: 400, y: 50, width: 100, height: 20 }
            ],
            enemies: [
                { x: 50, y: 400, width: 30, height: 50, speed: 2.0, direction: 1, type: 'normal' },
                { x: 300, y: 350, width: 30, height: 50, speed: 2.2, direction: 1, type: 'tracking' },
                { x: 500, y: 300, width: 30, height: 50, speed: 2.1, direction: 1, type: 'exploder' },
                { x: 200, y: 250, width: 30, height: 50, speed: 2.0, direction: 1, type: 'jumping' },
                { x: 400, y: 200, width: 30, height: 50, speed: 1.9, direction: 1, type: 'shooter' },
                { x: 300, y: 150, width: 30, height: 50, speed: 1.8, direction: 1, type: 'flying' },
                { x: 500, y: 50, width: 30, height: 50, speed: 1.7, direction: 1, type: 'flying' }
            ]
        },
        // 关卡10 - 最终挑战
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 100, y: 380, width: 100, height: 20 },
                { x: 300, y: 310, width: 100, height: 20 },
                { x: 500, y: 240, width: 100, height: 20 },
                { x: 700, y: 170, width: 100, height: 20 },
                { x: 200, y: 100, width: 100, height: 20 },
                { x: 400, y: 30, width: 100, height: 20 },
                { x: 600, y: -40, width: 100, height: 20 }
            ],
            enemies: [
                { x: 150, y: 390, width: 30, height: 50, speed: 2.1, direction: 1, type: 'normal' },
                { x: 350, y: 310, width: 30, height: 50, speed: 2.3, direction: 1, type: 'tracking' },
                { x: 550, y: 240, width: 30, height: 50, speed: 2.2, direction: 1, type: 'exploder' },
                { x: 750, y: 170, width: 30, height: 50, speed: 2.1, direction: 1, type: 'shooter' },
                { x: 300, y: 100, width: 30, height: 50, speed: 2.0, direction: 1, type: 'jumping' },
                { x: 500, y: 30, width: 30, height: 50, speed: 1.9, direction: 1, type: 'flying' },
                { x: 700, y: -40, width: 30, height: 50, speed: 1.8, direction: 1, type: 'flying' }
            ]
        },
        // 关卡11 - 密集敌人挑战
        {
            platforms: [
                { x: 0, y: 450, width: 400, height: 50 },
                { x: 500, y: 400, width: 300, height: 50 },
                { x: 100, y: 350, width: 200, height: 20 },
                { x: 400, y: 300, width: 200, height: 20 },
                { x: 700, y: 250, width: 100, height: 20 },
                { x: 200, y: 200, width: 150, height: 20 },
                { x: 500, y: 150, width: 150, height: 20 },
                { x: 300, y: 100, width: 150, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 2.0, direction: 1, type: 'normal' },
                { x: 300, y: 400, width: 30, height: 50, speed: 2.1, direction: 1, type: 'exploder' },
                { x: 600, y: 400, width: 30, height: 50, speed: 2.2, direction: 1, type: 'tracking' },
                { x: 200, y: 350, width: 30, height: 50, speed: 1.9, direction: 1, type: 'jumping' },
                { x: 500, y: 300, width: 30, height: 50, speed: 1.8, direction: 1, type: 'shooter' },
                { x: 800, y: 250, width: 30, height: 50, speed: 2.0, direction: -1, type: 'flying' },
                { x: 300, y: 200, width: 30, height: 50, speed: 1.7, direction: 1, type: 'exploder' },
                { x: 600, y: 150, width: 30, height: 50, speed: 1.6, direction: 1, type: 'flying' },
                { x: 400, y: 100, width: 30, height: 50, speed: 1.8, direction: 1, type: 'shooter' }
            ]
        },
        // 关卡12 - 复杂地形
        {
            platforms: [
                { x: 0, y: 450, width: 150, height: 50 },
                { x: 300, y: 420, width: 150, height: 20 },
                { x: 550, y: 390, width: 250, height: 20 },
                { x: 100, y: 360, width: 150, height: 20 },
                { x: 400, y: 330, width: 150, height: 20 },
                { x: 250, y: 300, width: 150, height: 20 },
                { x: 600, y: 270, width: 150, height: 20 },
                { x: 150, y: 240, width: 150, height: 20 },
                { x: 450, y: 210, width: 150, height: 20 },
                { x: 300, y: 180, width: 150, height: 20 },
                { x: 550, y: 150, width: 150, height: 20 },
                { x: 200, y: 120, width: 150, height: 20 },
                { x: 450, y: 90, width: 150, height: 20 },
                { x: 700, y: 60, width: 100, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 1.9, direction: 1, type: 'normal' },
                { x: 400, y: 400, width: 30, height: 50, speed: 2.0, direction: 1, type: 'tracking' },
                { x: 700, y: 390, width: 30, height: 50, speed: 2.1, direction: -1, type: 'exploder' },
                { x: 200, y: 360, width: 30, height: 50, speed: 1.8, direction: 1, type: 'jumping' },
                { x: 500, y: 330, width: 30, height: 50, speed: 1.7, direction: 1, type: 'shooter' },
                { x: 350, y: 300, width: 30, height: 50, speed: 2.0, direction: 1, type: 'exploder' },
                { x: 700, y: 270, width: 30, height: 50, speed: 1.9, direction: -1, type: 'flying' },
                { x: 250, y: 240, width: 30, height: 50, speed: 1.8, direction: 1, type: 'tracking' },
                { x: 550, y: 210, width: 30, height: 50, speed: 1.7, direction: 1, type: 'shooter' },
                { x: 400, y: 180, width: 30, height: 50, speed: 1.6, direction: 1, type: 'flying' },
                { x: 650, y: 150, width: 30, height: 50, speed: 1.9, direction: -1, type: 'flying' },
                { x: 300, y: 120, width: 30, height: 50, speed: 2.0, direction: 1, type: 'jumping' },
                { x: 550, y: 90, width: 30, height: 50, speed: 1.8, direction: 1, type: 'shooter' },
                { x: 800, y: 60, width: 30, height: 50, speed: 2.1, direction: -1, type: 'flying' }
            ]
        },
        // 关卡13 - 高空跳跃挑战
        {
            platforms: [
                { x: 0, y: 450, width: 200, height: 50 },
                { x: 300, y: 400, width: 150, height: 20 },
                { x: 550, y: 350, width: 250, height: 20 },
                { x: 100, y: 300, width: 150, height: 20 },
                { x: 400, y: 250, width: 150, height: 20 },
                { x: 700, y: 200, width: 100, height: 20 },
                { x: 200, y: 150, width: 150, height: 20 },
                { x: 500, y: 100, width: 150, height: 20 },
                { x: 300, y: 50, width: 150, height: 20 },
                { x: 600, y: 0, width: 200, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 2.2, direction: 1, type: 'tracking' },
                { x: 400, y: 400, width: 30, height: 50, speed: 2.3, direction: 1, type: 'exploder' },
                { x: 650, y: 350, width: 30, height: 50, speed: 2.1, direction: 1, type: 'jumping' },
                { x: 200, y: 300, width: 30, height: 50, speed: 2.0, direction: 1, type: 'shooter' },
                { x: 500, y: 250, width: 30, height: 50, speed: 1.9, direction: 1, type: 'flying' },
                { x: 800, y: 200, width: 30, height: 50, speed: 2.2, direction: -1, type: 'flying' },
                { x: 300, y: 150, width: 30, height: 50, speed: 2.1, direction: 1, type: 'tracking' },
                { x: 600, y: 100, width: 30, height: 50, speed: 2.0, direction: 1, type: 'shooter' },
                { x: 400, y: 50, width: 30, height: 50, speed: 1.9, direction: 1, type: 'exploder' },
                { x: 700, y: 0, width: 30, height: 50, speed: 2.2, direction: -1, type: 'flying' }
            ]
        },
        // 关卡14 - 终极敌人组合
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 100, y: 380, width: 200, height: 20 },
                { x: 400, y: 350, width: 200, height: 20 },
                { x: 700, y: 320, width: 100, height: 20 },
                { x: 200, y: 280, width: 150, height: 20 },
                { x: 500, y: 250, width: 150, height: 20 },
                { x: 300, y: 220, width: 150, height: 20 },
                { x: 600, y: 180, width: 150, height: 20 },
                { x: 100, y: 150, width: 150, height: 20 },
                { x: 400, y: 120, width: 150, height: 20 },
                { x: 200, y: 90, width: 150, height: 20 },
                { x: 500, y: 60, width: 150, height: 20 },
                { x: 300, y: 30, width: 150, height: 20 },
                { x: 600, y: 0, width: 200, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 2.3, direction: 1, type: 'tracking' },
                { x: 300, y: 400, width: 30, height: 50, speed: 2.4, direction: 1, type: 'exploder' },
                { x: 500, y: 400, width: 30, height: 50, speed: 2.5, direction: 1, type: 'normal' },
                { x: 700, y: 400, width: 30, height: 50, speed: 2.2, direction: -1, type: 'tracking' },
                { x: 200, y: 380, width: 30, height: 50, speed: 2.1, direction: 1, type: 'shooter' },
                { x: 500, y: 350, width: 30, height: 50, speed: 2.0, direction: 1, type: 'jumping' },
                { x: 800, y: 320, width: 30, height: 50, speed: 2.3, direction: -1, type: 'flying' },
                { x: 300, y: 280, width: 30, height: 50, speed: 2.2, direction: 1, type: 'exploder' },
                { x: 600, y: 250, width: 30, height: 50, speed: 2.1, direction: 1, type: 'shooter' },
                { x: 400, y: 220, width: 30, height: 50, speed: 2.0, direction: 1, type: 'tracking' },
                { x: 700, y: 180, width: 30, height: 50, speed: 2.3, direction: -1, type: 'flying' },
                { x: 200, y: 150, width: 30, height: 50, speed: 2.2, direction: 1, type: 'jumping' },
                { x: 500, y: 120, width: 30, height: 50, speed: 2.1, direction: 1, type: 'exploder' },
                { x: 300, y: 90, width: 30, height: 50, speed: 2.0, direction: 1, type: 'shooter' },
                { x: 600, y: 60, width: 30, height: 50, speed: 2.3, direction: 1, type: 'flying' },
                { x: 400, y: 30, width: 30, height: 50, speed: 2.2, direction: 1, type: 'tracking' },
                { x: 700, y: 0, width: 30, height: 50, speed: 2.1, direction: 1, type: 'flying' }
            ]
        },
        // 关卡15 - 最终决战
        {
            platforms: [
                { x: 0, y: 450, width: 800, height: 50 },
                { x: 200, y: 350, width: 400, height: 20 },
                { x: 0, y: 250, width: 200, height: 20 },
                { x: 600, y: 250, width: 200, height: 20 },
                { x: 300, y: 150, width: 200, height: 20 },
                { x: 100, y: 50, width: 150, height: 20 },
                { x: 550, y: 50, width: 150, height: 20 }
            ],
            enemies: [
                { x: 100, y: 400, width: 30, height: 50, speed: 2.5, direction: 1, type: 'tracking' },
                { x: 300, y: 400, width: 30, height: 50, speed: 2.6, direction: 1, type: 'exploder' },
                { x: 500, y: 400, width: 30, height: 50, speed: 2.7, direction: 1, type: 'normal' },
                { x: 700, y: 400, width: 30, height: 50, speed: 2.5, direction: -1, type: 'tracking' },
                { x: 300, y: 350, width: 30, height: 50, speed: 2.4, direction: 1, type: 'shooter' },
                { x: 500, y: 350, width: 30, height: 50, speed: 2.3, direction: 1, type: 'jumping' },
                { x: 100, y: 250, width: 30, height: 50, speed: 2.6, direction: 1, type: 'exploder' },
                { x: 700, y: 250, width: 30, height: 50, speed: 2.5, direction: -1, type: 'shooter' },
                { x: 400, y: 150, width: 30, height: 50, speed: 2.4, direction: 1, type: 'tracking' },
                { x: 200, y: 50, width: 30, height: 50, speed: 2.3, direction: 1, type: 'flying' },
                { x: 650, y: 50, width: 30, height: 50, speed: 2.6, direction: -1, type: 'flying' }
            ]
        }
    ];

    // 游戏状态
    let state = {
        player: {
            x: 100,
            y: 350,
            width: 40,
            height: 60,
            velocityX: 0,
            velocityY: 0,
            speed: CONFIG.playerSpeed,
            jumpForce: CONFIG.playerJumpForce,
            gravity: CONFIG.gravity,
            isJumping: false,
            doubleJumped: false,
            health: 100,
            maxHealth: 100,
            isAttacking: false,
            attackType: 'normal',
            attackTimer: null,
            attackCooldown: 0,
            attackPower: 1,
            powerUpTimer: null,
            facingDirection: 1,
            comboCount: 0,
            comboTimer: null,
            invincibilityFrames: 0,
            lastDamageTime: 0
        },
        platforms: [],
        enemies: [],
        props: [],
        particles: [],
        keys: {},
        gameRunning: true,
        lastTime: 0,
        animationId: null,
        currentLevel: 0,
        score: 0,
        difficulty: 'easy',
        completedLevels: [0],
        gameState: 'playing',
        attackEffects: [],
        enemyEffects: []
    };

    // 优化的对象池，减少内存分配
    const objectPools = {
        particles: [],
        attackEffects: [],
        enemyEffects: [],
        bullets: []
    };

    // 预分配对象池初始容量，减少动态扩展
    function initializeObjectPools() {
        // 预分配粒子对象
        for (let i = 0; i < 100; i++) {
            objectPools.particles.push({
                x: 0, y: 0, vx: 0, vy: 0, size: 0, color: '', life: 0, maxLife: 0, alpha: 0
            });
        }

        // 预分配攻击效果对象
        for (let i = 0; i < 50; i++) {
            objectPools.attackEffects.push({
                x: 0, y: 0, width: 0, height: 0, type: '', timer: 0, duration: 0, scale: 0, alpha: 0
            });
        }

        // 预分配敌人效果对象
        for (let i = 0; i < 30; i++) {
            objectPools.enemyEffects.push({
                x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: ''
            });
        }

        // 预分配子弹对象（用于敌人和道具）
        for (let i = 0; i < 200; i++) {
            objectPools.bullets.push({
                x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: '',
                speed: 0, health: 0, maxHealth: 0, attackDamage: 0, attackRange: 0,
                attackCooldown: 0, lastAttackCooldown: 0, hitStun: 0, isHit: false,
                direction: 0, state: '', patrolPoints: [], patrolIndex: 0,
                targetX: 0, targetY: 0, patrolPath: [], patrolIndex: 0,
                searchAngle: 0, searchRadius: 0, orbitRadius: 0, attackPhase: 0,
                attackTimer: 0, fuseTime: 0, explosionRadius: 0, explosionDamage: 0,
                collected: false, pulseTimer: 0, rotation: 0, rotationSpeed: 0, spawnTime: 0,
                wanderTimer: 0, wanderDirection: 0, explosionTimer: 0, isBlinking: false
            });
        }
    }

    // 优化的对象池管理函数，使用更高效的对象复用
    function getObjectFromPool(pool, type) {
        if (pool.length > 0) {
            const obj = pool.pop();
            // 优化：重置对象状态，避免内存泄漏
            resetObjectState(obj, type);
            return obj;
        }

        // 如果池子为空，创建新对象（但尽量避免这种情况）
        return createNewObject(type);
    }

    // 优化：重置对象状态的辅助函数
    function resetObjectState(obj, type) {
        // 优化：批量重置对象属性，减少重复操作
        const resetProps = ['x', 'y', 'vx', 'vy', 'width', 'height', 'velocityX', 'velocityY', 
                           'damage', 'life', 'maxLife', 'alpha', 'timer', 'duration', 'scale'];
        
        for (let i = 0; i < resetProps.length; i++) {
            obj[resetProps[i]] = 0;
        }
        
        // 根据对象类型重置特定属性
        switch (type) {
            case 'particle':
                obj.color = '';
                obj.size = 0;
                break;
            case 'attackEffect':
                obj.type = '';
                obj.scale = 0;
                obj.alpha = 0;
                break;
            case 'enemyEffect':
                obj.type = '';
                break;
            case 'bullet':
                obj.type = '';
                obj.speed = 0;
                obj.health = 0;
                obj.maxHealth = 0;
                obj.attackDamage = 0;
                obj.attackRange = 0;
                obj.attackCooldown = 0;
                obj.lastAttackCooldown = 0;
                obj.hitStun = 0;
                obj.isHit = false;
                obj.direction = 0;
                obj.state = '';
                obj.patrolPoints = [];
                obj.patrolIndex = 0;
                obj.targetX = 0;
                obj.targetY = 0;
                obj.patrolPath = [];
                obj.patrolIndex = 0;
                obj.searchAngle = 0;
                obj.searchRadius = 0;
                obj.orbitRadius = 0;
                obj.attackPhase = 0;
                obj.attackTimer = 0;
                obj.fuseTime = 0;
                obj.explosionRadius = 0;
                obj.explosionDamage = 0;
                obj.collected = false;
                obj.pulseTimer = 0;
                obj.rotation = 0;
                obj.rotationSpeed = 0;
                obj.spawnTime = 0;
                obj.wanderTimer = 0;
                obj.wanderDirection = 0;
                obj.explosionTimer = 0;
                obj.isBlinking = false;
                break;
        }
    }

    // 优化：创建新对象的辅助函数
    function createNewObject(type) {
        switch (type) {
            case 'particle':
                return { x: 0, y: 0, vx: 0, vy: 0, size: 0, color: '', life: 0, maxLife: 0, alpha: 0 };
            case 'attackEffect':
                return { x: 0, y: 0, width: 0, height: 0, type: '', timer: 0, duration: 0, scale: 0, alpha: 0 };
            case 'enemyEffect':
                return { x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: '' };
            case 'bullet':
                return createBulletObject();
            default:
                return {};
        }
    }

    // 优化：创建子弹对象的专用函数
    function createBulletObject() {
        return {
            x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: '',
            speed: 0, health: 0, maxHealth: 0, attackDamage: 0, attackRange: 0,
            attackCooldown: 0, lastAttackCooldown: 0, hitStun: 0, isHit: false,
            direction: 0, state: '', patrolPoints: [], patrolIndex: 0,
            targetX: 0, targetY: 0, patrolPath: [], patrolIndex: 0,
            searchAngle: 0, searchRadius: 0, orbitRadius: 0, attackPhase: 0,
            attackTimer: 0, fuseTime: 0, explosionRadius: 0, explosionDamage: 0,
            collected: false, pulseTimer: 0, rotation: 0, rotationSpeed: 0, spawnTime: 0,
            wanderTimer: 0, wanderDirection: 0, explosionTimer: 0, isBlinking: false
        };
    }

    function releaseObjectToPool(pool, obj) {
        // 重置对象状态，避免内存泄漏
        for (let key in obj) {
            if (key !== 'x' && key !== 'y' && key !== 'velocityX' && key !== 'velocityY') {
                obj[key] = 0;
            }
        }

        // 限制池子大小，防止内存泄漏
        const maxPoolSize = pool === objectPools.particles ? 200 :
            pool === objectPools.attackEffects ? 100 :
                pool === objectPools.enemyEffects ? 60 : 200;

        if (pool.length < maxPoolSize) {
            pool.push(obj);
        }
    }

    // 初始化游戏
    function initGame() {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        jumpBtn = document.getElementById('jumpBtn');
        attackBtn = document.getElementById('attackBtn');
        healthFill = document.querySelector('.health-progress');

        tutorialBtn = document.getElementById('tutorialBtn');
        difficultyBtn = document.getElementById('difficultyBtn');
        levelBtn = document.getElementById('levelBtn');
        exportBtn = document.getElementById('exportBtn');

        tutorialPanel = document.getElementById('tutorialPanel');
        difficultyPanel = document.getElementById('difficultyPanel');
        levelPanel = document.getElementById('levelPanel');

        currentLevelEl = document.getElementById('currentLevel');
        scoreEl = document.getElementById('score');
        difficultyEl = document.getElementById('difficulty');

        levelGrid = document.getElementById('levelGrid');
        modalCloseBtns = document.querySelectorAll('.close');

        canvas.width = CONFIG.canvasWidth;
        canvas.height = CONFIG.canvasHeight;

        // 初始化对象池
        initializeObjectPools();

        loadLevel(state.currentLevel);
        setupEventListeners();
        setupModalListeners();
        generateLevelButtons();
        addSaveLoadButtons();

        state.lastTime = performance.now();
        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 加载关卡
    function loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) return;

        state.currentLevel = levelIndex;
        state.gameState = 'playing';

        state.player.x = 100;
        state.player.y = 350;
        state.player.velocityX = 0;
        state.player.velocityY = 0;
        state.player.isJumping = false;
        state.player.doubleJumped = false;
        state.player.health = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        state.player.maxHealth = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        state.player.isAttacking = false;
        state.player.attackPower = 1;
        state.player.comboCount = 0;
        state.player.invincibilityFrames = 0;

        if (state.player.powerUpTimer) {
            clearTimeout(state.player.powerUpTimer);
            state.player.powerUpTimer = null;
        }
        if (state.player.comboTimer) {
            clearTimeout(state.player.comboTimer);
            state.player.comboTimer = null;
        }

        state.platforms = JSON.parse(JSON.stringify(LEVELS[levelIndex].platforms));
        // 使用对象池管理敌人数组
        state.enemies = [];

        const difficultyMultiplier = {
            easy: 0.8,
            medium: 1.0,
            hard: 1.3
        }[state.difficulty] || 1.0;

        // 预分配敌人对象到池子中
        const levelEnemies = LEVELS[levelIndex].enemies;
        for (let i = 0; i < levelEnemies.length; i++) {
            const enemy = getObjectFromPool(objectPools.bullets, 'bullet');
            Object.assign(enemy, levelEnemies[i]);
            enemy.speed *= DIFFICULTY_CONFIG[state.difficulty].enemySpeed * difficultyMultiplier;
            enemy.health = Math.round((enemy.health || 100) * difficultyMultiplier);
            enemy.maxHealth = enemy.health;
            enemy.attackDamage = (enemy.attackDamage || 10) * difficultyMultiplier;
            enemy.attackRange = (enemy.attackRange || 80) * difficultyMultiplier;
            state.enemies.push(enemy);
        }

        spawnProps(levelIndex);
        state.particles = [];
        state.attackEffects = [];
        state.enemyEffects = [];

        updateUI();
        updateHealthBar();
    }

    // 生成道具
    function spawnProps(levelIndex) {
        state.props = [];

        const basePropCount = Math.min(Math.floor(levelIndex / 2) + 2, 5);
        const difficultyMultiplier = {
            easy: 1.3,
            medium: 1.1,
            hard: 0.9
        }[state.difficulty] || 1.0;
        const propCount = Math.max(1, Math.round(basePropCount * difficultyMultiplier));

        const propTypes = ['health', 'powerup', 'invincibility', 'speedboost', 'shield', 'combo', 'timefreeze', 'bombdrop'];

        for (let i = 0; i < propCount; i++) {
            let propType;
            const rand = Math.random();

            if (levelIndex < 3) {
                if (rand < 0.6) {
                    propType = 'health';
                } else if (rand < 0.9) {
                    propType = 'powerup';
                } else {
                    propType = propTypes[Math.floor(Math.random() * propTypes.length)];
                }
            } else if (levelIndex < 7) {
                if (rand < 0.4) {
                    propType = 'health';
                } else if (rand < 0.65) {
                    propType = 'powerup';
                } else if (rand < 0.85) {
                    propType = ['invincibility', 'speedboost'][Math.floor(Math.random() * 2)];
                } else {
                    propType = propTypes[Math.floor(Math.random() * propTypes.length)];
                }
            } else {
                const advancedProps = ['invincibility', 'speedboost', 'shield', 'combo', 'timefreeze', 'bombdrop'];
                if (rand < 0.25) {
                    propType = 'health';
                } else if (rand < 0.5) {
                    propType = 'powerup';
                } else {
                    propType = advancedProps[Math.floor(Math.random() * advancedProps.length)];
                }
            }

            const platformIndex = Math.floor(Math.random() * (state.platforms.length - 1)) + 1;
            const platform = state.platforms[platformIndex];

            const prop = getObjectFromPool(objectPools.bullets, 'bullet');
            prop.x = platform.x + Math.random() * (platform.width - 25);
            prop.y = platform.y - 35;
            prop.width = 25;
            prop.height = 25;
            prop.type = propType;
            prop.collected = false;
            prop.pulseTimer = 0;
            prop.rotation = Math.random() * Math.PI * 2;
            prop.rotationSpeed = (Math.random() - 0.5) * 0.1;
            prop.spawnTime = state.lastTime;

            state.props.push(prop);
        }
    }

    // 优化的道具更新函数，使用对象池释放机制
    function updateProps() {
        for (let i = 0; i < state.props.length; i++) {
            const prop = state.props[i];
            if (!prop.collected) {
                prop.pulseTimer += 0.05;

                if (
                    state.player.x < prop.x + prop.width &&
                    state.player.x + state.player.width > prop.x &&
                    state.player.y < prop.y + prop.height &&
                    state.player.y + state.player.height > prop.y
                ) {
                    collectProp(prop);
                }
            }
        }
    }

    // 优化的收集道具函数，使用对象池释放机制
    function collectProp(prop) {
        prop.collected = true;

        addParticles(prop.x + prop.width / 2, prop.y + prop.height / 2, 20, '#ffff00', 6);

        switch (prop.type) {
            case 'health':
                const healthRestore = 40;
                state.player.health = Math.min(state.player.health + healthRestore, state.player.maxHealth);
                updateHealthBar();
                state.score += 15;
                break;
            case 'powerup':
                state.player.attackPower = 2.8;
                if (state.player.powerUpTimer) {
                    clearTimeout(state.player.powerUpTimer);
                }
                state.player.powerUpTimer = setTimeout(() => {
                    state.player.attackPower = 1;
                }, 7000);
                state.score += 25;
                break;
            case 'invincibility':
                state.player.invincibilityFrames = 700;
                state.score += 40;
                break;
            case 'speedboost':
                const originalSpeed = state.player.speed;
                state.player.speed *= 1.6;
                setTimeout(() => {
                    state.player.speed = originalSpeed;
                }, 5500);
                state.score += 30;
                break;
            case 'shield':
                state.player.shield = (state.player.shield || 0) + 50;
                state.player.maxShield = Math.max(state.player.maxShield || 0, state.player.shield);
                state.score += 35;
                break;
            case 'combo':
                state.player.comboCount += 5;
                state.score += 50;
                break;
            case 'timefreeze':
                state.timeFrozen = true;
                state.timeFreezeTimer = 300;
                state.score += 45;
                break;
            case 'bombdrop':
                dropBomb();
                state.score += 35;
                break;
        }

        // 将道具对象释放回对象池
        releaseObjectToPool(objectPools.bullets, prop);

        updateUI();
    }

    // 优化的炸弹投掷系统，使用对象池管理
    function dropBomb() {
        const bomb = getObjectFromPool(objectPools.bullets, 'bullet');
        bomb.x = state.player.x + state.player.width / 2 - 15;
        bomb.y = state.player.y;
        bomb.width = 30;
        bomb.height = 30;
        bomb.type = 'bomb';
        bomb.timer = 0;
        bomb.fuseTime = 60;
        bomb.explosionRadius = 120;
        bomb.explosionDamage = 35;

        state.props.push(bomb);
    }

    // 更新炸弹
    function updateBombs() {
        state.props.forEach((prop, index) => {
            if (prop.type === 'bomb') {
                prop.timer++;

                if (prop.timer >= prop.fuseTime) {
                    explodeBomb(prop, index);
                } else {
                    prop.y += 5;

                    let hitGround = false;
                    state.platforms.forEach(platform => {
                        if (
                            prop.x < platform.x + platform.width &&
                            prop.x + prop.width > platform.x &&
                            prop.y + prop.height > platform.y &&
                            prop.y + prop.height < platform.y + 15
                        ) {
                            prop.y = platform.y - prop.height;
                            hitGround = true;
                        }
                    });

                    if (hitGround) {
                        prop.fuseTime = Math.min(prop.fuseTime, prop.timer + 20);
                    }
                }
            }
        });
    }

    // 优化的炸弹爆炸函数，使用对象池释放机制
    function explodeBomb(prop, index) {
        addParticles(prop.x + prop.width / 2, prop.y + prop.height / 2, 60, '#ff6600', 18);
        addParticles(prop.x + prop.width / 2, prop.y + prop.height / 2, 40, '#ff0000', 22);

        const enemiesToRemove = [];
        const enemiesToRelease = [];

        state.enemies.forEach((enemy, enemyIndex) => {
            const dx = enemy.x + enemy.width / 2 - (prop.x + prop.width / 2);
            const dy = enemy.y + enemy.height / 2 - (prop.y + prop.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < prop.explosionRadius) {
                const damageMultiplier = 1 - (distance / prop.explosionRadius);
                const finalDamage = Math.round(prop.explosionDamage * damageMultiplier);
                enemy.health -= finalDamage;

                const knockbackForce = 6 * damageMultiplier;
                enemy.velocityX = (enemy.x - prop.x) > 0 ? knockbackForce : -knockbackForce;
                enemy.velocityY = -knockbackForce * 0.5;

                if (enemy.health <= 0) {
                    addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 25, '#ff0000', 12);
                    enemiesToRemove.push(enemyIndex);
                    enemiesToRelease.push(enemy);
                }
            }
        });

        // 从后往前删除敌人，避免索引问题
        for (let i = enemiesToRemove.length - 1; i >= 0; i--) {
            state.enemies.splice(enemiesToRemove[i], 1);
        }

        // 将敌人对象释放回对象池
        for (let i = 0; i < enemiesToRelease.length; i++) {
            releaseObjectToPool(objectPools.bullets, enemiesToRelease[i]);
        }

        // 将炸弹对象释放回对象池
        releaseObjectToPool(objectPools.bullets, prop);

        state.props.splice(index, 1);
        checkLevelComplete();
    }

    // 绘制道具
    function drawProps() {
        state.props.forEach(prop => {
            if (!prop.collected) {
                const pulseScale = 1 + Math.sin(prop.pulseTimer) * 0.1;

                ctx.save();
                ctx.translate(prop.x + prop.width / 2, prop.y + prop.height / 2);
                ctx.scale(pulseScale, pulseScale);

                if (prop.type === 'health') {
                    ctx.fillStyle = '#ff3333';
                    ctx.shadowColor = '#ff6666';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.bezierCurveTo(15, -25, 20, -5, 0, 10);
                    ctx.bezierCurveTo(-20, -5, -15, -25, 0, -10);
                    ctx.fill();
                } else if (prop.type === 'powerup') {
                    ctx.fillStyle = '#ffff33';
                    ctx.shadowColor = '#ffff66';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                        const x = 10 * Math.cos(angle);
                        const y = 10 * Math.sin(angle);
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                        const innerAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
                        const innerX = 5 * Math.cos(innerAngle);
                        const innerY = 5 * Math.sin(innerAngle);
                        ctx.lineTo(innerX, innerY);
                    }
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }
        });
    }

    // 设置事件监听
    function setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            state.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            state.keys[e.key] = false;
        });

        if (jumpBtn) {
            jumpBtn.replaceWith(jumpBtn.cloneNode(true));
            jumpBtn = document.getElementById('jumpBtn');
            jumpBtn.addEventListener('click', () => {
                if (state.gameState === 'playing') {
                    if (!state.player.isJumping) {
                        state.player.velocityY = state.player.jumpForce;
                        state.player.isJumping = true;
                    }
                }
            });
        }

        if (attackBtn) {
            attackBtn.replaceWith(attackBtn.cloneNode(true));
            attackBtn = document.getElementById('attackBtn');
            attackBtn.addEventListener('click', () => {
                if (state.gameState === 'playing') {
                    if (!state.player.isAttacking) {
                        state.player.isAttacking = true;
                        if (state.player.attackTimer) {
                            clearTimeout(state.player.attackTimer);
                        }
                        state.player.attackTimer = setTimeout(() => {
                            state.player.isAttacking = false;
                        }, CONFIG.attackDuration);
                    }
                }
            });
        }
    }

    // 设置模态框监听
    function setupModalListeners() {
        if (!tutorialPanel || !difficultyPanel || !levelPanel) {
            console.error('模态框元素未找到');
            return;
        }

        modalCloseBtns.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        modalCloseBtns = document.querySelectorAll('.close');
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        if (tutorialBtn) {
            tutorialBtn.replaceWith(tutorialBtn.cloneNode(true));
            tutorialBtn = document.getElementById('tutorialBtn');
            tutorialBtn.addEventListener('click', () => {
                tutorialPanel.style.display = 'block';
            });
        }

        if (difficultyBtn) {
            difficultyBtn.replaceWith(difficultyBtn.cloneNode(true));
            difficultyBtn = document.getElementById('difficultyBtn');
            difficultyBtn.addEventListener('click', () => {
                difficultyPanel.style.display = 'block';
            });
        }

        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(option => {
            option.replaceWith(option.cloneNode(true));
        });

        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                const difficulty = option.dataset.difficulty;
                if (difficulty) {
                    setDifficulty(difficulty);
                    difficultyPanel.style.display = 'none';
                }
            });
        });

        if (levelBtn) {
            levelBtn.replaceWith(levelBtn.cloneNode(true));
            levelBtn = document.getElementById('levelBtn');
            levelBtn.addEventListener('click', () => {
                generateLevelButtons();
                levelPanel.style.display = 'block';
            });
        }

        if (exportBtn) {
            exportBtn.replaceWith(exportBtn.cloneNode(true));
            exportBtn = document.getElementById('exportBtn');
            exportBtn.addEventListener('click', exportGameData);
        }
    }

    // 生成关卡按钮
    function generateLevelButtons() {
        if (!levelGrid) {
            console.error('关卡网格元素未找到');
            return;
        }

        levelGrid.innerHTML = '';

        for (let i = 0; i < LEVELS.length; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = i + 1;

            if (i === 0 || state.completedLevels.includes(i - 1)) {
                btn.addEventListener('click', () => {
                    loadLevel(i);
                    levelPanel.style.display = 'none';
                });
            } else {
                btn.classList.add('locked');
                btn.disabled = true;
                btn.title = '需要先完成前一个关卡';
            }

            levelGrid.appendChild(btn);
        }
    }

    // 设置难度
    function setDifficulty(difficulty) {
        state.difficulty = difficulty;
        state.player.health = DIFFICULTY_CONFIG[difficulty].playerHealth;
        updateHealthBar();
        updateUI();
        loadLevel(state.currentLevel);
    }

    // 更新UI
    function updateUI() {
        currentLevelEl.textContent = `关卡: ${state.currentLevel + 1}`;
        scoreEl.textContent = `分数: ${state.score}`;
        difficultyEl.textContent = `难度: ${state.difficulty === 'easy' ? '简单' : state.difficulty === 'medium' ? '中等' : '困难'}`;
    }

    // 更新玩家状态
    function updatePlayer() {
        const player = state.player;

        const acceleration = 0.6;
        const deceleration = 0.4;
        const airControl = 0.3;

        const currentAcceleration = player.isJumping ? acceleration * airControl : acceleration;
        const currentDeceleration = player.isJumping ? deceleration * airControl : deceleration;

        if (state.keys['ArrowLeft']) {
            player.velocityX = Math.max(player.velocityX - currentAcceleration, -player.speed);
            player.facingDirection = -1;
        } else if (state.keys['ArrowRight']) {
            player.velocityX = Math.min(player.velocityX + currentAcceleration, player.speed);
            player.facingDirection = 1;
        } else {
            if (player.velocityX > 0) {
                player.velocityX = Math.max(player.velocityX - currentDeceleration, 0);
            } else if (player.velocityX < 0) {
                player.velocityX = Math.min(player.velocityX + currentDeceleration, 0);
            }
        }

        const coyoteTime = 15;
        player.coyoteTimer = player.isJumping ? 0 : (player.coyoteTimer || 0) + 1;

        const canJump = !player.isJumping || player.coyoteTimer < coyoteTime;

        if (state.keys['ArrowUp'] && canJump && state.gameState === 'playing') {
            player.velocityY = player.jumpForce;
            player.isJumping = true;
            player.doubleJumped = false;
            player.coyoteTimer = 0;

            addParticles(player.x + player.width / 2, player.y + player.height, 10, '#ffffff', 3);

        } else if (state.keys['ArrowUp'] && player.isJumping && !player.doubleJumped && state.gameState === 'playing') {
            player.velocityY = player.jumpForce * 0.85;
            player.doubleJumped = true;

            addParticles(player.x + player.width / 2, player.y + player.height / 2, 15, '#4a9eff', 5);
        }

        if (!state.keys['ArrowUp'] && player.velocityY < 0) {
            player.velocityY *= 0.75;
        }

        if (state.keys[' '] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('normal');
        } else if (state.keys['Control'] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('heavy');
        } else if (state.keys['Shift'] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('special');
        }

        const gravity = player.isJumping && state.keys['ArrowUp'] ? player.gravity * 0.8 : player.gravity;
        player.velocityY += gravity;

        const oldX = player.x;
        const oldY = player.y;

        player.x += player.velocityX;
        player.y += player.velocityY;

        if (player.x < 0) {
            player.x = 0;
            player.velocityX *= -0.3;
        }
        if (player.x + player.width > CONFIG.canvasWidth) {
            player.x = CONFIG.canvasWidth - player.width;
            player.velocityX *= -0.3;
        }

        if (player.y + player.height > CONFIG.canvasHeight) {
            player.y = CONFIG.canvasHeight - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.doubleJumped = false;
            player.coyoteTimer = 0;
        }

        if (player.y < 0) {
            player.y = 0;
            player.velocityY *= -0.5;
        }

        let isOnGround = false;
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        // 优化碰撞检测：使用空间分割和早期退出机制
        const platforms = state.platforms;
        const platformCount = platforms.length;
        
        // 优化：使用更高效的边界检查顺序
        for (let i = 0; i < platformCount; i++) {
            const platform = platforms[i];
            
            // 优化：快速边界检查，使用位运算优化
            const pl = platform.x;
            const pr = pl + platform.width;
            const pt = platform.y;
            const pb = pt + platform.height;
            
            // 优化：快速边界检查，减少不必要的计算
            if (playerRight <= pl || playerLeft >= pr || playerBottom <= pt || playerTop >= pb) {
                continue;
            }

            // 优化：使用更高效的深度计算
            const ld = playerRight - pl;
            const rd = pr - playerLeft;
            const td = playerBottom - pt;
            const bd = pb - playerTop;
            
            // 优化：使用查找表减少条件判断
            const depths = [ld, rd, td, bd];
            const minIndex = depths.indexOf(Math.min(...depths));
            
            // 优化：使用switch语句替代多个if-else
            switch (minIndex) {
                case 0: // left
                    player.x = pl - player.width;
                    player.velocityX *= -0.2;
                    break;
                case 1: // right
                    player.x = pr;
                    player.velocityX *= -0.2;
                    break;
                case 2: // top
                    if (player.velocityY > 0) {
                        player.y = pt - player.height;
                        player.velocityY = 0;
                        isOnGround = true;
                        
                        // 优化：减少函数调用
                        const px1 = player.x + player.width / 4;
                        const px2 = player.x + player.width * 3 / 4;
                        const py = player.y + player.height;
                        addParticles(px1, py, 3, '#aaaaaa', 2);
                        addParticles(px2, py, 3, '#aaaaaa', 2);
                    }
                    break;
                case 3: // bottom
                    if (player.velocityY < 0) {
                        player.y = pb;
                        player.velocityY *= -0.4;
                    }
                    break;
            }
        }

        if (isOnGround) {
            player.isJumping = false;
            player.doubleJumped = false;
            player.coyoteTimer = 0;

            const groundFriction = 0.85;
            player.velocityX *= groundFriction;
        } else {
            const airResistance = 0.98;
            player.velocityX *= airResistance;
        }

        if (player.attackCooldown > 0) {
            player.attackCooldown--;
        }

        if (player.invincibilityFrames > 0) {
            player.invincibilityFrames--;
        }

        if (player.comboCount > 0) {
            if (player.comboTimer) {
                clearTimeout(player.comboTimer);
            }
            player.comboTimer = setTimeout(() => {
                player.comboCount = 0;
            }, 1800);
        }

        state.enemies.forEach(enemy => {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                if (player.invincibilityFrames <= 0) {
                    player.health -= 8;
                    player.invincibilityFrames = 35;
                    player.lastDamageTime = state.lastTime;
                    player.velocityX = (player.x - enemy.x) > 0 ? 5 : -5;
                    player.velocityY = -3;
                    updateHealthBar();
                    if (player.health <= 0) {
                        gameOver();
                    }
                    addParticles(player.x + player.width / 2, player.y + player.height / 2, 15, '#ff0000', 6);
                }
            }
        });
    }

    // 执行攻击
    function performAttack(type) {
        const player = state.player;
        player.isAttacking = true;
        player.attackType = type;

        let cooldown, power, duration, range, hitStun, knockback, accuracy, comboBonus, scoreMultiplier;

        switch (type) {
            case 'normal':
                cooldown = 18;
                power = 1.0 * player.attackPower;
                duration = 180;
                range = 70;
                hitStun = 9;
                knockback = 1.2;
                accuracy = 1.0;
                comboBonus = 1;
                scoreMultiplier = 1.0;
                break;
            case 'heavy':
                cooldown = 35;
                power = 2.5 * player.attackPower;
                duration = 280;
                range = 90;
                hitStun = 15;
                knockback = 3.5;
                accuracy = 0.85;
                comboBonus = 2;
                scoreMultiplier = 1.5;
                break;
            case 'special':
                cooldown = 55;
                power = 4.0 * player.attackPower;
                duration = 400;
                range = 125;
                hitStun = 20;
                knockback = 7.0;
                accuracy = 0.8;
                comboBonus = 3;
                scoreMultiplier = 2.0;
                break;
            default:
                cooldown = 18;
                power = 1.0 * player.attackPower;
                duration = 180;
                range = 70;
                hitStun = 9;
                knockback = 1.2;
                accuracy = 1.0;
                comboBonus = 1;
                scoreMultiplier = 1.0;
        }

        player.attackCooldown = cooldown;

        const attackHeightOffset = type === 'heavy' ? -10 : (type === 'special' ? -15 : 0);
        const attackHeight = player.height + (type === 'heavy' ? 20 : (type === 'special' ? 30 : 0));

        const attackShape = {
            x: player.x + (player.facingDirection === 1 ? player.width : -range),
            y: player.y + attackHeightOffset,
            width: range,
            height: attackHeight,
            type: type,
            hitStun: hitStun,
            knockback: knockback,
            accuracy: accuracy,
            direction: player.facingDirection,
            comboBonus: comboBonus,
            scoreMultiplier: scoreMultiplier
        };

        addAttackEffect(attackShape, type);

        let enemiesHit = 0;
        let totalDamage = 0;
        const hitEnemies = new Set();

        state.enemies.forEach((enemy, index) => {
            if (hitEnemies.has(index)) return;

            const enemyDodgeChance = enemy.type === 'flying' ? 0.2 :
                enemy.type === 'jumping' ? 0.15 : 0.1;
            const actualAccuracy = attackShape.accuracy * (1 - enemyDodgeChance);

            if (Math.random() > actualAccuracy) return;

            let isHit = false;

            if (type === 'special') {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const attackCenterX = attackShape.x + attackShape.width / 2;
                const attackCenterY = attackShape.y + attackShape.height / 2;

                const dx = enemyCenterX - attackCenterX;
                const dy = enemyCenterY - attackCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                if (distance < attackShape.width / 2 && Math.abs(angle) < 55) {
                    isHit = true;
                }
            } else if (type === 'heavy') {
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const attackCenterX = attackShape.x + attackShape.width / 2;
                const attackCenterY = attackShape.y + attackShape.height / 2;

                const dx = (enemyCenterX - attackCenterX) / (attackShape.width / 2);
                const dy = (enemyCenterY - attackCenterY) / (attackShape.height / 2);

                if (dx * dx + dy * dy < 1.2) {
                    isHit = true;
                }
            } else {
                if (
                    attackShape.x < enemy.x + enemy.width &&
                    attackShape.x + attackShape.width > enemy.x &&
                    attackShape.y < enemy.y + enemy.height &&
                    attackShape.y + attackShape.height > enemy.y
                ) {
                    isHit = true;
                }
            }

            if (isHit) {
                const damage = hitEnemy(enemy, index, power, type, attackShape.hitStun, attackShape.knockback);
                totalDamage += damage;
                enemiesHit++;
                hitEnemies.add(index);
            }
        });

        if (enemiesHit > 0) {
            let baseScore = Math.floor(totalDamage * 0.6 * attackShape.scoreMultiplier);
            const comboScore = player.comboCount * 8 * attackShape.comboBonus;
            const multiHitBonus = enemiesHit > 1 ? (enemiesHit - 1) * 50 : 0;
            const totalScore = baseScore + comboScore + multiHitBonus;
            state.score += totalScore;
        }

        if (player.attackTimer) {
            clearTimeout(player.attackTimer);
        }
        player.attackTimer = setTimeout(() => {
            player.isAttacking = false;
        }, duration);

        player.comboCount += attackShape.comboBonus;
        updateUI();

        if (type === 'special') {
            addScreenShake();
        }
    }

    // 击中敌人
    function hitEnemy(enemy, index, power, attackType, hitStun, knockback) {
        let damageMultiplier = 1.0;

        switch (enemy.type || 'normal') {
            case 'normal':
                damageMultiplier = 1.0;
                break;
            case 'jumping':
                damageMultiplier = 1.1;
                break;
            case 'tracking':
                damageMultiplier = 0.9;
                break;
            case 'flying':
                damageMultiplier = 1.2;
                break;
            case 'shooter':
                damageMultiplier = 0.8;
                break;
            default:
                damageMultiplier = 1.0;
        }

        const damage = Math.round(power * 24 * damageMultiplier);
        enemy.health -= damage;

        addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20, '#ff6600', 10);

        enemy.velocityX = state.player.facingDirection * knockback * 2.2;
        enemy.velocityY = -1.2 * knockback;

        enemy.hitStun = hitStun;
        enemy.isHit = true;

        if (enemy.health <= 0) {
            addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30, '#ff0000', 15);

            let baseScore = 0;
            switch (attackType) {
                case 'normal': baseScore = 20;
                    break;
                case 'heavy': baseScore = 30;
                    break;
                case 'special': baseScore = 45;
                    break;
            }

            const comboBonus = state.player.comboCount * 3;
            const difficultyBonus = state.difficulty === 'hard' ? 1.5 : (state.difficulty === 'medium' ? 1.2 : 1.0);
            const finalScore = Math.round(baseScore * difficultyBonus + comboBonus);

            state.score += finalScore;
            updateUI();

            state.enemies.splice(index, 1);
            checkLevelComplete();
        }

        return damage;
    }

    // 优化的攻击效果系统，使用对象池管理
    function addAttackEffect(attackBox, type) {
        const effect = getObjectFromPool(objectPools.attackEffects, 'attackEffect');
        effect.x = attackBox.x;
        effect.y = attackBox.y;
        effect.width = attackBox.width;
        effect.height = attackBox.height;
        effect.type = type;
        effect.timer = 0;
        effect.duration = type === 'normal' ? 22 : type === 'heavy' ? 32 : 42;
        effect.scale = 1.0;
        effect.alpha = 1.0;
        state.attackEffects.push(effect);

        const particleCount = type === 'normal' ? 8 : type === 'heavy' ? 12 : 16;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            const particle = getObjectFromPool(objectPools.particles, 'particle');
            particle.x = attackBox.x + attackBox.width / 2;
            particle.y = attackBox.y + attackBox.height / 2;
            particle.vx = Math.cos(angle) * (2 + Math.random() * 3);
            particle.vy = Math.sin(angle) * (2 + Math.random() * 3);
            particle.size = 2 + Math.random() * 3;
            particle.color = type === 'normal' ? '#ffcc00' : type === 'heavy' ? '#ff6600' : '#ff0000';
            particle.life = 25;
            particle.maxLife = 25;
            particle.alpha = 1.0;
            state.particles.push(particle);
        }
    }

    // 优化的粒子系统，使用对象池管理
    function addParticles(x, y, count, color, speed) {
        const maxParticlesPerCall = 50;
        const actualCount = Math.min(count, maxParticlesPerCall);

        for (let i = 0; i < actualCount; i++) {
            const randomX = (Math.random() - 0.5);
            const randomY = (Math.random() - 0.5);
            const randomSize = Math.random() * 3 + 1;

            const particle = getObjectFromPool(objectPools.particles, 'particle');
            particle.x = x;
            particle.y = y;
            particle.vx = randomX * speed;
            particle.vy = randomY * speed;
            particle.size = randomSize;
            particle.color = color;
            particle.life = 30;
            particle.maxLife = 30;
            particle.alpha = 1.0;

            state.particles.push(particle);
        }
    }

    // 优化的粒子更新函数，使用对象池释放机制
    function updateParticles() {
        const particlesToRemove = [];
        const particlesToRelease = [];

        for (let i = 0; i < state.particles.length; i++) {
            const particle = state.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vy += 0.1;

            particle.alpha = particle.life / particle.maxLife;

            const isOnScreen = particle.x > -50 && particle.x < CONFIG.canvasWidth + 50 &&
                particle.y > -50 && particle.y < CONFIG.canvasHeight + 50;

            if (!isOnScreen) {
                particlesToRemove.push(i);
                particlesToRelease.push(particle);
            } else if (particle.life <= 0) {
                particlesToRemove.push(i);
                particlesToRelease.push(particle);
            }
        }

        // 从后往前删除，避免索引问题
        for (let i = particlesToRemove.length - 1; i >= 0; i--) {
            state.particles.splice(particlesToRemove[i], 1);
        }

        // 将粒子对象释放回对象池
        for (let i = 0; i < particlesToRelease.length; i++) {
            releaseObjectToPool(objectPools.particles, particlesToRelease[i]);
        }

        // 限制最大粒子数量
        const maxParticles = state.gameState === 'playing' ? 250 : 150;
        if (state.particles.length > maxParticles) {
            const excess = state.particles.length - maxParticles;
            for (let i = 0; i < excess; i++) {
                const particle = state.particles.pop();
                if (particle) {
                    releaseObjectToPool(objectPools.particles, particle);
                }
            }
        }
    }

    // 优化的攻击效果更新函数，使用对象池释放机制
    function updateAttackEffects() {
        const effectsToRemove = [];
        const effectsToRelease = [];

        for (let i = 0; i < state.attackEffects.length; i++) {
            const effect = state.attackEffects[i];
            effect.timer++;
            if (effect.timer >= effect.duration) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
            }
        }

        // 从后往前删除，避免索引问题
        for (let i = effectsToRemove.length - 1; i >= 0; i--) {
            state.attackEffects.splice(effectsToRemove[i], 1);
        }

        // 将效果对象释放回对象池
        for (let i = 0; i < effectsToRelease.length; i++) {
            releaseObjectToPool(objectPools.attackEffects, effectsToRelease[i]);
        }
    }

    // 优化的敌人更新函数，使用对象池释放机制
    function updateEnemies() {
        const enemiesToRemove = [];
        const enemiesToRelease = [];

        // 优化：缓存玩家位置，减少重复计算
        const playerX = state.player.x;
        const playerY = state.player.y;
        const playerWidth = state.player.width;
        const playerHeight = state.player.height;
        
        for (let i = 0; i < state.enemies.length; i++) {
            const enemy = state.enemies[i];
            
            // 优化：使用更高效的属性初始化
            if (!enemy.health) enemy.health = 100;
            if (!enemy.maxHealth) enemy.maxHealth = 100;
            if (!enemy.velocityX) enemy.velocityX = 0;
            if (!enemy.velocityY) enemy.velocityY = 0;
            if (!enemy.gravity) enemy.gravity = CONFIG.gravity;
            if (!enemy.jumpForce) enemy.jumpForce = -12;
            if (!enemy.isJumping) enemy.isJumping = false;
            if (!enemy.hitStun) enemy.hitStun = 0;
            if (!enemy.isHit) enemy.isHit = false;
            
            // 优化：使用更高效的计时器更新
            if (enemy.lastAttackCooldown > 0) {
                enemy.lastAttackCooldown--;
            }
            
            if (enemy.hitStun > 0) {
                enemy.hitStun--;
                enemy.velocityX *= 0.8;
                enemy.isHit = true;
                continue; // 跳过其他更新逻辑
            }
            
            enemy.isHit = false;

            // 优化：缓存距离计算结果
            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distanceSquared = dx * dx + dy * dy;
            const distance = Math.sqrt(distanceSquared);

            switch (enemy.type || 'normal') {
                case 'normal': {
                    // 优化：使用更高效的AI状态更新
                    updateNormalEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }

                case 'jumping': {
                    updateJumpingEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }

                case 'tracking': {
                    updateTrackingEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }

                case 'flying': {
                    updateFlyingEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }

                case 'shooter': {
                    updateShooterEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }

                case 'exploder': {
                    updateExploderEnemyAI(enemy, dx, dy, distance, distanceSquared);
                    break;
                }
            }

            // 优化：批量平台碰撞检测
            updateEnemyPlatformCollision(enemy);
        }
    }

    // 优化：更新普通敌人AI
    function updateNormalEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'patrolling';
        
        // 优化：使用预计算的常量
        const canSeePlayer = distance < 250 && canSeeThroughPlatforms(enemy, state.player.x, state.player.y);
        
        if (distance < 10000 && canSeePlayer) { // 10000 = 100^2
            enemy.state = 'attacking';
        } else if (distance < 90000 && canSeePlayer) { // 90000 = 300^2
            enemy.state = 'chasing';
        } else {
            enemy.state = 'patrolling';
        }

        // 优化：预分配巡逻点，避免重复创建对象
        if (!enemy.patrolPoints) {
            enemy.patrolPoints = [
                { x: enemy.x - 100, y: enemy.y },
                { x: enemy.x + 100, y: enemy.y }
            ];
        }
        
        switch (enemy.state) {
            case 'patrolling':
                updatePatrollingState(enemy);
                break;
            case 'chasing':
                updateChasingState(enemy, dx);
                break;
            case 'attacking':
                updateAttackingState(enemy, dx);
                break;
        }

        // 优化：使用更高效的跳跃检测
        if (Math.random() < 0.015 && !enemy.isJumping) {
            enemy.velocityY = enemy.jumpForce;
            enemy.isJumping = true;
        }

        updateEnemyPhysics(enemy);
    }

    // 优化：更新跳跃敌人AI
    function updateJumpingEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'exploring';
        
        if (distance < 22500) { // 150^2
            enemy.state = 'attacking';
        } else if (distance < 90000) { // 300^2
            enemy.state = 'chasing';
        } else {
            enemy.state = 'exploring';
        }

        if (!enemy.isJumping) {
            updateJumpingEnemyMovement(enemy, dx, dy, distance, distanceSquared);
        }

        updateEnemyPhysics(enemy);
    }

    // 优化：更新追踪敌人AI
    function updateTrackingEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'patrolling';
        enemy.targetX = state.player.x;
        enemy.targetY = state.player.y;

                            // 优化：使用更高效的可见性检测
                            let canSeePlayer = canSeeThroughPlatforms(enemy, state.player.x, state.player.y);
                    if (distance < 80 && canSeePlayer) {
                        enemy.state = 'attacking';
                    } else if (distance < 350 && canSeePlayer) {
                        enemy.state = 'chasing';
                    } else if (distance < 500) {
                        enemy.state = 'searching';
                    } else {
                        enemy.state = 'patrolling';
                    }

                    switch (enemy.state) {
                        case 'patrolling': {
                            // 优化：预分配巡逻路径，避免重复创建对象
                            if (!enemy.patrolPath) {
                                enemy.patrolPath = [
                                    { x: enemy.x, y: enemy.y },
                                    { x: enemy.x + 120, y: enemy.y },
                                    { x: enemy.x + 120, y: enemy.y - 80 },
                                    { x: enemy.x, y: enemy.y - 80 }
                                ];
                            }
                            enemy.patrolIndex = enemy.patrolIndex || 0;

                            const currentPatrol = enemy.patrolPath[enemy.patrolIndex];
                            const patrolDx = currentPatrol.x - enemy.x;
                            const patrolDy = currentPatrol.y - enemy.y;

                            if (Math.abs(patrolDx) < 15 && Math.abs(patrolDy) < 15) {
                                enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
                            } else {
                                enemy.velocityX += (patrolDx * 0.05 - enemy.velocityX) * 0.2;
                                enemy.x += enemy.velocityX;

                                if (patrolDy < -20 && !enemy.isJumping) {
                                    enemy.velocityY = enemy.jumpForce * 1.2;
                                    enemy.isJumping = true;
                                }
                            }
                            break;
                        }

                        case 'searching': {
                            // 优化：预分配搜索角度和半径，避免重复创建
                            if (!enemy.searchAngle) enemy.searchAngle = 0;
                            if (!enemy.searchRadius) enemy.searchRadius = 50;

                            enemy.x += Math.cos(enemy.searchAngle) * enemy.speed;
                            enemy.y += Math.sin(enemy.searchAngle) * enemy.speed * 0.5;

                            enemy.searchAngle += 0.03;
                            enemy.searchRadius += 0.1;

                            if (enemy.searchRadius > 200) {
                                enemy.searchRadius = 50;
                            }
                            break;
                        }

                        case 'chasing': {
                            const playerVelocityX = state.player.velocityX;
                            const playerVelocityY = state.player.velocityY;

                            const predictedX = targetX + playerVelocityX * 3;
                            const predictedY = targetY + playerVelocityY * 3;

                            const chaseDx = predictedX - enemy.x;
                            const chaseDy = predictedY - enemy.y;

                            enemy.velocityX += (chaseDx * 0.08 - enemy.velocityX) * 0.2;
                            enemy.x += enemy.velocityX;

                            const yDiff = chaseDy - enemy.y;
                            if (yDiff < -30 && distance < 300 && !enemy.isJumping) {
                                const jumpTime = Math.sqrt(2 * Math.abs(yDiff) / enemy.gravity);
                                const jumpDistance = enemy.velocityX * jumpTime;

                                if (Math.abs(chaseDx - jumpDistance) < 50) {
                                    enemy.velocityY = enemy.jumpForce * 1.3;
                                    enemy.isJumping = true;
                                }
                            }
                            break;
                        }

                        case 'attacking': {
                            const optimalAttackDistance = 60;
                            const distanceDiff = Math.abs(targetX - enemy.x) - optimalAttackDistance;

                            if (Math.abs(distanceDiff) > 10) {
                                const adjustDirection = distanceDiff > 0 ? Math.sign(chaseDx) : -Math.sign(chaseDx);
                                enemy.velocityX += (adjustDirection * enemy.speed * 0.6 - enemy.velocityX) * 0.3;
                                enemy.x += enemy.velocityX;
                            }
                            break;
                        }
                    }

                    enemy.velocityY += enemy.gravity;
                    enemy.y += enemy.velocityY;

                    enemy.isJumping = true;
                    state.platforms.forEach(platform => {
                        if (
                            enemy.x < platform.x + platform.width &&
                            enemy.x + enemy.width > platform.x &&
                            enemy.y + enemy.height > platform.y &&
                            enemy.y + enemy.height < platform.y + 15 &&
                            enemy.velocityY > 0
                        ) {
                            enemy.y = platform.y - enemy.height;
                            enemy.velocityY = 0;
                            enemy.isJumping = false;
                        }
                    });

                    if (enemy.state === 'attacking' && distance < enemy.attackRange && enemy.lastAttackCooldown <= 0) {
                        enemy.direction = targetX > enemy.x ? 1 : -1;

                        if (Math.abs(state.player.velocityX) < 2 ||
                            Math.abs(state.player.velocityY) < 2 ||
                            Math.random() < 0.3) {
                            enemyAttack(enemy, index);
                        }
                    }
                    break;
                }

                case 'flying': {
                    const flyTargetX = state.player.x;
                    const flyTargetY = state.player.y;

                    enemy.state = enemy.state || 'patrolling';
                    enemy.flySpeed = enemy.flySpeed || enemy.speed * 0.3;
                    enemy.attackCooldown = enemy.attackCooldown || 60;
                    enemy.orbitRadius = enemy.orbitRadius || 120;

                    const visibilityDistance = 400;
                    if (distance < 100) {
                        enemy.state = 'attacking';
                    } else if (distance < visibilityDistance) {
                        enemy.state = 'chasing';
                    } else {
                        enemy.state = 'patrolling';
                    }

                    switch (enemy.state) {
                        case 'patrolling': {
                            enemy.patrolCenter = enemy.patrolCenter || { x: enemy.x, y: enemy.y };
                            enemy.patrolTime = enemy.patrolTime || 0;

                            enemy.x = enemy.patrolCenter.x + Math.sin(enemy.patrolTime * 0.002) * 150;
                            enemy.y = enemy.patrolCenter.y + Math.cos(enemy.patrolTime * 0.003) * 80;
                            enemy.patrolTime += 1;

                            break;
                        }

                        case 'chasing': {
                            const approachSpeed = 0.05;
                            const heightOffset = -20;

                            const horizontalDistance = Math.abs(flyTargetX - enemy.x);
                            const verticalDistance = Math.abs((flyTargetY + heightOffset) - enemy.y);

                            if (horizontalDistance > 50) {
                                enemy.x += (flyTargetX - enemy.x) * approachSpeed * 1.5;
                            } else {
                                enemy.y += ((flyTargetY + heightOffset) - enemy.y) * approachSpeed * 1.2;
                            }

                            enemy.y += Math.sin(state.lastTime * 0.01 + index) * 0.6;
                            break;
                        }

                        case 'attacking': {
                            enemy.attackPhase = enemy.attackPhase || 0;
                            enemy.attackTimer = enemy.attackTimer || 0;

                            switch (enemy.attackPhase) {
                                case 0: {
                                    const orbitSpeed = 0.006;
                                    const orbitAngle = state.lastTime * orbitSpeed + index;
                                    enemy.x = flyTargetX + Math.cos(orbitAngle) * enemy.orbitRadius;
                                    enemy.y = flyTargetY + Math.sin(orbitAngle) * enemy.orbitRadius;

                                    enemy.attackTimer++;
                                    if (enemy.attackTimer > 120) {
                                        enemy.attackPhase = 1;
                                        enemy.attackTimer = 0;
                                    }
                                    break;
                                }

                                case 1: {
                                    enemy.x += (flyTargetX - enemy.x) * 0.12;
                                    enemy.y += (flyTargetY - enemy.y) * 0.15;

                                    enemy.attackTimer++;
                                    if (enemy.attackTimer > 60) {
                                        enemy.attackPhase = 2;
                                        enemy.attackTimer = 0;
                                    }
                                    break;
                                }

                                case 2: {
                                    enemy.x += (enemy.x - flyTargetX) * 0.1;
                                    enemy.y += (enemy.y - flyTargetY) * 0.1;

                                    enemy.attackTimer++;
                                    if (enemy.attackTimer > 80) {
                                        enemy.attackPhase = 0;
                                        enemy.attackTimer = 0;
                                        enemy.orbitRadius = Math.random() * 100 + 80;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    enemy.direction = flyTargetX > enemy.x ? 1 : -1;

                    enemy.x = Math.max(0, Math.min(CONFIG.canvasWidth - enemy.width, enemy.x));
                    enemy.y = Math.max(30, Math.min(CONFIG.canvasHeight - 80, enemy.y));

                    const attackChance = enemy.state === 'attacking' ? 0.9 :
                        enemy.state === 'chasing' ? 0.4 : 0.15;

                    if (distance < enemy.attackRange && enemy.lastAttackCooldown <= 0 && Math.random() < attackChance) {
                        if (enemy.state === 'attacking' && enemy.attackPhase === 1) {
                            enemyShoot(enemy, index);
                        } else {
                            enemyAttack(enemy, index);
                        }
                    }
                    break;
                }

                case 'shooter': {
                    enemy.state = enemy.state || 'positioning';
                    enemy.attackCooldown = enemy.attackCooldown || 90;
                    enemy.shootAccuracy = enemy.shootAccuracy || 0.8;
                    enemy.retreatDistance = enemy.retreatDistance || 200;

                    const dx = state.player.x - enemy.x;
                    const dy = state.player.y - enemy.y;

                    enemy.direction = dx > 0 ? 1 : -1;

                    let optimalPlatform = null;
                    let optimalScore = -Infinity;

                    state.platforms.forEach(platform => {
                        const platformY = platform.y;
                        const platformCenterX = platform.x + platform.width / 2;

                        const heightScore = -platformY * 0.5;
                        const distanceScore = Math.max(0, 300 - Math.abs(dx));
                        const widthScore = platform.width * 0.1;

                        const platformScore = heightScore + distanceScore + widthScore;

                        if (platformScore > optimalScore) {
                            optimalScore = platformScore;
                            optimalPlatform = platform;
                        }
                    });

                    const canSeePlayer = !state.platforms.some(platform => {
                        const lineStart = { x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 };
                        const lineEnd = { x: state.player.x + state.player.width / 2, y: state.player.y + state.player.height / 2 };
                        const rect = {
                            x: platform.x,
                            y: platform.y,
                            width: platform.width,
                            height: platform.height
                        };

                        return rect.y > Math.min(lineStart.y, lineEnd.y) &&
                            rect.y < Math.max(lineStart.y, lineEnd.y) &&
                            rect.x < Math.max(lineStart.x, lineEnd.x) &&
                            rect.x + rect.width > Math.min(lineStart.x, lineEnd.x);
                    });

                    if (distance > 300 || (distance > 200 && !canSeePlayer)) {
                        enemy.state = 'approaching';
                        enemy.x += enemy.speed * enemy.direction * 0.7;

                        if (optimalPlatform && enemy.y + enemy.height < optimalPlatform.y - 30 && !enemy.isJumping) {
                            if (Math.random() < 0.8) {
                                enemy.velocityY = enemy.jumpForce * 1.3;
                                enemy.isJumping = true;
                            }
                        }
                    } else if (distance < 120) {
                        enemy.state = 'retreating';
                        enemy.x -= enemy.speed * enemy.direction * 0.8;

                        if (!enemy.isJumping && Math.random() < 0.5) {
                            enemy.velocityY = enemy.jumpForce * 0.9;
                            enemy.isJumping = true;
                        }
                    } else {
                        enemy.state = 'positioning';

                        if (optimalPlatform) {
                            const platformCenter = optimalPlatform.x + optimalPlatform.width / 2;
                            if (Math.abs(enemy.x - platformCenter) > 15) {
                                enemy.x += Math.sign(platformCenter - enemy.x) * enemy.speed * 0.4;
                            }

                            if (enemy.y + enemy.height < optimalPlatform.y - 25 && !enemy.isJumping) {
                                if (Math.random() < 0.8) {
                                    enemy.velocityY = enemy.jumpForce * 1.4;
                                    enemy.isJumping = true;
                                }
                            }
                        }
                    }

                    const shootChance = enemy.state === 'positioning' ? 0.95 :
                        enemy.state === 'approaching' ? 0.3 : 0.1;

                    if (distance < enemy.attackRange && enemy.lastAttackCooldown <= 0 && canSeePlayer && Math.random() < shootChance) {
                        const playerVelocityX = state.player.velocityX;
                        const playerVelocityY = state.player.velocityY;
                        const bulletSpeed = 8;

                        const timeToHit = distance / bulletSpeed;
                        const predictedPlayerX = state.player.x + playerVelocityX * timeToHit;
                        const predictedPlayerY = state.player.y + playerVelocityY * timeToHit;

                        const shootDx = predictedPlayerX - enemy.x;
                        const shootDy = predictedPlayerY - enemy.y;
                        const shootAngle = Math.atan2(shootDy, shootDx);

                        let accuracy = enemy.shootAccuracy;
                        if (enemy.state === 'approaching') accuracy *= 0.5;
                        if (enemy.isJumping) accuracy *= 0.7;

                        const randomFactor = (Math.random() - 0.5) * (1 - accuracy) * 2;
                        const finalShootAngle = shootAngle + randomFactor;

                        enemyShoot(enemy, index);
                    }

                    enemy.velocityY += enemy.gravity;
                    enemy.y += enemy.velocityY;

                    enemy.isJumping = true;
                    state.platforms.forEach(platform => {
                        if (
                            enemy.x < platform.x + platform.width &&
                            enemy.x + enemy.width > platform.x &&
                            enemy.y + enemy.height > platform.y &&
                            enemy.y + enemy.height < platform.y + 15 &&
                            enemy.velocityY > 0
                        ) {
                            enemy.y = platform.y - enemy.height;
                            enemy.velocityY = 0;
                            enemy.isJumping = false;
                        }
                    });
                    break;
                }

                case 'exploder': {
                    enemy.state = enemy.state || 'approaching';
                    enemy.explosionRadius = enemy.explosionRadius || 100;
                    enemy.explosionDamage = enemy.explosionDamage || 40;
                    enemy.detectionRange = enemy.detectionRange || 300;
                    enemy.explosionDelay = enemy.explosionDelay || 30;

                    const dx = state.player.x - enemy.x;
                    const dy = state.player.y - enemy.y;

                    if (distance < enemy.explosionRadius * 0.5) {
                        enemy.state = 'exploding';
                    } else if (distance < enemy.detectionRange) {
                        enemy.state = 'approaching';
                    } else {
                        enemy.state = 'wandering';
                    }

                    switch (enemy.state) {
                        case 'wandering': {
                            enemy.wanderTimer = enemy.wanderTimer || 0;
                            enemy.wanderDirection = enemy.wanderDirection || (Math.random() > 0.5 ? 1 : -1);

                            enemy.x += enemy.speed * enemy.wanderDirection * 0.5;
                            enemy.wanderTimer++;

                            if (enemy.wanderTimer > 60) {
                                enemy.wanderDirection *= -1;
                                enemy.wanderTimer = 0;
                            }

                            if (Math.random() < 0.02 && !enemy.isJumping) {
                                enemy.velocityY = enemy.jumpForce * 1.1;
                                enemy.isJumping = true;
                            }
                            break;
                        }

                        case 'approaching': {
                            const playerVelocityX = state.player.velocityX;
                            const playerVelocityY = state.player.velocityY;

                            const predictionTime = 0.5;
                            const predictedX = state.player.x + playerVelocityX * predictionTime;
                            const predictedY = state.player.y + playerVelocityY * predictionTime;

                            const targetVelocityX = (predictedX > enemy.x + enemy.width / 2) ? enemy.speed * 1.8 :
                                (predictedX < enemy.x - enemy.width / 2) ? -enemy.speed * 1.8 : 0;
                            enemy.velocityX += (targetVelocityX - enemy.velocityX) * 0.25;
                            enemy.direction = Math.sign(enemy.velocityX) || 1;

                            enemy.x += enemy.velocityX;

                            if (predictedY < enemy.y - 30 && distance < 350 && !enemy.isJumping) {
                                const jumpDistance = Math.abs(predictedX - enemy.x);
                                const jumpHeight = enemy.y - predictedY;
                                const gravity = enemy.gravity;

                                const jumpTime = Math.sqrt(2 * jumpHeight / gravity);
                                const requiredVelocityX = jumpDistance / jumpTime;

                                if (Math.abs(requiredVelocityX - enemy.velocityX) < 3) {
                                    enemy.velocityY = -Math.sqrt(2 * jumpHeight * gravity) * 1.2;
                                    enemy.isJumping = true;
                                }
                            }
                            break;
                        }

                        case 'exploding': {
                            enemy.explosionTimer = enemy.explosionTimer || 0;
                            enemy.explosionTimer++;

                            if (enemy.explosionTimer % 10 < 5) {
                                enemy.isBlinking = true;
                            } else {
                                enemy.isBlinking = false;
                            }

                            if (enemy.explosionTimer > enemy.explosionDelay) {
                                explodeEnemy(enemy, index);
                            }
                            break;
                        }
                    }

                    enemy.velocityY += enemy.gravity;
                    enemy.y += enemy.velocityY;

                    enemy.isJumping = true;
                    state.platforms.forEach(platform => {
                        if (
                            enemy.x < platform.x + platform.width &&
                            enemy.x + enemy.width > platform.x &&
                            enemy.y + enemy.height > platform.y &&
                            enemy.y + enemy.height < platform.y + 15 &&
                            enemy.velocityY > 0
                        ) {
                            enemy.y = platform.y - enemy.height;
                            enemy.velocityY = 0;
                            enemy.isJumping = false;
                        }
                    });
                    break;
                }
            }

            if (enemy.x < 0) enemy.x = 0;
            if (enemy.x + enemy.width > CONFIG.canvasWidth) {
                enemy.x = CONFIG.canvasWidth - enemy.width;
            }

            if (!enemy.isJumping && enemy.type !== 'flying') {
                enemy.velocityX *= 0.9;
            }
        };
    }

    // 敌人攻击
    function enemyAttack(enemy, index) {
        enemy.lastAttackCooldown = enemy.attackCooldown;

        const attackEffect = {
            x: enemy.x + (enemy.direction === 1 ? enemy.width : -60),
            y: enemy.y,
            width: 60,
            height: enemy.height,
            type: 'enemyAttack',
            timer: 0,
            duration: 20,
            damage: 10
        };

        state.attackEffects.push(attackEffect);

        const player = state.player;
        if (
            attackEffect.x < player.x + player.width &&
            attackEffect.x + attackEffect.width > player.x &&
            attackEffect.y < player.y + player.height &&
            attackEffect.y + attackEffect.height > player.y
        ) {
            if (player.invincibilityFrames <= 0) {
                player.health -= attackEffect.damage;
                player.invincibilityFrames = 30;
                player.lastDamageTime = state.lastTime;
                updateHealthBar();
                if (player.health <= 0) {
                    gameOver();
                }
                addParticles(player.x + player.width / 2, player.y + player.height / 2, 10, '#ff0000', 5);
            }
        }
    }

    // 优化的敌人射击系统，使用对象池管理
    function enemyShoot(enemy, index) {
        enemy.lastAttackCooldown = enemy.attackCooldown;

        const bullet = getObjectFromPool(objectPools.enemyEffects, 'enemyEffect');
        bullet.x = enemy.x + (enemy.direction === 1 ? enemy.width : -20);
        bullet.y = enemy.y + enemy.height / 2 - 5;
        bullet.width = 20;
        bullet.height = 10;
        bullet.velocityX = enemy.direction * 8;
        bullet.velocityY = 0;
        bullet.damage = 15;
        bullet.type = 'bullet';

        state.enemyEffects.push(bullet);
    }

    // 爆炸敌人的爆炸函数
    function explodeEnemy(enemy, index) {
        const explosionRadius = 100;
        const explosionDamage = 40;

        addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 50, '#ff9900', 15);
        addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30, '#ff3300', 20);

        const player = state.player;
        const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);
        const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);
        const playerDistance = Math.sqrt(dx * dx + dy * dy);

        if (playerDistance < explosionRadius) {
            const damageMultiplier = 1 - (playerDistance / explosionRadius);
            const finalDamage = Math.round(explosionDamage * damageMultiplier);

            if (player.invincibilityFrames <= 0) {
                player.health -= finalDamage;
                player.invincibilityFrames = 40;
                player.lastDamageTime = state.lastTime;

                const knockbackForce = 8 * damageMultiplier;
                player.velocityX = (player.x - enemy.x) > 0 ? knockbackForce : -knockbackForce;
                player.velocityY = -knockbackForce * 0.5;

                updateHealthBar();
                if (player.health <= 0) {
                    gameOver();
                }
            }
        }

        const enemiesToRemove = [];
        const enemiesToRelease = [];

        state.enemies.forEach((otherEnemy, otherIndex) => {
            if (otherIndex !== index) {
                const otherDx = otherEnemy.x + otherEnemy.width / 2 - (enemy.x + enemy.width / 2);
                const otherDy = otherEnemy.y + otherEnemy.height / 2 - (enemy.y + enemy.height / 2);
                const otherDistance = Math.sqrt(otherDx * otherDx + otherDy * otherDy);

                if (otherDistance < explosionRadius) {
                    const damageMultiplier = 1 - (otherDistance / explosionRadius);
                    const finalDamage = Math.round(explosionDamage * damageMultiplier * 0.5);
                    otherEnemy.health -= finalDamage;

                    const knockbackForce = 5 * damageMultiplier;
                    otherEnemy.velocityX = (otherEnemy.x - enemy.x) > 0 ? knockbackForce : -knockbackForce;
                    otherEnemy.velocityY = -knockbackForce * 0.5;

                    if (otherEnemy.health <= 0) {
                        addParticles(otherEnemy.x + otherEnemy.width / 2, otherEnemy.y + otherEnemy.height / 2, 25, '#ff0000', 12);
                        enemiesToRemove.push(otherIndex);
                        enemiesToRelease.push(otherEnemy);
                    }
                }
            }
        });

        // 从后往前删除敌人，避免索引问题
        for (let i = enemiesToRemove.length - 1; i >= 0; i--) {
            state.enemies.splice(enemiesToRemove[i], 1);
        }

        // 将敌人对象释放回对象池
        for (let i = 0; i < enemiesToRelease.length; i++) {
            releaseObjectToPool(objectPools.bullets, enemiesToRelease[i]);
        }

        // 将爆炸敌人对象释放回对象池
        releaseObjectToPool(objectPools.bullets, enemy);

        state.enemies.splice(index, 1);
        state.score += 35;
        updateUI();
        checkLevelComplete();
    }

    // 优化的敌人效果更新函数，使用对象池释放机制
    function updateEnemyEffects() {
        const effectsToRemove = [];
        const effectsToRelease = [];

        for (let i = 0; i < state.enemyEffects.length; i++) {
            const effect = state.enemyEffects[i];
            effect.x += effect.velocityX;
            effect.y += effect.velocityY;

            if (effect.x < 0 || effect.x > CONFIG.canvasWidth) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
                continue;
            }

            const player = state.player;
            if (
                effect.x < player.x + player.width &&
                effect.x + effect.width > player.x &&
                effect.y < player.y + player.height &&
                effect.y + effect.height > player.y
            ) {
                if (player.invincibilityFrames <= 0) {
                    player.health -= effect.damage;
                    player.invincibilityFrames = 30;
                    player.lastDamageTime = state.lastTime;
                    updateHealthBar();
                    if (player.health <= 0) {
                        gameOver();
                    }
                    addParticles(player.x + player.width / 2, player.y + player.height / 2, 10, '#ff0000', 5);
                }
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
                continue;
            }

            // 检查是否需要移除
            if (effect.y < -50 || effect.y > CONFIG.canvasHeight + 50) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
            }
        }

        // 从后往前删除，避免索引问题
        for (let i = effectsToRemove.length - 1; i >= 0; i--) {
            state.enemyEffects.splice(effectsToRemove[i], 1);
        }

        // 将效果对象释放回对象池
        for (let i = 0; i < effectsToRelease.length; i++) {
            releaseObjectToPool(objectPools.enemyEffects, effectsToRelease[i]);
        }
    }

    // 屏幕震动效果函数
    function addScreenShake() {
        if (!canvas) return;

        canvas.style.transform = 'translateX(2px) translateY(2px)';

        setTimeout(() => {
            canvas.style.transform = 'translateX(-2px) translateY(-2px)';
            setTimeout(() => {
                canvas.style.transform = 'translateX(1px) translateY(1px)';
                setTimeout(() => {
                    canvas.style.transform = 'translateX(-1px) translateY(-1px)';
                    setTimeout(() => {
                        canvas.style.transform = '';
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    }

    // 更新生命值显示
    function updateHealthBar() {
        if (healthFill) {
            healthFill.style.width = state.player.health + '%';
        }
    }

    // 检查关卡是否完成
    function checkLevelComplete() {
        if (state.enemies.length === 0) {
            state.gameState = 'levelComplete';

            if (!state.completedLevels.includes(state.currentLevel)) {
                state.completedLevels.push(state.currentLevel);
                generateLevelButtons();
            }

            drawLevelComplete();

            if (state.currentLevel < LEVELS.length - 1) {
                setTimeout(() => {
                    loadLevel(state.currentLevel + 1);
                }, 2000);
            } else {
                setTimeout(() => {
                    gameWin();
                }, 2000);
            }
        }
    }

    // 优化的绘制游戏元素函数，减少重绘次数
    function draw() {
        try {
            const now = performance.now();
            
            // 优化：缓存常量和计算结果
            const canvasW = CONFIG.canvasWidth;
            const canvasH = CONFIG.canvasHeight;
            const player = state.player;
            const gameState = state.gameState;
            
            ctx.save();
            
            // 优化：批量设置画布属性
            ctx.fillStyle = '#1a0f41';
            ctx.fillRect(0, 0, canvasW, canvasH);
            
            // 优化：使用更高效的绘制顺序
            drawPlatforms();
            drawProps();
            drawEnemies();
            drawAttackEffects();
            drawParticles();
            drawPlayer();
            
            // 优化：缓存常用属性
            const isPlaying = gameState === 'playing';
            const hasAttackPower = isPlaying && player.attackPower > 1;
            const hasCombo = isPlaying && player.comboCount > 1;
            const hasInvincibility = isPlaying && player.invincibilityFrames > 0;
            
            if (isPlaying) {
                // 优化：批量绘制UI效果
                if (hasAttackPower) {
                    drawAttackPowerUI();
                }
                
                if (hasCombo) {
                    drawComboUI();
                }
                
                if (hasInvincibility) {
                    drawInvincibilityUI();
                }
            }
            
            // 优化：延迟绘制游戏结束和关卡完成画面
            if (gameState === 'gameOver') {
                drawGameOver();
            } else if (gameState === 'levelComplete') {
                drawLevelComplete();
            }
            
            ctx.restore();
            
            // 优化：添加帧率统计
            if (now % 1000 < 16) { // 每秒更新一次
                state.lastFrameTime = now;
            }
            
        } catch (error) {
            console.error('绘制游戏元素时出错:', error);
        }
    }
    
    // 优化：绘制攻击力提升UI
    function drawAttackPowerUI() {
        const canvasW = CONFIG.canvasWidth;
        const canvasH = CONFIG.canvasHeight;
        const player = state.player;
        
        ctx.fillStyle = '#ffff33';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 8;
        ctx.fillText('攻击力提升!', canvasW / 2, 35);
        ctx.shadowBlur = 0;
        
        const pulseScale = 1 + Math.sin(state.lastTime * 0.02) * 0.1;
        ctx.save();
        ctx.translate(canvasW / 2, 35);
        ctx.scale(pulseScale, pulseScale);
        ctx.fillText('攻击力提升!', 0, 0);
        ctx.restore();
    }
    
    // 优化：绘制连击UI
    function drawComboUI() {
        const canvasW = CONFIG.canvasWidth;
        const player = state.player;
        
        const comboFontSize = Math.min(40, 20 + player.comboCount * 2);
        ctx.fillStyle = '#ffcc00';
        ctx.font = `bold ${comboFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff9900';
        ctx.shadowBlur = 12;
        
        const comboText = `${player.comboCount}x COMBO!`;
        const bounceOffset = Math.sin(state.lastTime * 0.015) * 3;
        ctx.fillText(comboText, canvasW / 2, 70 + bounceOffset);
        
        if (player.comboCount >= 5) {
            const pulseAlpha = 0.5 + Math.sin(state.lastTime * 0.03) * 0.3;
            ctx.strokeStyle = `rgba(255, 204, 0, ${pulseAlpha})`;
            ctx.lineWidth = 3;
            const pulseRadius = 60 + Math.sin(state.lastTime * 0.02) * 5;
            ctx.beginPath();
            ctx.arc(canvasW / 2, 70, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
    }
    
    // 优化：绘制无敌状态UI
    function drawInvincibilityUI() {
        const player = state.player;
        
        if (Math.floor(player.invincibilityFrames / 4) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.fillRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
            ctx.shadowBlur = 0;
        }
    }

    // 绘制粒子效果
    function drawParticles() {
        state.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        });
    }

    // 绘制攻击效果
    function drawAttackEffects() {
        state.attackEffects.forEach(effect => {
            let color, alpha, scale, rotation;

            alpha = 1 - (effect.timer / effect.duration);
            scale = 1 + (effect.timer / effect.duration) * 0.3;
            rotation = (effect.timer / effect.duration) * Math.PI * 0.5;

            switch (effect.type) {
                case 'normal':
                    color = '#00ffff';
                    break;
                case 'heavy':
                    color = '#ff6600';
                    break;
                case 'special':
                    color = '#ff00ff';
                    break;
                case 'enemyAttack':
                    color = '#ff0066';
                    break;
                default:
                    color = '#00ffff';
            }

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 25;

            ctx.translate(effect.x + effect.width / 2, effect.y + effect.height / 2);
            ctx.scale(scale, scale);
            ctx.rotate(rotation);

            if (effect.type === 'normal') {
                ctx.fillRect(-effect.width / 2, -effect.height / 2, effect.width, effect.height);
            } else if (effect.type === 'heavy') {
                ctx.beginPath();
                ctx.moveTo(-effect.width / 2, -effect.height / 2);
                ctx.lineTo(effect.width / 2, -effect.height / 1.5);
                ctx.lineTo(effect.width / 2, effect.height / 1.5);
                ctx.lineTo(-effect.width / 2, effect.height / 2);
                ctx.closePath();
                ctx.fill();
            } else if (effect.type === 'special') {
                const points = 5;
                const outerRadius = Math.max(effect.width, effect.height) / 2;
                const innerRadius = outerRadius / 2;

                ctx.beginPath();
                for (let i = 0; i < points * 2; i++) {
                    const angle = (i * Math.PI) / points - Math.PI / 2;
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, Math.max(effect.width, effect.height) / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    }

    // 绘制平台
    function drawPlatforms() {
        ctx.fillStyle = '#6a0dad';
        state.platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.shadowColor = '#9d4edd';
            ctx.shadowBlur = 15;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.shadowBlur = 0;
        });
    }

    // 绘制敌人
    function drawEnemies() {
        state.enemies.forEach(enemy => {
            enemy.health = enemy.health || 100;
            enemy.maxHealth = enemy.maxHealth || 100;

            ctx.save();

            if (enemy.isHit) {
                const hitAlpha = 0.5 + Math.sin(state.lastTime * 0.1) * 0.3;
                ctx.globalAlpha = hitAlpha;
            }

            const moveOffset = Math.sin(state.lastTime * 0.02) * 2;
            const enemyY = enemy.y + moveOffset;

            let enemyColor, shadowColor;
            switch (enemy.type || 'normal') {
                case 'normal':
                    enemyColor = '#ff0066';
                    shadowColor = '#ff66cc';
                    break;
                case 'jumping':
                    enemyColor = '#ff6600';
                    shadowColor = '#ff9933';
                    break;
                case 'tracking':
                    enemyColor = '#00ff00';
                    shadowColor = '#66ff66';
                    break;
                case 'flying':
                    enemyColor = '#00ffff';
                    shadowColor = '#66ffff';
                    enemyY += Math.sin(state.lastTime * 0.03) * 3;
                    break;
                case 'shooter':
                    enemyColor = '#ffff00';
                    shadowColor = '#ffff66';
                    break;
                case 'exploder':
                    enemyColor = '#ff3300';
                    shadowColor = '#ff6633';
                    if (enemy.state === 'exploding') {
                        enemyColor = enemy.explosionTimer % 10 < 5 ? '#ff3300' : '#ffff00';
                        shadowColor = '#ff9900';
                        ctx.shadowBlur = 25;
                    }
                    break;
                default:
                    enemyColor = '#ff0066';
                    shadowColor = '#ff66cc';
            }

            ctx.fillStyle = enemyColor;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 18;
            ctx.fillRect(enemy.x, enemyY, enemy.width, enemy.height);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffffff';
            const eyeSize = enemy.width * 0.15;
            ctx.fillRect(enemy.x + enemy.width * 0.3, enemyY + enemy.height * 0.2, eyeSize, eyeSize);
            ctx.fillRect(enemy.x + enemy.width * 0.55, enemyY + enemy.height * 0.2, eyeSize, eyeSize);

            const eyeXOffset = enemy.direction === 1 ? 0 : enemy.width * 0.15;
            ctx.fillStyle = '#000000';
            const pupilSize = enemy.width * 0.075;
            const pupilYOffset = enemy.isJumping ? 2 : 0;
            ctx.fillRect(enemy.x + enemy.width * 0.3 + eyeXOffset, enemyY + enemy.height * 0.2 + enemy.height * 0.05 + pupilYOffset, pupilSize, pupilSize);
            ctx.fillRect(enemy.x + enemy.width * 0.55 + eyeXOffset, enemyY + enemy.height * 0.2 + enemy.height * 0.05 + pupilYOffset, pupilSize, pupilSize);

            ctx.fillStyle = '#ffffff';
            if (enemy.isAttacking) {
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.1, 0, Math.PI);
                ctx.fill();
            } else if (enemy.isJumping) {
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.08, 0, Math.PI, false);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.05, 0, Math.PI * 2);
                ctx.fill();
            }

            const healthPercent = enemy.health / enemy.maxHealth;
            const healthBarWidth = enemy.width * 0.8;
            const healthBarHeight = 5;
            const healthBarX = enemy.x + (enemy.width - healthBarWidth) / 2;
            const healthBarY = enemyY - 12;

            ctx.fillStyle = '#333333';
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

            const healthGradient = ctx.createLinearGradient(healthBarX, healthBarY, healthBarX + healthBarWidth, healthBarY);
            if (healthPercent > 0.5) {
                healthGradient.addColorStop(0, '#00ff00');
                healthGradient.addColorStop(1, '#00aa00');
            } else if (healthPercent > 0.25) {
                healthGradient.addColorStop(0, '#ffff00');
                healthGradient.addColorStop(1, '#aaaa00');
            } else {
                healthGradient.addColorStop(0, '#ff0000');
                healthGradient.addColorStop(1, '#aa0000');
            }
            ctx.fillStyle = healthGradient;
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

            ctx.restore();
        });
    }

    // 绘制玩家
    function drawPlayer() {
        const player = state.player;

        const breathScale = 1 + Math.sin(state.lastTime * 0.005) * 0.02;

        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.scale(breathScale, breathScale);
        ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));

        if (player.isAttacking) {
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 25;

            const attackWidth = player.width + (player.facingDirection === 1 ? 30 : -30);
            const attackHeight = player.height + 10;
            ctx.fillRect(
                player.x + (player.facingDirection === 1 ? 0 : -attackWidth + player.width),
                player.y - 5,
                Math.abs(attackWidth),
                attackHeight
            );

            ctx.fillStyle = '#ffffff';
            const slashWidth = 15;
            const slashHeight = 10;
            ctx.fillRect(
                player.x + player.width + (player.facingDirection === 1 ? 5 : -slashWidth - 5),
                player.y + player.height / 2 - slashHeight / 2,
                slashWidth,
                slashHeight
            );

            for (let i = 0; i < 8; i++) {
                const particleX = player.x + player.width + (player.facingDirection === 1 ? 20 : -10) + Math.random() * 20;
                const particleY = player.y + Math.random() * player.height;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
                ctx.fillRect(particleX, particleY, 3, 3);
            }
        } else {
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00aaff';
            ctx.shadowBlur = 18;

            let bodyTilt = 0;
            if (player.velocityX > 0) bodyTilt = -7;
            if (player.velocityX < 0) bodyTilt = 7;

            ctx.save();
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
            ctx.rotate(bodyTilt * Math.PI / 180);
            ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
            ctx.restore();
        }
        ctx.shadowBlur = 0;
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        const eyeSize = 4;
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3, player.y + player.height * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7, player.y + player.height * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        const pupilSize = eyeSize * 0.6;
        const pupilOffsetX = player.velocityX * 0.1;
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3 + pupilOffsetX, player.y + player.height * 0.3, pupilSize, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7 + pupilOffsetX, player.y + player.height * 0.3, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        if (player.isAttacking) {
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 5, 0, Math.PI);
            ctx.fill();
        } else if (player.isJumping) {
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 4, 0, Math.PI, false);
            ctx.fill();
        } else if (Math.abs(player.velocityX) > 2) {
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 3, 0, Math.PI, false);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        if (player.attackPower > 1) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 20;
            const auraRadius = player.width / 2 + 15 + Math.sin(state.lastTime * 0.02) * 5;
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, auraRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (player.shield && player.shield > 0) {
            ctx.save();
            const shieldAlpha = 0.5 * (player.shield / (player.maxShield || 100));
            ctx.globalAlpha = shieldAlpha;
            ctx.fillStyle = '#0099ff';
            ctx.shadowColor = '#0099ff';
            ctx.shadowBlur = 25;
            const shieldRadius = player.width / 2 + 20 + Math.sin(state.lastTime * 0.03) * 8;
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, shieldRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // 绘制关卡完成画面
    function drawLevelComplete() {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('关卡完成!', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2);
        ctx.font = '20px Arial';
        ctx.fillText('准备进入下一关...', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 40);
    }

    // 绘制游戏胜利画面
    function drawGameWin() {
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏通关!', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2);
        ctx.font = '24px Arial';
        ctx.fillText(`最终分数: ${state.score}`, CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 50);
        ctx.fillText('恭喜你完成了所有关卡!', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 80);
    }

    // 游戏循环
    function gameLoop(timestamp) {
        if (!state.gameRunning) return;

        // 优化deltaTime计算，添加帧率限制和性能监控
        const currentTime = timestamp || performance.now();
        let deltaTime = currentTime - state.lastTime;

        // 优化：使用更精确的帧率控制（60FPS = 16.67ms）
        const TARGET_FPS = 60;
        const TARGET_FRAME_TIME = 1000 / TARGET_FPS;
        const MAX_FRAME_TIME = 50; // 最大帧时间，防止卡顿时的跳跃

        // 帧率限制
        if (deltaTime < TARGET_FRAME_TIME) {
            state.animationId = requestAnimationFrame(gameLoop);
            return;
        }

        // 限制最大deltaTime，防止卡顿
        deltaTime = Math.min(deltaTime, MAX_FRAME_TIME);
        state.lastTime = currentTime;

        // 优化：计算实际帧率和性能指标
        const actualFPS = Math.round(1000 / deltaTime);
        state.fps = state.fps || [];
        state.fps.push(actualFPS);
        if (state.fps.length > 60) {
            state.fps.shift();
        }
        state.avgFPS = Math.round(state.fps.reduce((a, b) => a + b, 0) / state.fps.length);

        // 优化：添加详细的性能监控
        state.performanceMetrics = state.performanceMetrics || {
            updateTimes: [],
            drawTimes: [],
            totalTimes: [],
            frameCount: 0
        };

        const perfMetrics = state.performanceMetrics;
        perfMetrics.frameCount++;

        // 记录更新开始时间
        const updateStartTime = performance.now();

        // 优化游戏状态检查，减少函数调用
        const isPlaying = state.gameState === 'playing';
        const isTimeFrozen = state.timeFrozen;

        if (isPlaying) {
            // 优化：缓存常用属性，减少重复访问
            const player = state.player;
            const timeFrozen = state.timeFrozen;
            
            // 优化：提前检查并减少函数调用
            if (!timeFrozen) {
                const enemyStartTime = performance.now();
                updateEnemies();
                perfMetrics.enemyTime = performance.now() - enemyStartTime;
            }

            // 优化：批量更新游戏对象
            const propsStartTime = performance.now();
            updateProps();
            perfMetrics.propsTime = performance.now() - propsStartTime;

            const particlesStartTime = performance.now();
            updateParticles();
            perfMetrics.particlesTime = performance.now() - particlesStartTime;

            const attackEffectsStartTime = performance.now();
            updateAttackEffects();
            perfMetrics.attackEffectsTime = performance.now() - attackEffectsStartTime;

            const enemyEffectsStartTime = performance.now();
            updateEnemyEffects();
            perfMetrics.enemyEffectsTime = performance.now() - enemyEffectsStartTime;

            const bombsStartTime = performance.now();
            updateBombs();
            perfMetrics.bombsTime = performance.now() - bombsStartTime;

            // 优化：减少嵌套条件判断
            if (timeFrozen) {
                state.timeFreezeTimer--;
                if (state.timeFreezeTimer <= 0) {
                    state.timeFrozen = false;
                    state.timeFreezeTimer = 0;
                }
            }
        }

        // 记录更新结束时间
        const updateTime = performance.now() - updateStartTime;

        // 优化：分离渲染阶段
        const drawStartTime = performance.now();
        draw();
        const drawTime = performance.now() - drawStartTime;

        // 记录总时间
        const totalTime = performance.now() - currentTime;

        // 更新性能指标
        perfMetrics.updateTimes.push(updateTime);
        perfMetrics.drawTimes.push(drawTime);
        perfMetrics.totalTimes.push(totalTime);

        // 限制性能指标数组大小
        if (perfMetrics.updateTimes.length > 60) perfMetrics.updateTimes.shift();
        if (perfMetrics.drawTimes.length > 60) perfMetrics.drawTimes.shift();
        if (perfMetrics.totalTimes.length > 60) perfMetrics.totalTimes.shift();

        // 计算平均时间
        perfMetrics.avgUpdateTime = perfMetrics.updateTimes.reduce((a, b) => a + b, 0) / perfMetrics.updateTimes.length;
        perfMetrics.avgDrawTime = perfMetrics.drawTimes.reduce((a, b) => a + b, 0) / perfMetrics.drawTimes.length;
        perfMetrics.avgTotalTime = perfMetrics.totalTimes.reduce((a, b) => a + b, 0) / perfMetrics.totalTimes.length;

        draw();

        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 游戏结束
    function gameOver() {
        state.gameRunning = false;
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
        }
        if (state.player.attackTimer) {
            clearTimeout(state.player.attackTimer);
        }

        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`最终分数: ${state.score}`, CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 40);
        ctx.fillText('点击刷新键重新开始', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 70);
    }

    // 游戏胜利
    function gameWin() {
        state.gameRunning = false;
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
        }
        if (state.player.attackTimer) {
            clearTimeout(state.player.attackTimer);
        }

        drawGameWin();
    }

    // 导出游戏数据
    function exportGameData() {
        const data = {
            score: state.score,
            completedLevels: state.completedLevels,
            difficulty: state.difficulty,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `stickman-adventure-data-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 保存游戏进度到本地存储
    function saveGameProgress() {
        const gameData = {
            score: state.score,
            completedLevels: state.completedLevels,
            difficulty: state.difficulty,
            currentLevel: state.currentLevel,
            saveTime: new Date().toISOString()
        };

        localStorage.setItem('stickmanAdventureProgress', JSON.stringify(gameData));

        showNotification('游戏进度已保存');
    }

    // 从本地存储加载游戏进度
    function loadGameProgress() {
        const savedData = localStorage.getItem('stickmanAdventureProgress');
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData);

                state.score = gameData.score || 0;
                state.completedLevels = gameData.completedLevels || [0];
                state.difficulty = gameData.difficulty || 'easy';

                generateLevelButtons();
                updateUI();

                showNotification('游戏进度已加载');

                return true;
            } catch (error) {
                console.error('加载游戏进度失败:', error);
                return false;
            }
        }
        return false;
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(106, 13, 173, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(100, 0, 255, 0.5);
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 添加存档/读档按钮到UI
    function addSaveLoadButtons() {
        const gameControls = document.querySelector('.game-controls');

        if (!document.getElementById('saveBtn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveBtn';
            saveBtn.className = 'cyber-button control-btn';
            saveBtn.textContent = '💾 保存进度';
            saveBtn.addEventListener('click', saveGameProgress);

            gameControls.appendChild(saveBtn);
        }

        if (!document.getElementById('loadBtn')) {
            const loadBtn = document.createElement('button');
            loadBtn.id = 'loadBtn';
            loadBtn.className = 'cyber-button control-btn';
            loadBtn.textContent = '📂 加载进度';
            loadBtn.addEventListener('click', loadGameProgress);

            gameControls.appendChild(loadBtn);
        }
    }

    return {
        init: initGame
    };
})();

// 页面加载完成后初始化游戏
window.addEventListener('load', function () {
    try {
        StickmanAdventure.init();
    } catch (error) {
        console.error('初始化火柴人冒险游戏时出错:', error);
    }
});