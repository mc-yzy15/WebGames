// 账号管理页面逻辑
import {
  checkTauriEnvironment,
  initAccountSystem,
  login,
  createAccount,
  logout,
  getCurrentAccount,
  updateAccountInfo,
  changePassword,
  updateSettings,
  deleteAccount,
  exportAccountToFile,
  importAccountFromFile,
  listAccountSummaries,
  loadAccount,
  getLoggedInAccount,
  formatDate,
  formatDuration,
  generateDefaultAvatar,
  getDefaultSettings,
  Account,
  AccountSettings,
} from "./account";

// 全局状态
let currentAccount: Account | null = null;

// DOM 加载完成后初始化
document.addEventListener("DOMContentLoaded", async () => {
  console.log("账号管理页面已加载");
  
  // 检查环境
  const isTauri = checkTauriEnvironment();
  if (!isTauri) {
    showBrowserWarning();
    return;
  }
  
  // 初始化账号系统
  await initAccountSystem();
  
  // 检查登录状态
  const account = await getCurrentAccount();
  if (account) {
    currentAccount = account;
    showDashboard();
  } else {
    showAuthSection();
  }
  
  // 绑定事件
  bindEvents();
});

// 显示浏览器警告
function showBrowserWarning(): void {
  const warning = document.getElementById("browser-warning");
  if (warning) {
    warning.style.display = "block";
  }
  document.getElementById("auth-section")!.style.display = "none";
}

// 显示登录/注册区域
function showAuthSection(): void {
  document.getElementById("auth-section")!.style.display = "grid";
  document.getElementById("dashboard")!.classList.remove("active");
}

// 显示账号面板
function showDashboard(): void {
  if (!currentAccount) return;
  
  document.getElementById("auth-section")!.style.display = "none";
  document.getElementById("dashboard")!.classList.add("active");
  
  // 更新用户信息
  updateUserInfo();
  
  // 更新统计
  updateStatistics();
  
  // 加载设置
  loadSettings();
  
  // 加载其他账号
  loadOtherAccounts();
}

// 更新用户信息显示
function updateUserInfo(): void {
  if (!currentAccount) return;
  
  // 头像
  const avatarImg = document.getElementById("user-avatar") as HTMLImageElement;
  if (currentAccount.avatar) {
    avatarImg.src = currentAccount.avatar;
  } else {
    avatarImg.src = generateDefaultAvatar(currentAccount.username);
  }
  
  // 用户名和昵称
  const displayName = currentAccount.nickname || currentAccount.username;
  document.getElementById("user-name")!.textContent = displayName;
  
  // 邮箱
  const emailEl = document.getElementById("user-email")!;
  if (currentAccount.email) {
    emailEl.textContent = currentAccount.email;
  } else {
    emailEl.textContent = "邮箱未设置";
    emailEl.style.color = "#999";
  }
  
  // 创建时间
  document.getElementById("user-created")!.textContent = 
    `创建于: ${formatDate(currentAccount.created_at)}`;
  
  // 填充表单
  (document.getElementById("edit-nickname") as HTMLInputElement).value = 
    currentAccount.nickname || "";
  (document.getElementById("edit-email") as HTMLInputElement).value = 
    currentAccount.email || "";
}

// 更新统计信息
function updateStatistics(): void {
  if (!currentAccount) return;
  
  const stats = currentAccount.statistics;
  const wordScore = currentAccount.game_data.word_game.total_score;
  const sentenceScore = currentAccount.game_data.sentence_game.total_score;
  const totalScore = wordScore + sentenceScore;
  
  document.getElementById("stat-score")!.textContent = totalScore.toString();
  document.getElementById("stat-games")!.textContent = stats.total_games_played.toString();
  document.getElementById("stat-time")!.textContent = formatDuration(stats.total_play_time);
  document.getElementById("stat-streak")!.textContent = stats.current_streak.toString();
}

// 加载设置到表单
function loadSettings(): void {
  if (!currentAccount) return;
  
  const settings = currentAccount.settings;
  
  (document.getElementById("setting-theme") as HTMLSelectElement).value = 
    settings.theme || "auto";
  (document.getElementById("setting-language") as HTMLSelectElement).value = 
    settings.language || "zh-CN";
  (document.getElementById("setting-sound") as HTMLInputElement).checked = 
    settings.sound_enabled !== false;
  (document.getElementById("setting-music") as HTMLInputElement).checked = 
    settings.music_enabled !== false;
  (document.getElementById("setting-autosave") as HTMLInputElement).checked = 
    settings.auto_save !== false;
  (document.getElementById("setting-notifications") as HTMLInputElement).checked = 
    settings.show_notifications !== false;
}

