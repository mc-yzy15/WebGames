// 扫雷游戏基础逻辑
// 扫雷游戏核心模块
const Minesweeper = (() => {
    // DOM元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const mineCounter = document.getElementById('mineCounter');
    const newGameBtn = document.getElementById('newGameBtn');

    // 游戏配置
    const CONFIG = {
        GRID_SIZE: 10,
        CELL_SIZE: 30,
        TOTAL_MINES: 10
    };

    // 游戏状态
    let state = {
        board: [],
        mines: [],
        revealed: [],
        flags: [],
        gameOver: false,
        remainingMines: CONFIG.TOTAL_MINES,
        cellsRevealed: 0,
        firstClick: true
    };

    // 初始化游戏
    function initGame() {
        // 重置游戏状态
        state = {
            board: [],
            mines: [],
            revealed: [],
            flags: [],
            gameOver: false,
            remainingMines: CONFIG.TOTAL_MINES,
            cellsRevealed: 0,
            firstClick: true
        };
        
        updateMineCounter();

        // 设置画布尺寸
        canvas.width = CONFIG.GRID_SIZE * CONFIG.CELL_SIZE;
        canvas.height = CONFIG.GRID_SIZE * CONFIG.CELL_SIZE;

        // 初始化游戏板
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            state.board[y] = [];
            state.revealed[y] = [];
            state.flags[y] = [];
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                state.board[y][x] = 0; // 0表示无雷
                state.revealed[y][x] = false;
                state.flags[y][x] = false;
            }
        }

        // 绘制初始游戏板
        drawBoard();
    }

    // 更新地雷计数器
    function updateMineCounter() {
        mineCounter.textContent = state.remainingMines;
    }

    // 生成地雷
    function generateMines(firstClickX, firstClickY) {
        let minesPlaced = 0;
        while (minesPlaced < CONFIG.TOTAL_MINES) {
            const x = Math.floor(Math.random() * CONFIG.GRID_SIZE);
            const y = Math.floor(Math.random() * CONFIG.GRID_SIZE);

            // 确保地雷不会出现在第一次点击的位置及其周围
            if (
                (x === firstClickX && y === firstClickY) ||
                Math.abs(x - firstClickX) <= 1 && Math.abs(y - firstClickY) <= 1 ||
                state.board[y][x] === -1
            ) {
                continue;
            }

            state.board[y][x] = -1; // -1表示地雷
            state.mines.push({x, y});
            minesPlaced++;
        }

        // 计算每个单元格周围的地雷数
        calculateMineCounts();
    }

    // 计算每个单元格周围的地雷数
    function calculateMineCounts() {
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                if (state.board[y][x] === -1) continue;

                let count = 0;
                // 检查周围8个单元格
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < CONFIG.GRID_SIZE && ny >= 0 && ny < CONFIG.GRID_SIZE) {
                            if (state.board[ny][nx] === -1) count++;
                        }
                    }
                }
                state.board[y][x] = count;
            }
        }
    }

    // 处理单元格点击
    function handleCellClick(e) {
        if (state.gameOver) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CONFIG.CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CONFIG.CELL_SIZE);

        if (x < 0 || x >= CONFIG.GRID_SIZE || y < 0 || y >= CONFIG.GRID_SIZE) return;
        if (state.revealed[y][x] || state.flags[y][x]) return;

        // 第一次点击时生成地雷
        if (state.firstClick) {
            generateMines(x, y);
            state.firstClick = false;
        }

        // 点击到地雷
        if (state.board[y][x] === -1) {
            revealMines();
            state.gameOver = true;
            alert('游戏结束! 你踩到了地雷!');
            return;
        }

        // 揭示单元格
        revealCell(x, y);

        // 检查是否获胜
        checkWinCondition();

        drawBoard();
    }

    // 处理右键点击(插旗)
    function handleRightClick(e) {
        e.preventDefault();
        if (state.gameOver) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CONFIG.CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CONFIG.CELL_SIZE);

        if (x < 0 || x >= CONFIG.GRID_SIZE || y < 0 || y >= CONFIG.GRID_SIZE) return;
        if (state.revealed[y][x]) return;

        // 切换旗帜状态
        state.flags[y][x] = !state.flags[y][x];
        state.remainingMines += state.flags[y][x] ? -1 : 1;
        updateMineCounter();

        drawBoard();
    }

    // 揭示单元格
    function revealCell(x, y) {
        if (state.revealed[y][x] || state.flags[y][x]) return;

        state.revealed[y][x] = true;
        state.cellsRevealed++;

        // 如果是空白单元格，递归揭示周围单元格
        if (state.board[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < CONFIG.GRID_SIZE && ny >= 0 && ny < CONFIG.GRID_SIZE) {
                        revealCell(nx, ny);
                    }
                }
            }
        }
    }

    // 揭示所有地雷
    function revealMines() {
        state.mines.forEach(({x, y}) => {
            state.revealed[y][x] = true;
        });
    }

    // 检查获胜条件
    function checkWinCondition() {
        const totalCells = CONFIG.GRID_SIZE * CONFIG.GRID_SIZE;
        if (state.cellsRevealed === totalCells - CONFIG.TOTAL_MINES) {
            state.gameOver = true;
            alert('恭喜! 你赢了!');
        }
    }

    // 绘制游戏板
    function drawBoard() {
        try {
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 批量绘制，减少Canvas API调用
            for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                    const cellX = x * CONFIG.CELL_SIZE;
                    const cellY = y * CONFIG.CELL_SIZE;

                    // 绘制单元格背景
                    ctx.fillStyle = state.revealed[y][x] ? '#1a1a3a' : '#2d2d5a';
                    ctx.fillRect(cellX, cellY, CONFIG.CELL_SIZE - 1, CONFIG.CELL_SIZE - 1);

                    // 添加发光效果
                    if (!state.revealed[y][x]) {
                        ctx.shadowColor = '#00ffff';
                        ctx.shadowBlur = 5;
                        ctx.fillRect(cellX, cellY, CONFIG.CELL_SIZE - 1, CONFIG.CELL_SIZE - 1);
                        ctx.shadowBlur = 0;
                    }

                    // 绘制旗帜
                    if (state.flags[y][x]) {
                        ctx.fillStyle = '#ff0066';
                        ctx.beginPath();
                        ctx.moveTo(cellX + CONFIG.CELL_SIZE / 2, cellY + 5);
                        ctx.lineTo(cellX + CONFIG.CELL_SIZE - 5, cellY + CONFIG.CELL_SIZE / 2);
                        ctx.lineTo(cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE - 5);
                        ctx.lineTo(cellX + 5, cellY + CONFIG.CELL_SIZE / 2);
                        ctx.closePath();
                        ctx.fill();
                        continue;
                    }

                    // 绘制已揭示的内容
                    if (state.revealed[y][x]) {
                        // 地雷
                        if (state.board[y][x] === -1) {
                            ctx.fillStyle = '#ff0066';
                            ctx.beginPath();
                            ctx.arc(cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE / 2, CONFIG.CELL_SIZE / 4, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.shadowColor = '#ff0066';
                            ctx.shadowBlur = 10;
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        }
                        // 数字
                        else if (state.board[y][x] > 0) {
                            const colors = [
                                '', '#00ffff', '#00ff99', '#ffff00', '#ff9900', '#ff0000', '#cc00cc', '#9900ff', '#0000ff'
                            ];
                            ctx.fillStyle = colors[state.board[y][x]];
                            ctx.font = 'bold 16px Arial';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(state.board[y][x], cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE / 2);
                            ctx.shadowColor = colors[state.board[y][x]];
                            ctx.shadowBlur = 5;
                            ctx.fillText(state.board[y][x], cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE / 2);
                            ctx.shadowBlur = 0;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('绘制游戏板时出错:', error);
        }
    }

    // 事件监听设置
    function setupEventListeners() {
        newGameBtn.addEventListener('click', initGame);
        canvas.addEventListener('click', handleCellClick);
        canvas.addEventListener('contextmenu', handleRightClick);
    }

    // 公开方法
    return {
        init: function() {
            setupEventListeners();
            initGame();
        }
    };
})();

// 初始化游戏
Minesweeper.init();