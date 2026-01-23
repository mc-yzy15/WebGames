/**
 * 2048 Game - ZOM Application
 */
class Game2048 {
  constructor() {
    this.appElement = null;
    this.gameManager = null;
  }

  /**
   * 初始化应用
   * @param {HTMLElement} element - 应用容器元素
   */
  init(element) {
    this.appElement = element;
    this.loadGame();
  }

  /**
   * 加载游戏
   */
  loadGame() {
    // 创建游戏容器
    const gameContainer = document.createElement('div');
    gameContainer.innerHTML = `
      <link rel="stylesheet" href="style.css">
      <div class="container">
        <h1>2048</h1>
        <div class="score-panel">
          <div>Score: <span id="score">0</span></div>
        </div>
        <div class="game-container">
          <div id="gameBoard"></div>
          <button id="newGameBtn">New Game</button>
        </div>
        <div class="game-description">
          <p>Use your arrow keys to move the tiles. When two tiles slide into each other, they merge into one!</p>
        </div>
      </div>
      <script src="script.js"></script>
    `;
    this.appElement.appendChild(gameContainer);

    // 初始化游戏
    setTimeout(() => {
      if (window.GameManager) {
        this.gameManager = window.GameManager;
        this.gameManager.init(gameContainer);
      }
    }, 100);
  }

  /**
   * 启动应用
   */
  start() {
    console.log('2048 game started');
  }

  /**
   * 停止应用
   */
  stop() {
    console.log('2048 game stopped');
  }

  /**
   * 暂停应用
   */
  pause() {
    console.log('2048 game paused');
  }

  /**
   * 恢复应用
   */
  resume() {
    console.log('2048 game resumed');
  }
}

// 导出应用类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game2048;
} else if (typeof window !== 'undefined') {
  window.Game2048 = Game2048;
}