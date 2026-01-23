/**
 * Snake Game - ZOM Application
 */
class GameSnake {
  constructor() {
    this.appElement = null;
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
        <h1>Snake</h1>
        <div class="game-info">
          <div class="score" id="score">Score: 0</div>
          <div class="high-score" id="highScore">High Score: 0</div>
          <button id="startButton">Start</button>
          <button id="pauseButton">Pause</button>
        </div>
        <canvas id="gameCanvas" width="300" height="300"></canvas>
        <div class="game-controls">
          <button id="up" class="control-btn">↑</button>
          <div class="controls-row">
            <button id="left" class="control-btn">←</button>
            <button id="down" class="control-btn">↓</button>
            <button id="right" class="control-btn">→</button>
          </div>
        </div>
      </div>
      <script src="script.js"></script>
    `;
    this.appElement.appendChild(gameContainer);

    // 初始化游戏
    setTimeout(() => {
      if (window.SnakeGame) {
        window.SnakeGame.init(gameContainer);
      }
    }, 100);
  }

  /**
   * 启动应用
   */
  start() {
    console.log('Snake game started');
  }

  /**
   * 停止应用
   */
  stop() {
    console.log('Snake game stopped');
  }

  /**
   * 暂停应用
   */
  pause() {
    console.log('Snake game paused');
  }

  /**
   * 恢复应用
   */
  resume() {
    console.log('Snake game resumed');
  }
}

// 导出应用类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameSnake;
} else if (typeof window !== 'undefined') {
  window.GameSnake = GameSnake;
}