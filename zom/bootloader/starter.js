/**
 * ZerOS 引导加载器
 * 负责系统启动、模块依赖管理和初始化
 */

// 模块依赖关系配置
const MODULE_DEPENDENCIES = {
    // 核心模块
    "../kernel/core/logger/kernelLogger.js": [],
    "../kernel/core/signal/dependencyConfig.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/core/signal/pool.js": ["../kernel/core/logger/kernelLogger.js"],
    
    // 类型枚举
    "../kernel/typePool/enumManager.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/typePool/logLevel.js": ["../kernel/typePool/enumManager.js"],
    "../kernel/typePool/addressType.js": ["../kernel/typePool/enumManager.js"],
    "../kernel/typePool/fileType.js": ["../kernel/typePool/enumManager.js"],
    
    // 文件系统模块
    "../kernel/filesystem/fileFramework.js": ["../kernel/typePool/fileType.js"],
    "../kernel/filesystem/disk.js": ["../kernel/filesystem/fileFramework.js"],
    "../kernel/filesystem/nodeTree.js": ["../kernel/filesystem/disk.js"],
    "../kernel/filesystem/init.js": ["../kernel/filesystem/nodeTree.js"],
    
    // 内存管理模块
    "../kernel/memory/heap.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/memory/shed.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/memory/memoryManager.js": ["../kernel/memory/heap.js", "../kernel/memory/shed.js"],
    "../kernel/memory/kernelMemory.js": ["../kernel/memory/memoryManager.js"],
    "../kernel/memory/memoryUtils.js": ["../kernel/core/logger/kernelLogger.js"],
    
    // 进程管理模块
    "../kernel/process/applicationAssets.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/process/applicationAssetManager.js": ["../kernel/process/applicationAssets.js"],
    "../kernel/process/programCategories.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/process/processManager.js": ["../kernel/process/applicationAssetManager.js", "../kernel/memory/memoryManager.js"],
    
    // 事件系统
    "../system/ui/eventManager.js": ["../kernel/process/processManager.js"],
    
    // GUI 系统
    "../system/ui/guiManager.js": ["../system/ui/eventManager.js"],
    "../system/ui/contextMenuManager.js": ["../system/ui/guiManager.js"],
    "../system/ui/taskbarManager.js": ["../system/ui/guiManager.js"],
    "../system/ui/notificationManager.js": ["../system/ui/taskbarManager.js"],
    "../system/ui/desktop.js": ["../system/ui/guiManager.js"],
    
    // 网络与动态模块
    "../kernel/drive/networkManager.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/dynamicModule/dynamicManager.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/drive/SystemInformation.js": ["../kernel/core/logger/kernelLogger.js"],
    
    // 本地存储
    "../kernel/drive/LStorage.js": ["../kernel/core/logger/kernelLogger.js"],
    
    // 主题与用户控制
    "../system/ui/themeManager.js": ["../kernel/drive/LStorage.js"],
    "../system/ui/userControl.js": ["../kernel/drive/LStorage.js"],
    "../system/ui/lockscreen.js": ["../system/ui/userControl.js"],
    
    // 权限与驱动
    "../system/ui/permissionManager.js": ["../kernel/process/processManager.js"],
    "../system/ui/animateManager.js": ["../system/ui/eventManager.js"],
    "../kernel/drive/multithreadingDrive.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/drive/dragDrive.js": ["../system/ui/eventManager.js"],
    "../kernel/drive/geographyDrive.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/drive/cacheDrive.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/drive/cryptDrive.js": ["../kernel/core/logger/kernelLogger.js"],
    "../kernel/drive/speechDrive.js": ["../kernel/core/logger/kernelLogger.js"],
    "../system/ui/exceptionHandler.js": ["../kernel/core/logger/kernelLogger.js"],
    "../system/ui/safeModeManager.js": ["../system/ui/exceptionHandler.js"]
};

// 系统启动配置
const SYSTEM_CONFIG = {
    // 自动授予普通权限
    autoGrantNormalPermissions: true,
    
    // 启用内核自检
    enableKernelSelfCheck: true,
    
    // 启用安全模式
    enableSafeMode: true,
    
    // 系统启动超时时间（毫秒）
    startupTimeout: 30000,
    
    // 模块加载超时时间（毫秒）
    moduleLoadTimeout: 5000
};

/**
 * 引导加载器类
 */
