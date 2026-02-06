use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use chrono::{DateTime, Utc};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

// 加密密钥种子
const ENCRYPTION_SEED: &[u8] = b"Ms.WuYYDS#2025WordGameV2024";

// 账号数据结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub username: String,
    pub created_at: DateTime<Utc>,
    pub last_login: Option<DateTime<Utc>>,
    pub game_data: GameData,
}

// 游戏数据
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GameData {
    // 单词游戏数据
    pub word_game: WordGameData,
    // 句子游戏数据
    pub sentence_game: SentenceGameData,
}

// 单词游戏数据
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

// 句子游戏数据
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

// 关卡记录
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

// 总记录
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

// 速通记录
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpeedrunRecord {
    pub name: String,
    pub total_time: f64,
    pub difficulty: String,
    pub levels_completed: i32,
    pub date: DateTime<Utc>,
    pub record_id: String,
}

// 导出数据结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportData {
    pub version: String,
    pub export_time: DateTime<Utc>,
    pub account: Account,
}

// 账号管理器
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

    // 生成加密密钥
    fn generate_key() -> [u8; 32] {
        let mut key = [0u8; 32];
        let seed_len = ENCRYPTION_SEED.len().min(32);
        key[..seed_len].copy_from_slice(&ENCRYPTION_SEED[..seed_len]);
        key
    }

    // 加密数据
    pub fn encrypt_data(data: &str) -> Result<String, String> {
        let key = Self::generate_key();
        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|e| format!("创建加密器失败: {:?}", e))?;

        let mut nonce_bytes = [0u8; 12];
        rand::thread_rng().fill(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let encrypted = cipher
            .encrypt(nonce, data.as_bytes())
            .map_err(|e| format!("加密失败: {:?}", e))?;

        // 组合 nonce 和加密数据
        let mut combined = Vec::new();
        combined.extend_from_slice(&nonce_bytes);
        combined.extend_from_slice(&encrypted);

        Ok(STANDARD.encode(&combined))
    }

    // 解密数据
    pub fn decrypt_data(encrypted_str: &str) -> Result<String, String> {
        let key = Self::generate_key();
        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|e| format!("创建解密器失败: {:?}", e))?;

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

    // 创建新账号
    pub fn create_account(&mut self, username: &str) -> Result<Account, String> {
        let id = Self::generate_id();
        let account = Account {
            id,
            username: username.to_string(),
            created_at: Utc::now(),
            last_login: Some(Utc::now()),
            game_data: GameData::default(),
        };

        self.save_account(&account)?;
        self.current_account = Some(account.clone());
        Ok(account)
    }

    // 加载账号
    pub fn load_account(&mut self, account_id: &str) -> Result<Account, String> {
        let file_path = self.data_dir.join(format!("{}.json", account_id));
        let data = fs::read_to_string(&file_path)
            .map_err(|e| format!("读取账号文件失败: {}", e))?;

        let mut account: Account =
            serde_json::from_str(&data).map_err(|e| format!("解析账号数据失败: {}", e))?;

        account.last_login = Some(Utc::now());
        self.save_account(&account)?;
        self.current_account = Some(account.clone());
        Ok(account)
    }

    // 保存账号
    fn save_account(&self, account: &Account) -> Result<(), String> {
        let file_path = self.data_dir.join(format!("{}.json", account.id));
        let data = serde_json::to_string_pretty(account)
            .map_err(|e| format!("序列化账号数据失败: {}", e))?;

        fs::write(&file_path, data).map_err(|e| format!("写入账号文件失败: {}", e))
    }

    // 获取当前账号
    pub fn get_current_account(&self) -> Option<&Account> {
        self.current_account.as_ref()
    }

    // 更新当前账号
    pub fn update_account(&mut self, account: Account) -> Result<(), String> {
        self.save_account(&account)?;
        self.current_account = Some(account);
        Ok(())
    }

    // 列出所有账号
    pub fn list_accounts(&self) -> Result<Vec<(String, String)>, String> {
        let mut accounts = Vec::new();

        for entry in fs::read_dir(&self.data_dir).map_err(|e| format!("读取目录失败: {}", e))? {
            let entry = entry.map_err(|e| format!("读取条目失败: {}", e))?;
            let path = entry.path();

            if path.extension().and_then(|s| s.to_str()) == Some("json") {
                if let Ok(data) = fs::read_to_string(&path) {
                    if let Ok(account) = serde_json::from_str::<Account>(&data) {
                        accounts.push((account.id, account.username));
                    }
                }
            }
        }

        Ok(accounts)
    }

    // 删除账号
    pub fn delete_account(&self, account_id: &str) -> Result<(), String> {
        let file_path = self.data_dir.join(format!("{}.json", account_id));
        fs::remove_file(&file_path).map_err(|e| format!("删除账号文件失败: {}", e))
    }

    // 导出账号数据（加密）
    pub fn export_account(&self, account_id: &str) -> Result<String, String> {
        let file_path = self.data_dir.join(format!("{}.json", account_id));
        let data = fs::read_to_string(&file_path)
            .map_err(|e| format!("读取账号文件失败: {}", e))?;

        let account: Account =
            serde_json::from_str(&data).map_err(|e| format!("解析账号数据失败: {}", e))?;

        let export_data = ExportData {
            version: "1.0.0".to_string(),
            export_time: Utc::now(),
            account,
        };

        let json_data = serde_json::to_string(&export_data)
            .map_err(|e| format!("序列化导出数据失败: {}", e))?;

        Self::encrypt_data(&json_data)
    }

    // 导入账号数据（解密）
    pub fn import_account(&mut self, encrypted_data: &str) -> Result<Account, String> {
        let decrypted = Self::decrypt_data(encrypted_data)?;
        let export_data: ExportData = serde_json::from_str(&decrypted)
            .map_err(|e| format!("解析导入数据失败: {}", e))?;

        // 验证版本
        if export_data.version != "1.0.0" {
            return Err(format!("不支持的版本: {}", export_data.version));
        }

        let account = export_data.account;
        self.save_account(&account)?;
        self.current_account = Some(account.clone());
        Ok(account)
    }

    // 生成唯一ID
    fn generate_id() -> String {
        let timestamp = Utc::now().timestamp_millis();
        let random: u32 = rand::thread_rng().gen();
        format!("{}_{:08x}", timestamp, random)
    }
}

// 全局账号管理器实例
use std::sync::Mutex;
use std::sync::OnceLock;

static ACCOUNT_MANAGER: OnceLock<Mutex<AccountManager>> = OnceLock::new();

pub fn get_account_manager() -> Result<&'static Mutex<AccountManager>, String> {
    ACCOUNT_MANAGER.get_or_try_init(|| {
        AccountManager::new().map(|manager| Mutex::new(manager))
    })
}
