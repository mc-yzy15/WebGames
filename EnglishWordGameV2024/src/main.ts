// Word Game 主入口脚本
import { initAccountSystem } from "./account";

console.log("Word Game V2024 - Tauri Edition 已加载");

// 等待DOM加载完成
document.addEventListener("DOMContentLoaded", async () => {
  console.log("导航页面已加载");
  
  // 初始化账号系统
  await initAccountSystem();
  
  // 检查是否需要显示账号管理界面
  const accountSection = document.getElementById("account-section");
  if (accountSection) {
    await updateAccountUI();
  }
});

// 更新账号管理UI
async function updateAccountUI(): Promise<void> {
  const { getLoggedInAccount, listAccounts, createAccount, loadAccount, deleteAccount, exportAccountToFile, importAccountFromFile } = await import("./account");
  
  const accountSection = document.getElementById("account-section");
  if (!accountSection) return;
  
  const currentAccount = getLoggedInAccount();
  
  if (currentAccount) {
    // 已登录状态
    accountSection.innerHTML = `
      <div class="account-info">
        <h3>当前账号: ${currentAccount.username}</h3>
        <p>创建时间: ${new Date(currentAccount.created_at).toLocaleString()}</p>
        <div class="account-actions">
          <button id="btn-export" class="control-btn success">📤 导出账号</button>
          <button id="btn-logout" class="control-btn secondary">退出</button>
        </div>
      </div>
    `;
    
    document.getElementById("btn-export")?.addEventListener("click", async () => {
      try {
        await exportAccountToFile();
        alert("账号数据已导出！");
      } catch (error) {
        alert("导出失败: " + error);
      }
    });
    
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      location.reload();
    });
  } else {
    // 未登录状态 - 显示账号列表和创建选项
    try {
      const accounts = await listAccounts();
      
      let accountsHtml = "";
      if (accounts.length > 0) {
        accountsHtml = `
          <div class="accounts-list">
            <h4>选择账号:</h4>
            ${accounts.map(acc => `
              <div class="account-item" data-id="${acc.id}">
                <span class="account-name">${acc.username}</span>
                <div class="account-actions">
                  <button class="btn-load" data-id="${acc.id}">加载</button>
                  <button class="btn-delete" data-id="${acc.id}">删除</button>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
      
      accountSection.innerHTML = `
        <div class="account-login">
          <h3>账号管理</h3>
          ${accountsHtml}
          <div class="account-create">
            <h4>创建新账号:</h4>
            <input type="text" id="new-username" placeholder="输入用户名" maxlength="20">
            <button id="btn-create" class="control-btn">创建账号</button>
          </div>
          <div class="account-import">
            <h4>导入账号:</h4>
            <input type="file" id="import-file" accept=".yzdatae">
            <button id="btn-import" class="control-btn warning">📥 导入</button>
          </div>
        </div>
      `;
      
      // 绑定事件
      document.querySelectorAll(".btn-load").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = (e.target as HTMLElement).dataset.id;
          if (id) {
            try {
              await loadAccount(id);
              location.reload();
            } catch (error) {
              alert("加载账号失败: " + error);
            }
          }
        });
      });
      
      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = (e.target as HTMLElement).dataset.id;
          if (id && confirm("确定要删除这个账号吗？数据将无法恢复！")) {
            try {
              await deleteAccount(id);
              location.reload();
            } catch (error) {
              alert("删除账号失败: " + error);
            }
          }
        });
      });
      
      document.getElementById("btn-create")?.addEventListener("click", async () => {
        const input = document.getElementById("new-username") as HTMLInputElement;
        const username = input.value.trim();
        if (username) {
          try {
            await createAccount(username);
            location.reload();
          } catch (error) {
            alert("创建账号失败: " + error);
          }
        } else {
          alert("请输入用户名");
        }
      });
      
      document.getElementById("btn-import")?.addEventListener("click", async () => {
        const fileInput = document.getElementById("import-file") as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
          try {
            await importAccountFromFile(file);
            alert("账号导入成功！");
            location.reload();
          } catch (error) {
            alert("导入失败: " + error);
          }
        } else {
          alert("请选择要导入的文件");
        }
      });
      
    } catch (error) {
      console.error("加载账号列表失败:", error);
    }
  }
}
