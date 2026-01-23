/**
 * NetworkManager - 网络管理模块
 * 用于处理ZOM系统的网络通信
 */
class NetworkManager {
  constructor() {
    this.connections = new Map();
    this.listeners = new Map();
    this.connected = false;
    this.networkStatus = 'disconnected';
  }

  /**
   * 初始化网络管理器
   */
  init() {
    this._checkNetworkStatus();
    setInterval(() => this._checkNetworkStatus(), 5000);
  }

  /**
   * 检查网络状态
   * @private
   */
  _checkNetworkStatus() {
    if (navigator.onLine) {
      if (this.networkStatus !== 'connected') {
        this.networkStatus = 'connected';
        this.connected = true;
        this._triggerNetworkChange('connected');
      }
    } else {
      if (this.networkStatus !== 'disconnected') {
        this.networkStatus = 'disconnected';
        this.connected = false;
        this._triggerNetworkChange('disconnected');
      }
    }
  }

  /**
   * 触发网络状态变更事件
   * @private
   * @param {string} status - 网络状态
   */
  _triggerNetworkChange(status) {
    const event = new CustomEvent('networkChange', {
      detail: {
        status,
        connected: status === 'connected'
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 发送HTTP请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} - 请求结果
   */
  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('NetworkManager.fetch error:', error);
      throw error;
    }
  }

  /**
   * 创建WebSocket连接
   * @param {string} url - WebSocket URL
   * @param {Object} options - WebSocket选项
   * @returns {WebSocket} - WebSocket连接
   */
  createWebSocket(url, options = {}) {
    const ws = new WebSocket(url, options.protocols);
    const connectionId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    ws.onopen = () => {
      this.connections.set(connectionId, ws);
      if (options.onopen) {
        options.onopen();
      }
    };

    ws.onmessage = (event) => {
      if (options.onmessage) {
        options.onmessage(event);
      }
    };

    ws.onerror = (error) => {
      if (options.onerror) {
        options.onerror(error);
      }
    };

    ws.onclose = () => {
      this.connections.delete(connectionId);
      if (options.onclose) {
        options.onclose();
      }
    };

    return ws;
  }

  /**
   * 关闭WebSocket连接
   * @param {WebSocket} ws - WebSocket连接
   */
  closeWebSocket(ws) {
    Array.from(this.connections.entries()).forEach(([id, connection]) => {
      if (connection === ws) {
        connection.close();
        this.connections.delete(id);
      }
    });
  }

  /**
   * 添加网络事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * 移除网络事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * 获取网络状态
   * @returns {string} - 网络状态
   */
  getNetworkStatus() {
    return this.networkStatus;
  }

  /**
   * 检查是否联网
   * @returns {boolean} - 是否联网
   */
  isConnected() {
    return this.connected;
  }

  /**
   * 获取所有WebSocket连接
   * @returns {Array} - WebSocket连接列表
   */
  getConnections() {
    return Array.from(this.connections.values());
  }
}

// 导出单例
const networkManager = new NetworkManager();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = networkManager;
} else if (typeof window !== 'undefined') {
  window.NetworkManager = networkManager;
}