// 加载其他账号列表
async function loadOtherAccounts(): Promise<void> {
  const container = document.getElementById("other-accounts")!;
  
  try {
    const accounts = await listAccountSummaries();
    const otherAccounts = accounts.filter(a => a.id !== currentAccount?.id);
    
    if (otherAccounts.length === 0) {
      container.innerHTML = `<p style="color: #666;">没有其他账号</p>`;
      return;
    }
    
    container.innerHTML = otherAccounts.map(acc => `
      <div class="account-item">
        <img src="${acc.avatar || generateDefaultAvatar(acc.username)}" alt="" class="avatar">
        <div class="info">
          <h4>${acc.nickname || acc.username}</h4>
          <p>总分: ${acc.total_score} | 创建于: ${formatDate(acc.created_at)}</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary btn-small" onclick="switchAccount('${acc.id}')">切换</button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML = `<p style="color: #e74c3c;">加载失败: ${error}</p>`;
  }
}

// 切换账号
async function switchAccount(accountId: string): Promise<void> {
  try {
    await loadAccount(accountId);
    currentAccount = getLoggedInAccount();
    showDashboard();
    showMessage("账号切换成功", "success");
  } catch (error) {
    showMessage(`切换失败: ${error}`, "error");
  }
}

// 绑定所有事件
function bindEvents(): void {
  // 标签页切换
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabId = (tab as HTMLElement).dataset.tab;
      
      // 切换标签页样式
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      // 切换内容
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.getElementById(`tab-${tabId}`)!.classList.add("active");
    });
  });
  
  // 登录表单
  document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = (document.getElementById("login-username") as HTMLInputElement).value;
    const password = (document.getElementById("login-password") as HTMLInputElement).value;
    
    try {
      const response = await login(username, password);
      if (response.success) {
        currentAccount = response.account;
        showDashboard();
        showMessage("登录成功！", "success");
      } else {
        showMessage(response.message, "error");
      }
    } catch (error) {
      showMessage(`登录失败: ${error}`, "error");
    }
  });
  
  // 注册表单
  document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = (document.getElementById("register-username") as HTMLInputElement).value;
    const password = (document.getElementById("register-password") as HTMLInputElement).value;
    const confirmPassword = (document.getElementById("register-password-confirm") as HTMLInputElement).value;
    
    if (password !== confirmPassword) {
      showMessage("两次输入的密码不一致", "error");
      return;
    }
    
    if (password.length < 6) {
      showMessage("密码长度至少6位", "error");
      return;
    }
    
    try {
      const account = await createAccount(username, password);
      currentAccount = account;
      showDashboard();
      showMessage("账号创建成功！", "success");
    } catch (error) {
      showMessage(`创建失败: ${error}`, "error");
    }
  });
  
  // 密码强度检测
  document.getElementById("register-password")?.addEventListener("input", (e) => {
    const password = (e.target as HTMLInputElement).value;
    const strengthBar = document.getElementById("password-strength-bar")!;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.className = "password-strength-bar";
    if (strength <= 2) {
      strengthBar.classList.add("weak");
    } else if (strength <= 4) {
      strengthBar.classList.add("medium");
    } else {
      strengthBar.classList.add("strong");
    }
  });
  
  // 头像上传
  document.getElementById("avatar-input")?.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file || !currentAccount) return;
    
    // 检查文件大小（最大 2MB）
    if (file.size > 2 * 1024 * 1024) {
      showMessage("图片大小不能超过 2MB", "error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        await updateAccountInfo(currentAccount!.id, { avatar: base64 });
        currentAccount!.avatar = base64;
        updateUserInfo();
        showMessage("头像更新成功", "success");
      } catch (error) {
        showMessage(`更新失败: ${error}`, "error");
      }
    };
    reader.readAsDataURL(file);
  });
  
  // 个人资料表单
  document.getElementById("profile-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentAccount) return;
    
    const nickname = (document.getElementById("edit-nickname") as HTMLInputElement).value;
    const email = (document.getElementById("edit-email") as HTMLInputElement).value;
    
    try {
      await updateAccountInfo(currentAccount.id, {
        nickname: nickname || undefined,
        email: email || undefined,
      });
      currentAccount.nickname = nickname || null;
      currentAccount.email = email || null;
      updateUserInfo();
      showMessage("个人资料已更新", "success");
    } catch (error) {
      showMessage(`更新失败: ${error}`, "error");
    }
  });
  
  // 设置表单
  document.getElementById("settings-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentAccount) return;
    
    const settings: AccountSettings = {
      theme: (document.getElementById("setting-theme") as HTMLSelectElement).value,
      language: (document.getElementById("setting-language") as HTMLSelectElement).value,
      sound_enabled: (document.getElementById("setting-sound") as HTMLInputElement).checked,
      music_enabled: (document.getElementById("setting-music") as HTMLInputElement).checked,
      auto_save: (document.getElementById("setting-autosave") as HTMLInputElement).checked,
      show_notifications: (document.getElementById("setting-notifications") as HTMLInputElement).checked,
    };
    
    try {
      await updateSettings(currentAccount.id, settings);
      currentAccount.settings = settings;
      showMessage("设置已保存", "success");
    } catch (error) {
      showMessage(`保存失败: ${error}`, "error");
    }
  });
  
  // 修改密码表单
  document.getElementById("password-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentAccount) return;
    
    const oldPassword = (document.getElementById("old-password") as HTMLInputElement).value;
    const newPassword = (document.getElementById("new-password") as HTMLInputElement).value;
    const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
    
    if (newPassword !== confirmPassword) {
      showMessage("两次输入的新密码不一致", "error");
      return;
    }
    
    if (newPassword.length < 6) {
      showMessage("新密码长度至少6位", "error");
      return;
    }
    
    try {
      await changePassword(currentAccount.id, oldPassword, newPassword);
      showMessage("密码修改成功", "success");
      (document.getElementById("password-form") as HTMLFormElement).reset();
    } catch (error) {
      showMessage(`修改失败: ${error}`, "error");
    }
  });
  
  // 退出登录
  document.getElementById("btn-logout")?.addEventListener("click", async () => {
    try {
      await logout();
      currentAccount = null;
      showAuthSection();
      showMessage("已退出登录", "success");
    } catch (error) {
      showMessage(`退出失败: ${error}`, "error");
    }
  });
  
  // 删除账号
  document.getElementById("btn-delete-account")?.addEventListener("click", async () => {
    if (!currentAccount) return;
    
    const password = prompt("请输入密码以确认删除账号（此操作不可恢复）：");
    if (!password) return;
    
    if (!confirm("确定要删除此账号吗？所有数据将被永久删除！")) {
      return;
    }
    
    try {
      await deleteAccount(currentAccount.id, password);
      currentAccount = null;
      showAuthSection();
      showMessage("账号已删除", "success");
    } catch (error) {
      showMessage(`删除失败: ${error}`, "error");
    }
  });
  
  // 导出账号
  document.getElementById("btn-export")?.addEventListener("click", async () => {
    if (!currentAccount) return;
    
    try {
      await exportAccountToFile();
      showMessage("账号数据已导出", "success");
    } catch (error) {
      showMessage(`导出失败: ${error}`, "error");
    }
  });
  
  // 导入账号
  document.getElementById("btn-import")?.addEventListener("click", async () => {
    const fileInput = document.getElementById("import-file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    
    if (!file) {
      showMessage("请选择要导入的文件", "error");
      return;
    }
    
    try {
      await importAccountFromFile(file);
      showMessage("账号导入成功", "success");
      // 刷新当前账号
      currentAccount = getLoggedInAccount();
      showDashboard();
    } catch (error) {
      showMessage(`导入失败: ${error}`, "error");
    }
  });
  
  // 文件拖拽
  const fileLabel = document.querySelector(".file-input-label");
  if (fileLabel) {
    fileLabel.addEventListener("dragover", (e) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).style.borderColor = "#667eea";
      (e.currentTarget as HTMLElement).style.background = "#f0f0f0";
    });
    
    fileLabel.addEventListener("dragleave", (e) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).style.borderColor = "#ccc";
      (e.currentTarget as HTMLElement).style.background = "transparent";
    });
    
    fileLabel.addEventListener("drop", (e) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).style.borderColor = "#ccc";
      (e.currentTarget as HTMLElement).style.background = "transparent";
      
      const files = (e as DragEvent).dataTransfer?.files;
      if (files && files.length > 0) {
        (document.getElementById("import-file") as HTMLInputElement).files = files;
      }
    });
  }
}

// 显示消息
function showMessage(message: string, type: "success" | "error"): void {
  const messageEl = document.getElementById("message")!;
  messageEl.textContent = message;
  messageEl.className = `message ${type} show`;
  
  setTimeout(() => {
    messageEl.classList.remove("show");
  }, 3000);
}

// 将 switchAccount 暴露到全局
declare global {
  interface Window {
    switchAccount: (accountId: string) => Promise<void>;
  }
}

window.switchAccount = switchAccount;
