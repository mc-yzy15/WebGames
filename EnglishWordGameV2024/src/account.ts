// 账号管理系统 - 完整版

// ========== 数据类型定义 ==========

export interface Account {
    id: string;
    username: string;
    nickname: string | null;
    email: string | null;
    avatar: string | null;
    password_hash: string;
    created_at: string;
    last_login: string | null;
    last_modified: string;
    is_active: boolean;
    settings: AccountSettings;
    game_data: GameData;
    statistics: UserStatistics;
}

export interface AccountSettings {
    theme: string;
    language: string;
    sound_enabled: boolean;
    music_enabled: boolean;
    auto_save: boolean;
    show_notifications: boolean;
}

export interface UserStatistics {
    total_play_time: number;
    total_games_played: number;
    total_score: number;
    achievements_unlocked: string[];
    login_count: number;
    longest_streak: number;
    current_streak: number;
}

export interface GameData {
    word_game: WordGameData;
    sentence_game: SentenceGameData;
}

export interface WordGameData {
    current_level: number;
    total_score: number;
    completed_levels: number[];
    difficulty: string;
    level_records: Record < string,
    LevelRecord[] >;
    total_records: Record < string,
    TotalRecord[] >;
    speedrun_records: SpeedrunRecord[];
}

export interface SentenceGameData {
    current_level: number;
    total_score: number;
    completed_levels: number[];
    difficulty: string;
    level_records: Record < string,
    LevelRecord[] >;
    total_records: Record < string,
    TotalRecord[] >;
    speedrun_records: SpeedrunRecord[];
}

export interface LevelRecord {
    name: string;
    level: number;
    score: number;
    time: number;
    mistakes: number;
    difficulty: string;
    date: string;
    record_id: string;
}

export interface TotalRecord {
    name: string;
    total_score: number;
    total_time: number;
    levels_completed: number;
    difficulty: string;
    date: string;
    record_id: string;
}

export interface SpeedrunRecord {
    name: string;
    total_time: number;
    difficulty: string;
    levels_completed: number;
    date: string;
    record_id: string;
}

export interface AccountSummary {
    id: string;
    username: string;
    nickname: string | null;
    avatar: string | null;
    created_at: string;
    last_login: string | null;
    total_score: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    account: Account | null;
    message: string;
}

