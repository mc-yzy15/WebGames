// 账号数据类型定义
export interface Account {
  id: string;
  username: string;
  created_at: string;
  last_login: string | null;
  game_data: GameData;
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
  level_records: Record<string, LevelRecord[]>;
  total_records: Record<string, TotalRecord[]>;
  speedrun_records: SpeedrunRecord[];
}

export interface SentenceGameData {
  current_level: number;
  total_score: number;
  completed_levels: number[];
  difficulty: string;
  level_records: Record<string, LevelRecord[]>;
  total_records: Record<string, TotalRecord[]>;
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

// 检查是否在 Tauri 环境中
function isTauri(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).__TAURI__ !== 'undefined';
}

// 动态导入 Tauri API
async function getInvoke() {
  if (!isTauri()) {
    throw new Error("Tauri API 只在桌面应用中可用");
  }
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke;
}

// 当前登录的账号
let currentAccount: Account | null = null;

// ========== 账号管理函数 ==========

/**
 * 创建新账号
 */
export async function createAccount(username: string): Promise<Account> {
  const invoke = await getInvoke();
  const account = await invoke<Account>("create_account", { username });
  currentAccount = account;
  return account;
}

/**
 * 加载账号
 */
export async function loadAccount(accountId: string): Promise<Account> {
  const invoke = await getInvoke();
  const account = await invoke<Account>("load_account", { account_id: accountId });
  currentAccount = account;
  return account;
}

/**
 * 获取当前账号
 */
export async function getCurrentAccount(): Promise<Account | null> {
  if (!isTauri()) {
    return null;
  }
  const invoke = await getInvoke();
  const account = await invoke<Account | null>("get_current_account");
  currentAccount = account;
  return account;
}

/**
 * 列出所有账号
 */
export async function listAccounts(): Promise<{ id: string; username: string }[]> {
  if (!isTauri()) {
    return [];
  }
  const invoke = await getInvoke();
  const accounts = await invoke<[string, string][]>("list_accounts");
  return accounts.map(([id, username]) => ({ id, username }));
}

/**
 * 删除账号
 */
export async function deleteAccount(accountId: string): Promise<void> {
  const invoke = await getInvoke();
  await invoke("delete_account", { account_id: accountId });
  if (currentAccount?.id === accountId) {
    currentAccount = null;
  }
}

/**
 * 更新游戏数据
 */
export async function updateGameData(gameData: GameData): Promise<void> {
  const invoke = await getInvoke();
  await invoke("update_game_data", { game_data: gameData });
  if (currentAccount) {
    currentAccount.game_data = gameData;
  }
}

// ========== 数据导入导出函数 ==========

/**
 * 导出账号数据（加密格式 .yzdatae）
 * @param accountId 账号ID，如果不提供则导出当前账号
 * @returns 加密后的数据字符串
 */
export async function exportAccountData(accountId?: string): Promise<string> {
  const invoke = await getInvoke();
  if (accountId) {
    return await invoke<string>("export_account_data", { account_id: accountId });
  } else {
    return await invoke<string>("export_current_account");
  }
}

/**
 * 导入账号数据（解密 .yzdatae 文件）
 * @param encryptedData 加密的账号数据
 * @returns 导入的账号信息
 */
export async function importAccountData(encryptedData: string): Promise<Account> {
  const invoke = await getInvoke();
  const account = await invoke<Account>("import_account_data", { encrypted_data: encryptedData });
  currentAccount = account;
  return account;
}

/**
 * 导出账号到文件（自动下载）
 * @param accountId 账号ID，如果不提供则导出当前账号
 * @param filename 文件名，默认为 username_yyyy-mm-dd.yzdatae
 */
export async function exportAccountToFile(accountId?: string, filename?: string): Promise<void> {
  const data = await exportAccountData(accountId);
  const account = currentAccount;
  
  if (!account && !accountId) {
    throw new Error("没有可导出的账号");
  }

  const defaultFilename = filename || 
    `${account?.username || "account"}_${new Date().toISOString().split("T")[0]}.yzdatae`;

  // 创建 Blob 并下载
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 从文件导入账号
 * @param file 用户选择的 .yzdatae 文件
 * @returns 导入的账号信息
 */
export async function importAccountFromFile(file: File): Promise<Account> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const encryptedData = e.target?.result as string;
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

// ========== 加密工具函数 ==========

/**
 * 加密任意数据
 */
export async function encryptData(data: string): Promise<string> {
  const invoke = await getInvoke();
  return await invoke<string>("encrypt_data", { data });
}

/**
 * 解密数据
 */
export async function decryptData(encryptedData: string): Promise<string> {
  const invoke = await getInvoke();
  return await invoke<string>("decrypt_data", { encrypted_data: encryptedData });
}

// ========== 工具函数 ==========

/**
 * 获取当前登录账号
 */
export function getLoggedInAccount(): Account | null {
  return currentAccount;
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return currentAccount !== null;
}

/**
 * 登出当前账号
 */
export function logout(): void {
  currentAccount = null;
}

/**
 * 检查是否在 Tauri 桌面环境中
 */
export function checkTauriEnvironment(): boolean {
  return isTauri();
}

/**
 * 初始化账号系统（应用启动时调用）
 */
export async function initAccountSystem(): Promise<void> {
  if (!isTauri()) {
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