class BootLoader {
    /**
     * 启动系统
     */
    static async startSystem() {
        try {
            console.log('🚀 ZerOS 启动中...');
            
            // 等待核心模块就绪
            await this._waitForCoreModules();
            
            // 初始化对象池
            await this._initializePool();
            
            // 加载模块
            await this._loadModules();
            
            // 内核初始化
            await this._initializeKernel();
            
            // 内核自检
            await this._kernelSelfCheck();
            
            // 显示锁屏界面
            await this._showLockScreen();
            
            console.log('🎉 ZerOS 启动完成！');
        } catch (error) {
            console.error('❌ 系统启动失败:', error);
            // 尝试进入安全模式
            if (typeof SafeModeManager !== 'undefined') {
                SafeModeManager.enableSafeMode();
            }
        }
    }
    
    /**
     * 等待核心模块就绪
     */
    static async _waitForCoreModules() {
        console.log('⏳ 等待核心模块就绪...');
        
        const coreModules = [
            { name: 'KernelLogger', check: () => typeof KernelLogger !== 'undefined' },
            { name: 'DependencyConfig', check: () => typeof DependencyConfig !== 'undefined' },
            { name: 'POOL', check: () => typeof POOL !== 'undefined' }
        ];
        
        const timeout = SYSTEM_CONFIG.startupTimeout;
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const allReady = coreModules.every(module => module.check());
            if (allReady) {
                console.log('✅ 所有核心模块就绪');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('核心模块加载超时');
    }
    
    /**
     * 初始化对象池
     */
    static async _initializePool() {
        console.log('🏊 初始化对象池...');
        
        if (typeof POOL !== 'undefined') {
            // 创建内核全局池
            POOL.__CREATE_POOL__("KERNEL_GLOBAL_POOL");
            
            // 设置系统加载标志
            POOL.__SET__("KERNEL_GLOBAL_POOL", "SYSTEM_LOADING", true);
            
            // 注册 Dependency 实例
            if (typeof DependencyConfig !== 'undefined') {
                POOL.__SET__("KERNEL_GLOBAL_POOL", "Dependency", DependencyConfig);
            }
            
            // 设置工作空间路径
            POOL.__SET__("KERNEL_GLOBAL_POOL", "WORKSPACE_PATH", "F:/Users/Yzy15/Documents/GitHub/WebGames/zom");
            
            console.log('✅ 对象池初始化完成');
        } else {
            throw new Error('POOL 模块未加载');
        }
    }
    
    /**
     * 加载模块
     */
    static async _loadModules() {
        console.log('📦 加载系统模块...');
        
        if (typeof DependencyConfig !== 'undefined') {
            // 注册依赖关系
            DependencyConfig.registerDependencies(MODULE_DEPENDENCIES);
            
            // 加载模块
            await DependencyConfig.loadModules();
            
            console.log('✅ 模块加载完成');
        } else {
            throw new Error('DependencyConfig 模块未加载');
        }
    }
    
    /**
     * 内核初始化
     */
    static async _initializeKernel() {
        console.log('🖥️  内核初始化...');
        
        // 检查内核异常标志
        if (typeof ExceptionHandler !== 'undefined') {
            const canBoot = await ExceptionHandler.canNormalBoot();
            if (!canBoot) {
                console.warn('⚠️  检测到内核异常，进入安全模式');
                if (typeof SafeModeManager !== 'undefined') {
                    SafeModeManager.enableSafeMode();
                }
                return;
            }
        }
        
        // 初始化事件管理器
        if (typeof EventManager !== 'undefined') {
            EventManager.init();
        }
        
        // 初始化进程管理器
        if (typeof ProcessManager !== 'undefined') {
            ProcessManager.init();
            // 注册 Exploit 程序
            ProcessManager.registerExploitProgram();
        }
        
        // 验证文件系统
        if (typeof Disk !== 'undefined') {
            while (!Disk.canUsed) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        console.log('✅ 内核初始化完成');
    }
    
    /**
     * 内核自检
     */
    static async _kernelSelfCheck() {
        if (!SYSTEM_CONFIG.enableKernelSelfCheck) {
            return;
        }
        
        console.log('🔍 内核自检...');
        
        const checks = [
            // 核心模块检查
            { name: 'KernelLogger', check: () => typeof KernelLogger !== 'undefined' },
            { name: 'DependencyConfig', check: () => typeof DependencyConfig !== 'undefined' },
            { name: 'POOL', check: () => typeof POOL !== 'undefined' },
            
            // 枚举管理器检查
            { name: 'EnumManager', check: () => typeof EnumManager !== 'undefined' },
            
            // 文件系统检查
            { name: 'Disk', check: () => typeof Disk !== 'undefined' && Disk.canUsed },
            { name: 'NodeTreeCollection', check: () => typeof NodeTreeCollection !== 'undefined' },
            { name: 'FileFramework', check: () => typeof FileFramework !== 'undefined' },
            { name: 'LStorage', check: () => typeof LStorage !== 'undefined' },
            
            // 内存管理检查
            { name: 'MemoryManager', check: () => typeof MemoryManager !== 'undefined' },
            { name: 'Heap', check: () => typeof Heap !== 'undefined' },
            { name: 'Shed', check: () => typeof Shed !== 'undefined' },
            { name: 'KernelMemory', check: () => typeof KernelMemory !== 'undefined' },
            
            // 进程管理检查
            { name: 'ProcessManager', check: () => typeof ProcessManager !== 'undefined' },
            { name: 'ApplicationAssetManager', check: () => typeof ApplicationAssetManager !== 'undefined' },
            
            // GUI 管理检查
            { name: 'GUIManager', check: () => typeof GUIManager !== 'undefined' },
            { name: 'ThemeManager', check: () => typeof ThemeManager !== 'undefined' },
            { name: 'DesktopManager', check: () => typeof DesktopManager !== 'undefined' },
            { name: 'TaskbarManager', check: () => typeof TaskbarManager !== 'undefined' },
            { name: 'NotificationManager', check: () => typeof NotificationManager !== 'undefined' },
            { name: 'PermissionManager', check: () => typeof PermissionManager !== 'undefined' },
            { name: 'ContextMenuManager', check: () => typeof ContextMenuManager !== 'undefined' },
            { name: 'EventManager', check: () => typeof EventManager !== 'undefined' },
            
            // 其他模块检查
            { name: 'NetworkManager', check: () => typeof NetworkManager !== 'undefined' },
            { name: 'SystemInformation', check: () => typeof SystemInformation !== 'undefined' },
            { name: 'DynamicManager', check: () => typeof DynamicManager !== 'undefined' },
            { name: 'MultithreadingDrive', check: () => typeof MultithreadingDrive !== 'undefined' },
            { name: 'DragDrive', check: () => typeof DragDrive !== 'undefined' },
            { name: 'GeographyDrive', check: () => typeof GeographyDrive !== 'undefined' },
            { name: 'CacheDrive', check: () => typeof CacheDrive !== 'undefined' },
            { name: 'CryptDrive', check: () => typeof CryptDrive !== 'undefined' },
            { name: 'SpeechDrive', check: () => typeof SpeechDrive !== 'undefined' },
            { name: 'ExceptionHandler', check: () => typeof ExceptionHandler !== 'undefined' },
            { name: 'SafeModeManager', check: () => typeof SafeModeManager !== 'undefined' }
        ];
        
        const passed = [];
        const failed = [];
        
        checks.forEach(check => {
            try {
                if (check.check()) {
                    passed.push(check.name);
                } else {
                    failed.push(check.name);
                }
            } catch (error) {
                failed.push(check.name);
            }
        });
        
        console.log(`✅ 通过检查: ${passed.length}/${checks.length}`);
        if (failed.length > 0) {
            console.warn(`⚠️  未通过检查: ${failed.join(', ')}`);
        }
        
        // 浏览器环境检查
        const browserChecks = [
            { name: 'localStorage', check: () => typeof localStorage !== 'undefined' },
            { name: 'document.body', check: () => typeof document !== 'undefined' && document.body },
            { name: 'window 对象', check: () => typeof window !== 'undefined' }
        ];
        
        browserChecks.forEach(check => {
            if (check.check()) {
                passed.push(check.name);
            } else {
                failed.push(check.name);
            }
        });
        
        console.log('✅ 内核自检完成');
    }
    
    /**
     * 显示锁屏界面
     */
    static async _showLockScreen() {
        console.log('🔒 显示锁屏界面...');
        
        if (typeof LockScreen !== 'undefined') {
            LockScreen.init();
            console.log('✅ 锁屏界面初始化完成');
        } else {
            console.warn('⚠️  LockScreen 模块未加载，跳过锁屏界面');
        }
    }
}

// 导出引导加载器
if (typeof window !== 'undefined') {
    window.BootLoader = BootLoader;
} else if (typeof globalThis !== 'undefined') {
    globalThis.BootLoader = BootLoader;
}

// 当 DOM 加载完成后启动系统
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            BootLoader.startSystem();
        });
    } else {
        BootLoader.startSystem();
    }
}