export interface UpdateAccountRequest {
    nickname?: string;
    email?: string;
    avatar?: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

// ========== 环境检测 ==========

function isTauri(): boolean {
    return typeof window !== 'undefined' && typeof(window as any).__TAURI__ !== 'undefined';
}

async function getInvoke() {
    if (! isTauri()) {
        throw new Error("Tauri API 只在桌面应用中可用");
    }
    const {invoke} = await import ("@tauri-apps/api/core");
    return invoke;
}

// ========== 全局状态 ==========

let currentAccount: Account |null = null;

// ========== 账号认证 ==========

export async function createAccount(username: string, password: string): Promise<Account> {
    const invoke = await getInvoke();
    const account = await invoke < Account > ("create_account", {username, password});
    currentAccount = account;
    return account;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    const invoke = await getInvoke();
    const response = await invoke < LoginResponse > ("login", {
        request: {
            username,
            password
        }
    });
    if (response.success && response.account) {
        currentAccount = response.account;
    }
    return response;
}

export async function logout(): Promise<void> {
    const invoke = await getInvoke();
    await invoke("logout");
    currentAccount = null;
}

export async function loadAccount(accountId: string): Promise<Account> {
    const invoke = await getInvoke();
    const account = await invoke < Account > ("load_account", {account_id: accountId});
    currentAccount = account;
    return account;
}

export async function getCurrentAccount(): Promise<Account | null> {
    if (! isTauri()) {
        return null;
    }
    const invoke = await getInvoke();
    const account = await invoke < Account | null > ("get_current_account");
    currentAccount = account;
    return account;
}

export async function listAccounts(): Promise<{ id: string; username: string }[]> {
    if (! isTauri()) {
        return [];
    }
    const invoke = await getInvoke();
    const accounts = await invoke < [string, string][] > ("list_accounts");
    return accounts.map(([id, username]) => ({id, username}));
}

export async function listAccountSummaries(): Promise<AccountSummary[]> {
    if (! isTauri()) {
        return [];
    }
    const invoke = await getInvoke();
    return await invoke < AccountSummary[] > ("list_account_summaries");
}

// ========== 账号信息管理 ==========

export async function updateAccountInfo(accountId: string, request: UpdateAccountRequest): Promise<Account> {
    const invoke = await getInvoke();
    const account = await invoke < Account > ("update_account_info", {
        account_id: accountId,
        request
    });
    if (currentAccount ?. id === accountId) {
        currentAccount = account;
    }
    return account;
}

export async function changePassword(accountId: string, oldPassword: string, newPassword: string): Promise<void> {
    const invoke = await getInvoke();
    await invoke("change_password", {
        account_id: accountId,
        request: {
            old_password: oldPassword,
            new_password: newPassword
        }
    });
}

export async function updateSettings(accountId: string, settings: AccountSettings): Promise<Account> {
    const invoke = await getInvoke();
    const account = await invoke < Account > ("update_settings", {
        account_id: accountId,
        settings
    });
    if (currentAccount ?. id === accountId) {
        currentAccount = account;
    }
    return account;
}

export async function deleteAccount(accountId: string, password: string): Promise<void> {
    const invoke = await getInvoke();
    await invoke("delete_account", {
        account_id: accountId,
        password
    });
    if (currentAccount ?. id === accountId) {
        currentAccount = null;
    }
}

// ========== 游戏数据 ==========

export async function updateGameData(accountId: string, gameData: GameData): Promise<void> {
    const invoke = await getInvoke();
    await invoke("update_game_data", {
        account_id: accountId,
        game_data: gameData
    });
    if (currentAccount ?. id === accountId) {
        currentAccount.game_data = gameData;
    }
}

export async function getAccountStatistics(accountId: string): Promise<UserStatistics> {
    const invoke = await getInvoke();
    return await invoke < UserStatistics > ("get_account_statistics", {account_id: accountId});
}

// ========== 数据导入导出 ==========

export async function exportAccountData(accountId ?:string): Promise<string> {
    const invoke = await getInvoke();
    if (accountId) {
        return await invoke < string > ("export_account_data", {account_id: accountId});
    } else {
        return await invoke < string > ("export_current_account");
    }
}

export async function importAccountData(encryptedData: string): Promise<Account> {
    const invoke = await getInvoke();
    const account = await invoke < Account > ("import_account_data", {encrypted_data: encryptedData});
    currentAccount = account;
    return account;
}

export async function exportAccountToFile(accountId ?:string, filename ?:string): Promise<void> {
    const data = await exportAccountData(accountId);
    const account = currentAccount;

    if (! account && ! accountId) {
        throw new Error("没有可导出的账号");
    }

    const defaultFilename = filename || `${
        account ?. username || "account"
    }_${
        new Date().toISOString().split("T")[0]
    }.yzdatae`;

    const blob = new Blob([data], {type: "application/octet-stream"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function importAccountFromFile(file: File): Promise<Account> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const encryptedData = e.target ?. result as string;
                const account = await importAccountData(encryptedData);
                resolve(account);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error("读取文件失败"));
        reader.readAsText(file);
    });
}

// ========== 加密工具 ==========

export async function encryptData(data: string): Promise<string> {
    const invoke = await getInvoke();
    return await invoke < string > ("encrypt_data", {data});
}

export async function decryptData(encryptedData: string): Promise<string> {
    const invoke = await getInvoke();
    return await invoke < string > ("decrypt_data", {encrypted_data: encryptedData});
}

// ========== 工具函数 ==========

export function getLoggedInAccount(): Account |null {
    return currentAccount;
}

export function isLoggedIn(): boolean {
    return currentAccount !== null;
}

export function checkTauriEnvironment(): boolean {
    return isTauri();
}

export async function initAccountSystem(): Promise<void> {
    if (! isTauri()) {
        console.log("浏览器环境：账号系统需要桌面应用才能使用");
        return;
    }

    try {
        const account = await getCurrentAccount();
        if (account) {
            console.log("已加载账号:", account.username);
        }
    } catch (error) {
        console.log("没有已登录的账号");
    }
}

// 默认账号设置
export function getDefaultSettings(): AccountSettings {
    return {
        theme: "auto",
        language: "zh-CN",
        sound_enabled: true,
        music_enabled: true,
        auto_save: true,
        show_notifications: true
    };
}

// 格式化时间
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
        return `${minutes}分钟${secs}秒`;
    } else {
        return `${secs}秒`;
    }
}

// 格式化日期
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN");
}

// 生成默认头像
export function generateDefaultAvatar(username: string): string {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d")!;

    // 背景色
    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8"
    ];
    const color = colors[username.charCodeAt(0) % colors.length];

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 100, 100);

    // 文字
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(username.charAt(0).toUpperCase(), 50, 50);

    return canvas.toDataURL("image/png");
}
