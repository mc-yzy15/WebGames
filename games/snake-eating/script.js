
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const startBtn = document.getElementById('startBtn');

        const gridSize = 15;
        const tileCount = canvas.width / gridSize;

        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameRunning = false;

        function drawGame() {
            if (!gameRunning) return;

            clearCanvas();
            moveSnake();
            drawSnake();
            drawFood();
            checkCollision();
            updateScore();
            setTimeout(drawGame, 200);
        }

        function clearCanvas() {
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function moveSnake() {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                generateFood();
                score += 10;
            } else {
                snake.pop();
            }
        }

        function drawSnake() {
            snake.forEach((segment, index) => {
                const gradient = ctx.createLinearGradient(
                    segment.x * gridSize,
                    segment.y * gridSize,
                    (segment.x + 1) * gridSize,
                    (segment.y + 1) * gridSize
                );
                gradient.addColorStop(0, '#4CAF50');
                gradient.addColorStop(1, '#45a049');
                ctx.fillStyle = gradient;
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);

                if (index === 0) {
                    // Draw eyes
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(segment.x * gridSize + 5, segment.y * gridSize + 5, 2, 0, 2 * Math.PI);
                    ctx.arc(segment.x * gridSize + 10, segment.y * gridSize + 5, 2, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });
        }

        function drawFood() {
            const gradient = ctx.createRadialGradient(
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                2,
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                gridSize / 2
            );
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(1, '#ee5253');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        function generateFood() {
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
        }

        function checkCollision() {
            const head = snake[0];

            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
            }

            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                }
            }
        }

        function gameOver() {
            gameRunning = false;
            startBtn.textContent = '重新开始';
            startBtn.style.display = 'inline-block';
            alert(`游戏结束！你的得分是: ${score}`);
        }

        function updateScore() {
            scoreElement.textContent = `得分: ${score}`;
        }

        function resetGame() {
            snake = [{ x: 10, y: 10 }];
            food = { x: 15, y: 15 };
            dx = 0;
            dy = 0;
            score = 0;
            updateScore();
        }

        document.addEventListener('keydown', changeDirection);

        function changeDirection(event) {
            const LEFT_KEY = 37;
            const RIGHT_KEY = 39;
            const UP_KEY = 38;
            const DOWN_KEY = 40;

            const keyPressed = event.keyCode;

            const goingUp = dy === -1;
            const goingDown = dy === 1;
            const goingRight = dx === 1;
            const goingLeft = dx === -1;

            if (keyPressed === LEFT_KEY && !goingRight) {
                dx = -1;
                dy = 0;
            }

            if (keyPressed === UP_KEY && !goingDown) {
                dx = 0;
                dy = -1;
            }

            if (keyPressed === RIGHT_KEY && !goingLeft) {
                dx = 1;
                dy = 0;
            }

            if (keyPressed === DOWN_KEY && !goingUp) {
                dx = 0;
                dy = 1;
            }
        }

        function changeDirectionByButton(direction) {
            if (direction === 'left' && dx !== 1) {
                dx = -1;
                dy = 0;
            } else if (direction === 'up' && dy !== 1) {
                dx = 0;
                dy = -1;
            } else if (direction === 'down' && dy !== -1) {
                dx = 0;
                dy = 1;
            } else if (direction === 'right' && dx !== -1) {
                dx = 1;
                dy = 0;
            }
        }

        startBtn.addEventListener('click', () => {
            resetGame();
            gameRunning = true;
            startBtn.style.display = 'none';
            drawGame();
        });

        clearCanvas();