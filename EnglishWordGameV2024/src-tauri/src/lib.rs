mod account;

use account::{get_account_manager, Account, GameData};
use serde::{Deserialize, Serialize};

// ========== 账号管理命令 ==========

/// 创建新账号
#[tauri::command]
fn create_account(username: String) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.create_account(&username)
}

/// 加载账号
#[tauri::command]
fn load_account(account_id: String) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.load_account(&account_id)
}

/// 获取当前账号
#[tauri::command]
fn get_current_account() -> Result<Option<Account>, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    Ok(manager.get_current_account().cloned())
}

/// 列出所有账号
#[tauri::command]
fn list_accounts() -> Result<Vec<(String, String)>, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.list_accounts()
}

/// 删除账号
#[tauri::command]
fn delete_account(account_id: String) -> Result<(), String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.delete_account(&account_id)
}

/// 更新游戏数据
#[tauri::command]
fn update_game_data(game_data: GameData) -> Result<(), String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;

    if let Some(mut account) = manager.get_current_account().cloned() {
        account.game_data = game_data;
        manager.update_account(account)
    } else {
        Err("没有当前账号".to_string())
    }
}

// ========== 数据导入导出命令 ==========

/// 导出账号数据（返回加密后的字符串）
#[tauri::command]
fn export_account_data(account_id: String) -> Result<String, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.export_account(&account_id)
}

/// 导入账号数据（传入加密字符串）
#[tauri::command]
fn import_account_data(encrypted_data: String) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.import_account(&encrypted_data)
}

/// 导出当前账号数据
#[tauri::command]
fn export_current_account() -> Result<String, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;

    if let Some(account) = manager.get_current_account() {
        manager.export_account(&account.id)
    } else {
        Err("没有当前账号".to_string())
    }
}

// ========== 加密工具命令 ==========

/// 加密任意数据
#[tauri::command]
fn encrypt_data(data: String) -> Result<String, String> {
    account::AccountManager::encrypt_data(&data)
}

/// 解密数据
#[tauri::command]
fn decrypt_data(encrypted_data: String) -> Result<String, String> {
    account::AccountManager::decrypt_data(&encrypted_data)
}

// ========== 应用程序入口 ==========

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // 账号管理
            create_account,
            load_account,
            get_current_account,
            list_accounts,
            delete_account,
            update_game_data,
            // 数据导入导出
            export_account_data,
            import_account_data,
            export_current_account,
            // 加密工具
            encrypt_data,
            decrypt_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
