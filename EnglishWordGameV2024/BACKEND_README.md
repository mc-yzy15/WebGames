# English Word Game V2024 - 后端功能说明

## 已实现的后端功能

### 1. 账号系统

#### 功能特性
- ✅ 创建新账号（用户名）
- ✅ 加载已有账号
- ✅ 列出所有账号
- ✅ 删除账号
- ✅ 自动保存游戏进度
- ✅ 账号数据本地存储

#### 数据存储位置
- Windows: `%APPDATA%\EnglishWordGameV2024\`
- macOS: `~/Library/Application Support/EnglishWordGameV2024/`
- Linux: `~/.local/share/EnglishWordGameV2024/`

### 2. 加密系统

#### 加密算法
- **算法**: AES-256-GCM
- **密钥种子**: `Ms.WuYYDS#2025WordGameV2024`
- **Nonce**: 12字节随机值

#### 安全特性
- 所有账号数据都经过加密存储
- 导出文件使用相同的加密标准
- 支持任意数据的加密/解密

### 3. 数据导入导出

#### 导出功能
- 导出格式: `.yzdatae` (加密文件)
- 包含内容: 账号信息 + 游戏数据
- 导出方式: 文件下载

#### 导入功能
- 支持导入 `.yzdatae` 文件
- 自动解密和验证
- 版本兼容性检查

## 技术栈

### 后端 (Rust)
- **Tauri**: 桌面应用框架
- **aes-gcm**: AES-256-GCM 加密
- **chrono**: 日期时间处理
- **dirs**: 系统目录访问
- **serde**: 序列化/反序列化

### 前端 (TypeScript)
- **Tauri API**: 调用后端命令
- **原生文件 API**: 文件导入导出

## 本地测试步骤

### 前提条件
1. 安装 [Rust](https://rustup.rs/) (包含 Cargo)
2. 安装 Node.js 和 npm

### 测试步骤

```bash
# 1. 进入项目目录
cd EnglishWordGameV2024

# 2. 安装前端依赖
npm install

# 3. 运行 Tauri 开发模式
npm run tauri dev
```

### 测试功能

1. **创建账号**
   - 在账号管理区域输入用户名
   - 点击"创建账号"按钮

2. **导出账号**
   - 点击"导出账号"按钮
   - 下载 `.yzdatae` 文件

3. **导入账号**
   - 选择之前导出的 `.yzdatae` 文件
   - 点击"导入"按钮

4. **切换账号**
   - 点击"退出"按钮
   - 选择其他账号或创建新账号

## 文件结构

```
src-tauri/
├── src/
│   ├── lib.rs          # Tauri 命令定义
│   ├── account.rs      # 账号系统实现
│   └── main.rs         # 程序入口
├── Cargo.toml          # Rust 依赖配置
tauri.conf.json         # Tauri 配置

src/
├── account.ts          # 前端账号模块
├── main.ts             # 前端入口
├── styles.css          # 样式文件
└── games/              # 游戏文件
    ├── jvzi/           # 句子游戏
    └── word/           # 单词游戏
```

## API 参考

### 后端命令

| 命令 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `create_account` | `username: String` | `Account` | 创建新账号 |
| `load_account` | `account_id: String` | `Account` | 加载账号 |
| `get_current_account` | - | `Option<Account>` | 获取当前账号 |
| `list_accounts` | - | `Vec<(String, String)>` | 列出所有账号 |
| `delete_account` | `account_id: String` | `()` | 删除账号 |
| `update_game_data` | `game_data: GameData` | `()` | 更新游戏数据 |
| `export_account_data` | `account_id: String` | `String` | 导出账号数据 |
| `import_account_data` | `encrypted_data: String` | `Account` | 导入账号数据 |
| `encrypt_data` | `data: String` | `String` | 加密数据 |
| `decrypt_data` | `encrypted_data: String` | `String` | 解密数据 |

### 前端函数

```typescript
// 账号管理
import { 
  createAccount, 
  loadAccount, 
  listAccounts, 
  deleteAccount,
  getCurrentAccount,
  updateGameData
} from './account';

// 导入导出
import {
  exportAccountData,
  importAccountData,
  exportAccountToFile,
  importAccountFromFile
} from './account';

// 加密工具
import {
  encryptData,
  decryptData
} from './account';
```

## 注意事项

1. **Rust 环境**: 测试完整功能需要安装 Rust 工具链
2. **数据备份**: 建议定期导出账号数据作为备份
3. **文件格式**: 只支持导入 `.yzdatae` 格式的文件
4. **版本兼容**: 导入时检查版本号，不兼容会报错

## 下一步计划

- [ ] 添加游戏进度自动同步
- [ ] 实现排行榜云端存储
- [ ] 添加多语言支持
- [ ] 优化加密性能
