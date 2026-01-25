// 火柴人冒险游戏核心逻辑
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
            doubleJumped: false, // 二段跳状态
            health: 100,
            maxHealth: 100,
            isAttacking: false,
            attackType: 'normal', // 攻击类型: normal, heavy, special
            attackTimer: null,
            attackCooldown: 0,
            attackPower: 1, // 攻击力倍数
            powerUpTimer: null, // 攻击力提升计时器
            facingDirection: 1, // 面向方向: 1=右, -1=左
            comboCount: 0, // 连击数
            comboTimer: null, // 连击计时器
            invincibilityFrames: 0, // 无敌帧
            lastDamageTime: 0 // 上次受伤时间
        },
        platforms: [],
        enemies: [],
        props: [], // 游戏道具
        particles: [], // 粒子效果
        keys: {},
        gameRunning: true,
        lastTime: 0,
        animationId: null,
        currentLevel: 0,
        score: 0,
        difficulty: 'easy',
        completedLevels: [0], // 已完成的关卡索引
        gameState: 'playing', // playing, gameOver, levelComplete
        attackEffects: [], // 攻击效果
        enemyEffects: [] // 敌人效果
    };

    // 初始化游戏
    function initGame() {
        // 获取DOM元素
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        jumpBtn = document.getElementById('jumpBtn');
        attackBtn = document.getElementById('attackBtn');
        healthFill = document.querySelector('.health-progress');
        
        // 新增按钮和面板
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

        // 设置画布尺寸
        canvas.width = CONFIG.canvasWidth;
        canvas.height = CONFIG.canvasHeight;

        // 初始化关卡
        loadLevel(state.currentLevel);

        // 设置事件监听
        setupEventListeners();
        setupModalListeners();

        // 生成关卡按钮
        generateLevelButtons();
        
        // 添加存档/读档按钮
        addSaveLoadButtons();

        // 开始游戏循环
        state.lastTime = performance.now();
        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 加载关卡
    function loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= LEVELS.length) return;

        state.currentLevel = levelIndex;
        state.gameState = 'playing';

        // 重置玩家位置和状态
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

        // 加载平台和敌人
        state.platforms = JSON.parse(JSON.stringify(LEVELS[levelIndex].platforms));
        state.enemies = JSON.parse(JSON.stringify(LEVELS[levelIndex].enemies));

        // 根据难度调整敌人属性
        const difficultyMultiplier = {
            easy: 0.8,
            medium: 1.0,
            hard: 1.3
        }[state.difficulty] || 1.0;
        
        state.enemies.forEach(enemy => {
            // 调整敌人速度
            enemy.speed *= DIFFICULTY_CONFIG[state.difficulty].enemySpeed * difficultyMultiplier;
            
            // 调整敌人生命值
            enemy.health = Math.round((enemy.health || 100) * difficultyMultiplier);
            enemy.maxHealth = enemy.health;
            
            // 调整敌人攻击力
            enemy.attackDamage = (enemy.attackDamage || 10) * difficultyMultiplier;
            
            // 调整敌人攻击范围
            enemy.attackRange = (enemy.attackRange || 80) * difficultyMultiplier;
        });

        // 生成道具
        spawnProps(levelIndex);
        
        // 清空效果和粒子
        state.particles = [];
        state.attackEffects = [];
        state.enemyEffects = [];

        // 更新UI
        updateUI();
        updateHealthBar();
    }

    // 生成道具
    function spawnProps(levelIndex) {
        state.props = [];

        // 根据关卡和难度生成不同数量的道具
        const basePropCount = Math.min(Math.floor(levelIndex / 2) + 2, 5);
        const difficultyMultiplier = {
            easy: 1.3,
            medium: 1.1,
            hard: 0.9
        }[state.difficulty] || 1.0;
        const propCount = Math.max(1, Math.round(basePropCount * difficultyMultiplier));

        // 扩展道具类型
        const propTypes = ['health', 'powerup', 'invincibility', 'speedboost', 'shield', 'combo', 'timefreeze', 'bombdrop'];
        
        for (let i = 0; i < propCount; i++) {
            // 根据关卡进度调整道具概率
            let propType;
            const rand = Math.random();
            
            if (levelIndex < 3) {
                // 前期关卡更多基础道具
                if (rand < 0.6) {
                    propType = 'health';
                } else if (rand < 0.9) {
                    propType = 'powerup';
                } else {
                    propType = propTypes[Math.floor(Math.random() * propTypes.length)];
                }
            } else if (levelIndex < 7) {
                // 中期关卡更多强化道具
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
                // 后期关卡更多高级道具
                const advancedProps = ['invincibility', 'speedboost', 'shield', 'combo', 'timefreeze', 'bombdrop'];
                if (rand < 0.25) {
                    propType = 'health';
                } else if (rand < 0.5) {
                    propType = 'powerup';
                } else {
                    propType = advancedProps[Math.floor(Math.random() * advancedProps.length)];
                }
            }

            // 随机选择平台，但避免最开始的平台
            const platformIndex = Math.floor(Math.random() * (state.platforms.length - 1)) + 1;
            const platform = state.platforms[platformIndex];

            // 在平台上随机位置生成道具
            const prop = {
                x: platform.x + Math.random() * (platform.width - 25),
                y: platform.y - 35,
                width: 25,
                height: 25,
                type: propType,
                collected: false,
                pulseTimer: 0,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                spawnTime: state.lastTime
            };

            state.props.push(prop);
        }
    }

    // 更新道具
    function updateProps() {
        state.props.forEach(prop => {
            if (!prop.collected) {
                // 道具脉冲动画
                prop.pulseTimer += 0.05;

                // 检查玩家是否接触道具
                if (
                    state.player.x < prop.x + prop.width &&
                    state.player.x + state.player.width > prop.x &&
                    state.player.y < prop.y + prop.height &&
                    state.player.y + state.player.height > prop.y
                ) {
                    collectProp(prop);
                }
            }
        });
    }

    // 收集道具
    function collectProp(prop) {
        prop.collected = true;

        // 添加收集粒子效果
        addParticles(prop.x + prop.width/2, prop.y + prop.height/2, 20, '#ffff00', 6);

        // 根据道具类型执行不同效果
        switch (prop.type) {
            case 'health':
                // 恢复生命值
                const healthRestore = 40;
                state.player.health = Math.min(state.player.health + healthRestore, state.player.maxHealth);
                updateHealthBar();
                state.score += 15;
                break;
            case 'powerup':
                // 提升攻击力
                state.player.attackPower = 2.8;
                if (state.player.powerUpTimer) {
                    clearTimeout(state.player.powerUpTimer);
                }
                // 攻击力提升持续7秒
                state.player.powerUpTimer = setTimeout(() => {
                    state.player.attackPower = 1;
                }, 7000);
                state.score += 25;
                break;
            case 'invincibility':
                // 无敌效果
                state.player.invincibilityFrames = 700; // 11.6秒无敌
                state.score += 40;
                break;
            case 'speedboost':
                // 速度提升
                const originalSpeed = state.player.speed;
                state.player.speed *= 1.6;
                setTimeout(() => {
                    state.player.speed = originalSpeed;
                }, 5500);
                state.score += 30;
                break;
            case 'shield':
                // 护盾效果
                state.player.shield = (state.player.shield || 0) + 50; // 添加50点护盾
                state.player.maxShield = Math.max(state.player.maxShield || 0, state.player.shield);
                state.score += 35;
                break;
            case 'combo':
                // 连击加成
                state.player.comboCount += 5;
                state.score += 50;
                break;
            case 'timefreeze':
                // 时间冻结效果
                state.timeFrozen = true;
                state.timeFreezeTimer = 300; // 5秒时间冻结
                state.score += 45;
                break;
            case 'bombdrop':
                // 炸弹投掷
                dropBomb();
                state.score += 35;
                break;
        }

        updateUI();
    }
    
    // 炸弹投掷函数
    function dropBomb() {
        // 在玩家位置生成炸弹
        const bomb = {
            x: state.player.x + state.player.width / 2 - 15,
            y: state.player.y,
            width: 30,
            height: 30,
            type: 'bomb',
            timer: 0,
            fuseTime: 60, // 1秒引信
            explosionRadius: 120,
            explosionDamage: 35
        };
        
        // 将炸弹添加到道具或效果数组
        state.props.push(bomb);
    }
    
    // 更新炸弹
    function updateBombs() {
        state.props.forEach((prop, index) => {
            if (prop.type === 'bomb') {
                // 更新炸弹引信
                prop.timer++;
                
                // 炸弹落地后爆炸
                if (prop.timer >= prop.fuseTime) {
                    // 触发爆炸
                    explodeBomb(prop, index);
                } else {
                    // 炸弹下落
                    prop.y += 5;
                    
                    // 检查是否落地
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
                    
                    // 落地后减少引信时间
                    if (hitGround) {
                        prop.fuseTime = Math.min(prop.fuseTime, prop.timer + 20);
                    }
                }
            }
        });
    }
    
    // 炸弹爆炸函数
    function explodeBomb(prop, index) {
        // 爆炸效果
        addParticles(prop.x + prop.width/2, prop.y + prop.height/2, 60, '#ff6600', 18);
        addParticles(prop.x + prop.width/2, prop.y + prop.height/2, 40, '#ff0000', 22);
        
        // 伤害敌人
        state.enemies.forEach((enemy, enemyIndex) => {
            const dx = enemy.x + enemy.width/2 - (prop.x + prop.width/2);
            const dy = enemy.y + enemy.height/2 - (prop.y + prop.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < prop.explosionRadius) {
                // 计算伤害
                const damageMultiplier = 1 - (distance / prop.explosionRadius);
                const finalDamage = Math.round(prop.explosionDamage * damageMultiplier);
                enemy.health -= finalDamage;
                
                // 击退效果
                const knockbackForce = 6 * damageMultiplier;
                enemy.velocityX = (enemy.x - prop.x) > 0 ? knockbackForce : -knockbackForce;
                enemy.velocityY = -knockbackForce * 0.5;
                
                // 检查敌人是否死亡
                if (enemy.health <= 0) {
                    addParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 25, '#ff0000', 12);
                    state.enemies.splice(enemyIndex, 1);
                    state.score += 25;
                    updateUI();
                }
            }
        });
        
        // 移除炸弹
        state.props.splice(index, 1);
        
        // 检查关卡是否完成
        checkLevelComplete();
    }

    // 绘制道具
    function drawProps() {
        state.props.forEach(prop => {
            if (!prop.collected) {
                // 脉冲效果
                const pulseScale = 1 + Math.sin(prop.pulseTimer) * 0.1;

                ctx.save();
                ctx.translate(prop.x + prop.width / 2, prop.y + prop.height / 2);
                ctx.scale(pulseScale, pulseScale);

                // 根据道具类型绘制不同样式
                if (prop.type === 'health') {
                    // 红色心形生命值道具
                    ctx.fillStyle = '#ff3333';
                    ctx.shadowColor = '#ff6666';
                    ctx.shadowBlur = 10;
                    // 绘制心形
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.bezierCurveTo(15, -25, 20, -5, 0, 10);
                    ctx.bezierCurveTo(-20, -5, -15, -25, 0, -10);
                    ctx.fill();
                } else if (prop.type === 'powerup') {
                    // 黄色星形攻击力提升道具
                    ctx.fillStyle = '#ffff33';
                    ctx.shadowColor = '#ffff66';
                    ctx.shadowBlur = 10;
                    // 绘制星形
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
        // 键盘控制
        window.addEventListener('keydown', (e) => {
            state.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            state.keys[e.key] = false;
        });

        // 按钮控制
        if (jumpBtn) {
            // 移除旧的事件监听，避免重复绑定
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
            // 移除旧的事件监听，避免重复绑定
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
        // 确保模态框元素存在
        if (!tutorialPanel || !difficultyPanel || !levelPanel) {
            console.error('模态框元素未找到');
            return;
        }

        // 关闭按钮
        modalCloseBtns.forEach(btn => {
            // 移除旧的事件监听，避免重复绑定
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // 重新获取关闭按钮并绑定事件
        modalCloseBtns = document.querySelectorAll('.close');
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 关闭当前模态框
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // 教程按钮
        if (tutorialBtn) {
            // 移除旧的事件监听
            tutorialBtn.replaceWith(tutorialBtn.cloneNode(true));
            tutorialBtn = document.getElementById('tutorialBtn');
            tutorialBtn.addEventListener('click', () => {
                tutorialPanel.style.display = 'block';
            });
        }

        // 难度选择按钮
        if (difficultyBtn) {
            // 移除旧的事件监听
            difficultyBtn.replaceWith(difficultyBtn.cloneNode(true));
            difficultyBtn = document.getElementById('difficultyBtn');
            difficultyBtn.addEventListener('click', () => {
                difficultyPanel.style.display = 'block';
            });
        }

        // 难度选项
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(option => {
            // 移除旧的事件监听
            option.replaceWith(option.cloneNode(true));
        });
        
        // 重新获取难度选项并绑定事件
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                const difficulty = option.dataset.difficulty;
                if (difficulty) {
                    setDifficulty(difficulty);
                    difficultyPanel.style.display = 'none';
                }
            });
        });

        // 关卡选择按钮
        if (levelBtn) {
            // 移除旧的事件监听
            levelBtn.replaceWith(levelBtn.cloneNode(true));
            levelBtn = document.getElementById('levelBtn');
            levelBtn.addEventListener('click', () => {
                // 在显示关卡面板前重新生成关卡按钮，确保状态正确
                generateLevelButtons();
                levelPanel.style.display = 'block';
            });
        }

        // 导出数据按钮
        if (exportBtn) {
            // 移除旧的事件监听
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

            // 检查关卡是否解锁
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
        // 更新玩家生命值
        state.player.health = DIFFICULTY_CONFIG[difficulty].playerHealth;
        updateHealthBar();
        updateUI();
        // 重新加载当前关卡以应用新难度
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

        // 键盘控制 - 增加更精细的加速度和减速度控制
        const acceleration = 0.6;
        const deceleration = 0.4;
        const airControl = 0.3; // 空中控制系数
        
        // 地面和空中的不同控制
        const currentAcceleration = player.isJumping ? acceleration * airControl : acceleration;
        const currentDeceleration = player.isJumping ? deceleration * airControl : deceleration;
        
        if (state.keys['ArrowLeft']) {
            player.velocityX = Math.max(player.velocityX - currentAcceleration, -player.speed);
            player.facingDirection = -1;
        } else if (state.keys['ArrowRight']) {
            player.velocityX = Math.min(player.velocityX + currentAcceleration, player.speed);
            player.facingDirection = 1;
        } else {
            // 平滑减速
            if (player.velocityX > 0) {
                player.velocityX = Math.max(player.velocityX - currentDeceleration, 0);
            } else if (player.velocityX < 0) {
                player.velocityX = Math.min(player.velocityX + currentDeceleration, 0);
            }
        }

        // Coyote Time - 允许玩家在刚离开平台后仍能跳跃
        const coyoteTime = 15; // 15帧的缓冲时间
        player.coyoteTimer = player.isJumping ? 0 : (player.coyoteTimer || 0) + 1;
        
        // 跳跃控制 - 增强的跳跃系统
        const canJump = !player.isJumping || player.coyoteTimer < coyoteTime;
        
        if (state.keys['ArrowUp'] && canJump && state.gameState === 'playing') {
            // 重置状态
            player.velocityY = player.jumpForce;
            player.isJumping = true;
            player.doubleJumped = false;
            player.coyoteTimer = 0;
            
            // 添加跳跃粒子效果
            addParticles(player.x + player.width/2, player.y + player.height, 10, '#ffffff', 3);
            
            // 跳跃音效（如果有）
        } 
        // 二段跳
        else if (state.keys['ArrowUp'] && player.isJumping && !player.doubleJumped && state.gameState === 'playing') {
            player.velocityY = player.jumpForce * 0.85;
            player.doubleJumped = true;
            
            // 添加二段跳粒子效果
            addParticles(player.x + player.width/2, player.y + player.height/2, 15, '#4a9eff', 5);
        }
        
        // 跳跃缓冲 - 释放跳跃键时减少跳跃高度
        if (!state.keys['ArrowUp'] && player.velocityY < 0) {
            player.velocityY *= 0.75;
        }

        // 攻击控制
        if (state.keys[' '] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            // 普通攻击
            performAttack('normal');
        } else if (state.keys['Control'] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            // 重攻击
            performAttack('heavy');
        } else if (state.keys['Shift'] && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            // 特殊攻击
            performAttack('special');
        }

        // 应用重力 - 可调节的重力
        const gravity = player.isJumping && state.keys['ArrowUp'] ? player.gravity * 0.8 : player.gravity;
        player.velocityY += gravity;
        
        // 保存旧位置用于碰撞检测
        const oldX = player.x;
        const oldY = player.y;
        
        // 更新位置
        player.x += player.velocityX;
        player.y += player.velocityY;

        // 边界检查 - 更严格的边界处理
        if (player.x < 0) {
            player.x = 0;
            player.velocityX *= -0.3; // 反弹效果
        }
        if (player.x + player.width > CONFIG.canvasWidth) {
            player.x = CONFIG.canvasWidth - player.width;
            player.velocityX *= -0.3; // 反弹效果
        }
        
        // 防止玩家掉出屏幕 - 增强的底部边界处理
        if (player.y + player.height > CONFIG.canvasHeight) {
            player.y = CONFIG.canvasHeight - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.doubleJumped = false;
            player.coyoteTimer = 0;
        }
        
        // 天花板碰撞 - 增强的天花板处理
        if (player.y < 0) {
            player.y = 0;
            player.velocityY *= -0.5; // 反弹效果
        }

        // 平台碰撞检测 - 改进的AABB碰撞检测
        let isOnGround = false;
        state.platforms.forEach(platform => {
            // 精确的碰撞检测
            const collision = {
                left: player.x + player.width > platform.x,
                right: player.x < platform.x + platform.width,
                top: player.y + player.height > platform.y,
                bottom: player.y < platform.y + platform.height
            };
            
            if (collision.left && collision.right && collision.top && collision.bottom) {
                // 计算碰撞深度
                const leftDepth = (player.x + player.width) - platform.x;
                const rightDepth = (platform.x + platform.width) - player.x;
                const topDepth = (player.y + player.height) - platform.y;
                const bottomDepth = (platform.y + platform.height) - player.y;
                
                // 找到最小的碰撞深度
                const minDepth = Math.min(leftDepth, rightDepth, topDepth, bottomDepth);
                
                // 根据最小深度进行碰撞响应
                if (minDepth === leftDepth) {
                    // 左侧碰撞
                    player.x = platform.x - player.width;
                    player.velocityX *= -0.2; // 轻微反弹
                } else if (minDepth === rightDepth) {
                    // 右侧碰撞
                    player.x = platform.x + platform.width;
                    player.velocityX *= -0.2; // 轻微反弹
                } else if (minDepth === topDepth && player.velocityY > 0) {
                    // 顶部碰撞（着陆）
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    isOnGround = true;
                    
                    // 着陆粒子效果
                    addParticles(player.x + player.width/4, player.y + player.height, 3, '#aaaaaa', 2);
                    addParticles(player.x + player.width*3/4, player.y + player.height, 3, '#aaaaaa', 2);
                } else if (minDepth === bottomDepth && player.velocityY < 0) {
                    // 底部碰撞（头顶天花板）
                    player.y = platform.y + platform.height;
                    player.velocityY *= -0.4; // 反弹效果
                }
            }
        });
        
        // 更新跳跃状态
        if (isOnGround) {
            player.isJumping = false;
            player.doubleJumped = false;
            player.coyoteTimer = 0;
            
            // 地面摩擦 - 增强的地面控制
            const groundFriction = 0.85;
            player.velocityX *= groundFriction;
        } else {
            // 空中拖拽 - 轻微的空气阻力
            const airResistance = 0.98;
            player.velocityX *= airResistance;
        }

        // 更新攻击冷却
        if (player.attackCooldown > 0) {
            player.attackCooldown--;
        }

        // 更新无敌帧
        if (player.invincibilityFrames > 0) {
            player.invincibilityFrames--;
        }

        // 更新连击计时器
        if (player.comboCount > 0) {
            if (player.comboTimer) {
                clearTimeout(player.comboTimer);
            }
            player.comboTimer = setTimeout(() => {
                player.comboCount = 0;
            }, 1800); // 延长连击时间，鼓励连续攻击
        }

        // 敌人碰撞检测
        state.enemies.forEach(enemy => {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                if (player.invincibilityFrames <= 0) {
                    player.health -= 8; // 略微降低敌人接触伤害
                    player.invincibilityFrames = 35; // 增加无敌时间
                    player.lastDamageTime = state.lastTime;
                    // 击退效果
                    player.velocityX = (player.x - enemy.x) > 0 ? 5 : -5;
                    player.velocityY = -3;
                    updateHealthBar();
                    if (player.health <= 0) {
                        gameOver();
                    }
                    // 添加受伤效果
                    addParticles(player.x + player.width/2, player.y + player.height/2, 15, '#ff0000', 6);
                }
            }
        });
    }
    
    // 执行攻击
    function performAttack(type) {
        const player = state.player;
        player.isAttacking = true;
        player.attackType = type;
        
        // 根据攻击类型设置详细参数，实现多样化的攻击体验
        let cooldown, power, duration, range, hitStun, knockback, accuracy, comboBonus, scoreMultiplier;
        
        // 攻击参数精细化配置
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
        
        // 设置攻击冷却
        player.attackCooldown = cooldown;
        
        // 计算攻击范围，考虑不同攻击类型的特性
        const attackHeightOffset = type === 'heavy' ? -10 : (type === 'special' ? -15 : 0);
        const attackHeight = player.height + (type === 'heavy' ? 20 : (type === 'special' ? 30 : 0));
        
        // 基于攻击类型的攻击形状
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
        
        // 添加攻击效果
        addAttackEffect(attackShape, type);
        
        // 检测敌人碰撞
        let enemiesHit = 0;
        let totalDamage = 0;
        let hitPositions = [];
        
        // 优化：使用对象来跟踪已击中的敌人，避免重复计算
        const hitEnemies = new Set();
        
        state.enemies.forEach((enemy, index) => {
            // 跳过已经被击中的敌人
            if (hitEnemies.has(index)) return;
            
            // 随机命中率，考虑敌人类型的闪避率
            const enemyDodgeChance = enemy.type === 'flying' ? 0.2 : 
                                     enemy.type === 'jumping' ? 0.15 : 0.1;
            const actualAccuracy = attackShape.accuracy * (1 - enemyDodgeChance);
            
            if (Math.random() > actualAccuracy) return;
            
            // 根据攻击类型使用不同的碰撞检测算法
            let isHit = false;
            
            if (type === 'special') {
                // 特殊攻击：复杂的扇形+矩形混合范围
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const attackCenterX = attackShape.x + attackShape.width / 2;
                const attackCenterY = attackShape.y + attackShape.height / 2;
                
                const dx = enemyCenterX - attackCenterX;
                const dy = enemyCenterY - attackCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                // 扇形范围检测
                if (distance < attackShape.width / 2 && Math.abs(angle) < 55) {
                    isHit = true;
                }
            } else if (type === 'heavy') {
                // 重攻击：椭圆形范围
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
                // 普通攻击：精准矩形范围
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
                // 敌人被击中
                const damage = hitEnemy(enemy, index, power, type, attackShape.hitStun, attackShape.knockback);
                totalDamage += damage;
                enemiesHit++;
                hitEnemies.add(index);
                hitPositions.push({x: enemy.x, y: enemy.y});
            }
        });
        
        // 根据击中敌人数量和总伤害增加额外分数
        if (enemiesHit > 0) {
            // 基础分数
            let baseScore = Math.floor(totalDamage * 0.6 * attackShape.scoreMultiplier);
            
            // 连击加成
            const comboScore = player.comboCount * 8 * attackShape.comboBonus;
            
            // 多敌人击中加成
            const multiHitBonus = enemiesHit > 1 ? (enemiesHit - 1) * 50 : 0;
            
            // 总分数
            const totalScore = baseScore + comboScore + multiHitBonus;
            state.score += totalScore;
        }
        
        // 攻击动画结束
        if (player.attackTimer) {
            clearTimeout(player.attackTimer);
        }
        player.attackTimer = setTimeout(() => {
            player.isAttacking = false;
        }, duration);
        
        // 增加连击数，考虑攻击类型
        player.comboCount += attackShape.comboBonus;
        
        // 更新UI
        updateUI();
        
        // 添加特殊攻击效果
        if (type === 'special') {
            // 特殊攻击的全屏震动效果
            addScreenShake();
        }
    }
    
    // 击中敌人
    function hitEnemy(enemy, index, power, attackType, hitStun, knockback) {
        // 计算伤害值，考虑敌人类型和防御
        let damageMultiplier = 1.0;
        
        // 根据敌人类型调整伤害
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
        
        // 计算最终伤害
        const damage = Math.round(power * 24 * damageMultiplier);
        enemy.health -= damage;
        
        // 添加敌人被击中效果
        addParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 20, '#ff6600', 10);
        
        // 添加击退效果
        enemy.velocityX = state.player.facingDirection * knockback * 2.2;
        enemy.velocityY = -1.2 * knockback;
        
        // 添加眩晕效果
        enemy.hitStun = hitStun;
        enemy.isHit = true;
        
        // 检查敌人是否死亡
        if (enemy.health <= 0) {
            // 死亡动画效果
            addParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 30, '#ff0000', 15);
            
            // 死亡音效（如果有）
            
            // 根据攻击类型和连击数计算分数
            let baseScore = 0;
            switch (attackType) {
                case 'normal': baseScore = 20;
                    break;
                case 'heavy': baseScore = 30;
                    break;
                case 'special': baseScore = 45;
                    break;
            }
            
            // 连击加成和难度加成
            const comboBonus = state.player.comboCount * 3;
            const difficultyBonus = state.difficulty === 'hard' ? 1.5 : (state.difficulty === 'medium' ? 1.2 : 1.0);
            const finalScore = Math.round(baseScore * difficultyBonus + comboBonus);
            
            state.score += finalScore;
            updateUI();
            
            // 移除敌人
            state.enemies.splice(index, 1);
            
            // 检查关卡是否完成
            checkLevelComplete();
        }
        
        return damage;
    }
    
    // 添加攻击效果
    function addAttackEffect(attackBox, type) {
        const effect = {
            x: attackBox.x,
            y: attackBox.y,
            width: attackBox.width,
            height: attackBox.height,
            type: type,
            timer: 0,
            duration: type === 'normal' ? 22 : type === 'heavy' ? 32 : 42,
            scale: 1.0,
            alpha: 1.0
        };
        state.attackEffects.push(effect);
        
        // 添加攻击特效粒子
        const particleCount = type === 'normal' ? 8 : type === 'heavy' ? 12 : 16;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 10 + Math.random() * 20;
            state.particles.push({
                x: attackBox.x + attackBox.width / 2,
                y: attackBox.y + attackBox.height / 2,
                vx: Math.cos(angle) * (2 + Math.random() * 3),
                vy: Math.sin(angle) * (2 + Math.random() * 3),
                size: 2 + Math.random() * 3,
                color: type === 'normal' ? '#ffcc00' : type === 'heavy' ? '#ff6600' : '#ff0000',
                life: 25,
                maxLife: 25,
                alpha: 1.0
            });
        }
    }
    
    // 添加粒子效果
    function addParticles(x, y, count, color, speed) {
        // 限制单次添加的粒子数量，避免性能峰值
        const maxParticlesPerCall = 50;
        const actualCount = Math.min(count, maxParticlesPerCall);
        
        for (let i = 0; i < actualCount; i++) {
            // 优化：预计算随机值，减少函数调用
            const randomX = (Math.random() - 0.5);
            const randomY = (Math.random() - 0.5);
            const randomSize = Math.random() * 3 + 1;
            
            state.particles.push({
                x: x,
                y: y,
                vx: randomX * speed,
                vy: randomY * speed,
                size: randomSize,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1.0 // 添加透明度属性
            });
        }
    }
    
    // 更新粒子效果
    function updateParticles() {
        // 优化：使用过滤而不是重建数组，减少内存分配
        state.particles = state.particles.filter(particle => {
            // 更新位置和速度
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vy += 0.1; // 粒子重力
            
            // 更新透明度
            particle.alpha = particle.life / particle.maxLife;
            
            // 移除超出屏幕的粒子，减少计算
            const isOnScreen = particle.x > -50 && particle.x < CONFIG.canvasWidth + 50 &&
                           particle.y > -50 && particle.y < CONFIG.canvasHeight + 50;
            
            // 仅保留存活且在屏幕内的粒子
            return particle.life > 0 && isOnScreen;
        });
        
        // 动态调整粒子上限，根据游戏当前状态
        const maxParticles = state.gameState === 'playing' ? 250 : 150;
        if (state.particles.length > maxParticles) {
            // 优化：保留最近添加的粒子，通常更显眼
            state.particles = state.particles.slice(-maxParticles);
        }
    }
    
    // 更新攻击效果
    function updateAttackEffects() {
        state.attackEffects = state.attackEffects.filter(effect => {
            effect.timer++;
            return effect.timer < effect.duration;
        });
    }

    // 更新敌人
    function updateEnemies() {
        state.enemies.forEach((enemy, index) => {
            // 确保敌人有完整的基本属性
            enemy.health = enemy.health || 100;
            enemy.maxHealth = enemy.maxHealth || 100;
            enemy.velocityX = enemy.velocityX || 0;
            enemy.velocityY = enemy.velocityY || 0;
            enemy.gravity = enemy.gravity || CONFIG.gravity;
            enemy.jumpForce = enemy.jumpForce || -12;
            enemy.isJumping = enemy.isJumping || false;
            enemy.attackTimer = enemy.attackTimer || null;
            enemy.lastAttackTime = enemy.lastAttackTime || 0;
            enemy.attackRange = enemy.attackRange || 80;
            enemy.attackCooldown = enemy.attackCooldown || 30;
            enemy.lastAttackCooldown = enemy.lastAttackCooldown || 0;
            enemy.hitStun = enemy.hitStun || 0;
            enemy.isHit = enemy.isHit || false;
            
            // 优化：只更新必要的属性
            if (enemy.lastAttackCooldown > 0) {
                enemy.lastAttackCooldown--;
            }
            
            if (enemy.hitStun > 0) {
                enemy.hitStun--;
                enemy.velocityX *= 0.8; // 眩晕时减速
                enemy.isHit = true;
                return; // 跳过其他行为，敌人处于眩晕状态
            }
            
            enemy.isHit = false;
            
            // 计算敌人与玩家的距离
            const dx = state.player.x - enemy.x;
            const dy = state.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 根据敌人类型执行不同的行为
            switch (enemy.type || 'normal') {
                case 'normal': {
                    // 普通敌人：智能巡逻 + 玩家检测
                    enemy.state = enemy.state || 'patrolling';
                    
                    // 简化的视线检测
                    const canSeePlayer = distance < 250 && !state.platforms.some(platform => {
                        return platform.y > enemy.y && platform.y < state.player.y &&
                               platform.x < Math.max(enemy.x, state.player.x) &&
                               platform.x + platform.width > Math.min(enemy.x, state.player.x);
                    });
                    
                    // 根据距离和视野切换状态
                    if (distance < 100 && canSeePlayer) {
                        enemy.state = 'attacking';
                    } else if (distance < 300 && canSeePlayer) {
                        enemy.state = 'chasing';
                    } else {
                        enemy.state = 'patrolling';
                    }
                    
                    // 实现智能巡逻路径
                    enemy.patrolPoints = enemy.patrolPoints || [
                        { x: enemy.x - 100, y: enemy.y },
                        { x: enemy.x + 100, y: enemy.y }
                    ];
                    enemy.patrolIndex = enemy.patrolIndex || 0;
                    
                    // 根据状态执行不同行为
                    switch (enemy.state) {
                        case 'patrolling':
                            // 智能巡逻：在巡逻点之间移动
                            const targetPatrol = enemy.patrolPoints[enemy.patrolIndex];
                            if (Math.abs(enemy.x - targetPatrol.x) < 10) {
                                enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPoints.length;
                            }
                            enemy.direction = enemy.x < targetPatrol.x ? 1 : -1;
                            enemy.x += enemy.speed * enemy.direction;
                            break;
                            
                        case 'chasing':
                            // 追逐玩家
                            enemy.direction = dx > 0 ? 1 : -1;
                            enemy.x += enemy.speed * enemy.direction * 1.2;
                            break;
                            
                        case 'attacking':
                            // 攻击状态：保持距离，准备攻击
                            if (Math.abs(dx) > 50) {
                                enemy.direction = dx > 0 ? 1 : -1;
                                enemy.x += enemy.speed * enemy.direction * 0.8;
                            }
                            break;
                    }
                    
                    // 随机跳跃，增加游戏趣味性
                    if (Math.random() < 0.015 && !enemy.isJumping) {
                        enemy.velocityY = enemy.jumpForce;
                        enemy.isJumping = true;
                    }
                    
                    // 应用重力和平台碰撞检测
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
                    
                case 'jumping': {
                    // 跳跃敌人：智能跳跃 + 方向变化
                    enemy.state = enemy.state || 'exploring';
                    
                    // 计算与玩家的相对位置
                    const dx = state.player.x - enemy.x;
                    const dy = state.player.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // 根据距离切换状态
                    if (distance < 150) {
                        enemy.state = 'attacking';
                    } else if (distance < 300) {
                        enemy.state = 'chasing';
                    } else {
                        enemy.state = 'exploring';
                    }
                    
                    // 实现更智能的跳跃行为
                    if (!enemy.isJumping) {
                        // 根据状态调整跳跃策略
                        let jumpForce = enemy.jumpForce;
                        
                        if (enemy.state === 'chasing') {
                            // 追逐时：向玩家方向跳跃
                            enemy.direction = dx > 0 ? 1 : -1;
                            jumpForce = enemy.jumpForce * 1.2; // 更强的跳跃
                        } else if (enemy.state === 'attacking') {
                            // 攻击时：保持一定距离跳跃
                            if (Math.abs(dx) < 80) {
                                enemy.direction = dx > 0 ? -1 : 1; // 反向跳跃
                                jumpForce = enemy.jumpForce * 0.8; // 较弱的跳跃
                            } else {
                                enemy.direction = dx > 0 ? 1 : -1; // 向玩家跳跃
                                jumpForce = enemy.jumpForce * 1.1;
                            }
                        } else {
                            // 探索时：随机方向跳跃
                            if (Math.random() < 0.3) {
                                enemy.direction *= -1;
                            }
                            jumpForce = enemy.jumpForce;
                        }
                        
                        // 执行跳跃
                        enemy.velocityY = jumpForce;
                        enemy.isJumping = true;
                        
                        // 添加跳跃加速
                        enemy.velocityX = enemy.direction * enemy.speed * 1.5;
                    }
                    
                    // 应用重力和平台碰撞检测
                    enemy.velocityY += enemy.gravity;
                    enemy.y += enemy.velocityY;
                    enemy.x += enemy.velocityX;
                    
                    // 地面摩擦
                    if (!enemy.isJumping) {
                        enemy.velocityX *= 0.8;
                    }
                    
                    // 边界检测
                    if (enemy.x < 0) enemy.x = 0;
                    if (enemy.x + enemy.width > CONFIG.canvasWidth) {
                        enemy.x = CONFIG.canvasWidth - enemy.width;
                    }
                    
                    // 平台碰撞检测
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
                    
                case 'tracking': {
                    // 追踪敌人：智能追踪 + 策略攻击
                    const targetX = state.player.x;
                    const targetY = state.player.y;
                    
                    // 初始化状态和属性
                    enemy.state = enemy.state || 'patrolling';
                    enemy.targetX = targetX;
                    enemy.targetY = targetY;
                    
                    // 精确的视线检测
                    const canSeePlayer = !state.platforms.some(platform => {
                        // 线段与矩形相交检测，判断是否有平台阻挡视线
                        const lineStart = { x: enemy.x + enemy.width/2, y: enemy.y + enemy.height/2 };
                        const lineEnd = { x: targetX + state.player.width/2, y: targetY + state.player.height/2 };
                        const rect = { 
                            x: platform.x, 
                            y: platform.y, 
                            width: platform.width, 
                            height: platform.height 
                        };
                        
                        // 简化的线段与矩形相交检测
                        return rect.y > Math.min(lineStart.y, lineEnd.y) && 
                               rect.y < Math.max(lineStart.y, lineEnd.y) && 
                               rect.x < Math.max(lineStart.x, lineEnd.x) && 
                               rect.x + rect.width > Math.min(lineStart.x, lineEnd.x);
                    });
                    
                    // 多层次状态切换
                    if (distance < 80 && canSeePlayer) {
                        enemy.state = 'attacking';
                    } else if (distance < 350 && canSeePlayer) {
                        enemy.state = 'chasing';
                    } else if (distance < 500) {
                        enemy.state = 'searching';
                    } else {
                        enemy.state = 'patrolling';
                    }
                    
                    // 实现复杂的行为逻辑
                    switch (enemy.state) {
                        case 'patrolling': {
                            // 智能巡逻：学习型巡逻路径
                            enemy.patrolPath = enemy.patrolPath || [
                                { x: enemy.x, y: enemy.y },
                                { x: enemy.x + 120, y: enemy.y },
                                { x: enemy.x + 120, y: enemy.y - 80 },
                                { x: enemy.x, y: enemy.y - 80 }
                            ];
                            enemy.patrolIndex = enemy.patrolIndex || 0;
                            
                            const currentPatrol = enemy.patrolPath[enemy.patrolIndex];
                            const patrolDx = currentPatrol.x - enemy.x;
                            const patrolDy = currentPatrol.y - enemy.y;
                            
                            if (Math.abs(patrolDx) < 15 && Math.abs(patrolDy) < 15) {
                                enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrolPath.length;
                            } else {
                                // 平滑移动到巡逻点
                                enemy.velocityX += (patrolDx * 0.05 - enemy.velocityX) * 0.2;
                                enemy.x += enemy.velocityX;
                                
                                // 跳跃到高处巡逻点
                                if (patrolDy < -20 && !enemy.isJumping) {
                                    enemy.velocityY = enemy.jumpForce * 1.2;
                                    enemy.isJumping = true;
                                }
                            }
                            break;
                        }
                        
                        case 'searching': {
                            // 搜索行为：螺旋式搜索
                            enemy.searchAngle = enemy.searchAngle || 0;
                            enemy.searchRadius = enemy.searchRadius || 50;
                            
                            enemy.x += Math.cos(enemy.searchAngle) * enemy.speed;
                            enemy.y += Math.sin(enemy.searchAngle) * enemy.speed * 0.5;
                            
                            enemy.searchAngle += 0.03;
                            enemy.searchRadius += 0.1;
                            
                            // 搜索范围限制
                            if (enemy.searchRadius > 200) {
                                enemy.searchRadius = 50;
                            }
                            break;
                        }
                        
                        case 'chasing': {
                            // 智能追逐：预测玩家移动
                            const playerVelocityX = state.player.velocityX;
                            const playerVelocityY = state.player.velocityY;
                            
                            // 预测目标位置
                            const predictedX = targetX + playerVelocityX * 3;
                            const predictedY = targetY + playerVelocityY * 3;
                            
                            // 平滑加速追踪
                            const chaseDx = predictedX - enemy.x;
                            const chaseDy = predictedY - enemy.y;
                            
                            enemy.velocityX += (chaseDx * 0.08 - enemy.velocityX) * 0.2;
                            enemy.x += enemy.velocityX;
                            
                            // 智能跳跃决策
                            const yDiff = chaseDy - enemy.y;
                            if (yDiff < -30 && distance < 300 && !enemy.isJumping) {
                                // 计算跳跃时机
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
                            // 策略攻击：保持最佳攻击距离
                            const optimalAttackDistance = 60;
                            const distanceDiff = Math.abs(targetX - enemy.x) - optimalAttackDistance;
                            
                            if (Math.abs(distanceDiff) > 10) {
                                // 调整位置到最佳攻击距离
                                const adjustDirection = distanceDiff > 0 ? Math.sign(chaseDx) : -Math.sign(chaseDx);
                                enemy.velocityX += (adjustDirection * enemy.speed * 0.6 - enemy.velocityX) * 0.3;
                                enemy.x += enemy.velocityX;
                            }
                            break;
                        }
                    }
                    
                    // 应用重力和平台碰撞检测
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
                    
                    // 智能攻击决策
                    if (enemy.state === 'attacking' && distance < enemy.attackRange && enemy.lastAttackCooldown <= 0) {
                        // 攻击前调整方向和位置
                        enemy.direction = targetX > enemy.x ? 1 : -1;
                        
                        // 攻击时机判断：玩家静止或移动缓慢时攻击
                        if (Math.abs(state.player.velocityX) < 2 || 
                            Math.abs(state.player.velocityY) < 2 || 
                            Math.random() < 0.3) {
                            enemyAttack(enemy, index);
                        }
                    }
                    break;
                }
                    
                case 'flying': {
                    // 飞行敌人：战术飞行 + 精准攻击
                    const flyTargetX = state.player.x;
                    const flyTargetY = state.player.y;
                    
                    // 初始化状态和属性
                    enemy.state = enemy.state || 'patrolling';
                    enemy.flySpeed = enemy.flySpeed || enemy.speed * 0.3;
                    enemy.attackCooldown = enemy.attackCooldown || 60;
                    enemy.orbitRadius = enemy.orbitRadius || 120;
                    
                    // 多层次状态切换
                    const visibilityDistance = 400;
                    if (distance < 100) {
                        enemy.state = 'attacking';
                    } else if (distance < visibilityDistance) {
                        enemy.state = 'chasing';
                    } else {
                        enemy.state = 'patrolling';
                    }
                    
                    // 实现高级飞行行为
                    switch (enemy.state) {
                        case 'patrolling': {
                            // 智能巡逻：三维空间巡逻
                            enemy.patrolCenter = enemy.patrolCenter || { x: enemy.x, y: enemy.y };
                            enemy.patrolTime = enemy.patrolTime || 0;
                            
                            // 三维椭圆运动
                            enemy.x = enemy.patrolCenter.x + Math.sin(enemy.patrolTime * 0.002) * 150;
                            enemy.y = enemy.patrolCenter.y + Math.cos(enemy.patrolTime * 0.003) * 80;
                            enemy.patrolTime += 1;
                            
                            break;
                        }
                        
                        case 'chasing': {
                            // 策略追逐：分阶段接近
                            const approachSpeed = 0.05;
                            const heightOffset = -20; // 保持在玩家上方
                            
                            // 分阶段接近：先横向，后纵向
                            const horizontalDistance = Math.abs(flyTargetX - enemy.x);
                            const verticalDistance = Math.abs((flyTargetY + heightOffset) - enemy.y);
                            
                            if (horizontalDistance > 50) {
                                // 先调整水平位置
                                enemy.x += (flyTargetX - enemy.x) * approachSpeed * 1.5;
                            } else {
                                // 再调整垂直位置
                                enemy.y += ((flyTargetY + heightOffset) - enemy.y) * approachSpeed * 1.2;
                            }
                            
                            // 添加飞行波动效果
                            enemy.y += Math.sin(state.lastTime * 0.01 + index) * 0.6;
                            break;
                        }
                        
                        case 'attacking': {
                            // 攻击策略：动态轨道 + 突然俯冲
                            enemy.attackPhase = enemy.attackPhase || 0;
                            enemy.attackTimer = enemy.attackTimer || 0;
                            
                            switch (enemy.attackPhase) {
                                case 0: {
                                    // 环绕轨道
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
                                    // 突然俯冲
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
                                    // 快速撤离
                                    enemy.x += (enemy.x - flyTargetX) * 0.1;
                                    enemy.y += (enemy.y - flyTargetY) * 0.1;
                                    
                                    enemy.attackTimer++;
                                    if (enemy.attackTimer > 80) {
                                        enemy.attackPhase = 0;
                                        enemy.attackTimer = 0;
                                        enemy.orbitRadius = Math.random() * 100 + 80; // 随机轨道半径
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    
                    // 保持面向玩家
                    enemy.direction = flyTargetX > enemy.x ? 1 : -1;
                    
                    // 精确的边界检查
                    enemy.x = Math.max(0, Math.min(CONFIG.canvasWidth - enemy.width, enemy.x));
                    enemy.y = Math.max(30, Math.min(CONFIG.canvasHeight - 80, enemy.y));
                    
                    // 智能攻击决策
                    const attackChance = enemy.state === 'attacking' ? 0.9 : 
                                         enemy.state === 'chasing' ? 0.4 : 0.15;
                    
                    if (distance < enemy.attackRange && enemy.lastAttackCooldown <= 0 && Math.random() < attackChance) {
                        // 根据攻击状态调整攻击类型
                        if (enemy.state === 'attacking' && enemy.attackPhase === 1) {
                            // 俯冲时使用强力攻击
                            enemyShoot(enemy, index);
                        } else {
                            // 普通攻击
                            enemyAttack(enemy, index);
                        }
                    }
                    break;
                }
                    
                case 'shooter': {
                    // 射手敌人：精准射击 + 战术撤退
                    // 初始化状态和属性
                    enemy.state = enemy.state || 'positioning';
                    enemy.attackCooldown = enemy.attackCooldown || 90;
                    enemy.shootAccuracy = enemy.shootAccuracy || 0.8;
                    enemy.retreatDistance = enemy.retreatDistance || 200;
                    
                    // 计算与玩家的相对位置
                    const dx = state.player.x - enemy.x;
                    const dy = state.player.y - enemy.y;
                    
                    // 面向玩家
                    enemy.direction = dx > 0 ? 1 : -1;
                    
                    // 智能位置选择：寻找最佳射击位置
                    let optimalPlatform = null;
                    let optimalScore = -Infinity;
                    
                    state.platforms.forEach(platform => {
                        const platformY = platform.y;
                        const platformCenterX = platform.x + platform.width / 2;
                        
                        // 计算平台评分：优先高处、视野开阔、距离适中
                        const heightScore = -platformY * 0.5; // 高处优先
                        const distanceScore = Math.max(0, 300 - Math.abs(dx)); // 距离适中优先
                        const widthScore = platform.width * 0.1; // 宽平台优先
                        
                        // 计算平台总分
                        const platformScore = heightScore + distanceScore + widthScore;
                        
                        if (platformScore > optimalScore) {
                            optimalScore = platformScore;
                            optimalPlatform = platform;
                        }
                    });
                    
                    // 精确的视线检测
                    const canSeePlayer = !state.platforms.some(platform => {
                        // 线段与矩形相交检测，判断是否有平台阻挡视线
                        const lineStart = { x: enemy.x + enemy.width/2, y: enemy.y + enemy.height/2 };
                        const lineEnd = { x: state.player.x + state.player.width/2, y: state.player.y + state.player.height/2 };
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
                    
                    // 根据距离、视野和状态执行不同行为
                    if (distance > 300 || (distance > 200 && !canSeePlayer)) {
                        // 远距离或视野被阻挡：接近玩家
                        enemy.state = 'approaching';
                        enemy.x += enemy.speed * enemy.direction * 0.7;
                        
                        // 尝试跳跃到更高的平台
                        if (optimalPlatform && enemy.y + enemy.height < optimalPlatform.y - 30 && !enemy.isJumping) {
                            if (Math.random() < 0.8) {
                                enemy.velocityY = enemy.jumpForce * 1.3;
                                enemy.isJumping = true;
                            }
                        }
                    } else if (distance < 120) {
                        // 近距离：战术撤退
                        enemy.state = 'retreating';
                        enemy.x -= enemy.speed * enemy.direction * 0.8;
                        
                        // 撤退时跳跃增加机动性
                        if (!enemy.isJumping && Math.random() < 0.5) {
                            enemy.velocityY = enemy.jumpForce * 0.9;
                            enemy.isJumping = true;
                        }
                    } else {
                        // 最佳距离：精准定位和射击
                        enemy.state = 'positioning';
                        
                        // 尝试移动到最优平台
                        if (optimalPlatform) {
                            const platformCenter = optimalPlatform.x + optimalPlatform.width / 2;
                            if (Math.abs(enemy.x - platformCenter) > 15) {
                                enemy.x += Math.sign(platformCenter - enemy.x) * enemy.speed * 0.4;
                            }
                            
                            // 如果不在平台上且可以跳跃，尝试跳跃到平台
                            if (enemy.y + enemy.height < optimalPlatform.y - 25 && !enemy.isJumping) {
                                if (Math.random() < 0.8) {
                                    enemy.velocityY = enemy.jumpForce * 1.4;
                                    enemy.isJumping = true;
                                }
                            }
                        }
                    }
                    
                    // 智能射击策略：预测玩家移动
                    const shootChance = enemy.state === 'positioning' ? 0.95 : 
                                         enemy.state === 'approaching' ? 0.3 : 0.1;
                    
                    if (distance < enemy.attackRange && enemy.lastAttackCooldown <= 0 && canSeePlayer && Math.random() < shootChance) {
                        // 计算射击提前量
                        const playerVelocityX = state.player.velocityX;
                        const playerVelocityY = state.player.velocityY;
                        const bulletSpeed = 8; // 子弹速度
                        
                        // 预测玩家未来位置
                        const timeToHit = distance / bulletSpeed;
                        const predictedPlayerX = state.player.x + playerVelocityX * timeToHit;
                        const predictedPlayerY = state.player.y + playerVelocityY * timeToHit;
                        
                        // 计算射击方向
                        const shootDx = predictedPlayerX - enemy.x;
                        const shootDy = predictedPlayerY - enemy.y;
                        const shootAngle = Math.atan2(shootDy, shootDx);
                        
                        // 根据敌人状态调整射击精度
                        let accuracy = enemy.shootAccuracy;
                        if (enemy.state === 'approaching') accuracy *= 0.5;
                        if (enemy.isJumping) accuracy *= 0.7;
                        
                        // 随机精度调整
                        const randomFactor = (Math.random() - 0.5) * (1 - accuracy) * 2;
                        const finalShootAngle = shootAngle + randomFactor;
                        
                        // 执行射击
                        enemyShoot(enemy, index);
                    }
                    
                    // 应用重力和平台碰撞检测
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
                    // 爆炸敌人：策略接近 + 延迟爆炸
                    enemy.state = enemy.state || 'approaching';
                    enemy.explosionRadius = enemy.explosionRadius || 100;
                    enemy.explosionDamage = enemy.explosionDamage || 40;
                    enemy.detectionRange = enemy.detectionRange || 300;
                    enemy.explosionDelay = enemy.explosionDelay || 30;
                    
                    // 计算与玩家的相对位置
                    const dx = state.player.x - enemy.x;
                    const dy = state.player.y - enemy.y;
                    
                    // 多层次状态管理
                    if (distance < enemy.explosionRadius * 0.5) {
                        // 近距离：准备爆炸
                        enemy.state = 'exploding';
                    } else if (distance < enemy.detectionRange) {
                        // 检测范围：加速接近
                        enemy.state = 'approaching';
                    } else {
                        // 远距离：缓慢移动
                        enemy.state = 'wandering';
                    }
                    
                    switch (enemy.state) {
                        case 'wandering': {
                            // 漫游行为：随机移动
                            enemy.wanderTimer = enemy.wanderTimer || 0;
                            enemy.wanderDirection = enemy.wanderDirection || (Math.random() > 0.5 ? 1 : -1);
                            
                            enemy.x += enemy.speed * enemy.wanderDirection * 0.5;
                            enemy.wanderTimer++;
                            
                            // 随机改变方向
                            if (enemy.wanderTimer > 60) {
                                enemy.wanderDirection *= -1;
                                enemy.wanderTimer = 0;
                            }
                            
                            // 偶尔跳跃
                            if (Math.random() < 0.02 && !enemy.isJumping) {
                                enemy.velocityY = enemy.jumpForce * 1.1;
                                enemy.isJumping = true;
                            }
                            break;
                        }
                        
                        case 'approaching': {
                            // 策略接近：预测玩家移动
                            const playerVelocityX = state.player.velocityX;
                            const playerVelocityY = state.player.velocityY;
                            
                            // 预测玩家未来位置
                            const predictionTime = 0.5;
                            const predictedX = state.player.x + playerVelocityX * predictionTime;
                            const predictedY = state.player.y + playerVelocityY * predictionTime;
                            
                            // 平滑加速追踪
                            const targetVelocityX = (predictedX > enemy.x + enemy.width / 2) ? enemy.speed * 1.8 : 
                                                   (predictedX < enemy.x - enemy.width / 2) ? -enemy.speed * 1.8 : 0;
                            enemy.velocityX += (targetVelocityX - enemy.velocityX) * 0.25;
                            enemy.direction = Math.sign(enemy.velocityX) || 1;
                            
                            enemy.x += enemy.velocityX;
                            
                            // 智能跳跃：计算跳跃轨迹
                            if (predictedY < enemy.y - 30 && distance < 350 && !enemy.isJumping) {
                                // 计算跳跃所需的水平速度和垂直速度
                                const jumpDistance = Math.abs(predictedX - enemy.x);
                                const jumpHeight = enemy.y - predictedY;
                                const gravity = enemy.gravity;
                                
                                // 简化的跳跃轨迹计算
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
                            // 爆炸准备：警告效果
                            enemy.explosionTimer = enemy.explosionTimer || 0;
                            enemy.explosionTimer++;
                            
                            // 爆炸倒计时动画
                            if (enemy.explosionTimer % 10 < 5) {
                                enemy.isBlinking = true;
                            } else {
                                enemy.isBlinking = false;
                            }
                            
                            // 触发爆炸
                            if (enemy.explosionTimer > enemy.explosionDelay) {
                                explodeEnemy(enemy, index);
                            }
                            break;
                        }
                    }
                    
                    // 应用重力和平台碰撞检测
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
            
            // 边界检查
            if (enemy.x < 0) enemy.x = 0;
            if (enemy.x + enemy.width > CONFIG.canvasWidth) {
                enemy.x = CONFIG.canvasWidth - enemy.width;
            }
            
            // 地面摩擦
            if (!enemy.isJumping && enemy.type !== 'flying') {
                enemy.velocityX *= 0.9;
            }
        });
    }
    
    // 敌人攻击
    function enemyAttack(enemy, index) {
        // 设置攻击冷却
        enemy.lastAttackCooldown = enemy.attackCooldown;
        
        // 创建攻击效果
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
        
        // 检查玩家是否被击中
        const player = state.player;
        if (
            attackEffect.x < player.x + player.width &&
            attackEffect.x + attackEffect.width > player.x &&
            attackEffect.y < player.y + player.height &&
            attackEffect.y + attackEffect.height > player.y
        ) {
            if (player.invincibilityFrames <= 0) {
                player.health -= attackEffect.damage;
                player.invincibilityFrames = 30; // 30帧无敌时间
                player.lastDamageTime = state.lastTime;
                updateHealthBar();
                if (player.health <= 0) {
                    gameOver();
                }
                // 添加受伤效果
                addParticles(player.x + player.width/2, player.y + player.height/2, 10, '#ff0000', 5);
            }
        }
    }
    
    // 敌人射击
    function enemyShoot(enemy, index) {
        // 设置攻击冷却
        enemy.lastAttackCooldown = enemy.attackCooldown;
        
        // 创建子弹
        const bullet = {
            x: enemy.x + (enemy.direction === 1 ? enemy.width : -20),
            y: enemy.y + enemy.height / 2 - 5,
            width: 20,
            height: 10,
            velocityX: enemy.direction * 8,
            velocityY: 0,
            damage: 15,
            type: 'bullet'
        };
        
        // 将子弹添加到敌人效果数组
        state.enemyEffects.push(bullet);
    }
    
    // 爆炸敌人的爆炸函数
    function explodeEnemy(enemy, index) {
        // 爆炸范围
        const explosionRadius = 100;
        const explosionDamage = 40;
        
        // 创建爆炸粒子效果
        addParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 50, '#ff9900', 15);
        addParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 30, '#ff3300', 20);
        
        // 检查玩家是否在爆炸范围内
        const player = state.player;
        const dx = player.x + player.width/2 - (enemy.x + enemy.width/2);
        const dy = player.y + player.height/2 - (enemy.y + enemy.height/2);
        const playerDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (playerDistance < explosionRadius) {
            // 计算伤害衰减
            const damageMultiplier = 1 - (playerDistance / explosionRadius);
            const finalDamage = Math.round(explosionDamage * damageMultiplier);
            
            if (player.invincibilityFrames <= 0) {
                player.health -= finalDamage;
                player.invincibilityFrames = 40;
                player.lastDamageTime = state.lastTime;
                
                // 击退效果
                const knockbackForce = 8 * damageMultiplier;
                player.velocityX = (player.x - enemy.x) > 0 ? knockbackForce : -knockbackForce;
                player.velocityY = -knockbackForce * 0.5;
                
                updateHealthBar();
                if (player.health <= 0) {
                    gameOver();
                }
            }
        }
        
        // 检查其他敌人是否在爆炸范围内
        state.enemies.forEach((otherEnemy, otherIndex) => {
            if (otherIndex !== index) {
                const otherDx = otherEnemy.x + otherEnemy.width/2 - (enemy.x + enemy.width/2);
                const otherDy = otherEnemy.y + otherEnemy.height/2 - (enemy.y + enemy.height/2);
                const otherDistance = Math.sqrt(otherDx * otherDx + otherDy * otherDy);
                
                if (otherDistance < explosionRadius) {
                    // 对其他敌人造成伤害
                    const damageMultiplier = 1 - (otherDistance / explosionRadius);
                    const finalDamage = Math.round(explosionDamage * damageMultiplier * 0.5);
                    otherEnemy.health -= finalDamage;
                    
                    // 击退效果
                    const knockbackForce = 5 * damageMultiplier;
                    otherEnemy.velocityX = (otherEnemy.x - enemy.x) > 0 ? knockbackForce : -knockbackForce;
                    otherEnemy.velocityY = -knockbackForce * 0.5;
                    
                    // 检查其他敌人是否死亡
                    if (otherEnemy.health <= 0) {
                        addParticles(otherEnemy.x + otherEnemy.width/2, otherEnemy.y + otherEnemy.height/2, 25, '#ff0000', 12);
                        state.enemies.splice(otherIndex, 1);
                    }
                }
            }
        });
        
        // 移除爆炸敌人
        state.enemies.splice(index, 1);
        
        // 增加分数
        state.score += 35;
        updateUI();
        
        // 检查关卡是否完成
        checkLevelComplete();
    }
    
    // 更新敌人效果
    function updateEnemyEffects() {
        state.enemyEffects = state.enemyEffects.filter(effect => {
            // 更新位置
            effect.x += effect.velocityX;
            effect.y += effect.velocityY;
            
            // 边界检查
            if (effect.x < 0 || effect.x > CONFIG.canvasWidth) {
                return false;
            }
            
            // 检查是否击中玩家
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
                    // 添加受伤效果
                    addParticles(player.x + player.width/2, player.y + player.height/2, 10, '#ff0000', 5);
                }
                return false;
            }
            
            return true;
        });
    }

    // 屏幕震动效果函数
    function addScreenShake() {
        if (!canvas) return;
        
        // 添加屏幕震动效果
        canvas.style.transform = 'translateX(2px) translateY(2px)';
        
        // 震动动画：快速震动几次
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
            // 关卡完成
            state.gameState = 'levelComplete';

            // 标记关卡为已完成
            if (!state.completedLevels.includes(state.currentLevel)) {
                state.completedLevels.push(state.currentLevel);
                // 更新关卡按钮
                generateLevelButtons();
            }

            // 绘制关卡完成画面
            drawLevelComplete();

            // 自动进入下一关（如果不是最后一关）
            if (state.currentLevel < LEVELS.length - 1) {
                setTimeout(() => {
                    loadLevel(state.currentLevel + 1);
                }, 2000);
            } else {
                // 游戏通关
                setTimeout(() => {
                    gameWin();
                }, 2000);
            }
        }
    }

    // 绘制游戏元素
    function draw() {
        try {
            // 保存当前上下文状态，避免样式污染
            ctx.save();
            
            // 优化：使用单一颜色背景，减少渐变计算
            ctx.fillStyle = '#1a0f41';
            ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

            // 绘制平台
            drawPlatforms();

            // 绘制道具
            drawProps();

            // 绘制敌人
            drawEnemies();

            // 绘制攻击效果
            drawAttackEffects();

            // 绘制粒子效果
            drawParticles();

            // 绘制玩家
            drawPlayer();
            
            // 优化：只在必要时绘制额外的UI元素
            if (state.gameState === 'playing') {
                // 绘制攻击力提升效果
                if (state.player.attackPower > 1) {
                    ctx.fillStyle = '#ffff33';
                    ctx.font = 'bold 18px Arial';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 8;
                    ctx.fillText('攻击力提升!', CONFIG.canvasWidth / 2, 35);
                    ctx.shadowBlur = 0;
                    
                    // 添加脉冲效果
                    const pulseScale = 1 + Math.sin(state.lastTime * 0.02) * 0.1;
                    ctx.save();
                    ctx.translate(CONFIG.canvasWidth / 2, 35);
                    ctx.scale(pulseScale, pulseScale);
                    ctx.fillText('攻击力提升!', 0, 0);
                    ctx.restore();
                }
                
                // 绘制连击数
                if (state.player.comboCount > 1) {
                    const comboFontSize = Math.min(40, 20 + state.player.comboCount * 2);
                    ctx.fillStyle = '#ffcc00';
                    ctx.font = `bold ${comboFontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.shadowColor = '#ff9900';
                    ctx.shadowBlur = 12;
                    
                    // 连击文字动画
                    const comboText = `${state.player.comboCount}x COMBO!`;
                    const bounceOffset = Math.sin(state.lastTime * 0.015) * 3;
                    ctx.fillText(comboText, CONFIG.canvasWidth / 2, 70 + bounceOffset);
                    
                    // 连击光环效果
                    if (state.player.comboCount >= 5) {
                        ctx.strokeStyle = `rgba(255, 204, 0, ${0.5 + Math.sin(state.lastTime * 0.03) * 0.3})`;
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.arc(CONFIG.canvasWidth / 2, 70, 60 + Math.sin(state.lastTime * 0.02) * 5, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    ctx.shadowBlur = 0;
                }
                
                // 绘制无敌状态效果
                if (state.player.invincibilityFrames > 0) {
                    // 玩家闪烁效果 - 优化：减少绘制调用
                    if (Math.floor(state.player.invincibilityFrames / 4) % 2 === 0) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                        ctx.shadowColor = '#ffffff';
                        ctx.shadowBlur = 15;
                        ctx.fillRect(state.player.x - 5, state.player.y - 5, state.player.width + 10, state.player.height + 10);
                        ctx.shadowBlur = 0;
                    }
                }
            }
            
            // 绘制游戏状态
            if (state.gameState === 'gameOver') {
                drawGameOver();
            } else if (state.gameState === 'levelComplete') {
                drawLevelComplete();
            }
            
            // 恢复上下文状态
            ctx.restore();
        } catch (error) {
            console.error('绘制游戏元素时出错:', error);
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
            
            // 计算透明度、缩放和旋转
            alpha = 1 - (effect.timer / effect.duration);
            scale = 1 + (effect.timer / effect.duration) * 0.3;
            rotation = (effect.timer / effect.duration) * Math.PI * 0.5;
            
            // 根据攻击类型设置颜色和效果
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
            
            // 保存当前绘图状态
            ctx.save();
            
            // 设置透明度
            ctx.globalAlpha = alpha;
            
            // 绘制攻击效果
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 25;
            
            // 应用缩放和旋转变换
            ctx.translate(effect.x + effect.width / 2, effect.y + effect.height / 2);
            ctx.scale(scale, scale);
            ctx.rotate(rotation);
            
            // 不同攻击类型的特殊效果
            if (effect.type === 'normal') {
                // 普通攻击：矩形效果
                ctx.fillRect(-effect.width / 2, -effect.height / 2, effect.width, effect.height);
            } else if (effect.type === 'heavy') {
                // 重攻击：梯形效果
                ctx.beginPath();
                ctx.moveTo(-effect.width / 2, -effect.height / 2);
                ctx.lineTo(effect.width / 2, -effect.height / 1.5);
                ctx.lineTo(effect.width / 2, effect.height / 1.5);
                ctx.lineTo(-effect.width / 2, effect.height / 2);
                ctx.closePath();
                ctx.fill();
            } else if (effect.type === 'special') {
                // 特殊攻击：星形效果
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
                // 敌人攻击：圆形效果
                ctx.beginPath();
                ctx.arc(0, 0, Math.max(effect.width, effect.height) / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 恢复绘图状态
            ctx.restore();
        });
    }

    // 绘制平台
    function drawPlatforms() {
        ctx.fillStyle = '#6a0dad';
        state.platforms.forEach(platform => {
            // 绘制平台
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // 平台发光效果
            ctx.shadowColor = '#9d4edd';
            ctx.shadowBlur = 15;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.shadowBlur = 0;
        });
    }

    // 绘制敌人
    function drawEnemies() {
        state.enemies.forEach(enemy => {
            // 确保敌人有生命值属性
            enemy.health = enemy.health || 100;
            enemy.maxHealth = enemy.maxHealth || 100;
            
            // 保存当前绘图状态
            ctx.save();
            
            // 敌人被击中时的闪烁效果
            if (enemy.isHit) {
                const hitAlpha = 0.5 + Math.sin(state.lastTime * 0.1) * 0.3;
                ctx.globalAlpha = hitAlpha;
            }
            
            // 敌人移动动画
            const moveOffset = Math.sin(state.lastTime * 0.02) * 2;
            const enemyY = enemy.y + moveOffset;
            
            // 根据敌人类型设置颜色和效果
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
                    // 飞行动画：上下浮动
                    enemyY += Math.sin(state.lastTime * 0.03) * 3;
                    break;
                case 'shooter':
                    enemyColor = '#ffff00';
                    shadowColor = '#ffff66';
                    break;
                case 'exploder':
                    enemyColor = '#ff3300';
                    shadowColor = '#ff6633';
                    // 爆炸前警告效果
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
            
            // 绘制敌人主体
            ctx.fillStyle = enemyColor;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 18;
            ctx.fillRect(enemy.x, enemyY, enemy.width, enemy.height);
            ctx.shadowBlur = 0;
            
            // 绘制敌人眼睛
            ctx.fillStyle = '#ffffff';
            const eyeSize = enemy.width * 0.15;
            ctx.fillRect(enemy.x + enemy.width * 0.3, enemyY + enemy.height * 0.2, eyeSize, eyeSize);
            ctx.fillRect(enemy.x + enemy.width * 0.55, enemyY + enemy.height * 0.2, eyeSize, eyeSize);
            
            // 绘制敌人瞳孔，跟随玩家
            const eyeXOffset = enemy.direction === 1 ? 0 : enemy.width * 0.15;
            ctx.fillStyle = '#000000';
            const pupilSize = enemy.width * 0.075;
            const pupilYOffset = enemy.isJumping ? 2 : 0;
            ctx.fillRect(enemy.x + enemy.width * 0.3 + eyeXOffset, enemyY + enemy.height * 0.2 + enemy.height * 0.05 + pupilYOffset, pupilSize, pupilSize);
            ctx.fillRect(enemy.x + enemy.width * 0.55 + eyeXOffset, enemyY + enemy.height * 0.2 + enemy.height * 0.05 + pupilYOffset, pupilSize, pupilSize);
            
            // 绘制敌人表情
            ctx.fillStyle = '#ffffff';
            if (enemy.isAttacking) {
                // 攻击时愤怒表情
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.1, 0, Math.PI);
                ctx.fill();
            } else if (enemy.isJumping) {
                // 跳跃时兴奋表情
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.08, 0, Math.PI, false);
                ctx.fill();
            } else {
                // 正常表情
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemyY + enemy.height * 0.4, enemy.width * 0.05, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 绘制敌人血条
            const healthPercent = enemy.health / enemy.maxHealth;
            const healthBarWidth = enemy.width * 0.8;
            const healthBarHeight = 5;
            const healthBarX = enemy.x + (enemy.width - healthBarWidth) / 2;
            const healthBarY = enemyY - 12;
            
            // 血条背景
            ctx.fillStyle = '#333333';
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
            
            // 血条填充 - 渐变效果
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
            
            // 血条边框
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
            
            // 恢复绘图状态
            ctx.restore();
        });
    }

    // 绘制玩家
    function drawPlayer() {
        const player = state.player;

        // 玩家呼吸动画
        const breathScale = 1 + Math.sin(state.lastTime * 0.005) * 0.02;

        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        ctx.scale(breathScale, breathScale);
        ctx.translate(-(player.x + player.width / 2), -(player.y + player.height / 2));

        if (player.isAttacking) {
            // 攻击动画
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 25;
            
            // 攻击冲刺效果
            const attackWidth = player.width + (player.facingDirection === 1 ? 30 : -30);
            const attackHeight = player.height + 10;
            ctx.fillRect(
                player.x + (player.facingDirection === 1 ? 0 : -attackWidth + player.width),
                player.y - 5,
                Math.abs(attackWidth),
                attackHeight
            );

            // 添加攻击动画效果
            ctx.fillStyle = '#ffffff';
            const slashWidth = 15;
            const slashHeight = 10;
            ctx.fillRect(
                player.x + player.width + (player.facingDirection === 1 ? 5 : -slashWidth - 5),
                player.y + player.height / 2 - slashHeight / 2,
                slashWidth,
                slashHeight
            );

            // 增强的攻击粒子效果
            for (let i = 0; i < 8; i++) {
                const particleX = player.x + player.width + (player.facingDirection === 1 ? 20 : -10) + Math.random() * 20;
                const particleY = player.y + Math.random() * player.height;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
                ctx.fillRect(particleX, particleY, 3, 3);
            }
        } else {
            // 站立/奔跑动画
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00aaff';
            ctx.shadowBlur = 18;

            // 奔跑动画：根据速度调整身体倾斜
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

        // 添加玩家眼睛
        ctx.fillStyle = '#ffffff';
        const eyeSize = 4;
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3, player.y + player.height * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7, player.y + player.height * 0.3, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加瞳孔
        ctx.fillStyle = '#000000';
        const pupilSize = eyeSize * 0.6;
        const pupilOffsetX = player.velocityX * 0.1;
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3 + pupilOffsetX, player.y + player.height * 0.3, pupilSize, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7 + pupilOffsetX, player.y + player.height * 0.3, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加玩家嘴巴（根据状态变化）
        ctx.fillStyle = '#ffffff';
        if (player.isAttacking) {
            // 攻击时张开嘴巴
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 5, 0, Math.PI);
            ctx.fill();
        } else if (player.isJumping) {
            // 跳跃时兴奋表情
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 4, 0, Math.PI, false);
            ctx.fill();
        } else if (Math.abs(player.velocityX) > 2) {
            // 奔跑时微笑
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 3, 0, Math.PI, false);
            ctx.fill();
        } else {
            // 站立时平静表情
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 攻击力提升特效
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
        
        // 护盾特效
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

    // 绘制敌人
    function drawEnemies() {
        state.enemies.forEach(enemy => {
            // 根据敌人类型设置不同颜色
            let enemyColor = '#ff0066';
            let shadowColor = '#ff66cc';
            
            switch (enemy.type) {
                case 'normal':
                    enemyColor = '#ff0066';
                    shadowColor = '#ff66cc';
                    break;
                case 'jumping':
                    enemyColor = '#ff6600';
                    shadowColor = '#ff9900';
                    break;
                case 'tracking':
                    enemyColor = '#00ff00';
                    shadowColor = '#66ff66';
                    break;
                case 'flying':
                    enemyColor = '#0066ff';
                    shadowColor = '#6699ff';
                    break;
                case 'shooter':
                    enemyColor = '#ff00ff';
                    shadowColor = '#ff66ff';
                    break;
                default:
                    enemyColor = '#ff0066';
                    shadowColor = '#ff66cc';
            }
            
            // 敌人发光效果
            ctx.fillStyle = enemyColor;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 10;
            
            // 敌人呼吸动画
            const enemyBreathScale = 1 + Math.sin(state.lastTime * 0.003) * 0.03;
            
            ctx.save();
            ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            ctx.scale(enemyBreathScale, enemyBreathScale);
            ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            ctx.restore();
            
            ctx.shadowBlur = 0;
            
            // 添加敌人眼睛
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.3, 2, 0, Math.PI * 2);
            ctx.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.3, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 添加敌人嘴巴（根据状态变化）
            ctx.fillStyle = '#000000';
            if (enemy.attacking) {
                // 攻击时张开嘴巴
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.4, 3, 0, Math.PI);
                ctx.fill();
            } else {
                // 愤怒表情
                ctx.beginPath();
                ctx.moveTo(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4);
                ctx.lineTo(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5);
                ctx.lineTo(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4);
                ctx.fill();
            }
            
            // 绘制敌人生命值条
            const healthPercent = enemy.health / enemy.maxHealth;
            ctx.fillStyle = '#333333';
            ctx.fillRect(enemy.x - 5, enemy.y - 15, enemy.width + 10, 8);
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(enemy.x - 3, enemy.y - 13, (enemy.width + 6) * healthPercent, 4);
        });
        
        // 绘制敌人子弹
        ctx.fillStyle = '#ff3300';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 5;
        state.enemyEffects.forEach(effect => {
            if (effect.type === 'bullet') {
                ctx.fillRect(effect.x, effect.y, effect.width, effect.height);
            }
        });
        ctx.shadowBlur = 0;
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

        // 计算时间差，用于控制游戏速度（限制最大deltaTime为16ms，约60fps）
        const deltaTime = Math.min(16, timestamp - state.lastTime);
        state.lastTime = timestamp;

        // 更新游戏状态（仅在游戏进行中）
        if (state.gameState === 'playing') {
            updatePlayer();
            
            // 时间冻结处理
            if (!state.timeFrozen) {
                updateEnemies();
            }
            
            updateProps();
            updateParticles();
            updateAttackEffects();
            updateEnemyEffects();
            updateBombs();
            
            // 更新时间冻结计时器
            if (state.timeFrozen) {
                state.timeFreezeTimer--;
                if (state.timeFreezeTimer <= 0) {
                    state.timeFrozen = false;
                    state.timeFreezeTimer = 0;
                }
            }
        }

        // 绘制游戏
        draw();

        // 继续游戏循环
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

        // 绘制游戏结束画面
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
        
        // 显示保存成功提示
        showNotification('游戏进度已保存');
    }
    
    // 从本地存储加载游戏进度
    function loadGameProgress() {
        const savedData = localStorage.getItem('stickmanAdventureProgress');
        if (savedData) {
            try {
                const gameData = JSON.parse(savedData);
                
                // 恢复游戏状态
                state.score = gameData.score || 0;
                state.completedLevels = gameData.completedLevels || [0];
                state.difficulty = gameData.difficulty || 'easy';
                
                // 生成关卡按钮
                generateLevelButtons();
                
                // 更新UI
                updateUI();
                
                // 显示加载成功提示
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
        // 创建通知元素
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
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 3秒后自动移除
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
        // 在游戏控制面板中添加按钮
        const gameControls = document.querySelector('.game-controls');
        
        // 检查按钮是否已存在，避免重复创建
        if (!document.getElementById('saveBtn')) {
            // 创建保存按钮
            const saveBtn = document.createElement('button');
            saveBtn.id = 'saveBtn';
            saveBtn.className = 'cyber-button control-btn';
            saveBtn.textContent = '💾 保存进度';
            saveBtn.addEventListener('click', saveGameProgress);
            
            // 添加到控制面板
            gameControls.appendChild(saveBtn);
        }
        
        if (!document.getElementById('loadBtn')) {
            // 创建加载按钮
            const loadBtn = document.createElement('button');
            loadBtn.id = 'loadBtn';
            loadBtn.className = 'cyber-button control-btn';
            loadBtn.textContent = '📂 加载进度';
            loadBtn.addEventListener('click', loadGameProgress);
            
            // 添加到控制面板
            gameControls.appendChild(loadBtn);
        }
    }

    // 公开方法
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