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
        // 关卡1
        {
            platforms: [
                {x: 0, y: 450, width: 800, height: 50},
                {x: 200, y: 380, width: 150, height: 20},
                {x: 400, y: 300, width: 150, height: 20},
                {x: 600, y: 220, width: 150, height: 20}
            ],
            enemies: [
                {x: 600, y: 390, width: 30, height: 50, speed: 1, direction: 1},
                {x: 300, y: 310, width: 30, height: 50, speed: 1.5, direction: 1}
            ]
        },
        // 关卡2
        {
            platforms: [
                {x: 0, y: 450, width: 800, height: 50},
                {x: 100, y: 380, width: 100, height: 20},
                {x: 300, y: 310, width: 100, height: 20},
                {x: 500, y: 240, width: 100, height: 20},
                {x: 700, y: 170, width: 100, height: 20}
            ],
            enemies: [
                {x: 500, y: 390, width: 30, height: 50, speed: 1.2, direction: 1},
                {x: 200, y: 310, width: 30, height: 50, speed: 1.5, direction: 1},
                {x: 600, y: 180, width: 30, height: 50, speed: 1.3, direction: 1}
            ]
        },
        // 关卡3
        {
            platforms: [
                {x: 0, y: 450, width: 200, height: 50},
                {x: 300, y: 380, width: 150, height: 20},
                {x: 550, y: 310, width: 250, height: 20},
                {x: 100, y: 240, width: 150, height: 20},
                {x: 400, y: 170, width: 150, height: 20}
            ],
            enemies: [
                {x: 100, y: 390, width: 30, height: 50, speed: 1.4, direction: 1},
                {x: 400, y: 310, width: 30, height: 50, speed: 1.6, direction: 1},
                {x: 200, y: 180, width: 30, height: 50, speed: 1.5, direction: 1}
            ]
        },
        // 关卡4
        {
            platforms: [
                {x: 0, y: 450, width: 150, height: 50},
                {x: 250, y: 400, width: 150, height: 20},
                {x: 500, y: 350, width: 150, height: 20},
                {x: 700, y: 300, width: 100, height: 20},
                {x: 150, y: 250, width: 150, height: 20},
                {x: 400, y: 200, width: 150, height: 20}
            ],
            enemies: [
                {x: 50, y: 400, width: 30, height: 50, speed: 1.5, direction: 1},
                {x: 350, y: 350, width: 30, height: 50, speed: 1.7, direction: 1},
                {x: 600, y: 300, width: 30, height: 50, speed: 1.6, direction: 1},
                {x: 250, y: 200, width: 30, height: 50, speed: 1.5, direction: 1}
            ]
        },
        // 关卡5
        {
            platforms: [
                {x: 0, y: 450, width: 800, height: 50},
                {x: 50, y: 380, width: 100, height: 20},
                {x: 250, y: 310, width: 100, height: 20},
                {x: 450, y: 240, width: 100, height: 20},
                {x: 650, y: 170, width: 100, height: 20},
                {x: 150, y: 100, width: 100, height: 20}
            ],
            enemies: [
                {x: 100, y: 390, width: 30, height: 50, speed: 1.6, direction: 1},
                {x: 350, y: 310, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 550, y: 240, width: 30, height: 50, speed: 1.7, direction: 1},
                {x: 750, y: 170, width: 30, height: 50, speed: 1.6, direction: 1}
            ]
        },
        // 关卡6
        {
            platforms: [
                {x: 0, y: 450, width: 150, height: 50},
                {x: 300, y: 400, width: 100, height: 20},
                {x: 550, y: 350, width: 250, height: 20},
                {x: 100, y: 300, width: 150, height: 20},
                {x: 400, y: 250, width: 150, height: 20},
                {x: 250, y: 200, width: 150, height: 20},
                {x: 600, y: 150, width: 150, height: 20}
            ],
            enemies: [
                {x: 100, y: 400, width: 30, height: 50, speed: 1.7, direction: 1},
                {x: 400, y: 350, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 200, y: 300, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 500, y: 250, width: 30, height: 50, speed: 1.7, direction: 1},
                {x: 700, y: 150, width: 30, height: 50, speed: 1.6, direction: 1}
            ]
        },
        // 关卡7
        {
            platforms: [
                {x: 0, y: 450, width: 200, height: 50},
                {x: 300, y: 380, width: 150, height: 20},
                {x: 550, y: 310, width: 250, height: 20},
                {x: 100, y: 240, width: 150, height: 20},
                {x: 400, y: 170, width: 150, height: 20},
                {x: 250, y: 100, width: 150, height: 20},
                {x: 600, y: 30, width: 150, height: 20}
            ],
            enemies: [
                {x: 100, y: 390, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 400, y: 310, width: 30, height: 50, speed: 2.0, direction: 1},
                {x: 200, y: 240, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 500, y: 170, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 350, y: 100, width: 30, height: 50, speed: 1.7, direction: 1}
            ]
        },
        // 关卡8
        {
            platforms: [
                {x: 0, y: 450, width: 150, height: 50},
                {x: 250, y: 400, width: 150, height: 20},
                {x: 500, y: 350, width: 150, height: 20},
                {x: 700, y: 300, width: 100, height: 20},
                {x: 150, y: 250, width: 150, height: 20},
                {x: 400, y: 200, width: 150, height: 20},
                {x: 250, y: 150, width: 150, height: 20},
                {x: 600, y: 100, width: 150, height: 20}
            ],
            enemies: [
                {x: 50, y: 400, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 350, y: 350, width: 30, height: 50, speed: 2.1, direction: 1},
                {x: 600, y: 300, width: 30, height: 50, speed: 2.0, direction: 1},
                {x: 250, y: 250, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 500, y: 200, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 350, y: 150, width: 30, height: 50, speed: 1.7, direction: 1}
            ]
        },
        // 关卡9
        {
            platforms: [
                {x: 0, y: 450, width: 100, height: 50},
                {x: 200, y: 400, width: 100, height: 20},
                {x: 400, y: 350, width: 100, height: 20},
                {x: 600, y: 300, width: 100, height: 20},
                {x: 100, y: 250, width: 100, height: 20},
                {x: 300, y: 200, width: 100, height: 20},
                {x: 500, y: 150, width: 100, height: 20},
                {x: 200, y: 100, width: 100, height: 20},
                {x: 400, y: 50, width: 100, height: 20}
            ],
            enemies: [
                {x: 50, y: 400, width: 30, height: 50, speed: 2.0, direction: 1},
                {x: 300, y: 350, width: 30, height: 50, speed: 2.2, direction: 1},
                {x: 500, y: 300, width: 30, height: 50, speed: 2.1, direction: 1},
                {x: 200, y: 250, width: 30, height: 50, speed: 2.0, direction: 1},
                {x: 400, y: 200, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 300, y: 150, width: 30, height: 50, speed: 1.8, direction: 1},
                {x: 500, y: 50, width: 30, height: 50, speed: 1.7, direction: 1}
            ]
        },
        // 关卡10
        {
            platforms: [
                {x: 0, y: 450, width: 800, height: 50},
                {x: 100, y: 380, width: 100, height: 20},
                {x: 300, y: 310, width: 100, height: 20},
                {x: 500, y: 240, width: 100, height: 20},
                {x: 700, y: 170, width: 100, height: 20},
                {x: 200, y: 100, width: 100, height: 20},
                {x: 400, y: 30, width: 100, height: 20},
                {x: 600, y: -40, width: 100, height: 20}
            ],
            enemies: [
                {x: 150, y: 390, width: 30, height: 50, speed: 2.1, direction: 1},
                {x: 350, y: 310, width: 30, height: 50, speed: 2.3, direction: 1},
                {x: 550, y: 240, width: 30, height: 50, speed: 2.2, direction: 1},
                {x: 750, y: 170, width: 30, height: 50, speed: 2.1, direction: 1},
                {x: 300, y: 100, width: 30, height: 50, speed: 2.0, direction: 1},
                {x: 500, y: 30, width: 30, height: 50, speed: 1.9, direction: 1},
                {x: 700, y: -40, width: 30, height: 50, speed: 1.8, direction: 1}
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
            isAttacking: false,
            attackTimer: null
        },
        platforms: [],
        enemies: [],
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
        state.player.isAttacking = false;
        
        // 加载平台和敌人
        state.platforms = JSON.parse(JSON.stringify(LEVELS[levelIndex].platforms));
        state.enemies = JSON.parse(JSON.stringify(LEVELS[levelIndex].enemies));
        
        // 根据难度调整敌人速度
        state.enemies.forEach(enemy => {
            enemy.speed *= DIFFICULTY_CONFIG[state.difficulty].enemySpeed;
        });
        
        // 更新UI
        updateUI();
        updateHealthBar();
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
            // 敌人左右移动
            enemy.x += enemy.speed * enemy.direction;
            if (enemy.x < 0 || enemy.x + enemy.width > CONFIG.canvasWidth) {
                enemy.direction *= -1;
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

            // 绘制敌人
            drawEnemies();

            // 绘制玩家
            drawPlayer();
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
        ctx.fillStyle = '#00ffff';
        
        if (player.isAttacking) {
            // 攻击动画
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 20;
            ctx.fillRect(player.x, player.y, player.width + 20, player.height);
            // 添加攻击动画效果
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(player.x + player.width, player.y + player.height / 2 - 5, 15, 10);
        } else {
            // 站立/奔跑动画
            ctx.shadowColor = '#00aaff';
            ctx.shadowBlur = 15;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        ctx.shadowBlur = 0;
        
        // 添加玩家眼睛
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(player.x + player.width * 0.3, player.y + player.height * 0.3, 3, 0, Math.PI * 2);
        ctx.arc(player.x + player.width * 0.7, player.y + player.height * 0.3, 3, 0, Math.PI * 2);
        ctx.fill();
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

    // 公开方法
    return {
        init: initGame
    };
})();

// 页面加载完成后初始化游戏
window.addEventListener('load', function() {
    try {
        StickmanAdventure.init();
    } catch (error) {
        console.error('初始化火柴人冒险游戏时出错:', error);
    }
});