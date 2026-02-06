---
name: zom-package-creator
description: 用于创建ZOM软件包的技能，根据ZerOS的API和规范，帮助用户创建、构建和发布ZOM软件包。当用户需要根据`f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs`中的API创建ZOM软件包时使用此技能。
---

# ZOM Package Creator

## 概述

ZOM (ZerOS Object Module) 是 ZerOS 系统的程序安装包格式，实际上是 ZIP 压缩包的另一种扩展名（`.zom`）。ZOM 安装包用于分发和安装 ZerOS 应用程序，包含程序的所有资源文件、配置信息和安装脚本。

## ZOM 软件包结构

ZOM 软件包必须包含以下结构：

```
myapp.zom (ZIP 压缩包)
├── application.json          # 程序配置文件（必需，不会被复制到 application/）
├── setup.js                  # 安装脚本（可选，不会被复制到 application/）
├── myapp.js                  # 主程序脚本
├── myapp.css                 # 样式文件
├── icon.svg                  # 程序图标
└── assets/                   # 资源文件目录
    ├── data.json
    ├── images/
    │   ├── logo.png
    │   └── background.jpg
    └── fonts/
        └── custom.woff2
```

## 创建 ZOM 软件包的步骤

### 1. 创建配置文件 (application.json)

创建 `application.json` 文件，包含程序的元数据和资源路径信息：

```json
{
    "name": "myapp",
    "version": "1.0.0",
    "description": "我的应用程序",
    "script": "myapp.js",
    "styles": ["myapp.css"],
    "icon": "icon.svg",
    "assets": [
        "assets/data.json",
        "assets/images/logo.png"
    ],
    "type": "GUI",
    "autoStart": false,
    "priority": 5,
    "alwaysShowInTaskbar": false,
    "allowMultipleInstances": true,
    "supportsPreview": true,
    "category": "utility"
}
```

### 2. 创建主程序脚本

创建主程序脚本，遵循 ZerOS 程序开发规范，包含以下必需方法：
- `__init__(pid, initArgs)`: 程序初始化
- `__exit__()`: 程序退出，清理资源
- `__info__()`: 返回程序信息

**示例**：

```javascript
(function(window) {
    'use strict';
    
    const PROGRAM_NAME = 'MYAPP';
    
    const MYAPP = {
        pid: null,
        window: null,
        
        __init__: async function(pid, initArgs) {
            this.pid = pid;
            // 初始化代码
        },
        
        __exit__: async function() {
            // 清理资源
        },
        
        __info__: function() {
            return {
                name: 'myapp',
                type: 'GUI',
                version: '1.0.0',
                description: '我的应用程序',
                author: 'Your Name',
                copyright: '© 2025',
                permissions: [],
                metadata: {
                    allowMultipleInstances: true
                }
            };
        }
    };
    
    if (typeof window !== 'undefined') {
        window[PROGRAM_NAME] = MYAPP;
    } else if (typeof globalThis !== 'undefined') {
        globalThis[PROGRAM_NAME] = MYAPP;
    }
    
})(typeof window !== 'undefined' ? window : globalThis);
```

### 3. 创建样式文件 (可选)

创建样式文件，使用 ZerOS 主题变量确保样式一致性：

```css
.myapp-window {
    background: var(--theme-background-elevated, rgba(37, 43, 53, 0.98));
    border: 1px solid var(--theme-border, rgba(139, 92, 246, 0.3));
    color: var(--theme-text, #d7e0dd);
}
```

### 4. 创建图标文件 (可选)

创建 SVG 或 PNG 格式的图标文件。

### 5. 添加资源文件 (可选)

将资源文件（如图片、音频、数据文件等）放在 `assets/` 目录下。

### 6. 创建安装脚本 (可选)

如果需要自定义安装过程，可以创建 `setup.js` 文件。安装脚本必须遵循 ZerOS 程序开发规范，且程序对象必须命名为 `SETUP`。

### 7. 构建 ZOM 软件包

