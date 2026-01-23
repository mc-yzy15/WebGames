/**
 * Stickman Adventure Game - ZOM Application
 */
class GameStickman {
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
        <h1>Stickman Adventure</h1>
        <div class="game-info">
          <div class="health-bar">
            <span>Health:</span>
            <div class="bar-container">
              <div class="health-progress" style="width: 100%;"></div>
            </div>
          </div>
          <div class="score" id="score">Score: 0</div>
          <button id="startButton" class="cyber-button">Start</button>
          <button id="restartButton" class="cyber-button">Restart</button>
        </div>
        <canvas id="gameCanvas" width="400" height="400"></canvas>
        <div class="game-controls">
          <button id="left" class="cyber-button">←</button>
          <button id="jump" class="cyber-button">Jump</button>
          <button id="attack" class="cyber-button">Attack</button>
          <button id="right" class="cyber-button">→</button>
        </div>
      </div>
      <script src="script.js"></script>
    `;
    this.appElement.appendChild(gameContainer);

    // 初始化游戏
    setTimeout(() => {
      if (window.StickmanAdventure) {
        window.StickmanAdventure.init(gameContainer);
      }
    }, 100);
  }

  /**
   * 启动应用
   */
  start() {
    console.log('Stickman Adventure game started');
  }

  /**
   * 停止应用
   */
  stop() {
    console.log('Stickman Adventure game stopped');
  }

  /**
   * 暂停应用
   */
  pause() {
    console.log('Stickman Adventure game paused');
  }

  /**
   * 恢复应用
   */
  resume() {
    console.log('Stickman Adventure game resumed');
  }
}

// 导出应用类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameStickman;
} else if (typeof window !== 'undefined') {
  window.GameStickman = GameStickman;
}