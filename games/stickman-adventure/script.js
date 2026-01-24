// 火柴人冒险游戏核心逻辑
const StickmanAdventure = (() => {
    // DOM元素
    let canvas, ctx;
    let jumpBtn, attackBtn;
    let healthFill;

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
        animationId: null
    };

    // 初始化游戏
    function initGame() {
        // 获取DOM元素
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        jumpBtn = document.getElementById('jumpBtn');
        attackBtn = document.getElementById('attackBtn');
        healthFill = document.querySelector('.health-progress');

        // 设置画布尺寸
        canvas.width = CONFIG.canvasWidth;
        canvas.height = CONFIG.canvasHeight;

        // 创建平台
        createPlatforms();

        // 初始化敌人
        spawnEnemies();

        // 设置事件监听
        setupEventListeners();

        // 开始游戏循环
        state.lastTime = performance.now();
        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 创建平台
    function createPlatforms() {
        state.platforms = [
            {x: 0, y: 450, width: 800, height: 50},
            {x: 200, y: 380, width: 150, height: 20},
            {x: 400, y: 300, width: 150, height: 20},
            {x: 600, y: 220, width: 150, height: 20}
        ];
    }

    // 生成敌人
    function spawnEnemies() {
        state.enemies = [
            {x: 600, y: 390, width: 30, height: 50, speed: 2, direction: 1},
            {x: 300, y: 310, width: 30, height: 50, speed: 1.5, direction: 1},
            {x: 500, y: 230, width: 30, height: 50, speed: 1, direction: 1}
        ];
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
                if (!state.player.isJumping) {
                    state.player.velocityY = state.player.jumpForce;
                    state.player.isJumping = true;
                }
            });
        }
        
        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                if (!state.player.isAttacking) {
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

    // 更新玩家状态
    function updatePlayer() {
        const player = state.player;

        // 键盘控制
        if (state.keys['ArrowLeft']) player.velocityX = -player.speed;
        else if (state.keys['ArrowRight']) player.velocityX = player.speed;
        else if (!state.keys['ArrowLeft'] && !state.keys['ArrowRight']) player.velocityX = 0;

        // 跳跃控制
        if (state.keys['ArrowUp'] && !player.isJumping) {
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

    // 游戏循环
    function gameLoop(timestamp) {
        if (!state.gameRunning) return;

        // 计算时间差，用于控制游戏速度
        const deltaTime = timestamp - state.lastTime;
        state.lastTime = timestamp;

        // 更新游戏状态
        updatePlayer();
        updateEnemies();

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
        ctx.fillText('按刷新键重新开始', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 40);
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