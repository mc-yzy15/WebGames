use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use chrono::{DateTime, Utc};
use rand::Rng;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

// 加密密钥种子
const ENCRYPTION_SEED: &[u8] = b"Ms.WuYYDS#2025WordGameV2024";

// ========== 数据模型 ==========

/// 账号信息
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub username: String,
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub avatar: Option<String>, // Base64 编码的头像
    pub password_hash: String,  // SHA256 哈希
    pub created_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
    pub last_modified: DateTime<Utc>,
    pub is_active: bool,
    pub settings: AccountSettings,
    pub game_data: GameData,
    pub statistics: UserStatistics,
}

/// 账号设置
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AccountSettings {
    pub theme: String,            // 主题: "light", "dark", "auto"
    pub language: String,         // 语言: "zh-CN", "en-US"
    pub sound_enabled: bool,      // 音效开关
    pub music_enabled: bool,      // 音乐开关
    pub auto_save: bool,          // 自动保存
    pub show_notifications: bool, // 显示通知
}

/// 用户统计
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UserStatistics {
    pub total_play_time: i64,               // 总游戏时长（秒）
    pub total_games_played: i32,            // 总游戏次数
    pub total_score: i32,                   // 总分数
    pub achievements_unlocked: Vec<String>, // 已解锁成就
    pub login_count: i32,                   // 登录次数
    pub longest_streak: i32,                // 最长连续登录天数
    pub current_streak: i32,                // 当前连续登录天数
}

/// 游戏数据
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GameData {
    pub word_game: WordGameData,
    pub sentence_game: SentenceGameData,
}

/// 单词游戏数据
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WordGameData {
    pub current_level: i32,
    pub total_score: i32,
    pub completed_levels: Vec<i32>,
    pub difficulty: String,
    pub level_records: HashMap<String, Vec<LevelRecord>>,
    pub total_records: HashMap<String, Vec<TotalRecord>>,
    pub speedrun_records: Vec<SpeedrunRecord>,
}

/// 句子游戏数据
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SentenceGameData {
    pub current_level: i32,
    pub total_score: i32,
    pub completed_levels: Vec<i32>,
    pub difficulty: String,
    pub level_records: HashMap<String, Vec<LevelRecord>>,
    pub total_records: HashMap<String, Vec<TotalRecord>>,
    pub speedrun_records: Vec<SpeedrunRecord>,
}

/// 关卡记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LevelRecord {
    pub name: String,
    pub level: i32,
    pub score: i32,
    pub time: f64,
    pub mistakes: i32,
    pub difficulty: String,
    pub date: DateTime<Utc>,
    pub record_id: String,
}

/// 总记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TotalRecord {
    pub name: String,
    pub total_score: i32,
    pub total_time: f64,
    pub levels_completed: i32,
    pub difficulty: String,
    pub date: DateTime<Utc>,
    pub record_id: String,
}

/// 速通记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpeedrunRecord {
    pub name: String,
    pub total_time: f64,
    pub difficulty: String,
    pub levels_completed: i32,
    pub date: DateTime<Utc>,
    pub record_id: String,
}

/// 导出数据结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportData {
    pub version: String,
    pub export_time: DateTime<Utc>,
    pub account: Account,
}

/// 账号摘要（用于列表显示）
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountSummary {
    pub id: String,
    pub username: String,
    pub nickname: Option<String>,
    pub avatar: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
    pub total_score: i32,
}

/// 登录请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

/// 登录响应
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
    pub success: bool,
    pub account: Option<Account>,
    pub message: String,
}

/// 更新账号信息请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateAccountRequest {
    pub nickname: Option<String>,
    pub email: Option<String>,
    pub avatar: Option<String>,
}

/// 修改密码请求
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChangePasswordRequest {
    pub old_password: String,
    pub new_password: String,
}

// ========== 账号管理器 ==========

pub struct AccountManager {
    data_dir: PathBuf,
    current_account: Option<Account>,
}

impl AccountManager {
    pub fn new() -> Result<Self, String> {
        let data_dir = Self::get_data_dir()?;
        fs::create_dir_all(&data_dir).map_err(|e| format!("创建数据目录失败: {}", e))?;

        Ok(Self {
            data_dir,
            current_account: None,
        })
    }

