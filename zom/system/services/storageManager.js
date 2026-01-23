/**
 * StorageManager - 存储管理模块
 * 用于处理ZOM系统的本地存储
 */
class StorageManager {
  constructor() {
    this.storages = new Map();
    this.initDefaultStorages();
  }

  /**
   * 初始化默认存储
   */
  initDefaultStorages() {
    this.registerStorage('local', window.localStorage);
    this.registerStorage('session', window.sessionStorage);
  }

  /**
   * 注册存储
   * @param {string} name - 存储名称
   * @param {Object} storage - 存储对象
   */
  registerStorage(name, storage) {
    this.storages.set(name, storage);
  }

  /**
   * 设置存储项
   * @param {string} storageName - 存储名称
   * @param {string} key - 键
   * @param {any} value - 值
   */
  setItem(storageName, key, value) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    try {
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('StorageManager.setItem error:', error);
      throw error;
    }
  }

  /**
   * 获取存储项
   * @param {string} storageName - 存储名称
   * @param {string} key - 键
   * @returns {any} - 值
   */
  getItem(storageName, key) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    try {
      const serializedValue = storage.getItem(key);
      return serializedValue === null ? null : JSON.parse(serializedValue);
    } catch (error) {
      console.error('StorageManager.getItem error:', error);
      throw error;
    }
  }

  /**
   * 删除存储项
   * @param {string} storageName - 存储名称
   * @param {string} key - 键
   */
  removeItem(storageName, key) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error('StorageManager.removeItem error:', error);
      throw error;
    }
  }

  /**
   * 清空存储
   * @param {string} storageName - 存储名称
   */
  clear(storageName) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    try {
      storage.clear();
    } catch (error) {
      console.error('StorageManager.clear error:', error);
      throw error;
    }
  }

  /**
   * 获取存储键列表
   * @param {string} storageName - 存储名称
   * @returns {Array} - 键列表
   */
  getKeys(storageName) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    const keys = [];
    for (let i = 0; i < storage.length; i++) {
      keys.push(storage.key(i));
    }
    return keys;
  }

  /**
   * 获取存储大小
   * @param {string} storageName - 存储名称
   * @returns {number} - 存储大小
   */
  getSize(storageName) {
    const storage = this.storages.get(storageName);
    if (!storage) {
      throw new Error(`Storage ${storageName} not found`);
    }
    return storage.length;
  }

  /**
   * 检查存储是否存在
   * @param {string} storageName - 存储名称
   * @returns {boolean} - 是否存在
   */
  hasStorage(storageName) {
    return this.storages.has(storageName);
  }

  /**
   * 获取所有存储
   * @returns {Array} - 存储列表
   */
  getAllStorages() {
    return Array.from(this.storages.keys());
  }
}

// 导出单例
const storageManager = new StorageManager();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageManager;
} else if (typeof window !== 'undefined') {
  window.StorageManager = storageManager;
}