// 火柴人冒险游戏核心逻辑
let canvas, ctx;
let player = {
    x: 100,
    y: 350,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: -15,
    gravity: 0.8,
    isJumping: false,
    health: 100,
    isAttacking: false
};
let platforms = [];
let enemies = [];
let gameLoopId;
let keys = {};

// 初始化游戏
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    // 创建平台
    platforms = [
        {x: 0, y: 450, width: 800, height: 50},
        {x: 200, y: 380, width: 150, height: 20},
        {x: 400, y: 300, width: 150, height: 20},
        {x: 600, y: 220, width: 150, height: 20}
    ];

    // 初始化敌人
    spawnEnemies();

    // 事件监听
    setupEventListeners();

    // 开始游戏循环
    gameLoopId = requestAnimationFrame(gameLoop);
}

// 生成敌人
function spawnEnemies() {
    enemies = [
        {x: 600, y: 390, width: 30, height: 50, speed: 2},
        {x: 300, y: 310, width: 30, height: 50, speed: 1.5},
        {x: 500, y: 230, width: 30, height: 50, speed: 1}
    ];
}

// 设置事件监听
function setupEventListeners() {
    // 键盘控制
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // 按钮控制
    document.getElementById('leftBtn').addEventListener('click', () => {
        player.velocityX = -player.speed;
    });
    document.getElementById('rightBtn').addEventListener('click', () => {
        player.velocityX = player.speed;
    });
    document.getElementById('jumpBtn').addEventListener('click', () => {
        if (!player.isJumping) {
            player.velocityY = player.jumpForce;
            player.isJumping = true;
        }
    });
    document.getElementById('attackBtn').addEventListener('click', () => {
        player.isAttacking = true;
        setTimeout(() => player.isAttacking = false, 200);
    });

    // 按钮释放事件
    document.getElementById('leftBtn').addEventListener('mouseup', () => {
        if (!keys['ArrowLeft']) player.velocityX = 0;
    });
    document.getElementById('rightBtn').addEventListener('mouseup', () => {
        if (!keys['ArrowRight']) player.velocityX = 0;
    });
}

// 更新玩家状态
function updatePlayer() {
    // 键盘控制
    if (keys['ArrowLeft']) player.velocityX = -player.speed;
    else if (keys['ArrowRight']) player.velocityX = player.speed;
    else player.velocityX = 0;

    // 跳跃控制
    if (keys['ArrowUp'] && !player.isJumping) {
        player.velocityY = player.jumpForce;
        player.isJumping = true;
    }

    // 应用重力
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    player.x += player.velocityX;

    // 边界检查
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // 平台碰撞检测
    player.isJumping = true;
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.velocityY + 10 &&
            player.velocityY > 0
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    // 攻击检测
    if (player.isAttacking) {
        enemies.forEach((enemy, index) => {
            if (
                player.x + player.width > enemy.x &&
                player.x < enemy.x + enemy.width &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                enemies.splice(index, 1);
                setTimeout(() => spawnEnemies(), 3000);
            }
        });
    }

    // 敌人碰撞检测
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            player.health -= 10;
            updateHealthBar();
            if (player.health <= 0) gameOver();
        }
    });
}

// 更新敌人
function updateEnemies() {
    enemies.forEach(enemy => {
        // 敌人左右移动
        enemy.x += enemy.speed;
        if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
            enemy.speed *= -1;
        }
    });
}

// 更新生命值显示
function updateHealthBar() {
    document.querySelector('.health-fill').style.width = player.health + '%';
}

// 绘制游戏元素
function draw() {
    // 清空画布
    ctx.fillStyle = '#1a0f41';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制平台
    ctx.fillStyle = '#6a0dad';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        // 平台发光效果
        ctx.shadowColor = '#9d4edd';
        ctx.shadowBlur = 15;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.shadowBlur = 0;
    });

    // 绘制敌人
    ctx.fillStyle = '#ff0066';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        // 敌人发光效果
        ctx.shadowColor = '#ff66cc';
        ctx.shadowBlur = 10;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.shadowBlur = 0;
    });

    // 绘制玩家
    ctx.fillStyle = '#00ffff';
    if (player.isAttacking) {
        // 攻击动画
        ctx.fillRect(player.x, player.y, player.width + 20, player.height);
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
    } else {
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = 15;
    }
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
}

// 游戏循环
function gameLoop() {
    updatePlayer();
    updateEnemies();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

// 游戏结束
function gameOver() {
    cancelAnimationFrame(gameLoopId);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('按刷新键重新开始', canvas.width / 2, canvas.height / 2 + 40);
}

// 页面加载时初始化游戏
window.onload = initGame;