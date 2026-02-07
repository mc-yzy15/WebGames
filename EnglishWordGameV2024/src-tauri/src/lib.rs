mod account;

use account::{
    get_account_manager, init_account_manager, Account, AccountSettings, AccountSummary,
    ChangePasswordRequest, GameData, LoginRequest, LoginResponse, UpdateAccountRequest,
};

// ========== 账号认证命令 ==========

/// 创建新账号（带密码）
#[tauri::command]
fn create_account(username: String, password: String) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.create_account(&username, &password)
}

/// 登录账号
#[tauri::command]
fn login(request: LoginRequest) -> Result<LoginResponse, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.login(&request.username, &request.password)
}

/// 登出当前账号
#[tauri::command]
fn logout() -> Result<(), String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    // 清除当前账号
    manager.current_account = None;
    Ok(())
}

/// 加载账号（无需密码，用于切换）
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

/// 列出所有账号（仅ID和用户名）
#[tauri::command]
fn list_accounts() -> Result<Vec<(String, String)>, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.list_accounts()
}

/// 获取账号摘要列表（包含头像等信息）
#[tauri::command]
fn list_account_summaries() -> Result<Vec<AccountSummary>, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.list_account_summaries()
}

// ========== 账号信息管理命令 ==========

/// 更新账号信息（昵称、邮箱、头像）
#[tauri::command]
fn update_account_info(account_id: String, request: UpdateAccountRequest) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.update_account_info(&account_id, request)
}

/// 修改密码
#[tauri::command]
fn change_password(account_id: String, request: ChangePasswordRequest) -> Result<(), String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.change_password(&account_id, request)
}

/// 更新账号设置
#[tauri::command]
fn update_settings(account_id: String, settings: AccountSettings) -> Result<Account, String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.update_settings(&account_id, settings)
}

/// 删除账号（需要密码验证）
#[tauri::command]
fn delete_account(account_id: String, password: String) -> Result<(), String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.delete_account(&account_id, &password)
}

// ========== 游戏数据命令 ==========

/// 更新游戏数据
#[tauri::command]
fn update_game_data(account_id: String, game_data: GameData) -> Result<(), String> {
    let manager = get_account_manager()?;
    let mut manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    manager.update_game_data(&account_id, game_data)
}

/// 获取账号统计信息
#[tauri::command]
fn get_account_statistics(account_id: String) -> Result<account::UserStatistics, String> {
    let manager = get_account_manager()?;
    let manager = manager.lock().map_err(|e| format!("锁定失败: {}", e))?;
    let account = manager.load_account_internal(&account_id)?;
    Ok(account.statistics)
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
    manager.export_current_account()
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
    // 初始化账号管理器
    if let Err(e) = init_account_manager() {
        eprintln!("初始化账号管理器失败: {}", e);
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // 账号认证
            create_account,
            login,
            logout,
            load_account,
            get_current_account,
            list_accounts,
            list_account_summaries,
            // 账号信息管理
            update_account_info,
            change_password,
            update_settings,
            delete_account,
            // 游戏数据
            update_game_data,
            get_account_statistics,
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
