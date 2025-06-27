// 2048游戏核心逻辑
const gameBoard = document.getElementById('gameBoard');
const newGameBtn = document.getElementById('newGameBtn');

// 游戏状态
let board = Array(16).fill(0);
let score = 0;

function initGame() {
    // 初始化游戏板
    renderBoard();
    addNewTile();
    addNewTile();
}

function renderBoard() {
    gameBoard.innerHTML = board.map((value, index) => 
        `<div class="cell" data-value="${value}">${value || ''}</div>`
    ).join('');
}

function addNewTile() {
    // 在空白位置生成新数字（2或4）
    const emptyCells = board.reduce((acc, val, idx) => {
        if(val === 0) acc.push(idx);
        return acc;
    }, []);
    
    if(emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

// 事件监听
newGameBtn.addEventListener('click', initGame);

// 初始化游戏
initGame();