/**
 * 贪吃蛇游戏核心模块
 * 功能：
 * - 基础贪吃蛇游戏逻辑
 * - 游戏难度递增
 * - 游戏暂停/继续
 * - 最高分记录（使用localStorage）
 * - 响应式触摸控制
 * - 游戏开始倒计时
 * - 美观的游戏结束弹窗
 */
const SnakeGame = (() => {
    // DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const upBtn = document.getElementById('up');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const downBtn = document.getElementById('down');

    // 游戏配置
    const CONFIG = {
        gridSize: 15,
        tileCount: canvas.width / 15,
        initialSpeed: 100, // 初始游戏速度（毫秒）
        minSpeed: 50, // 最小游戏速度（毫秒）
        speedDecrement: 5, // 每次增加难度时速度减少值（毫秒）
        scorePerFood: 10, // 每个食物的得分
        difficultyIncreaseInterval: 3, // 每吃3个食物增加一次难度
        initialDirection: { dx: 1, dy: 0 } // 初始方向向右
    };

    // 游戏状态
    let state = {
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        dx: 1,
        dy: 0,
        score: 0,
        highScore: 0,
        foodEaten: 0,
        currentSpeed: CONFIG.initialSpeed,
        gameRunning: false,
        gamePaused: false,
        lastTime: 0,
        animationId: null,
        countdown: 3,
        countdownActive: false,
        countdownStartTime: 0
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
        loadHighScore();
        updateHighScoreDisplay();
        resetGame();
        setupEventListeners();
        clearCanvas();
        drawInitialState();
    }

    // 重置游戏
    function resetGame() {
        state = {
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            dx: CONFIG.initialDirection.dx,
            dy: CONFIG.initialDirection.dy,
            score: 0,
            highScore: state.highScore,
            foodEaten: 0,
            currentSpeed: CONFIG.initialSpeed,
            gameRunning: false,
            gamePaused: false,
            lastTime: 0,
            animationId: null,
            countdown: 3,
            countdownActive: false,
            countdownStartTime: 0
        };
        updateScore();
        generateFood();
        startBtn.textContent = '开始游戏';
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }

    // 游戏主循环（使用requestAnimationFrame）
    function gameLoop(timestamp) {
        if (!state.gameRunning) return;

        if (state.gamePaused) {
            state.animationId = requestAnimationFrame(gameLoop);
            return;
        }

        // 处理倒计时
        if (state.countdownActive) {
            if (!state.countdownStartTime) {
                state.countdownStartTime = timestamp;
            }

            const elapsed = timestamp - state.countdownStartTime;
            const currentCount = Math.max(3 - Math.floor(elapsed / 1000), 0);

            if (currentCount !== state.countdown) {
                state.countdown = currentCount;
                clearCanvas();
                drawCountdown(currentCount);
            }

            if (currentCount === 0) {
                state.countdownActive = false;
                state.countdownStartTime = 0;
                state.lastTime = timestamp;
            } else {
                state.animationId = requestAnimationFrame(gameLoop);
                return;
            }
        }

        // 控制游戏速度
        if (timestamp - state.lastTime < state.currentSpeed) {
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

    // 绘制初始状态
    function drawInitialState() {
        clearCanvas();
        drawSnake();
        drawFood();
    }

    // 移动蛇
    function moveSnake() {
        const head = { x: state.snake[0].x + state.dx, y: state.snake[0].y + state.dy };
        state.snake.unshift(head);

        if (head.x === state.food.x && head.y === state.food.y) {
            generateFood();
            state.score += CONFIG.scorePerFood;
            state.foodEaten++;

            // 检查是否需要增加难度
            if (state.foodEaten % CONFIG.difficultyIncreaseInterval === 0) {
                increaseDifficulty();
            }

            // 检查是否更新最高分
            if (state.score > state.highScore) {
                state.highScore = state.score;
                saveHighScore();
                updateHighScoreDisplay();
            }
        } else {
            state.snake.pop();
        }
    }

    // 绘制蛇
    function drawSnake() {
        state.snake.forEach((segment, index) => {
            // 根据位置调整颜色，让蛇有渐变效果
            const gradient = ctx.createLinearGradient(
                segment.x * CONFIG.gridSize,
                segment.y * CONFIG.gridSize,
                segment.x * CONFIG.gridSize + CONFIG.gridSize,
                segment.y * CONFIG.gridSize + CONFIG.gridSize
            );
            const alpha = 1 - (index / state.snake.length) * 0.5;
            gradient.addColorStop(0, `rgba(76, 175, 80, ${alpha})`);
            gradient.addColorStop(1, `rgba(69, 160, 73, ${alpha})`);
            
            ctx.fillStyle = gradient;
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
                
                // 绘制舌头
                if (state.dx > 0) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(segment.x * CONFIG.gridSize + CONFIG.gridSize - 2, segment.y * CONFIG.gridSize + CONFIG.gridSize / 2 - 2, 4, 4);
                } else if (state.dx < 0) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(segment.x * CONFIG.gridSize - 4, segment.y * CONFIG.gridSize + CONFIG.gridSize / 2 - 2, 4, 4);
                } else if (state.dy > 0) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(segment.x * CONFIG.gridSize + CONFIG.gridSize / 2 - 2, segment.y * CONFIG.gridSize + CONFIG.gridSize - 2, 4, 4);
                } else if (state.dy < 0) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillRect(segment.x * CONFIG.gridSize + CONFIG.gridSize / 2 - 2, segment.y * CONFIG.gridSize - 4, 4, 4);
                }
            }
        });
    }

    // 绘制食物
    function drawFood() {
        // 使用动态渐变，让食物有呼吸效果
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 3) * 0.1 + 1;
        
        const foodX = state.food.x * CONFIG.gridSize + CONFIG.gridSize / 2;
        const foodY = state.food.y * CONFIG.gridSize + CONFIG.gridSize / 2;
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
            foodX, foodY, 0,
            foodX, foodY, CONFIG.gridSize / 2 - 1
        );
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, '#ff8787');
        gradient.addColorStop(1, '#ee5253');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            foodX,
            foodY,
            (CONFIG.gridSize / 2 - 1) * pulse,
            0,
            2 * Math.PI
        );
        ctx.fill();
        
        // 添加食物光芒效果
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // 绘制倒计时
    function drawCountdown(count) {
        ctx.fillStyle = '#333';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count, canvas.width / 2, canvas.height / 2);
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

    // 增加游戏难度
    function increaseDifficulty() {
        if (state.currentSpeed > CONFIG.minSpeed) {
            state.currentSpeed = Math.max(state.currentSpeed - CONFIG.speedDecrement, CONFIG.minSpeed);
        }
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
        state.gamePaused = false;
        
        // 清理所有定时器和动画帧
        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
            state.animationId = null;
        }
        
        // 清理倒计时定时器
        if (state.countdownStartTime) {
            state.countdownStartTime = 0;
        }
        
        startBtn.textContent = '重新开始';
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        pauseBtn.textContent = '暂停游戏';
        
        showGameOverModal();
    }

    // 显示游戏结束弹窗
    function showGameOverModal() {
        // 创建游戏结束弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            max-width: 400px;
            width: 90%;
        `;

        const gameOverText = document.createElement('h2');
        gameOverText.textContent = '游戏结束！';
        gameOverText.style.color = '#333';
        gameOverText.style.marginBottom = '20px';

        const scoreText = document.createElement('p');
        scoreText.textContent = `你的得分：${state.score}`;
        scoreText.style.fontSize = '18px';
        scoreText.style.marginBottom = '10px';

        const highScoreText = document.createElement('p');
        highScoreText.textContent = `最高分：${state.highScore}`;
        highScoreText.style.fontSize = '18px';
        highScoreText.style.marginBottom = '30px';

        const restartBtn = document.createElement('button');
        restartBtn.textContent = '重新开始';
        restartBtn.style.cssText = `
            padding: 12px 24px;
            background: linear-gradient(135deg, #0066ff, #00aaff);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        `;

        restartBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            startGame();
        });

        modalContent.appendChild(gameOverText);
        modalContent.appendChild(scoreText);
        modalContent.appendChild(highScoreText);
        modalContent.appendChild(restartBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // 更新分数显示
    function updateScore() {
        scoreElement.textContent = `得分: ${state.score}`;
    }

    // 更新最高分显示
    function updateHighScoreDisplay() {
        highScoreElement.textContent = `最高分: ${state.highScore}`;
    }

    // 保存最高分到localStorage
    function saveHighScore() {
        try {
            localStorage.setItem('snakeGameHighScore', state.highScore.toString());
        } catch (e) {
            console.error('保存最高分失败:', e);
        }
    }

    // 从localStorage加载最高分
    function loadHighScore() {
        try {
            const savedScore = localStorage.getItem('snakeGameHighScore');
            if (savedScore) {
                state.highScore = parseInt(savedScore, 10);
            }
        } catch (e) {
            console.error('加载最高分失败:', e);
            state.highScore = 0;
        }
    }

    // 处理键盘方向控制
    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const SPACE_KEY = 32;

        const keyPressed = event.keyCode;

        // 处理空格键暂停/继续
        if (keyPressed === SPACE_KEY && state.gameRunning) {
            togglePause();
            return;
        }

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

    // 切换游戏暂停状态
    function togglePause() {
        if (!state.gameRunning) return;

        state.gamePaused = !state.gamePaused;

        if (state.gamePaused) {
            pauseBtn.textContent = '继续游戏';
        } else {
            pauseBtn.textContent = '暂停游戏';
            state.lastTime = performance.now();
        }
    }

    // 开始游戏
    function startGame() {
        if (!state.gameRunning) {
            resetGame();
            state.gameRunning = true;
            state.gamePaused = false;
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            pauseBtn.textContent = '暂停游戏';
            // 启用倒计时
            state.countdownActive = true;
            state.countdown = 3;
            state.lastTime = performance.now();
            state.animationId = requestAnimationFrame(gameLoop);
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 按钮事件
        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', togglePause);
        upBtn.addEventListener('click', () => changeDirectionByButton('up'));
        leftBtn.addEventListener('click', () => changeDirectionByButton('left'));
        rightBtn.addEventListener('click', () => changeDirectionByButton('right'));
        downBtn.addEventListener('click', () => changeDirectionByButton('down'));

        // 键盘事件
        document.addEventListener('keydown', changeDirection);

        // 触摸控制
        setupTouchControls();
    }

    // 设置触摸控制
    function setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!state.gameRunning || state.gamePaused || state.countdownActive) return;

            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            // 确定主要移动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平移动
                if (dx > 0 && state.dx !== -1) {
                    changeDirectionByButton('right');
                } else if (dx < 0 && state.dx !== 1) {
                    changeDirectionByButton('left');
                }
            } else {
                // 垂直移动
                if (dy > 0 && state.dy !== -1) {
                    changeDirectionByButton('down');
                } else if (dy < 0 && state.dy !== 1) {
                    changeDirectionByButton('up');
                }
            }
        });
    }

    // 公开方法
    return {
        init: initGame,
        changeDirectionByButton: changeDirectionByButton
    };
})();

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    try {
        SnakeGame.init();
    } catch (error) {
        console.error('初始化贪吃蛇游戏时出错:', error);
    }
});

// 为了兼容性，将changeDirectionByButton暴露到全局
window.changeDirectionByButton = SnakeGame.changeDirectionByButton;