// 贪吃蛇游戏核心模块
const SnakeGame = (() => {
    // DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');

    // 游戏配置
    const CONFIG = {
        gridSize: 15,
        tileCount: canvas.width / 15,
        speed: 100, // 游戏速度（毫秒）
        initialDirection: { dx: 0, dy: 0 }
    };

    // 游戏状态
    let state = {
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        dx: 0,
        dy: 0,
        score: 0,
        gameRunning: false,
        lastTime: 0,
        animationId: null
    };

    // 缓存渐变对象，避免重复创建
    let snakeGradient = null;
    let foodGradient = null;

    // 初始化渐变对象
    function initGradients() {
        // 蛇身渐变
        snakeGradient = ctx.createLinearGradient(0, 0, CONFIG.gridSize, CONFIG.gridSize);
        snakeGradient.addColorStop(0, '#4CAF50');
        snakeGradient.addColorStop(1, '#45a049');

        // 食物渐变
        foodGradient = ctx.createRadialGradient(
            CONFIG.gridSize / 2,
            CONFIG.gridSize / 2,
            2,
            CONFIG.gridSize / 2,
            CONFIG.gridSize / 2,
            CONFIG.gridSize / 2
        );
        foodGradient.addColorStop(0, '#ff6b6b');
        foodGradient.addColorStop(1, '#ee5253');
    }

    // 初始化游戏
    function initGame() {
        initGradients();
        resetGame();
        setupEventListeners();
        clearCanvas();
    }

    // 重置游戏
    function resetGame() {
        state = {
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            dx: 0,
            dy: 0,
            score: 0,
            gameRunning: false,
            lastTime: 0,
            animationId: null
        };
        updateScore();
    }

    // 游戏主循环（使用requestAnimationFrame）
    function gameLoop(timestamp) {
        if (!state.gameRunning) return;

        // 控制游戏速度
        if (timestamp - state.lastTime < CONFIG.speed) {
            state.animationId = requestAnimationFrame(gameLoop);
            return;
        }

        state.lastTime = timestamp;

        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        updateScore();

        state.animationId = requestAnimationFrame(gameLoop);
    }

    // 清空画布
    function clearCanvas() {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 移动蛇
    function moveSnake() {
        const head = { x: state.snake[0].x + state.dx, y: state.snake[0].y + state.dy };
        state.snake.unshift(head);

        if (head.x === state.food.x && head.y === state.food.y) {
            generateFood();
            state.score += 10;
        } else {
            state.snake.pop();
        }
    }

    // 绘制蛇
    function drawSnake() {
        state.snake.forEach((segment, index) => {
            // 使用缓存的渐变
            ctx.fillStyle = snakeGradient;
            ctx.fillRect(
                segment.x * CONFIG.gridSize,
                segment.y * CONFIG.gridSize,
                CONFIG.gridSize - 2,
                CONFIG.gridSize - 2
            );

            if (index === 0) {
                // 绘制眼睛
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(segment.x * CONFIG.gridSize + 5, segment.y * CONFIG.gridSize + 5, 2, 0, 2 * Math.PI);
                ctx.arc(segment.x * CONFIG.gridSize + 10, segment.y * CONFIG.gridSize + 5, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    // 绘制食物
    function drawFood() {
        // 使用缓存的渐变
        ctx.fillStyle = foodGradient;
        ctx.beginPath();
        ctx.arc(
            state.food.x * CONFIG.gridSize + CONFIG.gridSize / 2,
            state.food.y * CONFIG.gridSize + CONFIG.gridSize / 2,
            CONFIG.gridSize / 2 - 1,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }

    // 生成食物（确保不在蛇身上）
    function generateFood() {
        let validPosition = false;
        let newFood;

        while (!validPosition) {
            newFood = {
                x: Math.floor(Math.random() * CONFIG.tileCount),
                y: Math.floor(Math.random() * CONFIG.tileCount)
            };

            // 检查食物是否在蛇身上
            validPosition = !state.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
        }

        state.food = newFood;
    }

    // 检查碰撞
    function checkCollision() {
        const head = state.snake[0];

        // 边界碰撞
        if (head.x < 0 || head.x >= CONFIG.tileCount || head.y < 0 || head.y >= CONFIG.tileCount) {
            gameOver();
            return;
        }

        // 自身碰撞
        for (let i = 1; i < state.snake.length; i++) {
            if (head.x === state.snake[i].x && head.y === state.snake[i].y) {
                gameOver();
                return;
            }
        }
    }

    // 游戏结束
    function gameOver() {
        state.gameRunning = false;
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
        }
        startBtn.textContent = '重新开始';
        startBtn.style.display = 'inline-block';
        alert(`游戏结束！你的得分是: ${state.score}`);
    }

    // 更新分数显示
    function updateScore() {
        scoreElement.textContent = `得分: ${state.score}`;
    }

    // 处理键盘方向控制
    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = event.keyCode;

        const goingUp = state.dy === -1;
        const goingDown = state.dy === 1;
        const goingRight = state.dx === 1;
        const goingLeft = state.dx === -1;

        if (keyPressed === LEFT_KEY && !goingRight) {
            state.dx = -1;
            state.dy = 0;
        } else if (keyPressed === UP_KEY && !goingDown) {
            state.dx = 0;
            state.dy = -1;
        } else if (keyPressed === RIGHT_KEY && !goingLeft) {
            state.dx = 1;
            state.dy = 0;
        } else if (keyPressed === DOWN_KEY && !goingUp) {
            state.dx = 0;
            state.dy = 1;
        }
    }

    // 处理按钮方向控制
    function changeDirectionByButton(direction) {
        if (direction === 'left' && state.dx !== 1) {
            state.dx = -1;
            state.dy = 0;
        } else if (direction === 'up' && state.dy !== 1) {
            state.dx = 0;
            state.dy = -1;
        } else if (direction === 'down' && state.dy !== -1) {
            state.dx = 0;
            state.dy = 1;
        } else if (direction === 'right' && state.dx !== -1) {
            state.dx = 1;
            state.dy = 0;
        }
    }

    // 开始游戏
    function startGame() {
        if (!state.gameRunning) {
            resetGame();
            state.gameRunning = true;
            startBtn.style.display = 'none';
            // 初始方向设为向右
            state.dx = 1;
            state.dy = 0;
            state.lastTime = performance.now();
            state.animationId = requestAnimationFrame(gameLoop);
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        startBtn.addEventListener('click', startGame);
        document.addEventListener('keydown', changeDirection);
    }

    // 公开方法
    return {
        init: initGame
    };
})();

// 初始化游戏
SnakeGame.init();