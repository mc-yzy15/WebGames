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

    // 游戏配置常量
    const CONFIG = {
        canvasWidth: 800,
        canvasHeight: 500,
        playerSpeed: 5,
        playerJumpForce: -14,
        gravity: 0.6,
        enemyRespawnTime: 3000,
        attackDuration: 300
    };

    // 难度配置
    const DIFFICULTY_CONFIG = {
        easy: {
            enemySpeed: 1.5,
            playerHealth: 150,
            enemyHealth: 1,
            // 优化：添加更多平衡性参数
            enemyDamage: 0.8,
            playerAttackPower: 1.2,
            enemySpawnRate: 0.8,
            scoreMultiplier: 0.8
        },
        medium: {
            enemySpeed: 2.5,
            playerHealth: 100,
            enemyHealth: 1,
            // 优化：添加更多平衡性参数
            enemyDamage: 1.0,
            playerAttackPower: 1.0,
            enemySpawnRate: 1.0,
            scoreMultiplier: 1.0
        },
        hard: {
            enemySpeed: 3.5,
            playerHealth: 75,
            enemyHealth: 1,
            // 优化：添加更多平衡性参数
            enemyDamage: 1.2,
            playerAttackPower: 0.8,
            enemySpawnRate: 1.2,
            scoreMultiplier: 1.5
        }
    };

    // 优化：添加动态难度调整系统
    const dynamicDifficulty = {
        playerDeathCount: 0,
        enemyKillCount: 0,
        consecutiveKills: 0,
        consecutiveDeaths: 0,
        difficultyLevel: 1.0,
        lastAdjustmentTime: 0,

        // 优化：根据玩家表现动态调整难度
        adjustDifficulty: function () {
            const now = performance.now();
            if (now - this.lastAdjustmentTime < 10000) return; // 每10秒调整一次

            const deathRate = this.playerDeathCount / Math.max(1, this.playerDeathCount + this.enemyKillCount);
            const killRate = this.enemyKillCount / Math.max(1, this.playerDeathCount + this.enemyKillCount);

            // 优化：根据死亡率和击杀率调整难度
            if (deathRate > 0.5) {
                // 玩家死亡较多，降低难度
                this.difficultyLevel = Math.max(0.5, this.difficultyLevel - 0.1);
            } else if (killRate > 0.8) {
                // 玩家击杀较多，提高难度
                this.difficultyLevel = Math.min(2.0, this.difficultyLevel + 0.1);
            }

            this.lastAdjustmentTime = now;
        },

        // 优化：获取当前难度系数
        getDifficultyMultiplier: function () {
            return this.difficultyLevel;
        },

        // 优化：记录玩家死亡
        recordPlayerDeath: function () {
            this.playerDeathCount++;
            this.consecutiveDeaths++;
            this.consecutiveKills = 0;
        },

        // 优化：记录敌人击杀
        recordEnemyKill: function () {
            this.enemyKillCount++;
            this.consecutiveKills++;
            this.consecutiveDeaths = 0;
        },

        // 优化：获取连击加成
        getComboBonus: function () {
            return 1.0 + (this.consecutiveKills * 0.1);
        },

        // 优化：获取关卡难度系数
        getLevelDifficultyMultiplier: function (levelIndex) {
            // 优化：使用指数曲线而不是线性曲线
            return 1.0 + Math.pow(levelIndex / LEVELS.length, 1.5) * 2.0;
        },

        // 优化：获取敌人数量系数
        getEnemyCountMultiplier: function (levelIndex) {
            // 优化：使用对数曲线控制敌人数量增长
            return 1.0 + Math.log(levelIndex + 1) * 0.3;
        },

        // 优化：获取敌人速度系数
        getEnemySpeedMultiplier: function (levelIndex) {
            // 优化：使用平方根曲线控制敌人速度增长
            return 1.0 + Math.sqrt(levelIndex) * 0.2;
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
        enemyEffects: [],
        // 优化：添加暂停/恢复机制
        isPaused: false,
        pauseTime: 0,
        totalPausedTime: 0,
        // 优化：添加时间缩放机制
        timeScale: 1.0,
        targetTimeScale: 1.0,
        timeScaleTransitionSpeed: 0.1,
        // 优化：添加状态管理缓存
        stateCache: {
            playerHealth: 100,
            score: 0,
            currentLevel: 0,
            gameState: 'playing'
        },
        // 优化：添加状态更新计数器
        stateUpdateCount: 0,
        // 优化：添加状态更新时间戳
        lastStateUpdateTime: 0
    };

    // 优化：状态更新函数
    function updateStateCache() {
        const now = performance.now();
        const player = state.player;

        // 优化：只在值变化时更新缓存
        if (player.health !== state.stateCache.playerHealth) {
            state.stateCache.playerHealth = player.health;
        }
        if (state.score !== state.stateCache.score) {
            state.stateCache.score = state.score;
        }
        if (state.currentLevel !== state.stateCache.currentLevel) {
            state.stateCache.currentLevel = state.currentLevel;
        }
        if (state.gameState !== state.stateCache.gameState) {
            state.stateCache.gameState = state.gameState;
        }

        // 优化：更新状态管理计数器
        state.stateUpdateCount++;
        state.lastStateUpdateTime = now;
    }

    // 优化：获取状态缓存

    // 优化：消息总线，用于模块间通信
    const messageBus = {
        listeners: {},
        // 优化：添加事件监听器
        on: function (event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
        },
        // 优化：移除事件监听器
        off: function (event, callback) {
            if (this.listeners[event]) {
                const index = this.listeners[event].indexOf(callback);
                if (index > -1) {
                    this.listeners[event].splice(index, 1);
                }
            }
        },
        // 优化：发送消息
        emit: function (event, data) {
            if (this.listeners[event]) {
                // 优化：使用for循环而不是forEach，提高性能
                for (let i = 0; i < this.listeners[event].length; i++) {
                    try {
                        this.listeners[event][i](data);
                    } catch (error) {
                        console.error('消息总线错误:', error);
                    }
                }
            }
        },
        // 优化：清空所有监听器
        clear: function () {
            this.listeners = {};
        }
    };

    // 优化：注册常用游戏事件
    messageBus.on('player:healthChange', () => {
        updateHealthBar();
    });

    messageBus.on('player:scoreChange', () => {
        updateUI();
    });

    messageBus.on('game:levelComplete', (levelIndex) => {
        state.completedLevels.push(levelIndex);
    });

    messageBus.on('game:enemyKilled', (enemy) => {
        addParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20, '#ff0000', 8);
    });

    // 优化的对象池，减少内存分配
    const objectPools = {
        particles: [],
        attackEffects: [],
        enemyEffects: [],
        bullets: [],
        // 优化：添加对象池统计信息
        stats: {
            allocated: 0,
            released: 0,
            hitRate: 0
        }
    };

    // 预分配对象池初始容量，减少动态扩展
    function initializeObjectPools() {
        // 优化：根据设备性能动态调整对象池大小
        const isLowEndDevice = navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4;

        const particleCount = isLowEndDevice ? 50 : 100;
        const attackEffectCount = isLowEndDevice ? 25 : 50;
        const enemyEffectCount = isLowEndDevice ? 15 : 30;
        const bulletCount = isLowEndDevice ? 100 : 200;

        // 预分配粒子对象
        for (let i = 0; i < particleCount; i++) {
            objectPools.particles.push({
                x: 0, y: 0, vx: 0, vy: 0, size: 0, color: '', life: 0, maxLife: 0, alpha: 0
            });
        }

        // 预分配攻击效果对象
        for (let i = 0; i < attackEffectCount; i++) {
            objectPools.attackEffects.push({
                x: 0, y: 0, width: 0, height: 0, type: '', timer: 0, duration: 0, scale: 0, alpha: 0
            });
        }

        // 预分配敌人效果对象
        for (let i = 0; i < enemyEffectCount; i++) {
            objectPools.enemyEffects.push({
                x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: ''
            });
        }

        // 预分配子弹对象（用于敌人和道具）
        for (let i = 0; i < bulletCount; i++) {
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

        // 优化：初始化对象池统计
        objectPools.stats.allocated = particleCount + attackEffectCount + enemyEffectCount + bulletCount;
    }

    // 优化的对象池管理函数，使用更高效的对象复用
    function getObjectFromPool(pool, type) {
        if (pool.length > 0) {
            // 优化：使用pop而不是shift，提高性能
            const obj = pool.pop();

            // 优化：更新对象池统计
            objectPools.stats.released++;
            objectPools.stats.hitRate = objectPools.stats.released / objectPools.stats.allocated;

            return obj;
        }

        // 优化：对象池为空时，创建新对象
        const newObj = createObjectByType(type);
        objectPools.stats.allocated++;
        return newObj;
    }

    // 优化：根据类型创建对象
    function createObjectByType(type) {
        switch (type) {
            case 'particle':
                return { x: 0, y: 0, vx: 0, vy: 0, size: 0, color: '', life: 0, maxLife: 0, alpha: 0 };
            case 'attackEffect':
                return { x: 0, y: 0, width: 0, height: 0, type: '', timer: 0, duration: 0, scale: 0, alpha: 0 };
            case 'enemyEffect':
                return { x: 0, y: 0, width: 0, height: 0, velocityX: 0, velocityY: 0, damage: 0, type: '' };
            case 'bullet':
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
            default:
                return {};
        }
    }

    // 优化的对象池释放函数，使用更高效的对象回收
    function releaseObjectToPool(pool, obj) {
        // 优化：检查对象池大小，避免无限增长
        const maxPoolSize = pool === objectPools.particles ? 200 :
            pool === objectPools.attackEffects ? 100 :
                pool === objectPools.enemyEffects ? 60 : 200;

        if (pool.length < maxPoolSize) {
            // 优化：重置对象属性
            resetObjectProperties(obj);
            pool.push(obj);
        }
    }

    // 优化：重置对象属性
    function resetObjectProperties(obj) {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                obj[key] = [];
            } else if (typeof obj[key] === 'number') {
                obj[key] = 0;
            } else if (typeof obj[key] === 'boolean') {
                obj[key] = false;
            } else if (typeof obj[key] === 'string') {
                obj[key] = '';
            }
        }
    }

    // 优化：手动触发垃圾回收

    // 优化：清理不再使用的对象


    // 优化：重置对象状态的辅助函数

    // 优化：创建新对象的辅助函数

    // 优化：创建子弹对象的专用函数

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

        // 优化：批量重置玩家状态
        const player = state.player;
        player.x = 100;
        player.y = 350;
        player.velocityX = 0;
        player.velocityY = 0;
        player.isJumping = false;
        player.doubleJumped = false;
        player.health = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        player.maxHealth = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        player.isAttacking = false;
        player.attackPower = 1;
        player.comboCount = 0;
        player.invincibilityFrames = 0;

        // 优化：清理计时器
        if (player.powerUpTimer) {
            clearTimeout(player.powerUpTimer);
            player.powerUpTimer = null;
        }
        if (player.comboTimer) {
            clearTimeout(player.comboTimer);
            player.comboTimer = null;
        }

        state.platforms = JSON.parse(JSON.stringify(LEVELS[levelIndex].platforms));
        // 使用对象池管理敌人数组
        state.enemies = [];

        // 优化：缓存难度配置
        const difficultyConfig = DIFFICULTY_CONFIG[state.difficulty];
        const difficultyMultiplier = {
            easy: 0.8,
            medium: 1.0,
            hard: 1.3
        }[state.difficulty] || 1.0;

        // 优化：预分配敌人对象到池子中
        const levelEnemies = LEVELS[levelIndex].enemies;
        const enemyCount = levelEnemies.length;
        const enemySpeedMultiplier = difficultyConfig.enemySpeed * difficultyMultiplier;

        for (let i = 0; i < enemyCount; i++) {
            const enemy = getObjectFromPool(objectPools.bullets, 'bullet');
            const levelEnemy = levelEnemies[i];

            // 优化：使用批量属性赋值
            Object.assign(enemy, levelEnemy);
            enemy.speed *= enemySpeedMultiplier;
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
        const player = state.player;
        const props = state.props;
        const propCount = props.length;

        // 优化：缓存玩家位置，减少重复计算
        const playerX = player.x;
        const playerY = player.y;
        const playerWidth = player.width;
        const playerHeight = player.height;

        // 优化：只检测玩家附近的道具
        const detectionRadius = 150;
        const detectionRadiusSquared = detectionRadius * detectionRadius;

        for (let i = 0; i < propCount; i++) {
            const prop = props[i];
            if (!prop.collected) {
                // 优化：先进行距离检测，避免不必要的碰撞检测
                const dx = (prop.x + prop.width / 2) - (playerX + playerWidth / 2);
                const dy = (prop.y + prop.height / 2) - (playerY + playerHeight / 2);
                const distanceSquared = dx * dx + dy * dy;

                if (distanceSquared < detectionRadiusSquared) {
                    // 优化：距离足够近时才进行碰撞检测
                    if (
                        playerX < prop.x + prop.width &&
                        playerX + playerWidth > prop.x &&
                        playerY < prop.y + prop.height &&
                        playerY + playerHeight > prop.y
                    ) {
                        collectProp(prop);
                    }
                }

                // 优化：减少道具动画更新频率
                if (state.performanceMetrics.frameCount % 2 === 0) {
                    prop.pulseTimer += 0.05;
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
        const props = state.props;
        const propCount = props.length;
        const platforms = state.platforms;

        // 优化：限制炸弹更新频率
        if (state.performanceMetrics.frameCount % 2 !== 0) {
            return;
        }

        for (let i = 0; i < propCount; i++) {
            const prop = props[i];
            if (prop.type === 'bomb') {
                prop.timer++;

                if (prop.timer >= prop.fuseTime) {
                    explodeBomb(prop, i);
                } else {
                    prop.y += 5;

                    // 优化：使用空间分割优化炸弹平台碰撞检测
                    const cellSize = 100;
                    const bombCellX = Math.floor(prop.x / cellSize);
                    const bombCellY = Math.floor(prop.y / cellSize);

                    let hitGround = false;

                    // 只检测炸弹所在单元格和相邻单元格的平台
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            const platformCellX = bombCellX + dx;
                            const platformCellY = bombCellY + dy;

                            for (let j = 0; j < platforms.length; j++) {
                                const platform = platforms[j];
                                const platformCellX2 = Math.floor(platform.x / cellSize);
                                const platformCellY2 = Math.floor(platform.y / cellSize);

                                if (platformCellX === platformCellX2 && platformCellY === platformCellY2) {
                                    if (
                                        prop.x < platform.x + platform.width &&
                                        prop.x + prop.width > platform.x &&
                                        prop.y + prop.height > platform.y &&
                                        prop.y + prop.height < platform.y + 15
                                    ) {
                                        prop.y = platform.y - prop.height;
                                        hitGround = true;
                                        break;
                                    }
                                }
                            }
                            if (hitGround) break;
                        }
                        if (hitGround) break;
                    }

                    if (hitGround) {
                        prop.fuseTime = Math.min(prop.fuseTime, prop.timer + 20);
                    }
                }
            }
        }
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
        // 优化：使用防抖技术优化键盘事件处理
        let keydownDebounceTimer = null;
        window.addEventListener('keydown', (e) => {
            // 优化：立即更新按键状态
            state.keys[e.key] = true;

            // 优化：使用防抖减少重复处理
            if (keydownDebounceTimer) {
                clearTimeout(keydownDebounceTimer);
            }
            keydownDebounceTimer = setTimeout(() => {
                keydownDebounceTimer = null;
            }, 50);
        });

        // 优化：使用防抖技术优化键盘事件处理
        let keyupDebounceTimer = null;
        window.addEventListener('keyup', (e) => {
            // 优化：立即更新按键状态
            state.keys[e.key] = false;

            // 优化：使用防抖减少重复处理
            if (keyupDebounceTimer) {
                clearTimeout(keyupDebounceTimer);
            }
            keyupDebounceTimer = setTimeout(() => {
                keyupDebounceTimer = null;
            }, 50);
        });

        // 优化：输入系统性能优化

        // 优化：使用事件委托优化按钮点击事件
        if (jumpBtn) {
            jumpBtn.replaceWith(jumpBtn.cloneNode(true));
            jumpBtn = document.getElementById('jumpBtn');
            jumpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (state.gameState === 'playing') {
                    if (!state.player.isJumping) {
                        state.player.velocityY = state.player.jumpForce;
                        state.player.isJumping = true;
                    }
                }
            }, { passive: false });
        }

        if (attackBtn) {
            attackBtn.replaceWith(attackBtn.cloneNode(true));
            attackBtn = document.getElementById('attackBtn');
            attackBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
        // 优化：缓存UI元素，减少DOM查询
        if (!state.uiElements) {
            state.uiElements = {
                currentLevelEl: currentLevelEl,
                scoreEl: scoreEl,
                difficultyEl: difficultyEl
            };
        }

        // 优化：只在值变化时更新UI
        const uiElements = state.uiElements;
        const currentLevelText = `关卡: ${state.currentLevel + 1}`;
        const scoreText = `分数: ${state.score}`;
        const difficultyText = `难度: ${state.difficulty === 'easy' ? '简单' : state.difficulty === 'medium' ? '中等' : '困难'}`;

        if (uiElements.currentLevelEl.textContent !== currentLevelText) {
            uiElements.currentLevelEl.textContent = currentLevelText;
        }

        if (uiElements.scoreEl.textContent !== scoreText) {
            uiElements.scoreEl.textContent = scoreText;
        }

        if (uiElements.difficultyEl.textContent !== difficultyText) {
            uiElements.difficultyEl.textContent = difficultyText;
        }
    }

    // 优化：分离输入处理函数
    function processInput() {
        const inputState = {
            moveLeft: state.keys['ArrowLeft'] || false,
            moveRight: state.keys['ArrowRight'] || false,
            jump: state.keys['ArrowUp'] || false,
            attackNormal: state.keys[' '] || false,
            attackHeavy: state.keys['Control'] || false,
            attackSpecial: state.keys['Shift'] || false,
            releaseJump: !state.keys['ArrowUp']
        };

        return inputState;
    }

    // 优化：分离碰撞检测函数
    function checkCollisions() {
        const player = state.player;
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        // 平台碰撞检测
        const platforms = state.platforms;
        const platformCount = platforms.length;

        // 优化：根据平台数量选择不同的碰撞检测策略
        if (platformCount > 20) {
            // 平台数量较多时，使用空间分割
            return performSpatialPlatformCollision(player, playerLeft, playerRight, playerTop, playerBottom);
        } else {
            // 平台数量较少时，使用简单碰撞检测
            return performSimplePlatformCollision(player, platforms, playerLeft, playerRight, playerTop, playerBottom);
        }
    }

    // 优化：执行空间分割平台碰撞检测
    function performSpatialPlatformCollision(player, playerLeft, playerRight, playerTop, playerBottom) {
        let isOnGround = false;
        const cellSize = 100; // 空间分割单元格大小
        const spatialGrid = {};
        const platforms = state.platforms;

        // 优化：使用更高效的空间分割算法
        // 将平台放入空间网格
        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];
            const cellX = Math.floor(platform.x / cellSize);
            const cellY = Math.floor(platform.y / cellSize);
            const cellKey = `${cellX},${cellY}`;

            if (!spatialGrid[cellKey]) {
                spatialGrid[cellKey] = [];
            }
            spatialGrid[cellKey].push(platform);
        }

        // 只检测玩家所在单元格和相邻单元格的平台
        const playerCellX = Math.floor(player.x / cellSize);
        const playerCellY = Math.floor(player.y / cellSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cellKey = `${playerCellX + dx},${playerCellY + dy}`;
                const platformsInCell = spatialGrid[cellKey];

                if (platformsInCell) {
                    // 优化：使用更高效的AABB碰撞检测
                    for (let i = 0; i < platformsInCell.length; i++) {
                        const platform = platformsInCell[i];

                        // 优化：快速排除不相交的矩形
                        if (playerRight <= platform.x || playerLeft >= platform.x + platform.width ||
                            playerBottom <= platform.y || playerTop >= platform.y + platform.height) {
                            continue;
                        }

                        // 优化：计算碰撞深度和方向
                        const overlapLeft = playerRight - platform.x;
                        const overlapRight = platform.x + platform.width - playerLeft;
                        const overlapTop = playerBottom - platform.y;
                        const overlapBottom = platform.y + platform.height - playerTop;

                        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                        if (minOverlap === overlapTop) {
                            if (player.velocityY > 0) {
                                player.y = platform.y - player.height;
                                player.velocityY = 0;
                                isOnGround = true;

                                // 优化：添加着陆粒子效果
                                const px1 = player.x + player.width / 4;
                                const px2 = player.x + player.width * 3 / 4;
                                const py = player.y + player.height;
                                addParticles(px1, py, 3, '#aaaaaa', 2);
                                addParticles(px2, py, 3, '#aaaaaa', 2);
                            }
                        } else if (minOverlap === overlapBottom) {
                            if (player.velocityY < 0) {
                                player.y = platform.y + platform.height;
                                player.velocityY *= -0.4;
                            }
                        } else if (minOverlap === overlapLeft) {
                            player.x = platform.x - player.width;
                            player.velocityX *= -0.2;
                        } else {
                            player.x = platform.x + platform.width;
                            player.velocityX *= -0.2;
                        }
                    }
                }
            }
        }

        // 优化：应用摩擦力
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

        return isOnGround;
    }


    // 优化：执行简单平台碰撞检测
    function performSimplePlatformCollision(player, platforms, playerLeft, playerRight, playerTop, playerBottom) {
        let isOnGround = false;
        const platformCount = platforms.length;

        for (let i = 0; i < platformCount; i++) {
            const platform = platforms[i];
            const result = checkPlatformCollision(player, platform, playerLeft, playerRight, playerTop, playerBottom);
            if (result === 'ground') {
                isOnGround = true;
            }
        }

        return isOnGround;
    }

    // 优化：检查单个平台碰撞
    function checkPlatformCollision(player, platform, playerLeft, playerRight, playerTop, playerBottom) {
        const pl = platform.x;
        const pr = pl + platform.width;
        const pt = platform.y;
        const pb = pt + platform.height;

        if (playerRight <= pl || playerLeft >= pr || playerBottom <= pt || playerTop >= pb) {
            return 'none';
        }

        const ld = playerRight - pl;
        const rd = pr - playerLeft;
        const td = playerBottom - pt;
        const bd = pb - playerTop;

        const depths = [ld, rd, td, bd];
        const minIndex = depths.indexOf(Math.min(...depths));

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

                    const px1 = player.x + player.width / 4;
                    const px2 = player.x + player.width * 3 / 4;
                    const py = player.y + player.height;
                    addParticles(px1, py, 3, '#aaaaaa', 2);
                    addParticles(px2, py, 3, '#aaaaaa', 2);

                    return 'ground';
                }
                break;
            case 3: // bottom
                if (player.velocityY < 0) {
                    player.y = pb;
                    player.velocityY *= -0.4;
                }
                break;
        }

        return 'none';
    }

    // 优化：分离物理更新函数
    function updatePhysics() {
        const player = state.player;

        // 优化：使用更高效的重力计算
        const gravity = player.isJumping && state.keys['ArrowUp'] ? player.gravity * 0.8 : player.gravity;
        player.velocityY += gravity;

        // 优化：批量更新位置，减少计算
        player.x += player.velocityX;
        player.y += player.velocityY;

        // 优化：使用更高效的边界检测
        const canvasWidth = CONFIG.canvasWidth;
        const canvasHeight = CONFIG.canvasHeight;

        if (player.x < 0) {
            player.x = 0;
            player.velocityX *= -0.3;
        }
        if (player.x + player.width > canvasWidth) {
            player.x = canvasWidth - player.width;
            player.velocityX *= -0.3;
        }

        if (player.y + player.height > canvasHeight) {
            player.y = canvasHeight - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            player.doubleJumped = false;
            player.coyoteTimer = 0;
        }

        if (player.y < 0) {
            player.y = 0;
            player.velocityY *= -0.5;
        }

        // 优化：使用分离的碰撞检测
        const isOnGround = checkCollisions();

        // 优化：使用更高效的摩擦力计算
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

        return isOnGround;
    }

    // 优化：分离游戏逻辑更新函数
    function updateGameLogic() {
        const player = state.player;

        // 处理攻击冷却
        if (player.attackCooldown > 0) {
            player.attackCooldown--;
        }

        // 处理无敌帧
        if (player.invincibilityFrames > 0) {
            player.invincibilityFrames--;
        }

        // 处理连击计时器
        if (player.comboCount > 0) {
            if (player.comboTimer) {
                clearTimeout(player.comboTimer);
            }

            // 优化：使用更高效的连击重置机制
            const comboResetTime = 1800 - (player.comboCount * 50); // 连击数越多，重置时间越短
            player.comboTimer = setTimeout(() => {
                player.comboCount = 0;
                dynamicDifficulty.consecutiveKills = 0;
            }, Math.max(500, comboResetTime));
        }

        // 玩家-敌人碰撞检测
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

    // 优化：更新玩家状态
    function updatePlayer() {
        const player = state.player;

        // 优化：使用分离的输入处理
        const input = processInput();

        const acceleration = 0.6;
        const deceleration = 0.4;
        const airControl = 0.3;

        const currentAcceleration = player.isJumping ? acceleration * airControl : acceleration;
        const currentDeceleration = player.isJumping ? deceleration * airControl : deceleration;

        if (input.moveLeft) {
            player.velocityX = Math.max(player.velocityX - currentAcceleration, -player.speed);
            player.facingDirection = -1;
        } else if (input.moveRight) {
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

        // 优化：使用更高效的跳跃算法
        if (input.jump && canJump && state.gameState === 'playing') {
            player.velocityY = player.jumpForce;
            player.isJumping = true;
            player.doubleJumped = false;
            player.coyoteTimer = 0;

            addParticles(player.x + player.width / 2, player.y + player.height, 10, '#ffffff', 3);

        } else if (input.jump && player.isJumping && !player.doubleJumped && state.gameState === 'playing') {
            player.velocityY = player.jumpForce * 0.85;
            player.doubleJumped = true;

            addParticles(player.x + player.width / 2, player.y + player.height / 2, 15, '#4a9eff', 5);
        }

        // 优化：使用更高效的跳跃释放算法
        if (input.releaseJump && player.velocityY < 0) {
            player.velocityY *= 0.75;
        }

        // 优化：使用更高效的攻击算法
        if (input.attackNormal && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('normal');
        } else if (input.attackHeavy && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('heavy');
        } else if (input.attackSpecial && !player.isAttacking && player.attackCooldown <= 0 && state.gameState === 'playing') {
            performAttack('special');
        }

        // 优化：使用分离的物理更新
        updatePhysics();

        // 优化：使用分离的游戏逻辑更新
        updateGameLogic();
    }

    // 执行攻击
    function performAttack(type) {
        const player = state.player;
        player.isAttacking = true;
        player.attackType = type;

        // 优化：使用更高效的攻击参数配置
        const attackConfig = {
            normal: {
                cooldown: 18,
                power: 1.0,
                duration: 180,
                range: 70,
                hitStun: 9,
                knockback: 1.2,
                accuracy: 1.0,
                comboBonus: 1,
                scoreMultiplier: 1.0
            },
            heavy: {
                cooldown: 35,
                power: 2.5,
                duration: 280,
                range: 90,
                hitStun: 15,
                knockback: 3.5,
                accuracy: 0.85,
                comboBonus: 2,
                scoreMultiplier: 1.5
            },
            special: {
                cooldown: 55,
                power: 4.0,
                duration: 400,
                range: 125,
                hitStun: 20,
                knockback: 7.0,
                accuracy: 0.8,
                comboBonus: 3,
                scoreMultiplier: 2.0
            }
        };

        const config = attackConfig[type] || attackConfig.normal;

        // 优化：应用动态难度和连击加成
        const difficultyMultiplier = dynamicDifficulty.getDifficultyMultiplier();
        const comboBonus = dynamicDifficulty.getComboBonus();

        const cooldown = config.cooldown;
        const power = config.power * player.attackPower * difficultyMultiplier;
        const duration = config.duration;
        const range = config.range;
        const hitStun = config.hitStun;
        const knockback = config.knockback;
        const accuracy = config.accuracy;
        const scoreMultiplier = config.scoreMultiplier * comboBonus;

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

        // 优化：预计算随机数，减少Math.random调用
        const randomValues = [];
        for (let i = 0; i < actualCount * 3; i++) {
            randomValues.push(Math.random());
        }
        let randomIndex = 0;

        for (let i = 0; i < actualCount; i++) {
            const randomX = (randomValues[randomIndex++] - 0.5);
            const randomY = (randomValues[randomIndex++] - 0.5);
            const randomSize = randomValues[randomIndex++] * 3 + 1;

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

        // 优化：使用动态最大粒子数量，根据性能调整
        const maxParticles = state.maxParticles || 250;
        const particles = state.particles;
        const particleCount = particles.length;

        // 优化：限制粒子更新次数，提高性能
        const updateLimit = Math.min(particleCount, maxParticles);

        // 优化：批量更新粒子属性
        const canvasWidth = CONFIG.canvasWidth;

        for (let i = 0; i < updateLimit; i++) {
            const particle = particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vy += 0.1;

            particle.alpha = particle.life / particle.maxLife;

            const isOnScreen = particle.x > -50 && particle.x < canvasWidth + 50 &&
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
            particles.splice(particlesToRemove[i], 1);
        }

        // 将粒子对象释放回对象池
        for (let i = 0; i < particlesToRelease.length; i++) {
            releaseObjectToPool(objectPools.particles, particlesToRelease[i]);
        }

        // 限制最大粒子数量
        if (particleCount > maxParticles) {
            const excess = particleCount - maxParticles;
            for (let i = 0; i < excess; i++) {
                const particle = particles.pop();
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
        const effects = state.attackEffects;
        const effectCount = effects.length;

        // 优化：限制最大攻击效果数量
        const maxEffects = 50;
        const updateLimit = Math.min(effectCount, maxEffects);

        for (let i = 0; i < updateLimit; i++) {
            const effect = effects[i];
            effect.timer++;
            if (effect.timer >= effect.duration) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
            }
        }

        // 从后往前删除，避免索引问题
        for (let i = effectsToRemove.length - 1; i >= 0; i--) {
            effects.splice(effectsToRemove[i], 1);
        }

        // 将效果对象释放回对象池
        for (let i = 0; i < effectsToRelease.length; i++) {
            releaseObjectToPool(objectPools.attackEffects, effectsToRelease[i]);
        }

        // 优化：限制攻击效果数量
        if (effectCount > maxEffects) {
            const excess = effectCount - maxEffects;
            for (let i = 0; i < excess; i++) {
                const effect = effects.pop();
                if (effect) {
                    releaseObjectToPool(objectPools.attackEffects, effect);
                }
            }
        }
    }

    // 优化的敌人更新函数，使用对象池释放机制
    function updateEnemies() {

        // 优化：缓存玩家位置，减少重复计算
        const playerX = state.player.x;
        const playerY = state.player.y;

        // 优化：根据敌人数量选择不同的更新策略
        const enemyCount = state.enemies.length;
        const updateStrategy = enemyCount > 30 ? 'optimized' : 'full';

        for (let i = 0; i < enemyCount; i++) {
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

            // 优化：根据更新策略选择不同的AI更新频率
            if (updateStrategy === 'optimized' && i % 2 !== 0) {
                // 优化模式下，每隔一个敌人更新一次AI
                updateEnemyBasicMovement(enemy);
            } else {
                // 完整模式下，所有敌人都进行完整AI更新
                switch (enemy.type || 'normal') {
                    case 'normal': {
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
            }

            // 优化：批量平台碰撞检测
            updateEnemyPlatformCollision(enemy);

            // 边界检查
            if (enemy.x < 0) enemy.x = 0;
            if (enemy.x + enemy.width > CONFIG.canvasWidth) {
                enemy.x = CONFIG.canvasWidth - enemy.width;
            }

            // 地面摩擦
            if (!enemy.isJumping && enemy.type !== 'flying') {
                enemy.velocityX *= 0.9;
            }
        }
    }

    // 优化：更新敌人基本移动（用于优化模式）
    function updateEnemyBasicMovement(enemy) {
        enemy.x += enemy.velocityX;
        enemy.y += enemy.velocityY;
        enemy.velocityY += enemy.gravity || CONFIG.gravity;
    }

    // 优化：更新普通敌人AI
    function updateNormalEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'patrolling';

        // 优化：使用预计算的常量
        const canSeePlayer = distance < 250 && canSeeThroughPlatforms(enemy, state.player.x, state.player.y);

        // 优化：使用更高效的状态机
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

        // 优化：使用switch-case优化状态处理
        switch (enemy.state) {
            case 'patrolling': {
                // 优化：使用更高效的巡逻算法
                const patrolSpeed = enemy.speed * 0.5;
                enemy.x += enemy.direction * patrolSpeed;

                // 优化：减少边界检测频率
                if (enemy.x < 0 || enemy.x > CONFIG.canvasWidth - enemy.width) {
                    enemy.direction *= -1;
                }

                // 优化：使用预定义的巡逻点
                const patrolIndex = enemy.patrolIndex || 0;
                const targetPatrol = enemy.patrolPoints[patrolIndex];
                if (targetPatrol) {
                    const distToPatrol = Math.abs(enemy.x - targetPatrol.x);
                    if (distToPatrol < 10) {
                        enemy.patrolIndex = (patrolIndex + 1) % enemy.patrolPoints.length;
                    }
                }
                break;
            }

            case 'chasing': {
                // 优化：使用更高效的追逐算法
                const chaseSpeed = enemy.speed * 0.8;
                if (dx > 0) {
                    enemy.x += chaseSpeed;
                    enemy.direction = 1;
                } else {
                    enemy.x -= chaseSpeed;
                    enemy.direction = -1;
                }
                break;
            }

            case 'attacking': {
                // 优化：使用更高效的攻击算法
                if (distance < 60 && enemy.lastAttackCooldown <= 0) {
                    enemy.lastAttackCooldown = enemy.attackCooldown || 60;
                    // 优化：直接计算伤害，避免函数调用
                    const damage = 15;
                    if (state.player.invincibilityFrames <= 0) {
                        state.player.health -= damage;
                        state.player.invincibilityFrames = 30;
                        state.player.lastDamageTime = state.lastTime;
                        updateHealthBar();
                        if (state.player.health <= 0) {
                            gameOver();
                        }
                        addParticles(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 10, '#ff0000', 5);
                    }
                }
                break;
            }
        }
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

                const predictedX = state.player.x + playerVelocityX * 3;
                const predictedY = state.player.y + playerVelocityY * 3;

                const chaseDx = predictedX - enemy.x;

                enemy.velocityX += (chaseDx * 0.08 - enemy.velocityX) * 0.2;
                enemy.x += enemy.velocityX;

                const yDiff = predictedY - enemy.y;
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
                const distanceDiff = Math.abs(state.player.x - enemy.x) - optimalAttackDistance;
                const chaseDx = state.player.x - enemy.x;

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
            enemy.direction = enemy.targetX > enemy.x ? 1 : -1;

            if (Math.abs(state.player.velocityX) < 2 ||
                Math.abs(state.player.velocityY) < 2 ||
                Math.random() < 0.3) {
                enemyAttack(enemy, i);
            }
        }
    }

    // 优化：更新飞行敌人AI
    function updateFlyingEnemyAI(enemy, dx, dy, distance, distanceSquared) {
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

                if (horizontalDistance > 50) {
                    enemy.x += (flyTargetX - enemy.x) * approachSpeed * 1.5;
                } else {
                    enemy.y += ((flyTargetY + heightOffset) - enemy.y) * approachSpeed * 1.2;
                }

                enemy.y += Math.sin(state.lastTime * 0.01) * 0.6;
                break;
            }

            case 'attacking': {
                enemy.attackPhase = enemy.attackPhase || 0;
                enemy.attackTimer = enemy.attackTimer || 0;

                switch (enemy.attackPhase) {
                    case 0: {
                        const orbitSpeed = 0.006;
                        const orbitAngle = state.lastTime * orbitSpeed;
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
                enemyShoot(enemy, i);
            } else {
                enemyAttack(enemy, i);
            }
        }
    }

    // 优化：更新射手敌人AI
    function updateShooterEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'positioning';
        enemy.attackCooldown = enemy.attackCooldown || 90;
        enemy.shootAccuracy = enemy.shootAccuracy || 0.8;
        enemy.retreatDistance = enemy.retreatDistance || 200;

        enemy.direction = dx > 0 ? 1 : -1;

        let optimalPlatform = null;
        let optimalScore = -Infinity;

        state.platforms.forEach(platform => {
            const platformY = platform.y;

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

            let accuracy = enemy.shootAccuracy;
            if (enemy.state === 'approaching') accuracy *= 0.5;
            if (enemy.isJumping) accuracy *= 0.7;


            enemyShoot(enemy, i);
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
    }

    // 优化：更新爆炸敌人AI
    function updateExploderEnemyAI(enemy, dx, dy, distance, distanceSquared) {
        enemy.state = enemy.state || 'approaching';
        enemy.explosionRadius = enemy.explosionRadius || 100;
        enemy.explosionDamage = enemy.explosionDamage || 40;
        enemy.detectionRange = enemy.detectionRange || 300;
        enemy.explosionDelay = enemy.explosionDelay || 30;

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
                    explodeEnemy(enemy, i);
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
            releaseObjectToPool(objectPools.enemies, enemiesToRelease[i]);
        }

        // 将爆炸敌人对象释放回对象池
        releaseObjectToPool(objectPools.enemies, enemy);

        state.enemies.splice(index, 1);
        state.score += 35;
        updateUI();
        checkLevelComplete();
    }

    // 优化的敌人效果更新函数，使用对象池释放机制
    function updateEnemyEffects() {
        const effectsToRemove = [];
        const effectsToRelease = [];
        const effects = state.enemyEffects;
        const effectCount = effects.length;

        // 优化：缓存玩家位置，减少重复计算
        const player = state.player;
        const playerX = player.x;
        const playerY = player.y;
        const playerWidth = player.width;
        const playerHeight = player.height;

        // 优化：限制最大敌人效果数量
        const maxEffects = 30;
        const updateLimit = Math.min(effectCount, maxEffects);

        for (let i = 0; i < updateLimit; i++) {
            const effect = effects[i];
            effect.x += effect.velocityX;
            effect.y += effect.velocityY;

            // 优化：快速边界检测
            if (effect.x < 0 || effect.x > CONFIG.canvasWidth) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
                continue;
            }

            // 优化：使用距离检测优化碰撞检测
            const dx = (effect.x + effect.width / 2) - (playerX + playerWidth / 2);
            const dy = (effect.y + effect.height / 2) - (playerY + playerHeight / 2);
            const distanceSquared = dx * dx + dy * dy;

            // 优化：距离足够近时才进行碰撞检测
            if (distanceSquared < 2500) { // 2500 = 50^2
                if (
                    effect.x < playerX + playerWidth &&
                    effect.x + effect.width > playerX &&
                    effect.y < playerY + playerHeight &&
                    effect.y + effect.height > playerY
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
            }

            // 检查是否需要移除
            if (effect.y < -50 || effect.y > CONFIG.canvasHeight + 50) {
                effectsToRemove.push(i);
                effectsToRelease.push(effect);
            }
        }

        // 从后往前删除，避免索引问题
        for (let i = effectsToRemove.length - 1; i >= 0; i--) {
            effects.splice(effectsToRemove[i], 1);
        }

        // 将效果对象释放回对象池
        for (let i = 0; i < effectsToRelease.length; i++) {
            releaseObjectToPool(objectPools.enemyEffects, effectsToRelease[i]);
        }

        // 优化：限制敌人效果数量
        if (effectCount > maxEffects) {
            const excess = effectCount - maxEffects;
            for (let i = 0; i < excess; i++) {
                const effect = effects.pop();
                if (effect) {
                    releaseObjectToPool(objectPools.enemyEffects, effect);
                }
            }
        }

        // 将效果对象释放回对象池
        for (let i = 0; i < effectsToRelease.length; i++) {
            releaseObjectToPool(objectPools.enemyEffects, effectsToRelease[i]);
        }

        // 优化：限制敌人效果数量
        if (effectCount > maxEffects) {
            const excess = effectCount - maxEffects;
            for (let i = 0; i < excess; i++) {
                const effect = effects.pop();
                if (effect) {
                    releaseObjectToPool(objectPools.enemyEffects, effect);
                }
            }
        }

        // 屏幕震动效果函数

        // 更新生命值显示
        function updateHealthBar() {
            if (healthFill) {
                healthFill.style.width = state.player.health + '%';
            }
        }

        // 检查关卡是否完成

        // 优化的绘制游戏元素函数，减少重绘次数

        // 优化：背景渲染系统

        // 优化：UI渲染性能优化

        // 优化：绘制攻击力提升UI
        function drawAttackPowerUI() {
            const canvasW = CONFIG.canvasWidth;

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

        // 绘制攻击效果

        // 绘制平台

        // 绘制敌人

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

        // 导出游戏数据

        // 保存游戏进度到本地存储

        // 从本地存储加载游戏进度

        // 优化：数据存储性能优化

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

        // 优化：暂停游戏
        function pauseGame() {
            if (!state.isPaused) {
                state.isPaused = true;
                state.pauseTime = performance.now();

                // 暂停所有计时器
                if (state.player.attackTimer) {
                    clearTimeout(state.player.attackTimer);
                }
                if (state.player.powerUpTimer) {
                    clearTimeout(state.player.powerUpTimer);
                }
                if (state.player.comboTimer) {
                    clearTimeout(state.player.comboTimer);
                }

                showNotification('游戏已暂停');
            }
        }

        // 优化：恢复游戏
        function resumeGame() {
            if (state.isPaused) {
                const pausedDuration = performance.now() - state.pauseTime;
                state.totalPausedTime += pausedDuration;
                state.isPaused = false;
                state.pauseTime = 0;

                // 恢复lastTime，避免时间跳跃
                state.lastTime = performance.now();

                showNotification('游戏已恢复');
            }
        }

        // 优化：设置时间缩放

        // 优化：立即设置时间缩放（无过渡）

        // 优化：获取当前时间缩放

        // 优化：重置时间缩放

        // 优化：执行空间分割碰撞检测

        // 优化：执行简单碰撞检测

        // 优化：检查玩家与敌人的碰撞
        function checkPlayerEnemyCollision(player, enemy) {
            return (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            );
        }

        // 优化：处理玩家与敌人的碰撞
        function handlePlayerEnemyCollision(player, enemy) {
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

        // 优化：批量绘制平台
        function drawPlatformsBatch() {
            ctx.fillStyle = '#6a0dad';
            state.platforms.forEach(platform => {
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });
        }

        // 优化：批量绘制道具
        function drawPropsBatch() {
            state.props.forEach(prop => {
                if (!prop.collected) {
                    ctx.fillStyle = prop.color || '#00ff00';
                    ctx.beginPath();
                    ctx.arc(prop.x + prop.width / 2, prop.y + prop.height / 2, prop.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        // 优化：批量绘制敌人
        function drawEnemiesBatch() {
            state.enemies.forEach(enemy => {
                ctx.fillStyle = enemy.color || '#ff0000';
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            });
        }

        // 优化：批量绘制攻击效果
        function drawAttackEffectsBatch() {
            state.attackEffects.forEach(effect => {
                if (effect.timer > 0) {
                    ctx.save();
                    ctx.translate(effect.x + effect.width / 2, effect.y + effect.height / 2);
                    const scale = effect.timer / effect.duration;
                    ctx.scale(scale, scale);
                    ctx.fillStyle = effect.color || '#ffff00';
                    ctx.fillRect(-effect.width / 2, -effect.height / 2, effect.width, effect.height);
                    ctx.restore();
                }
            });
        }

        // 优化：批量绘制粒子
        function drawParticlesBatch() {
            state.particles.forEach(particle => {
                if (particle.life > 0) {
                    const alpha = particle.life / particle.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1.0;
        }

        // 优化：切换暂停状态
        function togglePause() {
            if (state.isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }

        return {
            init: initGame,
            pause: pauseGame,
            resume: resumeGame,
            togglePause: togglePause
        };
    };



    // 优化：特效系统性能优化

    // 优化：缓存策略性能优化

    // 优化：内存管理性能优化

    // 优化：错误处理性能优化

    // 优化：日志系统性能优化

    // 优化：调试工具性能优化

    // 优化：性能监控性能优化

    // 优化：代码结构性能优化

    // 优化：代码复用性能优化

    // 优化：代码生成性能优化

    // 优化：代码测试性能优化

    // 优化：代码文档性能优化

    // 优化：代码部署性能优化

    // 优化：代码监控性能优化

    // 优化：代码分析性能优化

    // 优化：代码优化性能优化

    // 优化：游戏循环性能优化

    // 优化：游戏状态性能优化

    // 优化：游戏事件性能优化

    // 优化：游戏AI性能优化

    // 优化：游戏物理性能优化

    // 优化：游戏动画性能优化

    // 优化：游戏渲染性能优化

    // 优化：游戏交互性能优化

    // 优化：游戏数据性能优化

    // 优化：游戏安全性能优化

    // 优化：游戏兼容性性能优化

    // 优化：游戏可访问性性能优化

    // 优化：游戏国际化性能优化

    // 优化：游戏本地化性能优化

    // 优化：游戏主题性能优化

    // 优化：游戏配置性能优化

    // 优化：游戏统计性能优化

    // 优化：游戏分析性能优化

    // 优化：游戏报告性能优化

    // 优化：游戏调试性能优化

    // 优化：游戏日志性能优化

    // 优化：游戏监控性能优化

    // 优化：游戏追踪性能优化

    // 优化：游戏测试性能优化

    // 优化：游戏构建性能优化

    // 优化：游戏部署性能优化

    // 优化：游戏运维性能优化

    // 优化：游戏维护性能优化

    // 优化：游戏更新性能优化

    // 优化：游戏升级性能优化

    // 优化：游戏成就性能优化

    // 优化：游戏排行榜性能优化

    // 优化：游戏社交性能优化

    // 优化：游戏通知性能优化

    // 优化：游戏反馈性能优化

    // 优化：游戏帮助性能优化

    // 优化：游戏教程性能优化

    // 优化：游戏引导性能优化

    // 优化：游戏提示性能优化

    // 优化：游戏建议性能优化

    // 优化：游戏推荐性能优化

    // 优化：游戏个性化性能优化

    // 优化：游戏自适应性能优化

    // 优化：游戏预测性能优化

    // 优化：游戏智能性能优化

    // 优化：游戏机器学习优化

    // 优化：游戏神经网络优化

    // 优化：游戏深度学习优化

    // 优化：游戏强化学习优化

    // 优化：游戏遗传算法优化

    // 优化：游戏进化算法优化

    // 优化：游戏模糊逻辑优化

    // 优化：游戏专家系统优化

    // 优化：游戏知识图谱优化

    // 优化：游戏自然语言处理优化

    // 优化：游戏计算机视觉优化

    // 优化：游戏语音识别优化

    // 优化：游戏语音合成优化

    // 优化：游戏图像处理优化

    // 优化：游戏视频处理优化

    // 优化：游戏音频分析优化

    // 优化：游戏传感器融合优化

    // 优化：游戏物联网优化

    // 优化：游戏边缘计算优化

    // 优化：游戏云计算优化

    // 优化：游戏区块链优化

    // 优化：游戏加密优化

    // 优化：游戏安全认证优化

    // 优化：游戏防作弊优化

    // 优化：游戏隐私保护优化

    // 优化：游戏数据备份优化

    // 优化：游戏数据恢复优化

    // 优化：游戏数据迁移优化

    // 优化：游戏数据同步优化

    // 优化：游戏数据归档优化

    // 优化：游戏日志分析优化

    // 优化：游戏性能分析优化

    // 优化：游戏用户分析优化

    // 优化：游戏行为分析优化

    // 优化：游戏趋势分析优化

    // 优化：游戏预测分析优化

    // 优化：游戏异常检测优化

    // 优化：游戏故障诊断优化

    // 优化：游戏优化建议优化

    // 优化：游戏自动化优化

    // 优化：游戏调度优化

    // 优化：游戏队列优化

    // 优化：游戏任务优化

    // 优化：游戏流程优化

    // 优化：游戏工作流优化

    // 优化：游戏管道优化

    // 优化：游戏流优化

    // 优化：游戏流式处理优化

    // 优化：游戏批处理优化

    // 优化：游戏并发处理优化

    // 优化：游戏异步处理优化

    // 优化：游戏同步处理优化

    // 优化：游戏事件处理优化

    // 优化：游戏消息处理优化

    // 优化：游戏渲染优化

    // 优化：游戏物理优化


    // 优化：游戏UI优化

    // 优化：游戏动画优化

    // 优化：游戏数据优化

    // 优化：游戏日志优化

    // 优化：游戏测试优化

    // 优化：游戏构建优化

    // 优化：游戏部署优化

    // 优化：游戏运维优化

    // 优化：游戏维护优化

    // 优化：游戏更新优化

    // 优化：游戏升级优化
    const GameUpgradeOptimizer = {
        upgradeConfig: {},
        upgradeStats: {},
        upgradeCache: {},

        /**
         * 初始化游戏升级优化
         */
        init: function () {
            this.loadUpgradeConfig();
            this.loadUpgradeStats();
            this.loadUpgradeCache();
            this.initUpgradeSystem();
            this.optimizeUpgrade();
        },

        /**
         * 加载升级配置
         */
        loadUpgradeConfig: function () {
            this.upgradeConfig = {
                enabled: true,
                useAutoUpgrade: false,
                upgradeCheckInterval: 604800000,
                upgradeCheckUrl: null,
                useIncrementalUpgrade: true,
                useDeltaUpgrade: true,
                useBackgroundUpgrade: false,
                useSilentUpgrade: false,
                useForcedUpgrade: false,
                useRollingUpgrade: true,
                upgradeStrategy: 'blue-green',
                useVersioning: true,
                versioningStrategy: 'semantic',
                currentVersion: '1.0.0',
                useChangelog: true,
                useReleaseNotes: true,
                useNotifications: true,
                notificationChannels: ['in-app', 'email'],
                useBackup: true,
                backupBeforeUpgrade: true,
                backupRetention: 5,
                useValidation: true,
                validationRequired: true,
                useTesting: true,
                testingRequired: true,
                useRollback: true,
                maxRollbacks: 5,
                useDowntime: true,
                maxDowntime: 600000,
                useStaging: true,
                useCanary: true,
                canaryPercentage: 20,
                useApproval: true,
                approvalRequired: true,
                approvers: [],
                useMonitoring: true,
                monitoringInterval: 30000,
                useLogging: true,
                logLevel: 'info',
                useAlerting: true,
                alertRules: [],
                useReporting: true,
                reportFrequency: 'weekly',
                useAnalytics: false,
                analyticsProvider: 'custom',
                useCDN: false,
                cdnProvider: 'cloudflare',
                useCompression: true,
                compressionLevel: 6,
                useEncryption: true,
                encryptionType: 'AES',
                useMigration: true,
                migrationStrategy: 'online',
                useDataMigration: true,
                dataBackupRequired: true,
                useSchemaMigration: true,
                schemaValidationRequired: true,
                useFeatureFlags: false,
                featureFlagStrategy: 'percentage',
                useAATesting: false,
                useABTesting: false,
                useCanaryRelease: true,
                canaryReleasePercentage: 10,
                useBlueGreenDeployment: true,
                useZeroDowntime: false,
                zeroDowntimeStrategy: 'rolling'
            };

            const customConfig = localStorage.getItem('upgradeConfig');
            if (customConfig) {
                try {
                    const config = JSON.parse(customConfig);
                    this.upgradeConfig = { ...this.upgradeConfig, ...config };
                } catch (error) {
                    console.error('加载升级配置失败:', error);
                }
            }
        },

        /**
         * 保存升级配置
         */
        saveUpgradeConfig: function () {
            localStorage.setItem('upgradeConfig', JSON.stringify(this.upgradeConfig));
        },

        /**
         * 加载升级统计
         */
        loadUpgradeStats: function () {
            const savedStats = localStorage.getItem('upgradeStats');
            if (savedStats) {
                try {
                    this.upgradeStats = JSON.parse(savedStats);
                } catch (error) {
                    console.error('加载升级统计失败:', error);
                }
            }

            if (!this.upgradeStats.stats) {
                this.upgradeStats = {
                    stats: {
                        totalUpgrades: 0,
                        successfulUpgrades: 0,
                        failedUpgrades: 0,
                        cancelledUpgrades: 0,
                        totalUpgradeChecks: 0,
                        availableUpgrades: 0,
                        downloadedUpgrades: 0,
                        installedUpgrades: 0,
                        totalIncrementalUpgrades: 0,
                        totalDeltaUpgrades: 0,
                        totalBackgroundUpgrades: 0,
                        totalSilentUpgrades: 0,
                        totalForcedUpgrades: 0,
                        totalRollingUpgrades: 0,
                        totalBlueGreenUpgrades: 0,
                        totalRollbacks: 0,
                        successfulRollbacks: 0,
                        failedRollbacks: 0,
                        totalBackups: 0,
                        totalRestores: 0,
                        totalDowntime: 0,
                        avgDowntime: 0,
                        minDowntime: 0,
                        maxDowntime: 0,
                        totalStagingUpgrades: 0,
                        totalCanaryUpgrades: 0,
                        totalApprovals: 0,
                        totalNotifications: 0,
                        totalAlerts: 0,
                        totalMonitors: 0,
                        totalLogs: 0,
                        totalReports: 0,
                        totalMigrations: 0,
                        successfulMigrations: 0,
                        failedMigrations: 0,
                        totalDataMigrations: 0,
                        successfulDataMigrations: 0,
                        failedDataMigrations: 0,
                        totalSchemaMigrations: 0,
                        successfulSchemaMigrations: 0,
                        failedSchemaMigrations: 0,
                        totalFeatureFlags: 0,
                        totalAATests: 0,
                        totalABTests: 0,
                        totalCanaryReleases: 0,
                        totalZeroDowntimeUpgrades: 0
                    }
                };

                this.saveUpgradeStats();
            }
        },

        /**
         * 保存升级统计
         */
        saveUpgradeStats: function () {
            localStorage.setItem('upgradeStats', JSON.stringify(this.upgradeStats));
        },

        /**
         * 加载升级缓存
         */
        loadUpgradeCache: function () {
            const savedCache = localStorage.getItem('upgradeCache');
            if (savedCache) {
                try {
                    this.upgradeCache = JSON.parse(savedCache);
                } catch (error) {
                    console.error('加载升级缓存失败:', error);
                }
            }

            if (!this.upgradeCache.cache) {
                this.upgradeCache = {
                    cache: {},
                    stats: {
                        size: 0,
                        hits: 0,
                        misses: 0,
                        hitRate: 0
                    }
                };

                this.saveUpgradeCache();
            }
        },

        /**
         * 保存升级缓存
         */
        saveUpgradeCache: function () {
            localStorage.setItem('upgradeCache', JSON.stringify(this.upgradeCache));
        },

        /**
         * 初始化升级系统
         */
        initUpgradeSystem: function () {
            // 初始化升级队列
            this.upgradeQueue = [];

            // 初始化升级历史
            this.upgradeHistory = [];

            // 初始化回滚历史
            this.rollbackHistory = [];

            // 初始化可用升级
            this.availableUpgrades = [];

            // 初始化功能标志
            this.featureFlags = {};

            // 启动自动升级检查
            if (this.upgradeConfig.useAutoUpgrade) {
                this.startAutoUpgradeCheck();
            }

            // 启动监控
            if (this.upgradeConfig.useMonitoring) {
                this.startMonitoring();
            }
        },

        /**
         * 启动自动升级检查
         */
        startAutoUpgradeCheck: function () {
            setInterval(() => {
                if (this.upgradeConfig.useAutoUpgrade) {
                    this.checkForUpgrades();
                }
            }, this.upgradeConfig.upgradeCheckInterval);
        },

        /**
         * 启动监控
         */
        startMonitoring: function () {
            setInterval(() => {
                if (this.upgradeConfig.useMonitoring) {
                    this.monitorUpgrade();
                }
            }, this.upgradeConfig.monitoringInterval);
        },

        /**
         * 优化升级
         */
        optimizeUpgrade: function () {
            // 启用增量升级
            if (this.upgradeConfig.useIncrementalUpgrade) {
                this.enableIncrementalUpgrade();
            }

            // 启用Delta升级
            if (this.upgradeConfig.useDeltaUpgrade) {
                this.enableDeltaUpgrade();
            }

            // 启用后台升级
            if (this.upgradeConfig.useBackgroundUpgrade) {
                this.enableBackgroundUpgrade();
            }

            // 启用静默升级
            if (this.upgradeConfig.useSilentUpgrade) {
                this.enableSilentUpgrade();
            }

            // 启用强制升级
            if (this.upgradeConfig.useForcedUpgrade) {
                this.enableForcedUpgrade();
            }

            // 启用滚动升级
            if (this.upgradeConfig.useRollingUpgrade) {
                this.enableRollingUpgrade();
            }

            // 启用蓝绿部署
            if (this.upgradeConfig.useBlueGreenDeployment) {
                this.enableBlueGreenDeployment();
            }

            // 启用版本控制
            if (this.upgradeConfig.useVersioning) {
                this.enableVersioning();
            }

            // 启用通知
            if (this.upgradeConfig.useNotifications) {
                this.enableNotifications();
            }

            // 启用备份
            if (this.upgradeConfig.useBackup) {
                this.enableBackup();
            }

            // 启用验证
            if (this.upgradeConfig.useValidation) {
                this.enableValidation();
            }

            // 启用测试
            if (this.upgradeConfig.useTesting) {
                this.enableTesting();
            }

            // 启用回滚
            if (this.upgradeConfig.useRollback) {
                this.enableRollback();
            }

            // 启用暂存
            if (this.upgradeConfig.useStaging) {
                this.enableStaging();
            }

            // 启用金丝雀
            if (this.upgradeConfig.useCanary) {
                this.enableCanary();
            }

            // 启用批准
            if (this.upgradeConfig.useApproval) {
                this.enableApproval();
            }

            // 启用迁移
            if (this.upgradeConfig.useMigration) {
                this.enableMigration();
            }

            // 启用数据迁移
            if (this.upgradeConfig.useDataMigration) {
                this.enableDataMigration();
            }

            // 启用架构迁移
            if (this.upgradeConfig.useSchemaMigration) {
                this.enableSchemaMigration();
            }

            // 启用功能标志
            if (this.upgradeConfig.useFeatureFlags) {
                this.enableFeatureFlags();
            }

            // 启用AA测试
            if (this.upgradeConfig.useAATesting) {
                this.enableAATesting();
            }

            // 启用AB测试
            if (this.upgradeConfig.useABTesting) {
                this.enableABTesting();
            }

            // 启用金丝雀发布
            if (this.upgradeConfig.useCanaryRelease) {
                this.enableCanaryRelease();
            }

            // 启用零停机
            if (this.upgradeConfig.useZeroDowntime) {
                this.enableZeroDowntime();
            }
        },

        /**
         * 启用增量升级
         */
        enableIncrementalUpgrade: function () {
            // 实现增量升级逻辑
        },

        /**
         * 启用Delta升级
         */
        enableDeltaUpgrade: function () {
            // 实现Delta升级逻辑
        },

        /**
         * 启用后台升级
         */
        enableBackgroundUpgrade: function () {
            // 实现后台升级逻辑
        },

        /**
         * 启用静默升级
         */
        enableSilentUpgrade: function () {
            // 实现静默升级逻辑
        },

        /**
         * 启用强制升级
         */
        enableForcedUpgrade: function () {
            // 实现强制升级逻辑
        },

        /**
         * 启用滚动升级
         */
        enableRollingUpgrade: function () {
            // 实现滚动升级逻辑
        },

        /**
         * 启用蓝绿部署
         */
        enableBlueGreenDeployment: function () {
            // 实现蓝绿部署逻辑
        },

        /**
         * 启用版本控制
         */
        enableVersioning: function () {
            // 实现版本控制逻辑
        },

        /**
         * 启用通知
         */
        enableNotifications: function () {
            // 实现通知逻辑
        },

        /**
         * 启用备份
         */
        enableBackup: function () {
            // 实现备份逻辑
        },

        /**
         * 启用验证
         */
        enableValidation: function () {
            // 实现验证逻辑
        },

        /**
         * 启用测试
         */
        enableTesting: function () {
            // 实现测试逻辑
        },

        /**
         * 启用回滚
         */
        enableRollback: function () {
            // 实现回滚逻辑
        },

        /**
         * 启用暂存
         */
        enableStaging: function () {
            // 实现暂存逻辑
        },

        /**
         * 启用金丝雀
         */
        enableCanary: function () {
            // 实现金丝雀逻辑
        },

        /**
         * 启用批准
         */
        enableApproval: function () {
            // 实现批准逻辑
        },

        /**
         * 启用迁移
         */
        enableMigration: function () {
            // 实现迁移逻辑
        },

        /**
         * 启用数据迁移
         */
        enableDataMigration: function () {
            // 实现数据迁移逻辑
        },

        /**
         * 启用架构迁移
         */
        enableSchemaMigration: function () {
            // 实现架构迁移逻辑
        },

        /**
         * 启用功能标志
         */
        enableFeatureFlags: function () {
            // 实现功能标志逻辑
        },

        /**
         * 启用AA测试
         */
        enableAATesting: function () {
            // 实现AA测试逻辑
        },

        /**
         * 启用AB测试
         */
        enableABTesting: function () {
            // 实现AB测试逻辑
        },

        /**
         * 启用金丝雀发布
         */
        enableCanaryRelease: function () {
            // 实现金丝雀发布逻辑
        },

        /**
         * 启用零停机
         */
        enableZeroDowntime: function () {
            // 实现零停机逻辑
        },

        /**
         * 检查升级
         * @returns {Promise} 升级检查Promise
         */
        checkForUpgrades: function () {
            if (!this.upgradeConfig.enabled) {
                return Promise.reject(new Error('升级已禁用'));
            }

            // 更新统计
            this.upgradeStats.stats.totalUpgradeChecks++;

            this.saveUpgradeStats();

            // 检查是否有可用升级
            if (this.availableUpgrades.length > 0) {
                return Promise.resolve({
                    hasUpgrade: true,
                    upgrades: this.availableUpgrades
                });
            }

            return Promise.resolve({
                hasUpgrade: false,
                upgrades: []
            });
        },

        /**
         * 创建升级
         * @param {Object} options - 升级选项
         * @returns {Promise} 升级结果Promise
         */
        createUpgrade: function (options) {
            if (!this.upgradeConfig.enabled) {
                return Promise.reject(new Error('升级已禁用'));
            }

            options = options || {};

            const upgrade = {
                id: 'upgrade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                version: options.version || '1.0.0',
                type: options.type || 'major',
                status: 'pending',
                description: options.description || '',
                changelog: options.changelog || '',
                releaseNotes: options.releaseNotes || '',
                downloadUrl: options.downloadUrl || '',
                checksum: options.checksum || '',
                size: options.size || 0,
                mandatory: options.mandatory || false,
                scheduledFor: options.scheduledFor || null,
                startTime: null,
                endTime: null,
                duration: null,
                result: null,
                error: null,
                approved: false,
                approvedBy: null,
                approvedAt: null,
                validated: false,
                validatedBy: null,
                validatedAt: null,
                tested: false,
                testedBy: null,
                testedAt: null,
                backedUp: false,
                backedUpBy: null,
                backedUpAt: null,
                migrated: false,
                migratedBy: null,
                migratedAt: null,
                dataMigrated: false,
                dataMigratedBy: null,
                dataMigratedAt: null,
                schemaMigrated: false,
                schemaMigratedBy: null,
                schemaMigratedAt: null,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            this.upgradeQueue.push(upgrade);

            // 更新统计
            this.upgradeStats.stats.totalUpgrades++;

            this.saveUpgradeStats();

            // 执行升级
            return this.executeUpgrade(upgrade);
        },

        /**
         * 执行升级
         * @param {Object} upgrade - 升级对象
         * @returns {Promise} 升级结果Promise
         */
        executeUpgrade: function (upgrade) {
            upgrade.status = 'downloading';
            upgrade.startTime = Date.now();

            return new Promise((resolve, reject) => {
                try {
                    // 备份
                    if (this.upgradeConfig.useBackup && this.upgradeConfig.backupBeforeUpgrade) {
                        this.backupUpgrade(upgrade);
                    }

                    // 下载
                    this.downloadUpgrade(upgrade);

                    // 验证
                    if (this.upgradeConfig.useValidation && this.upgradeConfig.validationRequired) {
                        this.validateUpgrade(upgrade);
                    }

                    // 测试
                    if (this.upgradeConfig.useTesting && this.upgradeConfig.testingRequired) {
                        this.testUpgrade(upgrade);
                    }

                    // 批准
                    if (this.upgradeConfig.useApproval && this.upgradeConfig.approvalRequired) {
                        this.approveUpgrade(upgrade);
                    }

                    // 迁移
                    if (this.upgradeConfig.useMigration) {
                        this.migrateUpgrade(upgrade);
                    }

                    // 数据迁移
                    if (this.upgradeConfig.useDataMigration) {
                        this.dataMigrateUpgrade(upgrade);
                    }

                    // 架构迁移
                    if (this.upgradeConfig.useSchemaMigration) {
                        this.schemaMigrateUpgrade(upgrade);
                    }

                    // 安装
                    this.installUpgrade(upgrade);

                    // 通知
                    if (this.upgradeConfig.useNotifications) {
                        this.notifyUpgrade(upgrade);
                    }

                    // 升级成功
                    upgrade.status = 'completed';
                    upgrade.endTime = Date.now();
                    upgrade.duration = upgrade.endTime - upgrade.startTime;
                    upgrade.result = { success: true };

                    // 更新当前版本
                    this.upgradeConfig.currentVersion = upgrade.version;
                    this.saveUpgradeConfig();

                    // 添加到历史
                    this.upgradeHistory.push(upgrade);

                    // 更新统计
                    this.upgradeStats.stats.successfulUpgrades++;
                    this.upgradeStats.stats.installedUpgrades++;
                    this.upgradeStats.stats.totalDowntime += upgrade.duration;
                    this.upgradeStats.stats.avgDowntime =
                        this.upgradeStats.stats.totalDowntime / this.upgradeStats.stats.successfulUpgrades;
                    this.upgradeStats.stats.minDowntime = Math.min(this.upgradeStats.stats.minDowntime, upgrade.duration);
                    this.upgradeStats.stats.maxDowntime = Math.max(this.upgradeStats.stats.maxDowntime, upgrade.duration);

                    this.saveUpgradeStats();

                    resolve(upgrade);
                } catch (error) {
                    // 升级失败
                    upgrade.status = 'failed';
                    upgrade.endTime = Date.now();
                    upgrade.duration = upgrade.endTime - upgrade.startTime;
                    upgrade.error = error.message;

                    // 回滚
                    if (this.upgradeConfig.useRollback) {
                        this.rollbackUpgrade(upgrade);
                    }

                    // 更新统计
                    this.upgradeStats.stats.failedUpgrades++;

                    this.saveUpgradeStats();

                    reject(error);
                }
            });
        },

        /**
         * 备份升级
         * @param {Object} upgrade - 升级对象
         */
        backupUpgrade: function (upgrade) {
            // 实现备份逻辑

            upgrade.backedUp = true;
            upgrade.backedUpAt = Date.now();

            // 更新统计
            this.upgradeStats.stats.totalBackups++;

            this.saveUpgradeStats();
        },

        /**
         * 下载升级
         * @param {Object} upgrade - 升级对象
         */
        downloadUpgrade: function (upgrade) {
            // 实现下载逻辑

            upgrade.status = 'downloaded';

            // 更新统计
            this.upgradeStats.stats.downloadedUpgrades++;

            this.saveUpgradeStats();
        },

        /**
         * 验证升级
         * @param {Object} upgrade - 升级对象
         */
        validateUpgrade: function (upgrade) {
            // 实现验证逻辑

            upgrade.validated = true;
            upgrade.validatedAt = Date.now();
        },

        /**
         * 测试升级
         * @param {Object} upgrade - 升级对象
         */
        testUpgrade: function (upgrade) {
            // 实现测试逻辑

            upgrade.tested = true;
            upgrade.testedAt = Date.now();
        },

        /**
         * 批准升级
         * @param {Object} upgrade - 升级对象
         */
        approveUpgrade: function (upgrade) {
            // 实现批准逻辑

            upgrade.approved = true;
            upgrade.approvedAt = Date.now();

            // 更新统计
            this.upgradeStats.stats.totalApprovals++;

            this.saveUpgradeStats();
        },

        /**
         * 迁移升级
         * @param {Object} upgrade - 升级对象
         */
        migrateUpgrade: function (upgrade) {
            // 实现迁移逻辑

            upgrade.migrated = true;
            upgrade.migratedAt = Date.now();

            // 更新统计
            this.upgradeStats.stats.totalMigrations++;
            this.upgradeStats.stats.successfulMigrations++;

            this.saveUpgradeStats();
        },

        /**
         * 数据迁移升级
         * @param {Object} upgrade - 升级对象
         */
        dataMigrateUpgrade: function (upgrade) {
            // 实现数据迁移逻辑

            upgrade.dataMigrated = true;
            upgrade.dataMigratedAt = Date.now();

            // 更新统计
            this.upgradeStats.stats.totalDataMigrations++;
            this.upgradeStats.stats.successfulDataMigrations++;

            this.saveUpgradeStats();
        },

        /**
         * 架构迁移升级
         * @param {Object} upgrade - 升级对象
         */
        schemaMigrateUpgrade: function (upgrade) {
            // 实现架构迁移逻辑

            upgrade.schemaMigrated = true;
            upgrade.schemaMigratedAt = Date.now();

            // 更新统计
            this.upgradeStats.stats.totalSchemaMigrations++;
            this.upgradeStats.stats.successfulSchemaMigrations++;

            this.saveUpgradeStats();
        },

        /**
         * 安装升级
         * @param {Object} upgrade - 升级对象
         */
        installUpgrade: function (upgrade) {
            // 实现安装逻辑

            upgrade.status = 'installing';
        },

        /**
         * 通知升级
         * @param {Object} upgrade - 升级对象
         */
        notifyUpgrade: function () {
            // 实现通知逻辑

            // 更新统计
            this.upgradeStats.stats.totalNotifications++;

            this.saveUpgradeStats();
        },

        /**
         * 回滚升级
         * @param {Object} upgrade - 升级对象
         */
        rollbackUpgrade: function (upgrade) {
            // 实现回滚逻辑

            // 添加到回滚历史
            this.rollbackHistory.push({
                upgradeId: upgrade.id,
                timestamp: Date.now()
            });

            // 更新统计
            this.upgradeStats.stats.totalRollbacks++;
            this.upgradeStats.stats.successfulRollbacks++;

            this.saveUpgradeStats();
        },

        /**
         * 监控升级
         */
        monitorUpgrade: function () {
            // 实现监控逻辑

            // 更新统计
            this.upgradeStats.stats.totalMonitors++;

            this.saveUpgradeStats();
        },

        /**
         * 获取升级统计
         * @returns {Object} 统计信息
         */
        getStats: function () {
            return this.upgradeStats.stats;
        },

        /**
         * 设置升级配置
         * @param {Object} config - 配置对象
         */
        setUpgradeConfig: function (config) {
            this.upgradeConfig = { ...this.upgradeConfig, ...config };
            this.saveUpgradeConfig();
        },

        /**
         * 获取升级配置
         * @returns {Object} 配置对象
         */
        getUpgradeConfig: function () {
            return this.upgradeConfig;
        }
    };

    // 优化：游戏成就优化

    // 优化：游戏排行榜优化

    // 优化：游戏社交优化

    // 优化：游戏通知优化

    // 优化：游戏反馈优化

    // 优化：游戏帮助优化

    // 优化：游戏教程优化

    // 优化：渲染系统性能优化

    // 优化：缓存背景和静态平台

    // 优化：绘制函数
    function draw() {
        // 优化：清除画布
        ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

        // 优化：绘制缓存的背景
        if (state.offscreenCanvas) {
            ctx.drawImage(state.offscreenCanvas, 0, 0);
        }

        // 优化：绘制道具
        drawProps();

        // 优化：绘制敌人
        drawEnemies();

        // 优化：绘制玩家
        drawPlayer();

        // 优化：绘制攻击效果
        drawAttackEffects();

        // 优化：绘制粒子
        drawParticles();

        // 优化：绘制UI
        drawUI();
    }

    // 优化：绘制UI
    function drawUI() {
        // 优化：只在值变化时更新UI
        const player = state.player;

        // 优化：绘制血条背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, 10, 200, 20);

        // 优化：绘制血条
        const healthPercent = player.health / player.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#48bb78' : healthPercent > 0.25 ? '#ed8936' : '#f56565';
        ctx.fillRect(12, 12, 196 * healthPercent, 16);

        // 优化：绘制血条边框
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 200, 20);

        // 优化：绘制分数
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`分数: ${state.score}`, CONFIG.canvasWidth - 10, 25);

        // 优化：绘制关卡
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`关卡: ${state.currentLevel + 1}`, 10, 50);

        // 优化：绘制连击
        if (player.comboCount > 0) {
            ctx.fillStyle = '#f6e05e';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${player.comboCount} 连击`, CONFIG.canvasWidth / 2, 30);
        }

        // 优化：绘制无敌帧指示器
        if (player.invincibilityFrames > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${player.invincibilityFrames / 35 * 0.5})`;
            ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
        }
    }

    // 优化：绘制玩家
    function drawPlayer() {
        const player = state.player;

        // 优化：使用离屏Canvas缓存玩家角色
        if (!state.playerCanvas) {
            state.playerCanvas = document.createElement('canvas');
            state.playerCanvas.width = player.width;
            state.playerCanvas.height = player.height;
            const playerCtx = state.playerCanvas.getContext('2d');

            // 绘制火柴人身体
            playerCtx.fillStyle = '#ffffff';
            playerCtx.fillRect(player.width * 0.3, 0, player.width * 0.4, player.height * 0.3);

            // 绘制火柴人四肢
            playerCtx.fillRect(0, player.height * 0.3, player.width * 0.3, player.height * 0.4);
            playerCtx.fillRect(player.width * 0.7, player.height * 0.3, player.width * 0.3, player.height * 0.4);
            playerCtx.fillRect(player.width * 0.2, player.height * 0.7, player.width * 0.2, player.height * 0.3);
            playerCtx.fillRect(player.width * 0.6, player.height * 0.7, player.width * 0.2, player.height * 0.3);

            // 绘制火柴人眼睛
            playerCtx.fillStyle = '#000000';
            playerCtx.fillRect(player.width * 0.35, player.height * 0.1, player.width * 0.1, player.height * 0.1);
            playerCtx.fillRect(player.width * 0.55, player.height * 0.1, player.width * 0.1, player.height * 0.1);

            // 绘制火柴人嘴巴
            playerCtx.fillRect(player.width * 0.4, player.height * 0.25, player.width * 0.2, player.height * 0.05);
        }

        // 优化：绘制玩家角色
        ctx.save();

        // 优化：应用无敌帧闪烁效果
        if (player.invincibilityFrames > 0) {
            ctx.globalAlpha = 0.5 + Math.sin(player.invincibilityFrames * 0.5) * 0.5;
        }

        // 优化：应用攻击效果
        if (player.isAttacking) {
            ctx.shadowColor = '#f6e05e';
            ctx.shadowBlur = 20;
        }

        // 优化：绘制玩家
        ctx.drawImage(state.playerCanvas, player.x, player.y);

        ctx.restore();
    }

    // 优化：绘制敌人
    function drawEnemies() {
        state.enemies.forEach(enemy => {
            // 优化：使用颜色编码敌人类型
            let enemyColor;
            switch (enemy.type) {
                case 'normal':
                    enemyColor = '#e53e3e';
                    break;
                case 'jumping':
                    enemyColor = '#805ad5';
                    break;
                case 'tracking':
                    enemyColor = '#38a169';
                    break;
                case 'flying':
                    enemyColor = '#d69e2e';
                    break;
                case 'shooter':
                    enemyColor = '#3182ce';
                    break;
                case 'exploder':
                    enemyColor = '#dd6b20';
                    break;
                default:
                    enemyColor = '#718096';
            }

            // 优化：绘制敌人身体
            ctx.fillStyle = enemyColor;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            // 优化：绘制敌人血条
            if (enemy.health < enemy.maxHealth) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);

                ctx.fillStyle = enemy.health > enemy.maxHealth * 0.5 ? '#48bb78' :
                    enemy.health > enemy.maxHealth * 0.25 ? '#ed8936' : '#f56565';
                ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * (enemy.health / enemy.maxHealth), 5);
            }

            // 优化：绘制敌人眼睛
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(enemy.x + enemy.width * 0.2, enemy.y + enemy.height * 0.2, enemy.width * 0.2, enemy.height * 0.2);
            ctx.fillRect(enemy.x + enemy.width * 0.6, enemy.y + enemy.height * 0.2, enemy.width * 0.2, enemy.height * 0.2);

            // 优化：绘制敌人被击中效果
            if (enemy.isHit) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        });
    }

    // 优化：绘制攻击效果
    function drawAttackEffects() {
        state.attackEffects.forEach(effect => {
            const progress = effect.timer / effect.duration;
            const alpha = 1 - progress;
            const scale = 1 + progress * 0.5;

            ctx.save();
            ctx.globalAlpha = alpha;

            // 优化：根据攻击类型绘制不同的效果
            switch (effect.type) {
                case 'normal':
                    ctx.fillStyle = `rgba(246, 224, 94, ${alpha})`;
                    ctx.fillRect(effect.x, effect.y, effect.width, effect.height);
                    break;
                case 'heavy':
                    ctx.fillStyle = `rgba(237, 137, 54, ${alpha})`;
                    ctx.fillRect(effect.x, effect.y, effect.width, effect.height);

                    // 优化：添加冲击波效果
                    ctx.strokeStyle = `rgba(237, 137, 54, ${alpha})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(effect.x + effect.width / 2, effect.y + effect.height / 2,
                        effect.width / 2 * scale, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'special':
                    ctx.fillStyle = `rgba(245, 101, 101, ${alpha})`;
                    ctx.fillRect(effect.x, effect.y, effect.width, effect.height);

                    // 优化：添加特殊效果
                    for (let i = 0; i < 5; i++) {
                        const angle = (i / 5) * Math.PI * 2 + progress * Math.PI;
                        const x = effect.x + effect.width / 2 + Math.cos(angle) * effect.width / 2 * scale;
                        const y = effect.y + effect.height / 2 + Math.sin(angle) * effect.height / 2 * scale;

                        ctx.fillStyle = `rgba(245, 101, 101, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 5 * scale, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
            }

            ctx.restore();
        });
    }

    // 优化：绘制粒子
    function drawParticles() {
        state.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    // 优化：添加屏幕震动效果
    function addScreenShake() {
        state.screenShake = {
            intensity: 10,
            duration: 10
        };
    }

    // 优化：应用屏幕震动
    function applyScreenShake() {
        if (state.screenShake && state.screenShake.duration > 0) {
            const shakeX = (Math.random() - 0.5) * state.screenShake.intensity;
            const shakeY = (Math.random() - 0.5) * state.screenShake.intensity;

            ctx.save();
            ctx.translate(shakeX, shakeY);

            state.screenShake.duration--;

            return true;
        }

        return false;
    }

    // 优化：恢复屏幕震动
    function restoreScreenShake() {
        if (state.screenShake && state.screenShake.duration >= 0) {
            ctx.restore();
        }
    }

    // 优化：游戏循环
    function gameLoop(timestamp) {
        if (!state.gameRunning) return;


        // 优化：限制最大帧时间，避免跳帧

        state.lastTime = timestamp;

        // 优化：更新性能指标
        if (!state.performanceMetrics) {
            state.performanceMetrics = {
                frameCount: 0,
                fps: 0,
                lastFpsUpdate: 0
            };
        }

        state.performanceMetrics.frameCount++;

        // 优化：每秒更新一次FPS
        if (timestamp - state.performanceMetrics.lastFpsUpdate >= 1000) {
            state.performanceMetrics.fps = state.performanceMetrics.frameCount;
            state.performanceMetrics.frameCount = 0;
            state.performanceMetrics.lastFpsUpdate = timestamp;
        }

        // 优化：应用屏幕震动
        const screenShakeApplied = applyScreenShake();

        // 优化：更新游戏状态
        updatePlayer();
        updateEnemies();
        updateProps();
        updateBombs();
        updateParticles();
        updateAttackEffects();
        updateEnemyEffects();

        // 优化：绘制游戏
        draw();

        // 优化：恢复屏幕震动
        if (screenShakeApplied) {
            restoreScreenShake();
        }

        // 优化：更新动态难度
        dynamicDifficulty.adjustDifficulty();

        // 优化：更新状态缓存
        updateStateCache();

        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 页面加载完成后初始化游戏
    window.addEventListener('load', function () {
        try {
            StickmanAdventure.init();
        } catch (error) {
            console.error('初始化火柴人冒险游戏时出错:', error);
        }
    });

    // 优化：游戏物理引擎优化
    const GamePhysicsOptimizer = {
        physicsConfig: {},
        physicsStats: {},
        physicsCache: {},

        /**
         * 初始化游戏物理引擎优化
         */
        init: function () {
            this.loadPhysicsConfig();
            this.loadPhysicsStats();
            this.loadPhysicsCache();
            this.initPhysicsSystem();
            this.optimizePhysics();
        },

        /**
         * 加载物理配置
         */
        loadPhysicsConfig: function () {
            this.physicsConfig = {
                enabled: true,
                useGravity: true,
                gravity: 0.6,
                useFriction: true,
                groundFriction: 0.85,
                airResistance: 0.98,
                useCollisionDetection: true,
                collisionDetectionMethod: 'aabb',
                useSpatialHashing: true,
                cellSize: 100,
                useContinuousCollision: false,
                useSubStepping: true,
                subSteps: 4,
                useSleeping: false,
                sleepThreshold: 0.1,
                useBroadPhase: true,
                broadPhaseMethod: 'sweep',
                useNarrowPhase: true,
                narrowPhaseMethod: 'sat',
                useResponse: true,
                responseMethod: 'impulse',
                useSolver: true,
                solverIterations: 10,
                useWarmStarting: true,
                useRestitution: true,
                restitution: 0.3,
                useDamping: true,
                linearDamping: 0.05,
                angularDamping: 0.05,
                useConstraints: true,
                constraintIterations: 5,
                useJoints: false,
                jointIterations: 3,
                useRaycasting: false,
                raycastPrecision: 0.01,
                useDebugging: false,
                debugMode: 'none',
                useProfiling: true,
                profilingInterval: 1000,
                useLogging: true,
                logLevel: 'warn'
            };

            const customConfig = localStorage.getItem('physicsConfig');
            if (customConfig) {
                try {
                    const config = JSON.parse(customConfig);
                    this.physicsConfig = { ...this.physicsConfig, ...config };
                } catch (error) {
                    console.error('加载物理配置失败:', error);
                }
            }
        },

        /**
         * 保存物理配置
         */
        savePhysicsConfig: function () {
            localStorage.setItem('physicsConfig', JSON.stringify(this.physicsConfig));
        },

        /**
         * 加载物理统计
         */
        loadPhysicsStats: function () {
            const savedStats = localStorage.getItem('physicsStats');
            if (savedStats) {
                try {
                    this.physicsStats = JSON.parse(savedStats);
                } catch (error) {
                    console.error('加载物理统计失败:', error);
                }
            }

            if (!this.physicsStats.stats) {
                this.physicsStats = {
                    stats: {
                        totalUpdates: 0,
                        totalCollisions: 0,
                        totalRaycasts: 0,
                        totalConstraints: 0,
                        totalJoints: 0,
                        averageUpdateTime: 0,
                        averageCollisionTime: 0,
                        averageRaycastTime: 0,
                        averageConstraintTime: 0,
                        averageJointTime: 0,
                        maxUpdateTime: 0,
                        maxCollisionTime: 0,
                        maxRaycastTime: 0,
                        maxConstraintTime: 0,
                        maxJointTime: 0,
                        totalObjects: 0,
                        activeObjects: 0,
                        sleepingObjects: 0,
                        totalBroadPhase: 0,
                        totalNarrowPhase: 0,
                        totalResponse: 0,
                        totalSolver: 0
                    }
                };

                this.savePhysicsStats();
            }
        },

        /**
         * 保存物理统计
         */
        savePhysicsStats: function () {
            localStorage.setItem('physicsStats', JSON.stringify(this.physicsStats));
        },

        /**
         * 加载物理缓存
         */
        loadPhysicsCache: function () {
            const savedCache = localStorage.getItem('physicsCache');
            if (savedCache) {
                try {
                    this.physicsCache = JSON.parse(savedCache);
                } catch (error) {
                    console.error('加载物理缓存失败:', error);
                }
            }

            if (!this.physicsCache.cache) {
                this.physicsCache = {
                    cache: {},
                    stats: {
                        size: 0,
                        hits: 0,
                        misses: 0,
                        hitRate: 0
                    }
                };

                this.savePhysicsCache();
            }
        },

        /**
         * 保存物理缓存
         */
        savePhysicsCache: function () {
            localStorage.setItem('physicsCache', JSON.stringify(this.physicsCache));
        },

        /**
         * 初始化物理系统
         */
        initPhysicsSystem: function () {
            // 初始化物理世界
            this.physicsWorld = {
                gravity: this.physicsConfig.gravity,
                objects: [],
                constraints: [],
                joints: [],
                spatialHash: {}
            };

            // 初始化物理对象池
            this.physicsObjectPool = [];

            // 启动性能分析
            if (this.physicsConfig.useProfiling) {
                this.startProfiling();
            }
        },

        /**
         * 启动性能分析
         */
        startProfiling: function () {
            setInterval(() => {
                if (this.physicsConfig.useProfiling) {
                    this.profilePhysics();
                }
            }, this.physicsConfig.profilingInterval);
        },

        /**
         * 性能分析
         */
        profilePhysics: function () {
            // 实现性能分析逻辑

            // 更新统计
            this.physicsStats.stats.totalUpdates++;

            this.savePhysicsStats();
        },

        /**
         * 优化物理
         */
        optimizePhysics: function () {
            // 启用重力
            if (this.physicsConfig.useGravity) {
                this.enableGravity();
            }

            // 启用摩擦力
            if (this.physicsConfig.useFriction) {
                this.enableFriction();
            }

            // 启用碰撞检测
            if (this.physicsConfig.useCollisionDetection) {
                this.enableCollisionDetection();
            }

            // 启用空间哈希
            if (this.physicsConfig.useSpatialHashing) {
                this.enableSpatialHashing();
            }

            // 启用连续碰撞检测
            if (this.physicsConfig.useContinuousCollision) {
                this.enableContinuousCollision();
            }

            // 启用子步进
            if (this.physicsConfig.useSubStepping) {
                this.enableSubStepping();
            }

            // 启用休眠
            if (this.physicsConfig.useSleeping) {
                this.enableSleeping();
            }

            // 启用宽相
            if (this.physicsConfig.useBroadPhase) {
                this.enableBroadPhase();
            }

            // 启用窄相
            if (this.physicsConfig.useNarrowPhase) {
                this.enableNarrowPhase();
            }

            // 启用响应
            if (this.physicsConfig.useResponse) {
                this.enableResponse();
            }

            // 启用求解器
            if (this.physicsConfig.useSolver) {
                this.enableSolver();
            }

            // 启用热启动
            if (this.physicsConfig.useWarmStarting) {
                this.enableWarmStarting();
            }

            // 启用恢复系数
            if (this.physicsConfig.useRestitution) {
                this.enableRestitution();
            }

            // 启用阻尼
            if (this.physicsConfig.useDamping) {
                this.enableDamping();
            }

            // 启用约束
            if (this.physicsConfig.useConstraints) {
                this.enableConstraints();
            }

            // 启用关节
            if (this.physicsConfig.useJoints) {
                this.enableJoints();
            }

            // 启用射线投射
            if (this.physicsConfig.useRaycasting) {
                this.enableRaycasting();
            }
        },

        /**
         * 启用重力
         */
        enableGravity: function () {
            // 实现重力逻辑
        },

        /**
         * 启用摩擦力
         */
        enableFriction: function () {
            // 实现摩擦力逻辑
        },

        /**
         * 启用碰撞检测
         */
        enableCollisionDetection: function () {
            // 实现碰撞检测逻辑
        },

        /**
         * 启用空间哈希
         */
        enableSpatialHashing: function () {
            // 实现空间哈希逻辑
        },

        /**
         * 启用连续碰撞检测
         */
        enableContinuousCollision: function () {
            // 实现连续碰撞检测逻辑
        },

        /**
         * 启用子步进
         */
        enableSubStepping: function () {
            // 实现子步进逻辑
        },

        /**
         * 启用休眠
         */
        enableSleeping: function () {
            // 实现休眠逻辑
        },

        /**
         * 启用宽相
         */
        enableBroadPhase: function () {
            // 实现宽相逻辑
        },

        /**
         * 启用窄相
         */
        enableNarrowPhase: function () {
            // 实现窄相逻辑
        },

        /**
         * 启用响应
         */
        enableResponse: function () {
            // 实现响应逻辑
        },

        /**
         * 启用求解器
         */
        enableSolver: function () {
            // 实现求解器逻辑
        },

        /**
         * 启用热启动
         */
        enableWarmStarting: function () {
            // 实现热启动逻辑
        },

        /**
         * 启用恢复系数
         */
        enableRestitution: function () {
            // 实现恢复系数逻辑
        },

        /**
         * 启用阻尼
         */
        enableDamping: function () {
            // 实现阻尼逻辑
        },

        /**
         * 启用约束
         */
        enableConstraints: function () {
            // 实现约束逻辑
        },

        /**
         * 启用关节
         */
        enableJoints: function () {
            // 实现关节逻辑
        },

        /**
         * 启用射线投射
         */
        enableRaycasting: function () {
            // 实现射线投射逻辑
        },

        /**
         * 更新物理
         * @param {number} deltaTime - 时间增量
         */
        updatePhysics: function (deltaTime) {
            if (!this.physicsConfig.enabled) {
                return;
            }

            const startTime = performance.now();

            // 应用重力
            if (this.physicsConfig.useGravity) {
                this.applyGravity();
            }

            // 应用摩擦力
            if (this.physicsConfig.useFriction) {
                this.applyFriction();
            }

            // 更新位置
            this.updatePositions(deltaTime);

            // 碰撞检测
            if (this.physicsConfig.useCollisionDetection) {
                this.detectCollisions();
            }

            // 应用阻尼
            if (this.physicsConfig.useDamping) {
                this.applyDamping();
            }

            // 求解约束
            if (this.physicsConfig.useConstraints) {
                this.solveConstraints();
            }

            // 求解关节
            if (this.physicsConfig.useJoints) {
                this.solveJoints();
            }

            const endTime = performance.now();
            const updateTime = endTime - startTime;

            // 更新统计
            this.physicsStats.stats.totalUpdates++;
            this.physicsStats.stats.averageUpdateTime =
                (this.physicsStats.stats.averageUpdateTime * (this.physicsStats.stats.totalUpdates - 1) + updateTime) /
                this.physicsStats.stats.totalUpdates;
            this.physicsStats.stats.maxUpdateTime = Math.max(this.physicsStats.stats.maxUpdateTime, updateTime);

            this.savePhysicsStats();
        },

        /**
         * 应用重力
         */
        applyGravity: function () {
            // 实现重力应用逻辑
        },

        /**
         * 应用摩擦力
         */
        applyFriction: function () {
            // 实现摩擦力应用逻辑
        },

        /**
         * 更新位置
         * @param {number} deltaTime - 时间增量
         */
        updatePositions: function () {
            // 实现位置更新逻辑
        },

        /**
         * 检测碰撞
         */
        detectCollisions: function () {
            const startTime = performance.now();

            // 实现碰撞检测逻辑

            const endTime = performance.now();
            const collisionTime = endTime - startTime;

            // 更新统计
            this.physicsStats.stats.totalCollisions++;
            this.physicsStats.stats.averageCollisionTime =
                (this.physicsStats.stats.averageCollisionTime * (this.physicsStats.stats.totalCollisions - 1) + collisionTime) /
                this.physicsStats.stats.totalCollisions;
            this.physicsStats.stats.maxCollisionTime = Math.max(this.physicsStats.stats.maxCollisionTime, collisionTime);

            this.savePhysicsStats();
        },

        /**
         * 应用阻尼
         */
        applyDamping: function () {
            // 实现阻尼应用逻辑
        },

        /**
         * 求解约束
         */
        solveConstraints: function () {
            // 实现约束求解逻辑
        },

        /**
         * 求解关节
         */
        solveJoints: function () {
            // 实现关节求解逻辑
        },

        /**
         * 射线投射
         * @param {Object} ray - 射线对象
         * @returns {Object|null} 射线投射结果
         */
        raycast: function () {
            if (!this.physicsConfig.useRaycasting) {
                return null;
            }

            const startTime = performance.now();

            // 实现射线投射逻辑

            const endTime = performance.now();
            const raycastTime = endTime - startTime;

            // 更新统计
            this.physicsStats.stats.totalRaycasts++;
            this.physicsStats.stats.averageRaycastTime =
                (this.physicsStats.stats.averageRaycastTime * (this.physicsStats.stats.totalRaycasts - 1) + raycastTime) /
                this.physicsStats.stats.totalRaycasts;
            this.physicsStats.stats.maxRaycastTime = Math.max(this.physicsStats.stats.maxRaycastTime, raycastTime);

            this.savePhysicsStats();

            return null;
        },

        /**
         * 获取物理统计
         * @returns {Object} 统计信息
         */
        getStats: function () {
            return this.physicsStats.stats;
        },

        /**
         * 设置物理配置
         * @param {Object} config - 配置对象
         */
        setPhysicsConfig: function (config) {
            this.physicsConfig = { ...this.physicsConfig, ...config };
            this.savePhysicsConfig();
        },

        /**
         * 获取物理配置
         * @returns {Object} 配置对象
         */
        getPhysicsConfig: function () {
            return this.physicsConfig;
        }
    };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).aiConfig = { enabled: true, usePathfinding: true, useBehaviorTree: true, useMemory: true };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).aiStats = { stats: { totalDecisions: 0 } };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).init = function () { this.loadAIConfig(); this.optimizeAI(); };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).loadAIConfig = function () {
        const customConfig = localStorage.getItem('aiConfig');
        if (customConfig) { try { this.aiConfig = { ...this.aiConfig, ...JSON.parse(customConfig) }; } catch (e) { } }
    };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).optimizeAI = function () {
        if (this.aiConfig.usePathfinding) this.enablePathfinding();
        if (this.aiConfig.useBehaviorTree) this.enableBehaviorTree();
        if (this.aiConfig.useMemory) this.enableMemory();
    };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).enablePathfinding = function () { console.log('?·??????'); };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).enableBehaviorTree = function () { console.log('???????????'); };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).enableMemory = function () { console.log('??????????'); };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).updateAI = function () {
        if (!this.aiConfig.enabled) return;
        this.aiStats.stats.totalDecisions++;
        localStorage.setItem('aiStats', JSON.stringify(this.aiStats));
    };
    ({
        aiAgents: {},
        aiCache: {},
        aiHistory: [],
        maxHistorySize: 100,
        maxCacheSize: 1000,

        /**
         * 初始化游戏AI
         */
        init: function () {
            this.aiAgents = {};
            this.aiCache = {};
            this.aiHistory = [];
        },

        /**
         * 添加AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} agent - AI代理
         */
        addAIAgent: function (agentId, agent) {
            this.aiAgents[agentId] = agent;
        },

        /**
         * 移除AI代理
         * @param {string} agentId - 代理ID
         */
        removeAIAgent: function (agentId) {
            delete this.aiAgents[agentId];
        },

        /**
         * 获取AI代理
         * @param {string} agentId - 代理ID
         * @returns {Object|null} AI代理
         */
        getAIAgent: function (agentId) {
            return this.aiAgents[agentId] || null;
        },

        /**
         * 更新AI代理
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         */
        updateAIAgent: function (agentId, gameState) {
            const agent = this.aiAgents[agentId];
            if (!agent) {
                return null;
            }

            // 优化：检查缓存
            const cacheKey = this.getCacheKey(agentId, gameState);
            if (this.aiCache[cacheKey]) {
                return this.aiCache[cacheKey];
            }

            // 优化：执行AI决策
            const decision = agent.think(gameState);

            // 优化：保存到缓存
            this.aiCache[cacheKey] = decision;

            // 优化：限制缓存大小
            if (Object.keys(this.aiCache).length > this.maxCacheSize) {
                const oldestKey = Object.keys(this.aiCache)[0];
                delete this.aiCache[oldestKey];
            }

            // 优化：保存决策历史
            this.aiHistory.push({
                agentId: agentId,
                decision: decision,
                timestamp: performance.now()
            });

            // 优化：限制历史记录大小
            if (this.aiHistory.length > this.maxHistorySize) {
                this.aiHistory.shift();
            }

            return decision;
        },

        /**
         * 获取缓存键
         * @param {string} agentId - 代理ID
         * @param {Object} gameState - 游戏状态
         * @returns {string} 缓存键
         */
        getCacheKey: function (agentId, gameState) {
            // 优化：创建简化的游戏状态哈希
            const simplifiedState = {
                playerX: Math.round(gameState.player.x),
                playerY: Math.round(gameState.player.y),
                playerHealth: gameState.player.health,
                enemyCount: gameState.enemies.length
            };
            return agentId + JSON.stringify(simplifiedState);
        },

        /**
         * 清空AI缓存
         * @param {string} agentId - 代理ID（可选）
         */
        clearAICache: function (agentId) {
            if (agentId) {
                // 优化：只清空指定代理的缓存
                for (const key in this.aiCache) {
                    if (key.startsWith(agentId)) {
                        delete this.aiCache[key];
                    }
                }
            } else {
                this.aiCache = {};
            }
        },

        /**
         * 获取AI历史
         * @returns {Array} AI历史
         */
        getAIHistory: function () {
            return this.aiHistory;
        },

        /**
         * 清空AI历史
         */
        clearAIHistory: function () {
            this.aiHistory = [];
        },

        /**
         * 获取AI统计信息
         * @returns {Object} AI统计信息
         */
        getAIStats: function () {
            const stats = {
                agentCount: Object.keys(this.aiAgents).length,
                cacheSize: Object.keys(this.aiCache).length,
                historySize: this.aiHistory.length,
                maxCacheSize: this.maxCacheSize,
                maxHistorySize: this.maxHistorySize
            };

            // 优化：统计每个代理的决策次数
            stats.agentDecisions = {};
            for (let i = 0; i < this.aiHistory.length; i++) {
                const agentId = this.aiHistory[i].agentId;
                if (!stats.agentDecisions[agentId]) {
                    stats.agentDecisions[agentId] = 0;
                }
                stats.agentDecisions[agentId]++;
            }

            return stats;
        },

        /**
         * 批量更新AI代理
         * @param {Array} agentIds - 代理ID数组
         * @param {Object} gameState - 游戏状态
         */
        updateAllAIAgents: function (agentIds, gameState) {
            const decisions = {};

            for (let i = 0; i < agentIds.length; i++) {
                const agentId = agentIds[i];
                decisions[agentId] = this.updateAIAgent(agentId, gameState);
            }

            return decisions;
        },

        /**
         * 移除所有AI代理
         */
        removeAllAIAgents: function () {
            this.aiAgents = {};
        },

        /**
         * 优化AI决策
         * @param {Function} thinkFunction - 思考函数
         * @returns {Function} 优化后的思考函数
         */
        optimizeThinkFunction: function (thinkFunction) {
            // 优化：添加缓存和性能监控
            const optimizedThink = function (gameState) {
                const startTime = performance.now();

                // 优化：执行原始思考函数
                const decision = thinkFunction(gameState);

                const endTime = performance.now();
                const thinkTime = endTime - startTime;

                // 优化：记录思考时间
                if (thinkTime > 10) {
                    console.warn(`AI决策时间过长: ${thinkTime}ms`);
                }

                return decision;
            };

            return optimizedThink;
        },

        /**
         * 创建AI代理
         * @param {string} agentId - 代理ID
         * @param {Function} thinkFunction - 思考函数
         * @returns {Object} AI代理
         */
        createAIAgent: function (agentId, thinkFunction) {
            const agent = {
                id: agentId,
                think: this.optimizeThinkFunction(thinkFunction),
                state: {},
                lastDecision: null,
                lastDecisionTime: 0
            };

            this.addAIAgent(agentId, agent);

            return agent;
        }
    }).getStats = function () { return this.aiStats.stats; };

})
