/**
 * ZerOS 进程管理器
 * 负责程序的生命周期管理，包括启动、运行、终止等
 */

class ProcessManager {
    // 进程表
    static PROCESS_TABLE = new Map();
    
    // 进程 ID 计数器
    static _pidCounter = 10000;
    
    // Exploit 程序 PID
    static EXPLOIT_PID = 10000;
    
    // 初始化标志
    static _initialized = false;
    
    /**
     * 初始化进程管理器
     */
    static init() {
        if (this._initialized) {
            return;
        }
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('ProcessManager', '进程管理器初始化');
        } else {
            console.log('ProcessManager 初始化');
        }
        
        // 注册 Exploit 程序
        this.registerExploitProgram();
        
        this._initialized = true;
    }
    
    /**
     * 注册 Exploit 程序
     */
    static registerExploitProgram() {
        const exploitProcess = {
            pid: this.EXPLOIT_PID,
            programName: 'exploit',
            programNameUpper: 'EXPLOIT',
            status: 'running',
            startTime: Date.now(),
            isExploit: true,
            memoryRefs: new Map(),
            domElements: new Set(),
            requestedModules: new Set()
        };
        
        this.PROCESS_TABLE.set(this.EXPLOIT_PID, exploitProcess);
        
        if (typeof KernelLogger !== 'undefined') {
            KernelLogger.info('ProcessManager', '已注册 Exploit 程序');
        }
    }
    
    /**
     * 启动程序
     * @param {string} programName - 程序名称
     * @param {Object} initArgs - 初始化参数
     * @returns {Promise<number>} 进程 ID
     */
    static async startProgram(programName, initArgs = {}) {
        if (!this._initialized) {
            throw new Error('ProcessManager 未初始化');
        }
        
        try {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('ProcessManager', `启动程序: ${programName}`, initArgs);
            }
            
            // 验证程序存在
            const appAsset = this._getApplicationAsset(programName);
            if (!appAsset) {
                throw new Error(`程序不存在: ${programName}`);
            }
            
            // 权限检查
            if (!this._checkProgramPermission(programName)) {
                throw new Error(`权限不足，无法启动程序: ${programName}`);
            }
            
            // 多实例检查
            if (!this._checkMultipleInstances(programName, appAsset)) {
                // 程序已在运行，聚焦现有窗口
                const existingPid = this._getExistingProgramPid(programName);
                if (existingPid) {
                    this._focusProgramWindow(existingPid);
                    return existingPid;
                }
            }
            
            // 分配 PID
            const pid = this._allocatePid();
            
            // 创建进程信息
            const processInfo = {
                pid,
                programName,
                programNameUpper: programName.toUpperCase(),
                script: appAsset.script,
                styles: appAsset.styles || [],
                assets: appAsset.assets || [],
                metadata: appAsset.metadata || {},
                status: 'loading',
                startTime: Date.now(),
                memoryRefs: new Map(),
                domElements: new Set(),
                requestedModules: new Set(),
                isCLI: false
            };
            
            // 注册进程
            this.PROCESS_TABLE.set(pid, processInfo);
            
            // 加载程序资源
            await this._loadProgramResources(pid, processInfo);
            
            // 等待程序对象出现
            const programObject = await this._waitForProgramObject(pid, processInfo);
            
            // 检查程序类型
            const programInfo = programObject.__info__();
            if (programInfo.type === 'CLI') {
                processInfo.isCLI = true;
                await this._handleCLIProgram(pid, processInfo, initArgs);
            }
            
            // 注册程序权限
            if (typeof PermissionManager !== 'undefined') {
                await PermissionManager.registerProgramPermissions(pid, programInfo, {
                    isAdminProgram: this._isAdminProgram(programName)
                });
            }
            
            // 调用程序初始化
            processInfo.status = 'starting';
            
            const standardizedInitArgs = this._standardizeInitArgs(pid, initArgs, programInfo);
            
            try {
                await programObject.__init__(pid, standardizedInitArgs);
                processInfo.status = 'running';
            } catch (error) {
                processInfo.status = 'exited';
                processInfo.exitTime = Date.now();
                this.PROCESS_TABLE.delete(pid);
                
                if (typeof KernelLogger !== 'undefined') {
                    KernelLogger.error('ProcessManager', `程序初始化失败: ${programName}`, error);
                }
                throw error;
            }
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('ProcessManager', `程序启动成功: ${programName}, PID: ${pid}`);
            }
            
            return pid;
        } catch (error) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('ProcessManager', `启动程序失败: ${programName}`, error);
            }
            throw error;
        }
    }
    
    /**
     * 终止程序
     * @param {number} pid - 进程 ID
     * @param {boolean} force - 是否强制终止
     * @returns {Promise<boolean>} 是否成功终止
     */
    static async killProgram(pid, force = false) {
        if (!this._initialized) {
            throw new Error('ProcessManager 未初始化');
        }
        
        try {
            const processInfo = this.PROCESS_TABLE.get(pid);
            if (!processInfo) {
                return false;
            }
            
            if (processInfo.status === 'exited') {
                return false;
            }
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('ProcessManager', `终止程序: ${processInfo.programName}, PID: ${pid}`);
            }
            
            // 设置状态为 exiting
            processInfo.status = 'exiting';
            
            // 调用程序退出方法
            try {
                const programObject = this._getProgramObject(processInfo);
                if (programObject && typeof programObject.__exit__ === 'function') {
                    await programObject.__exit__(pid, force);
                }
            } catch (error) {
                if (!force) {
                    throw error;
                }
            }
            
            // 清理关联资源
            await this._cleanupProcessResources(pid, processInfo);
            
            // 更新进程状态
            processInfo.status = 'exited';
            processInfo.exitTime = Date.now();
            
            // 从进程表中移除
            this.PROCESS_TABLE.delete(pid);
            
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.info('ProcessManager', `程序已终止: ${processInfo.programName}, PID: ${pid}`);
            }
            
            return true;
        } catch (error) {
            if (typeof KernelLogger !== 'undefined') {
                KernelLogger.error('ProcessManager', `终止程序失败: ${pid}`, error);
            }
            throw error;
        }
    }
    
    /**
     * 分配进程 ID
     * @returns {number} 进程 ID
     */
    static _allocatePid() {
        this._pidCounter++;
        return this._pidCounter;
    }
    
    /**
     * 获取应用程序资源
     * @param {string} programName - 程序名称
     * @returns {Object|null} 应用程序资源
     */
    static _getApplicationAsset(programName) {
        // 这里简化处理，实际应该从 ApplicationAssetManager 获取
        const appAssets = {
            'snake-eating': {
                script: 'application/snake-eating/snake-eating.js',
                styles: ['application/snake-eating/snake-eating.css'],
                icon: 'application/snake-eating/snake-eating.svg',
                metadata: {
                    autoStart: false,
                    priority: 1,
                    description: '贪吃蛇游戏',
                    version: '1.0.0',
                    type: 'GUI',
                    allowMultipleInstances: true
                }
            },
            '2048': {
                script: 'application/2048/2048.js',
                styles: ['application/2048/2048.css'],
                icon: 'application/2048/2048.svg',
                metadata: {
                    autoStart: false,
                    priority: 1,
                    description: '2048 游戏',
                    version: '1.0.0',
                    type: 'GUI',
                    allowMultipleInstances: true
                }
            },
            'minesweeper': {
                script: 'application/minesweeper/minesweeper.js',
                styles: ['application/minesweeper/minesweeper.css'],
                icon: 'application/minesweeper/minesweeper.svg',
                metadata: {
                    autoStart: false,
                    priority: 1,
                    description: '扫雷游戏',
                    version: '1.0.0',
                    type: 'GUI',
                    allowMultipleInstances: true
                }
            },
            'stickman-adventure': {
                script: 'application/stickman-adventure/stickman-adventure.js',
                styles: ['application/stickman-adventure/stickman-adventure.css'],
                icon: 'application/stickman-adventure/stickman-adventure.svg',
                metadata: {
                    autoStart: false,
                    priority: 1,
                    description: '火柴人冒险游戏',
                    version: '1.0.0',
                    type: 'GUI',
                    allowMultipleInstances: true
                }
            }
        };
        
        return appAssets[programName] || null;
    }
    
    /**
     * 检查程序权限
     * @param {string} programName - 程序名称
     * @returns {boolean} 是否有权限
     */
    static _checkProgramPermission(programName) {
        // 这里简化处理，实际应该检查用户权限
        return true;
    }
    
    /**
     * 检查多实例
     * @param {string} programName - 程序名称
     * @param {Object} appAsset - 应用程序资源
     * @returns {boolean} 是否可以启动新实例
     */
    static _checkMultipleInstances(programName, appAsset) {
        const allowMultiple = appAsset.metadata?.allowMultipleInstances ?? true;
        if (allowMultiple) {
            return true;
        }
        
        // 检查是否已有实例在运行
        for (const [pid, processInfo] of this.PROCESS_TABLE.entries()) {
            if (processInfo.programName === programName && processInfo.status === 'running') {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 获取已运行的程序 PID
     * @param {string} programName - 程序名称
     * @returns {number|null} 进程 ID
     */
    static _getExistingProgramPid(programName) {
        for (const [pid, processInfo] of this.PROCESS_TABLE.entries()) {
            if (processInfo.programName === programName && processInfo.status === 'running') {
                return pid;
            }
        }
        return null;
    }
    
    /**
     * 聚焦程序窗口
     * @param {number} pid - 进程 ID
     */
    static _focusProgramWindow(pid) {
        // 这里简化处理，实际应该通过 GUIManager 聚焦窗口
        if (typeof GUIManager !== 'undefined') {
            const windows = GUIManager.getWindowsByPid(pid);
            if (windows.length > 0) {
                GUIManager.focusWindow(windows[0]);
            }
        }
    }
    
    /**
     * 加载程序资源
     * @param {number} pid - 进程 ID
     * @param {Object} processInfo - 进程信息
     * @returns {Promise<void>}
     */
    static async _loadProgramResources(pid, processInfo) {
        // 这里简化处理，实际应该加载脚本、样式等资源
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    /**
     * 等待程序对象出现
     * @param {number} pid - 进程 ID
     * @param {Object} processInfo - 进程信息
     * @returns {Promise<Object>} 程序对象
     */
    static async _waitForProgramObject(pid, processInfo) {
        const timeout = 5000;
        const startTime = Date.now();
        const programNameUpper = processInfo.programNameUpper;
        
        while (Date.now() - startTime < timeout) {
            // 检查全局对象
            if (typeof window !== 'undefined' && window[programNameUpper]) {
                return window[programNameUpper];
            }
            
            // 检查 globalThis
            if (typeof globalThis !== 'undefined' && globalThis[programNameUpper]) {
                return globalThis[programNameUpper];
            }
            
            // 检查 POOL
            if (typeof POOL !== 'undefined') {
                const programObject = POOL.__GET__("APPLICATION_POOL", programNameUpper);
                if (programObject) {
                    return programObject;
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        throw new Error(`程序对象未找到: ${processInfo.programName}`);
    }
    
    /**
     * 处理 CLI 程序
     * @param {number} pid - 进程 ID
     * @param {Object} processInfo - 进程信息
     * @param {Object} initArgs - 初始化参数
     * @returns {Promise<void>}
     */
    static async _handleCLIProgram(pid, processInfo, initArgs) {
        // 这里简化处理，实际应该处理终端相关逻辑
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    /**
     * 标准化初始化参数
     * @param {number} pid - 进程 ID
     * @param {Object} initArgs - 初始化参数
     * @param {Object} programInfo - 程序信息
     * @returns {Object} 标准化的初始化参数
     */
    static _standardizeInitArgs(pid, initArgs, programInfo) {
        return {
            pid,
            args: initArgs.args || [],
            env: initArgs.env || {},
            cwd: initArgs.cwd || 'C:',
            terminal: initArgs.terminal,
            guiContainer: initArgs.guiContainer || document.getElementById('gui-container'),
            metadata: initArgs.metadata || {},
            ...initArgs
        };
    }
    
    /**
     * 获取程序对象
     * @param {Object} processInfo - 进程信息
     * @returns {Object|null} 程序对象
     */
    static _getProgramObject(processInfo) {
        const programNameUpper = processInfo.programNameUpper;
        
        if (typeof window !== 'undefined' && window[programNameUpper]) {
            return window[programNameUpper];
        }
        
        if (typeof globalThis !== 'undefined' && globalThis[programNameUpper]) {
            return globalThis[programNameUpper];
        }
        
        if (typeof POOL !== 'undefined') {
            return POOL.__GET__("APPLICATION_POOL", programNameUpper);
        }
        
        return null;
    }
    
    /**
     * 清理进程资源
     * @param {number} pid - 进程 ID
     * @param {Object} processInfo - 进程信息
     * @returns {Promise<void>}
     */
    static async _cleanupProcessResources(pid, processInfo) {
        // 清理 GUI 元素
        if (typeof GUIManager !== 'undefined') {
            const windows = GUIManager.getWindowsByPid(pid);
            for (const windowId of windows) {
                GUIManager.unregisterWindow(windowId);
            }
        }
        
        // 清理事件监听器
        if (typeof EventManager !== 'undefined') {
            EventManager.unregisterAllHandlersForPid(pid);
        }
        
        // 清理权限
        if (typeof PermissionManager !== 'undefined') {
            PermissionManager.clearProgramPermissions(pid);
        }
        
        // 清理内存引用
        processInfo.memoryRefs.clear();
        
        // 清理 DOM 元素
        processInfo.domElements.clear();
        
        // 清理请求的模块
        processInfo.requestedModules.clear();
    }
    
    /**
     * 检查是否为管理员程序
     * @param {string} programName - 程序名称
     * @returns {boolean} 是否为管理员程序
     */
    static _isAdminProgram(programName) {
        const adminPrograms = ['regedit', 'kernelchecker', 'authenticator', 'permissioncontrol'];
        return adminPrograms.includes(programName);
    }
    
    /**
     * 调用内核 API
     * @param {number} pid - 进程 ID
     * @param {string} apiName - API 名称
     * @param {Array} args - 参数数组
     * @returns {Promise<any>} API 调用结果
     */
    static async callKernelAPI(pid, apiName, args) {
        if (!this._initialized) {
            throw new Error('ProcessManager 未初始化');
        }
        
        const processInfo = this.PROCESS_TABLE.get(pid);
        if (!processInfo) {
            throw new Error(`进程不存在: ${pid}`);
        }
        
        if (processInfo.status !== 'running') {
            throw new Error(`进程状态不正确: ${processInfo.status}`);
        }
        
        // 检查权限
        if (!processInfo.isExploit) {
            // 这里简化处理，实际应该检查权限
        }
        
        // 执行 API 调用
        return this._executeKernelAPI(apiName, args, pid);
    }
    
    /**
     * 执行内核 API 调用
     * @param {string} apiName - API 名称
     * @param {Array} args - 参数数组
     * @param {number} pid - 进程 ID
     * @returns {Promise<any>} API 调用结果
     */
    static async _executeKernelAPI(apiName, args, pid) {
        // 解析 API 名称
        const [moduleName, methodName] = apiName.split('.');
        if (!moduleName || !methodName) {
            throw new Error(`无效的 API 名称: ${apiName}`);
        }
        
        // 获取模块实例
        let module;
        
        // 从 POOL 获取
        if (typeof POOL !== 'undefined') {
            module = POOL.__GET__("KERNEL_GLOBAL_POOL", moduleName);
        }
        
        // 从全局对象获取
        if (!module && typeof window !== 'undefined') {
            module = window[moduleName];
        }
        
        // 从 globalThis 获取
        if (!module && typeof globalThis !== 'undefined') {
            module = globalThis[moduleName];
        }
        
        if (!module) {
            throw new Error(`模块不存在: ${moduleName}`);
        }
        
        // 调用方法
        const method = module[methodName];
        if (typeof method !== 'function') {
            throw new Error(`方法不存在: ${apiName}`);
        }
        
        // 执行方法
        try {
            const result = await method(...args);
            return result;
        } catch (error) {
            throw new Error(`API 调用失败: ${apiName}, 错误: ${error.message}`);
        }
    }
    
    /**
     * 获取进程信息
     * @param {number} pid - 进程 ID
     * @returns {Object|null} 进程信息
     */
    static getProcessInfo(pid) {
        return this.PROCESS_TABLE.get(pid);
    }
    
    /**
     * 获取所有进程信息
     * @returns {Array} 进程信息数组
     */
    static getAllProcesses() {
        return Array.from(this.PROCESS_TABLE.values());
    }
    
    /**
     * 检查进程是否存在
     * @param {number} pid - 进程 ID
     * @returns {boolean} 是否存在
     */
    static hasProcess(pid) {
        return this.PROCESS_TABLE.has(pid);
    }
    
    /**
     * 获取进程状态
     * @param {number} pid - 进程 ID
     * @returns {string|null} 进程状态
     */
    static getProcessStatus(pid) {
        const processInfo = this.PROCESS_TABLE.get(pid);
        return processInfo ? processInfo.status : null;
    }
}

// 自动初始化
ProcessManager.init();

// 导出进程管理器
if (typeof window !== 'undefined') {
    window.ProcessManager = ProcessManager;
} else if (typeof globalThis !== 'undefined') {
    globalThis.ProcessManager = ProcessManager;
}