    fn get_data_dir() -> Result<PathBuf, String> {
        dirs::data_dir()
            .ok_or_else(|| "无法获取数据目录".to_string())
            .map(|dir| dir.join("EnglishWordGameV2024"))
    }

    /// 生成唯一ID
    fn generate_id() -> String {
        let timestamp = Utc::now().timestamp_millis();
        let random: u32 = rand::random();
        format!("{}_{:08x}", timestamp, random)
    }

    /// 生成记录ID
    fn generate_record_id() -> String {
        let timestamp = Utc::now().timestamp_millis();
        let random: u32 = rand::random();
        format!("REC_{}_{:08x}", timestamp, random)
    }

    /// 哈希密码
    fn hash_password(password: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(password.as_bytes());
        hasher.update(ENCRYPTION_SEED);
        format!("{:x}", hasher.finalize())
    }

    /// 验证密码
    fn verify_password(password: &str, hash: &str) -> bool {
        Self::hash_password(password) == hash
    }

    /// 生成加密密钥
    fn generate_key() -> [u8; 32] {
        let mut key = [0u8; 32];
        let seed_len = ENCRYPTION_SEED.len().min(32);
        key[..seed_len].copy_from_slice(&ENCRYPTION_SEED[..seed_len]);
        key
    }

    /// 加密数据
    pub fn encrypt_data(data: &str) -> Result<String, String> {
        let key = Self::generate_key();
        let cipher =
            Aes256Gcm::new_from_slice(&key).map_err(|e| format!("创建加密器失败: {:?}", e))?;

        let mut nonce_bytes = [0u8; 12];
        rand::thread_rng().fill(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let encrypted = cipher
            .encrypt(nonce, data.as_bytes())
            .map_err(|e| format!("加密失败: {:?}", e))?;

        let mut combined = Vec::new();
        combined.extend_from_slice(&nonce_bytes);
        combined.extend_from_slice(&encrypted);

        Ok(STANDARD.encode(&combined))
    }

    /// 解密数据
    pub fn decrypt_data(encrypted_str: &str) -> Result<String, String> {
        let key = Self::generate_key();
        let cipher =
            Aes256Gcm::new_from_slice(&key).map_err(|e| format!("创建解密器失败: {:?}", e))?;

        let combined = STANDARD
            .decode(encrypted_str)
            .map_err(|e| format!("Base64解码失败: {}", e))?;

        if combined.len() < 12 {
            return Err("数据格式错误".to_string());
        }

        let nonce = Nonce::from_slice(&combined[..12]);
        let encrypted_data = &combined[12..];

        let decrypted = cipher
            .decrypt(nonce, encrypted_data)
            .map_err(|e| format!("解密失败: {:?}", e))?;

        String::from_utf8(decrypted).map_err(|e| format!("UTF8解码失败: {}", e))
    }

    /// 创建新账号
    pub fn create_account(&mut self, username: &str, password: &str) -> Result<Account, String> {
        // 检查用户名是否已存在
        let accounts = self.list_accounts()?;
        if accounts.iter().any(|(_, name)| name == username) {
            return Err("用户名已存在".to_string());
        }

        let id = Self::generate_id();
        let now = Utc::now();
        let account = Account {
            id: id.clone(),
            username: username.to_string(),
            nickname: None,
            email: None,
            avatar: None,
            password_hash: Self::hash_password(password),
            created_at: now,
            last_login: Some(now),
            last_modified: now,
            is_active: true,
            settings: AccountSettings::default(),
            game_data: GameData::default(),
            statistics: UserStatistics::default(),
        };

        self.save_account(&account)?;
        self.current_account = Some(account.clone());
        Ok(account)
    }

    /// 登录账号
    pub fn login(&mut self, username: &str, password: &str) -> Result<LoginResponse, String> {
        let accounts = self.list_accounts()?;

        for (id, name) in accounts {
            if name == username {
                let account = self.load_account_internal(&id)?;
                if Self::verify_password(password, &account.password_hash) {
                    let mut updated_account = account.clone();
                    updated_account.last_login = Some(Utc::now());
                    updated_account.statistics.login_count += 1;

                    // 更新连续登录
                    if let Some(last_login) = account.last_login {
                        let days_since = (Utc::now() - last_login).num_days();
                        if days_since == 1 {
                            updated_account.statistics.current_streak += 1;
                            if updated_account.statistics.current_streak
                                > updated_account.statistics.longest_streak
                            {
                                updated_account.statistics.longest_streak =
                                    updated_account.statistics.current_streak;
                            }
                        } else if days_since > 1 {
                            updated_account.statistics.current_streak = 1;
                        }
                    } else {
                        updated_account.statistics.current_streak = 1;
                    }

                    self.save_account(&updated_account)?;
                    self.current_account = Some(updated_account.clone());

                    return Ok(LoginResponse {
                        success: true,
                        account: Some(updated_account),
                        message: "登录成功".to_string(),
                    });
                } else {
                    return Ok(LoginResponse {
                        success: false,
                        account: None,
                        message: "密码错误".to_string(),
                    });
                }
            }
        }

        Ok(LoginResponse {
            success: false,
            account: None,
            message: "账号不存在".to_string(),
        })
    }

    /// 加载账号（内部方法）
    fn load_account_internal(&self, account_id: &str) -> Result<Account, String> {
        let file_path = self.data_dir.join(format!("{}.json", account_id));
        let data =
            fs::read_to_string(&file_path).map_err(|e| format!("读取账号文件失败: {}", e))?;

        let account: Account =
            serde_json::from_str(&data).map_err(|e| format!("解析账号数据失败: {}", e))?;

        Ok(account)
    }

    /// 加载账号
    pub fn load_account(&mut self, account_id: &str) -> Result<Account, String> {
        let account = self.load_account_internal(account_id)?;
        self.current_account = Some(account.clone());
        Ok(account)
    }

    /// 获取当前账号
    pub fn get_current_account(&self) -> Option<Account> {
        self.current_account.clone()
    }

    /// 列出所有账号
    pub fn list_accounts(&self) -> Result<Vec<(String, String)>, String> {
        let mut accounts = Vec::new();

        if let Ok(entries) = fs::read_dir(&self.data_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("json") {
                    if let Ok(data) = fs::read_to_string(&path) {
                        if let Ok(account) = serde_json::from_str::<Account>(&data) {
                            accounts.push((account.id, account.username));
                        }
                    }
                }
            }
        }

        Ok(accounts)
    }

