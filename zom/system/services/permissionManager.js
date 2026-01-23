/**
 * PermissionManager - 权限管理模块
 * 用于管理ZOM系统中的权限
 */
class PermissionManager {
  constructor() {
    this.permissions = new Map();
    this.processPermissions = new Map();
  }

  /**
   * 注册权限
   * @param {string} permissionId - 权限ID
   * @param {string} name - 权限名称
   * @param {string} description - 权限描述
   */
  registerPermission(permissionId, name, description) {
    this.permissions.set(permissionId, {
      id: permissionId,
      name,
      description,
      registeredAt: Date.now()
    });
  }

  /**
   * 为进程授予权限
   * @param {number} pid - 进程ID
   * @param {string} permissionId - 权限ID
   */
  grantPermission(pid, permissionId) {
    if (!this.processPermissions.has(pid)) {
      this.processPermissions.set(pid, new Set());
    }
    this.processPermissions.get(pid).add(permissionId);
  }

  /**
   * 检查进程是否有指定权限
   * @param {number} pid - 进程ID
   * @param {string} permissionId - 权限ID
   * @returns {boolean} - 是否有权限
   */
  checkPermission(pid, permissionId) {
    if (!this.processPermissions.has(pid)) {
      return false;
    }
    return this.processPermissions.get(pid).has(permissionId);
  }

  /**
   * 撤销进程的权限
   * @param {number} pid - 进程ID
   * @param {string} permissionId - 权限ID
   */
  revokePermission(pid, permissionId) {
    if (this.processPermissions.has(pid)) {
      this.processPermissions.get(pid).delete(permissionId);
    }
  }

  /**
   * 清除进程的所有权限
   * @param {number} pid - 进程ID
   */
  clearProcessPermissions(pid) {
    this.processPermissions.delete(pid);
  }

  /**
   * 获取所有注册的权限
   * @returns {Array} - 权限列表
   */
  getAllPermissions() {
    return Array.from(this.permissions.values());
  }

  /**
   * 获取进程的所有权限
   * @param {number} pid - 进程ID
   * @returns {Array} - 权限列表
   */
  getProcessPermissions(pid) {
    if (!this.processPermissions.has(pid)) {
      return [];
    }
    return Array.from(this.processPermissions.get(pid));
  }
}

// 导出单例
const permissionManager = new PermissionManager();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = permissionManager;
} else if (typeof window !== 'undefined') {
  window.PermissionManager = permissionManager;
}