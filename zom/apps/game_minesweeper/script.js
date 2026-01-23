// 扫雷游戏基础逻辑
// 扫雷游戏核心模块
const Minesweeper = (() => {
    // DOM元素
    let gameBoard;
    let mineCounter;
    let resetButton;
    let timeCounter;
    
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
        firstClick: true,
        startTime: null,
        timerInterval: null
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
            firstClick: true,
            startTime: null,
            timerInterval: null
        };
        
        updateMineCounter();
        updateTimeCounter();
        clearInterval(state.timerInterval);

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
        if (mineCounter) {
            mineCounter.textContent = `Mines: ${state.remainingMines}`;
        }
    }

    // 更新时间计数器
    function updateTimeCounter() {
        if (timeCounter) {
            if (state.startTime) {
                const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
                timeCounter.textContent = `Time: ${elapsedTime}`;
            } else {
                timeCounter.textContent = 'Time: 0';
            }
        }
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

        const cell = e.target;
        if (!cell.classList.contains('cell')) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (state.revealed[y][x] || state.flags[y][x]) return;

        // 第一次点击时生成地雷
        if (state.firstClick) {
            generateMines(x, y);
            state.firstClick = false;
            state.startTime = Date.now();
            state.timerInterval = setInterval(updateTimeCounter, 1000);
        }

        // 点击到地雷
        if (state.board[y][x] === -1) {
            revealMines();
            state.gameOver = true;
            clearInterval(state.timerInterval);
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

        const cell = e.target;
        if (!cell.classList.contains('cell')) return;
        
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

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
            clearInterval(state.timerInterval);
            alert('恭喜! 你赢了!');
        }
    }

    // 绘制游戏板
    function drawBoard() {
        if (!gameBoard) return;
        
        // 清空游戏板
        gameBoard.innerHTML = '';
        
        // 设置游戏板样式
        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = `repeat(${CONFIG.GRID_SIZE}, ${CONFIG.CELL_SIZE}px)`;
        gameBoard.style.gridTemplateRows = `repeat(${CONFIG.GRID_SIZE}, ${CONFIG.CELL_SIZE}px)`;
        gameBoard.style.gap = '2px';
        gameBoard.style.padding = '10px';
        gameBoard.style.backgroundColor = '#2d2d5a';
        gameBoard.style.borderRadius = '8px';
        
        // 绘制单元格
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.style.width = `${CONFIG.CELL_SIZE}px`;
                cell.style.height = `${CONFIG.CELL_SIZE}px`;
                cell.style.display = 'flex';
                cell.style.justifyContent = 'center';
                cell.style.alignItems = 'center';
                cell.style.fontSize = '16px';
                cell.style.fontWeight = 'bold';
                cell.style.cursor = 'pointer';
                
                // 设置单元格样式
                if (state.revealed[y][x]) {
                    cell.style.backgroundColor = '#1a1a3a';
                    if (state.board[y][x] === -1) {
                        // 地雷
                        cell.style.backgroundColor = '#ff0066';
                        cell.textContent = '💣';
                    } else if (state.board[y][x] > 0) {
                        // 数字
                        const colors = [
                            '', '#00ffff', '#00ff99', '#ffff00', '#ff9900', '#ff0000', '#cc00cc', '#9900ff', '#0000ff'
                        ];
                        cell.style.color = colors[state.board[y][x]];
                        cell.textContent = state.board[y][x];
                    }
                } else {
                    cell.style.backgroundColor = '#2d2d5a';
                    if (state.flags[y][x]) {
                        cell.textContent = '🚩';
                    }
                }
                
                // 添加事件监听
                cell.addEventListener('click', handleCellClick);
                cell.addEventListener('contextmenu', handleRightClick);
                
                gameBoard.appendChild(cell);
            }
        }
    }

    // 初始化DOM元素
    function initDOM(container) {
        gameBoard = container.querySelector('#gameBoard');
        mineCounter = container.querySelector('#mineCounter');
        resetButton = container.querySelector('#resetButton');
        timeCounter = container.querySelector('#timeCounter');
        
        if (resetButton) {
            resetButton.addEventListener('click', initGame);
        }
    }

    // 公开方法
    return {
        init: function(container) {
            initDOM(container);
            initGame();
        }
    };
})();

// 导出游戏管理器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Minesweeper;
} else if (typeof window !== 'undefined') {
  window.Minesweeper = Minesweeper;
}