    /// 获取账号摘要列表
    pub fn list_account_summaries(&self) -> Result<Vec<AccountSummary>, String> {
        let mut summaries = Vec::new();

        if let Ok(entries) = fs::read_dir(&self.data_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("json") {
                    if let Ok(data) = fs::read_to_string(&path) {
                        if let Ok(account) = serde_json::from_str::<Account>(&data) {
                            let total_score = account.game_data.word_game.total_score
                                + account.game_data.sentence_game.total_score;
                            summaries.push(AccountSummary {
                                id: account.id,
                                username: account.username,
                                nickname: account.nickname,
                                avatar: account.avatar,
                                created_at: account.created_at,
                                last_login: account.last_login,
                                total_score,
                            });
                        }
                    }
                }
            }
        }

        // 按最后登录时间排序
        summaries.sort_by(|a, b| b.last_login.cmp(&a.last_login));
        Ok(summaries)
    }

    /// 保存账号
    fn save_account(&self, account: &Account) -> Result<(), String> {
        let file_path = self.data_dir.join(format!("{}.json", account.id));
        let data = serde_json::to_string_pretty(account)
            .map_err(|e| format!("序列化账号数据失败: {}", e))?;

        fs::write(&file_path, data).map_err(|e| format!("保存账号文件失败: {}", e))?;

        Ok(())
    }

    /// 更新账号信息
    pub fn update_account_info(
        &mut self,
        account_id: &str,
        request: UpdateAccountRequest,
    ) -> Result<Account, String> {
        let mut account = self.load_account_internal(account_id)?;

        if let Some(nickname) = request.nickname {
            account.nickname = if nickname.is_empty() {
                None
            } else {
                Some(nickname)
            };
        }
        if let Some(email) = request.email {
            account.email = if email.is_empty() { None } else { Some(email) };
        }
        if let Some(avatar) = request.avatar {
            account.avatar = if avatar.is_empty() {
                None
            } else {
                Some(avatar)
            };
        }

        account.last_modified = Utc::now();
        self.save_account(&account)?;

        if self
            .current_account
            .as_ref()
            .map(|a| a.id == account_id)
            .unwrap_or(false)
        {
            self.current_account = Some(account.clone());
        }

        Ok(account)
    }

    /// 修改密码
    pub fn change_password(
        &mut self,
        account_id: &str,
        request: ChangePasswordRequest,
    ) -> Result<(), String> {
        let mut account = self.load_account_internal(account_id)?;

        if !Self::verify_password(&request.old_password, &account.password_hash) {
            return Err("原密码错误".to_string());
        }

        account.password_hash = Self::hash_password(&request.new_password);
        account.last_modified = Utc::now();
        self.save_account(&account)?;

        if self
            .current_account
            .as_ref()
            .map(|a| a.id == account_id)
            .unwrap_or(false)
        {
            self.current_account = Some(account.clone());
        }

        Ok(())
    }

    /// 更新设置
    pub fn update_settings(
        &mut self,
        account_id: &str,
        settings: AccountSettings,
    ) -> Result<Account, String> {
        let mut account = self.load_account_internal(account_id)?;
        account.settings = settings;
        account.last_modified = Utc::now();
        self.save_account(&account)?;

        if self
            .current_account
            .as_ref()
            .map(|a| a.id == account_id)
            .unwrap_or(false)
        {
            self.current_account = Some(account.clone());
        }

        Ok(account)
    }

    /// 删除账号
    pub fn delete_account(&mut self, account_id: &str, password: &str) -> Result<(), String> {
        let account = self.load_account_internal(account_id)?;

        if !Self::verify_password(password, &account.password_hash) {
            return Err("密码错误".to_string());
        }

        let file_path = self.data_dir.join(format!("{}.json", account_id));
        fs::remove_file(&file_path).map_err(|e| format!("删除账号文件失败: {}", e))?;

        if self
            .current_account
            .as_ref()
            .map(|a| a.id == account_id)
            .unwrap_or(false)
        {
            self.current_account = None;
        }

        Ok(())
    }

    /// 更新游戏数据
    pub fn update_game_data(
        &mut self,
        account_id: &str,
        game_data: GameData,
    ) -> Result<(), String> {
        let mut account = self.load_account_internal(account_id)?;
        account.game_data = game_data;
        account.last_modified = Utc::now();
        self.save_account(&account)?;

        if self
            .current_account
            .as_ref()
            .map(|a| a.id == account_id)
            .unwrap_or(false)
        {
            self.current_account = Some(account.clone());
        }

        Ok(())
    }

    /// 导出账号
    pub fn export_account(&self, account_id: &str) -> Result<String, String> {
        let account = self.load_account_internal(account_id)?;

        let export_data = ExportData {
            version: "1.0.0".to_string(),
            export_time: Utc::now(),
            account,
        };

        let json = serde_json::to_string(&export_data)
            .map_err(|e| format!("序列化导出数据失败: {}", e))?;

        Self::encrypt_data(&json)
    }

    /// 导出当前账号
    pub fn export_current_account(&self) -> Result<String, String> {
        let account = self.current_account.as_ref().ok_or("没有当前账号")?;
        self.export_account(&account.id)
    }

    /// 导入账号
    pub fn import_account(&mut self, encrypted_data: &str) -> Result<Account, String> {
        let decrypted = Self::decrypt_data(encrypted_data)?;
        let export_data: ExportData =
            serde_json::from_str(&decrypted).map_err(|e| format!("解析导入数据失败: {}", e))?;

        // 检查版本兼容性
        if export_data.version != "1.0.0" {
            return Err(format!("不兼容的版本: {}", export_data.version));
        }

        let mut account = export_data.account;
        account.id = Self::generate_id(); // 生成新ID避免冲突
        account.created_at = Utc::now();
        account.last_login = Some(Utc::now());
        account.last_modified = Utc::now();

        self.save_account(&account)?;
        self.current_account = Some(account.clone());

        Ok(account)
    }
}

// 全局账号管理器实例
use std::sync::Mutex;

lazy_static::lazy_static! {
    static ref ACCOUNT_MANAGER: Mutex<Option<AccountManager>> = Mutex::new(None);
}

pub fn init_account_manager() -> Result<(), String> {
    let manager = AccountManager::new()?;
    let mut global = ACCOUNT_MANAGER.lock().map_err(|e| e.to_string())?;
    *global = Some(manager);
    Ok(())
}

pub fn get_account_manager(
) -> Result<std::sync::MutexGuard<'static, Option<AccountManager>>, String> {
    ACCOUNT_MANAGER.lock().map_err(|e| e.to_string())
}