使用压缩工具将所有文件压缩成 ZIP 格式，然后将扩展名改为 `.zom`。

**使用 PowerShell 构建**：

```powershell
Compress-Archive -Path * -DestinationPath myapp.zom -Force
```

**使用 ZIP 命令构建**：

```bash
zip -r myapp.zom *
```

## 发布 ZOM 软件包

将构建好的 ZOM 软件包发布到指定目录：
- 发布路径：`f:\Users\Yzy15\Documents\GitHub\WebGames\zom\Releases\Beta`

## 最佳实践

1. **遵循 ZerOS 开发规范**：
   - 使用 EventManager 进行事件处理
   - 使用 KernelLogger 进行日志记录
   - 使用 GUIManager 管理窗口
   - 在 `__info__` 中声明所需权限
   - 在 `__exit__` 中清理所有资源

2. **文件组织**：
   - 将相关文件组织到子目录中
   - 保持目录结构清晰
   - 避免在根目录放置过多文件

3. **路径配置**：
   - 使用相对路径（相对于 ZOM 根目录）
   - 路径使用正斜杠 `/` 作为分隔符
   - 避免使用绝对路径

4. **资源文件**：
   - 大文件考虑压缩或使用外部资源
   - 图片使用 SVG 格式（矢量图）或优化的 PNG/WebP
   - 字体文件使用 WOFF2 格式

## 相关 API 文档

创建 ZOM 软件包时，应参考以下 API 文档：
- `f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs\API\GUIManager.md`
- `f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs\API\EventManager.md`
- `f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs\API\KernelLogger.md`
- `f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs\API\PermissionManager.md`
- `f:\Users\Yzy15\Documents\GitHub\WebGames\zom\docs\API\ZOMInstall.md`

## 示例应用

以下是一个简单的 ZOM 软件包示例：

1. **application.json**：
   ```json
   {
       "name": "demoapp",
       "version": "1.0.0",
       "description": "A simple demo application for ZerOS",
       "script": "demoapp.js",
       "styles": ["demoapp.css"],
       "icon": "icon.svg",
       "type": "GUI",
       "category": "utility"
   }
   ```

2. **demoapp.js**：
   ```javascript
   (function(window) {
       'use strict';
       
       const PROGRAM_NAME = 'DEMOAPP';
       
       const DEMOAPP = {
           pid: null,
           window: null,
           
           __init__: async function(pid, initArgs) {
               this.pid = pid;
               // 初始化代码
           },
           
           __exit__: async function() {
               // 清理资源
           },
           
           __info__: function() {
               return {
                   name: 'demoapp',
                   type: 'GUI',
                   version: '1.0.0',
                   description: 'A simple demo application for ZerOS',
                   author: 'ZerOS Team',
                   copyright: '© 2025',
                   permissions: [],
                   metadata: {
                       allowMultipleInstances: true
                   }
               };
           }
       };
       
       if (typeof window !== 'undefined') {
           window[PROGRAM_NAME] = DEMOAPP;
       } else if (typeof globalThis !== 'undefined') {
           globalThis[PROGRAM_NAME] = DEMOAPP;
       }
       
   })(typeof window !== 'undefined' ? window : globalThis);
   ```

3. **demoapp.css**：
   ```css
   .demoapp-window {
       background: var(--theme-background-elevated, rgba(37, 43, 53, 0.98));
       border: 1px solid var(--theme-border, rgba(139, 92, 246, 0.3));
       color: var(--theme-text, #d7e0dd);
   }
   ```

4. **icon.svg**：
   ```svg
   <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
     <circle cx="32" cy="32" r="30" fill="#8B5CF6" opacity="0.1"/>
     <path d="M16 32L24 20L32 28L40 20L48 32L40 44L32 36L24 44L16 32Z" fill="#8B5CF6" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
   </svg>
   ```

## 安装 ZOM 软件包

ZOM 软件包可以通过 ZerOS 系统的 `zominstall` 命令进行安装：

```bash
zominstall <zom文件路径>
```

**重要**：只有管理员用户可以安装程序。