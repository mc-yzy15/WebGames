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

    // 10个关卡设计
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
        // 关卡5
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
                { x: 100, y: 390, width: 30, height: 50, speed: 1.6, direction: 1 },
                { x: 350, y: 310, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 550, y: 240, width: 30, height: 50, speed: 1.7, direction: 1 },
                { x: 750, y: 170, width: 30, height: 50, speed: 1.6, direction: 1 }
            ]
        },
        // 关卡6
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
                { x: 100, y: 400, width: 30, height: 50, speed: 1.7, direction: 1 },
                { x: 400, y: 350, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 200, y: 300, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 500, y: 250, width: 30, height: 50, speed: 1.7, direction: 1 },
                { x: 700, y: 150, width: 30, height: 50, speed: 1.6, direction: 1 }
            ]
        },
        // 关卡7
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
                { x: 100, y: 390, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 400, y: 310, width: 30, height: 50, speed: 2.0, direction: 1 },
                { x: 200, y: 240, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 500, y: 170, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 350, y: 100, width: 30, height: 50, speed: 1.7, direction: 1 }
            ]
        },
        // 关卡8
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
                { x: 50, y: 400, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 350, y: 350, width: 30, height: 50, speed: 2.1, direction: 1 },
                { x: 600, y: 300, width: 30, height: 50, speed: 2.0, direction: 1 },
                { x: 250, y: 250, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 500, y: 200, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 350, y: 150, width: 30, height: 50, speed: 1.7, direction: 1 }
            ]
        },
        // 关卡9
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
                { x: 50, y: 400, width: 30, height: 50, speed: 2.0, direction: 1 },
                { x: 300, y: 350, width: 30, height: 50, speed: 2.2, direction: 1 },
                { x: 500, y: 300, width: 30, height: 50, speed: 2.1, direction: 1 },
                { x: 200, y: 250, width: 30, height: 50, speed: 2.0, direction: 1 },
                { x: 400, y: 200, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 300, y: 150, width: 30, height: 50, speed: 1.8, direction: 1 },
                { x: 500, y: 50, width: 30, height: 50, speed: 1.7, direction: 1 }
            ]
        },
        // 关卡10
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
                { x: 150, y: 390, width: 30, height: 50, speed: 2.1, direction: 1 },
                { x: 350, y: 310, width: 30, height: 50, speed: 2.3, direction: 1 },
                { x: 550, y: 240, width: 30, height: 50, speed: 2.2, direction: 1 },
                { x: 750, y: 170, width: 30, height: 50, speed: 2.1, direction: 1 },
                { x: 300, y: 100, width: 30, height: 50, speed: 2.0, direction: 1 },
                { x: 500, y: 30, width: 30, height: 50, speed: 1.9, direction: 1 },
                { x: 700, y: -40, width: 30, height: 50, speed: 1.8, direction: 1 }
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
            health: 100,
            maxHealth: 100,
            isAttacking: false,
            attackTimer: null,
            attackPower: 1, // 攻击力倍数
            powerUpTimer: null // 攻击力提升计时器
        },
        platforms: [],
        enemies: [],
        props: [], // 游戏道具
        keys: {},
        gameRunning: true,
        lastTime: 0,
        animationId: null,
        currentLevel: 0,
        score: 0,
        difficulty: 'easy',
        completedLevels: [0], // 已完成的关卡索引
        gameState: 'playing' // playing, gameOver, levelComplete
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
        state.player.health = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        state.player.maxHealth = DIFFICULTY_CONFIG[state.difficulty].playerHealth;
        state.player.isAttacking = false;
        state.player.attackPower = 1;
        if (state.player.powerUpTimer) {
            clearTimeout(state.player.powerUpTimer);
            state.player.powerUpTimer = null;
        }

        // 加载平台和敌人
        state.platforms = JSON.parse(JSON.stringify(LEVELS[levelIndex].platforms));
        state.enemies = JSON.parse(JSON.stringify(LEVELS[levelIndex].enemies));

        // 根据难度调整敌人速度
        state.enemies.forEach(enemy => {
            enemy.speed *= DIFFICULTY_CONFIG[state.difficulty].enemySpeed;
        });

        // 生成道具
        spawnProps(levelIndex);

        // 更新UI
        updateUI();
        updateHealthBar();
    }

    // 生成道具
    function spawnProps(levelIndex) {
        state.props = [];

        // 根据关卡生成不同数量的道具
        const propCount = Math.min(levelIndex + 1, 3);

        for (let i = 0; i < propCount; i++) {
            // 随机选择道具类型
            const propTypes = ['health', 'powerup'];
            const propType = propTypes[Math.floor(Math.random() * propTypes.length)];

            // 随机选择平台
            const platform = state.platforms[Math.floor(Math.random() * state.platforms.length)];

            // 在平台上随机位置生成道具
            const prop = {
                x: platform.x + Math.random() * (platform.width - 20),
                y: platform.y - 30,
                width: 20,
                height: 20,
                type: propType,
                collected: false,
                pulseTimer: 0
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

        // 根据道具类型执行不同效果
        switch (prop.type) {
            case 'health':
                // 恢复生命值
                state.player.health = Math.min(state.player.health + 30, state.player.maxHealth);
                updateHealthBar();
                state.score += 5;
                break;
            case 'powerup':
                // 提升攻击力
                state.player.attackPower = 2;
                if (state.player.powerUpTimer) {
                    clearTimeout(state.player.powerUpTimer);
                }
                // 攻击力提升持续5秒
                state.player.powerUpTimer = setTimeout(() => {
                    state.player.attackPower = 1;
                }, 5000);
                state.score += 15;
                break;
        }

        updateUI();
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
            jumpBtn.addEventListener('click', () => {
                if (!state.player.isJumping && state.gameState === 'playing') {
                    state.player.velocityY = state.player.jumpForce;
                    state.player.isJumping = true;
                }
            });
        }

        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                if (!state.player.isAttacking && state.gameState === 'playing') {
                    state.player.isAttacking = true;
                    if (state.player.attackTimer) {
                        clearTimeout(state.player.attackTimer);
                    }
                    state.player.attackTimer = setTimeout(() => {
                        state.player.isAttacking = false;
                    }, CONFIG.attackDuration);
                }
            });
        }
    }

    // 设置模态框监听
    function setupModalListeners() {
        // 关闭按钮
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 关闭当前模态框
                const modal = btn.closest('.modal');
                modal.style.display = 'none';
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
            tutorialBtn.addEventListener('click', () => {
                tutorialPanel.style.display = 'block';
            });
        }

        // 难度选择按钮
        if (difficultyBtn) {
            difficultyBtn.addEventListener('click', () => {
                difficultyPanel.style.display = 'block';
            });
        }

        // 难度选项
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(option => {
            option.addEventListener('click', () => {
                const difficulty = option.dataset.difficulty;
                setDifficulty(difficulty);
                difficultyPanel.style.display = 'none';
            });
        });

        // 关卡选择按钮
        if (levelBtn) {
            levelBtn.addEventListener('click', () => {
                levelPanel.style.display = 'block';
            });
        }

        // 导出数据按钮
        if (exportBtn) {
            exportBtn.addEventListener('click', exportGameData);
        }
    }

    // 生成关卡按钮
    function generateLevelButtons() {
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

        // 键盘控制
        if (state.keys['ArrowLeft']) player.velocityX = -player.speed;
        else if (state.keys['ArrowRight']) player.velocityX = player.speed;
        else if (!state.keys['ArrowLeft'] && !state.keys['ArrowRight']) player.velocityX = 0;

        // 跳跃控制
        if (state.keys['ArrowUp'] && !player.isJumping && state.gameState === 'playing') {
            player.velocityY = player.jumpForce;
            player.isJumping = true;
        }

        // 应用重力
        player.velocityY += player.gravity;
        player.y += player.velocityY;
        player.x += player.velocityX;

        // 边界检查
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > CONFIG.canvasWidth) {
            player.x = CONFIG.canvasWidth - player.width;
        }

        // 平台碰撞检测
        player.isJumping = true;
        state.platforms.forEach(platform => {
            if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y + player.height < platform.y + 10 &&
                player.velocityY > 0
            ) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        });

        // 攻击检测
        if (player.isAttacking) {
            state.enemies.forEach((enemy, index) => {
                if (
                    player.x + player.width > enemy.x &&
                    player.x < enemy.x + enemy.width &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y
                ) {
                    state.enemies.splice(index, 1);
                    state.score += 10;
                    updateUI();

                    // 检查关卡是否完成
                    checkLevelComplete();
                }
            });
        }

        // 敌人碰撞检测
        state.enemies.forEach(enemy => {
            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                player.health -= 10;
                updateHealthBar();
                if (player.health <= 0) {
                    gameOver();
                }
            }
        });
    }

    // 更新敌人
    function updateEnemies() {
        state.enemies.forEach(enemy => {
            // 根据敌人类型执行不同的行为
            switch (enemy.type || 'normal') {
                case 'normal':
                    // 普通敌人：左右移动
                    enemy.x += enemy.speed * enemy.direction;
                    if (enemy.x < 0 || enemy.x + enemy.width > CONFIG.canvasWidth) {
                        enemy.direction *= -1;
                    }
                    break;

                case 'jumping':
                    // 跳跃敌人：左右移动 + 跳跃
                    enemy.x += enemy.speed * enemy.direction;
                    if (enemy.x < 0 || enemy.x + enemy.width > CONFIG.canvasWidth) {
                        enemy.direction *= -1;
                    }

                    // 应用重力
                    enemy.velocityY += enemy.gravity || CONFIG.gravity;
                    enemy.y += enemy.velocityY;

                    // 平台碰撞检测
                    enemy.isJumping = true;
                    state.platforms.forEach(platform => {
                        if (
                            enemy.x < platform.x + platform.width &&
                            enemy.x + enemy.width > platform.x &&
                            enemy.y + enemy.height > platform.y &&
                            enemy.y + enemy.height < platform.y + 10 &&
                            enemy.velocityY > 0
                        ) {
                            enemy.y = platform.y - enemy.height;
                            enemy.velocityY = enemy.jumpForce || -12;
                            enemy.isJumping = false;
                        }
                    });
                    break;

                case 'tracking':
                    // 追踪敌人：追踪玩家
                    if (state.player.x > enemy.x + enemy.width / 2) {
                        enemy.x += enemy.speed;
                    } else if (state.player.x < enemy.x - enemy.width / 2) {
                        enemy.x -= enemy.speed;
                    }

                    // 应用重力
                    enemy.velocityY += enemy.gravity || CONFIG.gravity;
                    enemy.y += enemy.velocityY;

                    // 平台碰撞检测
                    enemy.isJumping = true;
                    state.platforms.forEach(platform => {
                        if (
                            enemy.x < platform.x + platform.width &&
                            enemy.x + enemy.width > platform.x &&
                            enemy.y + enemy.height > platform.y &&
                            enemy.y + enemy.height < platform.y + 10 &&
                            enemy.velocityY > 0
                        ) {
                            enemy.y = platform.y - enemy.height;
                            enemy.velocityY = 0;
                            enemy.isJumping = false;
                        }
                    });
                    break;

                case 'flying':
                    // 飞行敌人：上下浮动 + 左右移动
                    enemy.x += enemy.speed * enemy.direction;
                    if (enemy.x < 0 || enemy.x + enemy.width > CONFIG.canvasWidth) {
                        enemy.direction *= -1;
                    }

                    // 上下浮动
                    enemy.y = enemy.baseY + Math.sin(state.lastTime * 0.005) * 30;
                    break;
            }
        });
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
            // 清空画布
            ctx.fillStyle = '#1a0f41';
            ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

            // 绘制平台
            drawPlatforms();

            // 绘制道具
            drawProps();

            // 绘制敌人
            drawEnemies();

            // 绘制玩家
            drawPlayer();

            // 绘制攻击力提升效果
            if (state.player.attackPower > 1) {
                ctx.fillStyle = '#ffff33';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('攻击力提升!', CONFIG.canvasWidth / 2, 30);
            }
        } catch (error) {
            console.error('绘制游戏元素时出错:', error);
        }
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
        ctx.fillStyle = '#ff0066';
        state.enemies.forEach(enemy => {
            // 绘制敌人
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            // 敌人发光效果
            ctx.shadowColor = '#ff66cc';
            ctx.shadowBlur = 10;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.shadowBlur = 0;
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
            ctx.shadowBlur = 20;
            ctx.fillRect(player.x, player.y, player.width + 20, player.height);

            // 添加攻击动画效果
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(player.x + player.width, player.y + player.height / 2 - 5, 15, 10);

            // 攻击粒子效果
            for (let i = 0; i < 5; i++) {
                const particleX = player.x + player.width + 20 + Math.random() * 10;
                const particleY = player.y + player.height * 0.2 + Math.random() * player.height * 0.6;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
                ctx.fillRect(particleX, particleY, 2, 2);
            }
        } else {
            // 站立/奔跑动画
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00aaff';
            ctx.shadowBlur = 15;

            // 奔跑动画：根据速度调整身体倾斜
            let bodyTilt = 0;
            if (player.velocityX > 0) bodyTilt = -5;
            if (player.velocityX < 0) bodyTilt = 5;

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
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3, player.y + player.height * 0.3, 3, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7, player.y + player.height * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();

        // 添加玩家嘴巴（根据状态变化）
        ctx.fillStyle = '#ffffff';
        if (player.isAttacking) {
            // 攻击时张开嘴巴
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 4, 0, Math.PI);
            ctx.fill();
        } else if (player.isJumping) {
            // 跳跃时兴奋表情
            ctx.beginPath();
            ctx.arc(player.x + player.width * 0.5, player.y + player.height * 0.4, 3, 0, Math.PI, false);
            ctx.fill();
        }
    }

    // 绘制敌人
    function drawEnemies() {
        state.enemies.forEach(enemy => {
            // 敌人发光效果
            ctx.fillStyle = '#ff0066';
            ctx.shadowColor = '#ff66cc';
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

            // 添加敌人嘴巴（愤怒表情）
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4);
            ctx.lineTo(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5);
            ctx.lineTo(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4);
            ctx.fill();
        });
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

        // 计算时间差，用于控制游戏速度
        const deltaTime = timestamp - state.lastTime;
        state.lastTime = timestamp;

        // 更新游戏状态（仅在游戏进行中）
        if (state.gameState === 'playing') {
            updatePlayer();
            updateEnemies();
            updateProps();
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
        
        // 创建保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveBtn';
        saveBtn.className = 'cyber-button control-btn';
        saveBtn.textContent = '💾 保存进度';
        saveBtn.addEventListener('click', saveGameProgress);
        
        // 创建加载按钮
        const loadBtn = document.createElement('button');
        loadBtn.id = 'loadBtn';
        loadBtn.className = 'cyber-button control-btn';
        loadBtn.textContent = '📂 加载进度';
        loadBtn.addEventListener('click', loadGameProgress);
        
        // 添加到控制面板
        gameControls.appendChild(saveBtn);
        gameControls.appendChild(loadBtn);
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