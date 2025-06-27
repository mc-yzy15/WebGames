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

    // 初始化游戏
    function initGame() {
        board = Array(16).fill(0);
        score = 0;
        updateScore();
        renderBoard();
        addNewTile();
        addNewTile();
    }

    // 渲染游戏板
    function renderBoard() {
        gameBoard.innerHTML = board.map((value, index) => 
            `<div class="cell" data-value="${value}">${value || ''}</div>`
        ).join('');
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

    // 公开方法
    return {
        init: initGame
    };
})();

// 事件监听
newGameBtn.addEventListener('click', GameManager.init);

// 初始化游戏
GameManager.init();