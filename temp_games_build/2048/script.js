// 2048游戏核心逻辑
// 2048游戏核心模块
const GameManager = (() => {
    // DOM元素
    const gameBoard = document.getElementById('gameBoard');
    const newGameBtn = document.getElementById('newGameBtn');
    const scoreDisplay = document.getElementById('score');
    
    // 游戏状态
    let board = Array(16).fill(0);
    let score = 0;
    let isGameOver = false;

    // 初始化游戏
    function initGame() {
        board = Array(16).fill(0);
        score = 0;
        isGameOver = false;
        updateScore();
        renderBoard();
        addNewTile();
        addNewTile();
    }

    // 渲染游戏板（优化DOM操作）
    function renderBoard() {
        // 使用文档片段减少重排
        const fragment = document.createDocumentFragment();
        
        board.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.value = value;
            cell.textContent = value || '';
            fragment.appendChild(cell);
        });
        
        // 清空并一次性添加
        gameBoard.innerHTML = '';
        gameBoard.appendChild(fragment);
    }

    // 添加新数字块
    function addNewTile() {
        const emptyCells = board.reduce((acc, val, idx) => {
            if(val === 0) acc.push(idx);
            return acc;
        }, []);
        
        if(emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
            renderBoard();
        }
    }

    // 更新分数显示
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // 检查游戏是否结束
    function checkGameOver() {
        // 检查是否有空格
        if (board.includes(0)) return false;
        
        // 检查是否有可合并的相邻块
        for (let i = 0; i < 16; i++) {
            // 水平检查
            if (i % 4 < 3 && board[i] === board[i + 1]) return false;
            // 垂直检查
            if (i < 12 && board[i] === board[i + 4]) return false;
        }
        
        isGameOver = true;
        return true;
    }

    // 移动逻辑 - 左移
    function moveLeft() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            const start = row * 4;
            const end = start + 4;
            const rowTiles = board.slice(start, end).filter(val => val !== 0);
            
            // 合并相同数字
            for (let i = 0; i < rowTiles.length - 1; i++) {
                if (rowTiles[i] === rowTiles[i + 1]) {
                    rowTiles[i] *= 2;
                    score += rowTiles[i];
                    rowTiles.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // 补零
            while (rowTiles.length < 4) {
                rowTiles.push(0);
            }
            
            // 更新棋盘
            for (let i = 0; i < 4; i++) {
                if (board[start + i] !== rowTiles[i]) {
                    board[start + i] = rowTiles[i];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // 移动逻辑 - 右移
    function moveRight() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            const start = row * 4;
            const end = start + 4;
            const rowTiles = board.slice(start, end).filter(val => val !== 0);
            
            // 合并相同数字
            for (let i = rowTiles.length - 1; i > 0; i--) {
                if (rowTiles[i] === rowTiles[i - 1]) {
                    rowTiles[i] *= 2;
                    score += rowTiles[i];
                    rowTiles.splice(i - 1, 1);
                    moved = true;
                }
            }
            
            // 补零
            while (rowTiles.length < 4) {
                rowTiles.unshift(0);
            }
            
            // 更新棋盘
            for (let i = 0; i < 4; i++) {
                if (board[start + i] !== rowTiles[i]) {
                    board[start + i] = rowTiles[i];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // 移动逻辑 - 上移
    function moveUp() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            const colTiles = [];
            
            // 提取列数据
            for (let row = 0; row < 4; row++) {
                const value = board[row * 4 + col];
                if (value !== 0) {
                    colTiles.push(value);
                }
            }
            
            // 合并相同数字
            for (let i = 0; i < colTiles.length - 1; i++) {
                if (colTiles[i] === colTiles[i + 1]) {
                    colTiles[i] *= 2;
                    score += colTiles[i];
                    colTiles.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // 补零
            while (colTiles.length < 4) {
                colTiles.push(0);
            }
            
            // 更新棋盘
            for (let row = 0; row < 4; row++) {
                const index = row * 4 + col;
                if (board[index] !== colTiles[row]) {
                    board[index] = colTiles[row];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // 移动逻辑 - 下移
    function moveDown() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            const colTiles = [];
            
            // 提取列数据
            for (let row = 0; row < 4; row++) {
                const value = board[row * 4 + col];
                if (value !== 0) {
                    colTiles.push(value);
                }
            }
            
            // 合并相同数字
            for (let i = colTiles.length - 1; i > 0; i--) {
                if (colTiles[i] === colTiles[i - 1]) {
                    colTiles[i] *= 2;
                    score += colTiles[i];
                    colTiles.splice(i - 1, 1);
                    moved = true;
                }
            }
            
            // 补零
            while (colTiles.length < 4) {
                colTiles.unshift(0);
            }
            
            // 更新棋盘
            for (let row = 0; row < 4; row++) {
                const index = row * 4 + col;
                if (board[index] !== colTiles[row]) {
                    board[index] = colTiles[row];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // 处理键盘事件
    function handleKeyPress(e) {
        if (isGameOver) return;
        
        let moved = false;
        
        switch (e.key) {
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
        }
        
        if (moved) {
            updateScore();
            addNewTile();
            renderBoard();
            checkGameOver();
        }
    }

    // 公开方法
    return {
        init: initGame,
        handleKeyPress: handleKeyPress
    };
})();

// 事件监听
newGameBtn.addEventListener('click', GameManager.init);
document.addEventListener('keydown', GameManager.handleKeyPress);

// 初始化游戏
GameManager.init();