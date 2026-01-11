/* 单词闯关游戏 JavaScript 代码 */

/* ========== 游戏核心数据 ========== */
const ALL_EXPRESSIONS = [
    { eng: 'rules for having fun', chi: '娱乐规则' },
    { eng: 'traffic rules', chi: '交通规则' },
    { eng: 'in daily life', chi: '在日常生活中' },
    { eng: 'develop over time', chi: '随着时间演变' },
    { eng: 'vary across countries', chi: '因国家而异' },
    { eng: 'a common practice behavior or rule=norm', chi: '规范 普遍的行为惯例或规则' },
    { eng: 'a clear rule for quality or correctness=standard', chi: '标准 关于质量或正确性的明确规则' },
    { eng: 'a well-organized system=good order', chi: '良好的秩序' },
    { eng: 'a basis, the most important part that everything else needs=foundation', chi: '根基' },
    { eng: 'explore different types of rules', chi: '探索不同类型的规则' },
    { eng: 'follow the rules', chi: '遵守规则' },
    { eng: 'challenge the rules', chi: '质疑规则' },
    { eng: 'design new rules', chi: '制定新规则' },
    { eng: 'zebra crossing', chi: '斑马线' },
    { eng: 'break the rules', chi: '违反规则' },
    { eng: 'kick the seats', chi: '踢座位' },
    { eng: 'put your feet on seats', chi: '把脚放在座位上' },
    { eng: 'block the way; block the noise;', chi: '挡路 阻隔噪音' },
    { eng: 'clean up your litter', chi: '清理你的垃圾' },
    { eng: 'look after the children', chi: '照看孩子' },
    { eng: 'be quiet', chi: '保持安静' },
    { eng: 'eat smelly food', chi: '吃有异味的食物' },
    { eng: 'a quiet place', chi: '一个安静的地方' },
    { eng: 'play loud music', chi: '播放大声的音乐' },
    { eng: 'in surprise', chi: '惊讶地，吃惊地' },
    { eng: 'in order to/so as to/ to…', chi: '为了，以便' },
    { eng: 'feel angry/cross/mad/displeased; get annoyed turn as red as a tomato', chi: '感到生气/恼怒/愤怒/不悦/变得烦躁 气得满脸通红' },
    { eng: 'several packets of food', chi: '几包食物' },
    { eng: 'a mountain of blue cheese', chi: '一大堆蓝纹奶酪' },
    { eng: 'cover one\'s ears', chi: '捂住耳朵' },
    { eng: 'reduce the smell', chi: '减轻气味' },
    { eng: 'turn around', chi: '转过身' },
    { eng: 'the signs on the wall', chi: '墙上的标识' },
    { eng: 'feel brave', chi: '感到勇敢' },
    { eng: 'take a deep breath', chi: '深吸一口气' },
    { eng: 'clear one\'s throat', chi: '清嗓子' },
    { eng: 'responsibility', chi: '责任' },
    { eng: 'stand up to bad behavior', chi: '抵制不良行为' },
    { eng: 'make new rules', chi: '制定新规则' },
    { eng: 'a touching story', chi: '一个感人的故事' },
    { eng: 'pick up the pieces', chi: '收拾残局' },
    { eng: 'clean up the mess', chi: '清理杂乱' },
    { eng: 'say sorry to', chi: '向…道歉' },
    { eng: 'tell the truth', chi: '说实话' },
    { eng: 'spread some happiness', chi: '传递一些快乐' },
    { eng: 'see the kindness in small things', chi: '发现小事中的善意' },
    { eng: 'remind others', chi: '提醒他人' },
    { eng: 'keep public places clean and tidy', chi: '保持公共场所干净整洁' },
    { eng: 'make a difficult decision', chi: '做一个艰难的决定' },
    { eng: 'a famous line', chi: '一句名言' },
    { eng: 'the whole system of rules in a country or society', chi: '一个国家/社会的整套规则体系=law法律' },
    { eng: 'drive very fast', chi: '开得很快' },
    { eng: 'a very sick passenger', chi: '一位病重的乘客' },
    { eng: 'slow down', chi: '减速' },
    { eng: 'at once', chi: '立刻' },
    { eng: 'the information of the guests', chi: '客人的信息' },
    { eng: 'in some very special situations', chi: '在一些非常特殊的情况下' },
    { eng: 'have rules for a reason', chi: '制定规则是由原因的' },
    { eng: 'cause an accident', chi: '造成事故' },
    { eng: 'urgent situation', chi: '紧急情况' },
    { eng: 'cause harm', chi: '造成伤害' },
    { eng: 'have very bad effects', chi: '产生很坏的影响' },
    { eng: 'take part in a debate', chi: '参加辩论' },
    { eng: 'support your arguments', chi: '支持你的论点' },
    { eng: 'state your arguments', chi: '陈述你的论点' },
    { eng: 'in conclusion', chi: '总之' },
    { eng: 'post personal information', chi: '发布个人信息' },
    { eng: 'be aware of strangers', chi: '提防陌生人' },
    { eng: 'keep personal information private', chi: '保护个人信息隐私' },
    { eng: 'be careful with your posts', chi: '谨慎发布内容' },
    { eng: 'a piece of cake', chi: '小菜一碟' },
    { eng: 'chat face to face', chi: '面对面聊天' },
    { eng: 'get in touch with', chi: '与…取得联系' },
    { eng: 'stay safe', chi: '保持安全' },
    { eng: 'basic rules', chi: '基本规则' },
    { eng: 'bring risks', chi: '带来风险' },
    { eng: 'limit', chi: '限制' },
    { eng: 'ask for help', chi: '求助' },
    { eng: 'make enemies', chi: '树敌' },
    { eng: 'trusted friends', chi: '值得信任的朋友' },
    { eng: 'set a smart password', chi: '设置安全的密码' },
    { eng: 'find yourself in hot water', chi: '使自己陷入困境' },
    { eng: 'turn to your parents', chi: '向父母求助' },
    { eng: 'cyberbullying', chi: '网络欺凌' },
    { eng: 'social media', chi: '社交媒体' },
    { eng: 'protect online accounts', chi: '保护网络账号' },
    { eng: 'cut in line', chi: '插队' },
    { eng: 'share a touching story', chi: '分享一个感人的故事' },
    { eng: 'improve one\'s grades', chi: '提高成绩' },
    { eng: 'wear seat belts', chi: '系安全带' },
    { eng: 'wait in line', chi: '排队等候' },
    { eng: 'fall over', chi: '绊倒' },
    { eng: 'make great changes', chi: '发生巨大变化' }
];

/* ========== 游戏状态管理 ========== */
const GameState = {
    currentLevel: 1,
    levelStartTime: 0,
    gameStartTime: 0,
    selectedCard: null,
    matchedPairs: 0,
    totalPairs: 0,
    currentExpressions: [],
    mistakes: 0,
    totalScore: 0,
    levelScore: 0,
    playerName: '玩家',
    levels: 10,
    pairsPerLevel: 9,
    completedLevels: new Set(),
    levelRecords: {}, // 各关卡排行榜 {level: [{name, score, time, date}]}
    totalRecords: [],  // 总排行榜 [{name, totalScore, totalTime, levelsCompleted, date}]
    gameVersion: '1.3.0', // 游戏版本，用于数据兼容性检查
    encryptionSeed: "Ms.WuYYDS#2025UNIT5", // 加密种子
    timerInterval: null, // 计时器ID
    
    // 初始化
    init() {
        this.loadProgress();
        this.loadLeaderboards();
        
        // 如果没有玩家名称，提示输入
        if (!this.playerName || this.playerName === '玩家') {
            const name = prompt('请输入您的玩家名称（至少2个字符）：', this.playerName);
            if (name && name.trim().length >= 2) {
                this.playerName = name.trim();
                this.saveProgress();
            }
        }
        
        this.gameStartTime = Date.now();
    },
    
    // 保存进度
    saveProgress() {
        try {
            const data = {
                version: this.gameVersion,
                currentLevel: this.currentLevel,
                totalScore: this.totalScore,
                completedLevels: Array.from(this.completedLevels),
                playerName: this.playerName,
                saveTime: Date.now()
            };
            localStorage.setItem('wordGameProgress', JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('保存进度失败:', e);
            return false;
        }
    },
    
    // 加载进度
    loadProgress() {
        try {
            const data = JSON.parse(localStorage.getItem('wordGameProgress'));
            if (data && data.version) {
                this.currentLevel = data.currentLevel || 1;
                this.totalScore = data.totalScore || 0;
                this.completedLevels = new Set(data.completedLevels || []);
                this.playerName = data.playerName || '玩家';
                return true;
            }
        } catch (e) {
            console.warn('加载进度失败:', e);
        }
        return false;
    },
    
    // 保存排行榜
    saveLeaderboards() {
        try {
            localStorage.setItem('wordGameLevelRecords', JSON.stringify(this.levelRecords));
            localStorage.setItem('wordGameTotalRecords', JSON.stringify(this.totalRecords));
            return true;
        } catch (e) {
            console.warn('保存排行榜失败:', e);
            return false;
        }
    },
    
    // 加载排行榜
    loadLeaderboards() {
        try {
            this.levelRecords = JSON.parse(localStorage.getItem('wordGameLevelRecords')) || {};
            this.totalRecords = JSON.parse(localStorage.getItem('wordGameTotalRecords')) || [];
            return true;
        } catch (e) {
            console.warn('加载排行榜失败:', e);
            this.levelRecords = {};
            this.totalRecords = [];
            return false;
        }
    },
    
    // 清除所有数据
    clearAllData() {
        try {
            localStorage.removeItem('wordGameProgress');
            localStorage.removeItem('wordGameLevelRecords');
            localStorage.removeItem('wordGameTotalRecords');
            
            this.currentLevel = 1;
            this.totalScore = 0;
            this.completedLevels = new Set();
            this.levelRecords = {};
            this.totalRecords = [];
            
            return true;
        } catch (e) {
            console.warn('清除数据失败:', e);
            return false;
        }
    },
    
    // 添加关卡记录
    addLevelRecord(level, time, mistakes, score) {
        if (!this.levelRecords[level]) {
            this.levelRecords[level] = [];
        }
        
        const record = {
            name: this.playerName,
            level: level,
            score: score,
            time: parseFloat(time),
            mistakes: mistakes,
            date: Date.now(),
            recordId: this.generateRecordId()
        };
        
        this.levelRecords[level].push(record);
        this.levelRecords[level].sort((a, b) => b.score - a.score || a.time - b.time);
        
        // 只保留每个关卡前50名
        if (this.levelRecords[level].length > 50) {
            this.levelRecords[level] = this.levelRecords[level].slice(0, 50);
        }
        
        this.completedLevels.add(level);
        this.saveProgress();
        this.saveLeaderboards();
        
        return record;
    },
    
    // 添加总记录
    addTotalRecord(totalTime) {
        const record = {
            name: this.playerName,
            totalScore: this.totalScore,
            totalTime: parseFloat(totalTime),
            levelsCompleted: this.levels,
            date: Date.now(),
            recordId: this.generateRecordId()
        };
        
        this.totalRecords.push(record);
        this.totalRecords.sort((a, b) => b.totalScore - a.totalScore || a.totalTime - b.totalTime);
        
        if (this.totalRecords.length > 50) {
            this.totalRecords = this.totalRecords.slice(0, 50);
        }
        
        this.saveLeaderboards();
        return record;
    },
    
    // 生成唯一的记录ID
    generateRecordId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    // 获取关卡记录
    getLevelRecords(level) {
        return this.levelRecords[level] || [];
    },
    
    // 获取总记录
    getTotalRecords() {
        return this.totalRecords;
    },
    
    // 计算得分
    calculateScore(time, mistakes, pairs) {
        const baseScore = 100;
        const timePenalty = Math.min(time * 0.5, 30);
        const mistakePenalty = mistakes * 5;
        const bonus = pairs * 2;
        const score = Math.max(0, Math.round(baseScore - timePenalty - mistakePenalty + bonus));
        return score;
    },
    
    // 获取星级
    getStars(score) {
        if (score >= 90) return '⭐⭐⭐⭐⭐';
        if (score >= 70) return '⭐⭐⭐⭐';
        if (score >= 50) return '⭐⭐⭐';
        if (score >= 30) return '⭐⭐';
        return '⭐';
    },
    
    // 开始计时器
    startTimer() {
        // 清除已有计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // 启动新计时器
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 100);
    },
    
    // 停止计时器
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    // 更新计时器显示
    updateTimerDisplay() {
        const elapsed = (Date.now() - this.levelStartTime) / 1000;
        document.getElementById('time').textContent = elapsed.toFixed(3);
    }
};

/* ========== 数据加密解密功能 ========== */
const DataEncryptor = {
    // XOR加密
    xorEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    },
    
    // Base64编码
    base64Encode(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
                (match, p1) => String.fromCharCode('0x' + p1)));
        } catch (e) {
            return btoa(unescape(encodeURIComponent(str)));
        }
    },
    
    // Base64解码
    base64Decode(str) {
        try {
            return decodeURIComponent(atob(str).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        } catch (e) {
            return decodeURIComponent(escape(atob(str)));
        }
    },
    
    // 生成校验和
    generateChecksum(data) {
        const str = JSON.stringify(data);
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum = (sum + str.charCodeAt(i)) % 2147483647;
        }
        return sum.toString(16);
    },
    
    // 加密数据
    encryptData(data) {
        try {
            const jsonStr = JSON.stringify(data);
            const encrypted = this.xorEncrypt(jsonStr, GameState.encryptionSeed);
            return this.base64Encode(encrypted);
        } catch (e) {
            console.error('加密失败:', e);
            return null;
        }
    },
    
    // 解密数据
    decryptData(encryptedStr) {
        try {
            const decoded = this.base64Decode(encryptedStr);
            const decrypted = this.xorEncrypt(decoded, GameState.encryptionSeed);
            return JSON.parse(decrypted);
        } catch (e) {
            console.error('解密失败:', e);
            return null;
        }
    },
    
    // 导出加密数据
    exportEncryptedData() {
        const data = {
            version: GameState.gameVersion,
            playerName: GameState.playerName,
            totalScore: GameState.totalScore,
            currentLevel: GameState.currentLevel,
            completedLevels: Array.from(GameState.completedLevels),
            levelRecords: GameState.levelRecords,
            totalRecords: GameState.totalRecords,
            exportTime: Date.now()
        };
        
        const encrypted = this.encryptData(data);
        if (!encrypted) throw new Error('加密失败');
        
        return {
            content: encrypted,
            filename: `wordgame_${GameState.playerName}_${new Date().toISOString().slice(0, 10)}.yzgdatae`
        };
    },
    
    // 导出明文数据
    exportPlainData() {
        const data = {
            version: GameState.gameVersion,
            playerName: GameState.playerName,
            totalScore: GameState.totalScore,
            currentLevel: GameState.currentLevel,
            completedLevels: Array.from(GameState.completedLevels),
            levelRecords: GameState.levelRecords,
            totalRecords: GameState.totalRecords,
            exportTime: Date.now(),
            checksum: this.generateChecksum({
                totalScore: GameState.totalScore,
                currentLevel: GameState.currentLevel,
                completedLevels: Array.from(GameState.completedLevels)
            })
        };
        
        return {
            content: JSON.stringify(data, null, 2),
            filename: `wordgame_${GameState.playerName}_${new Date().toISOString().slice(0, 10)}.yzgdata`
        };
    },
    
    // 导入数据
    importData(content, isEncrypted) {
        try {
            let data;
            
            if (isEncrypted) {
                data = this.decryptData(content);
            } else {
                data = JSON.parse(content);
                
                // 验证校验和
                const checksum = this.generateChecksum({
                    totalScore: data.totalScore,
                    currentLevel: data.currentLevel,
                    completedLevels: data.completedLevels
                });
                
                if (checksum !== data.checksum) {
                    throw new Error('校验和不匹配，数据可能已损坏');
                }
            }
            
            // 版本兼容性检查
            if (!data.version || data.version < '1.0.0') {
                throw new Error('不支持的数据版本');
            }
            
            return data;
        } catch (e) {
            console.error('导入失败:', e);
            throw e;
        }
    }
};

/* ========== 游戏核心逻辑 ========== */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(text, type, data) {
    const card = document.createElement('div');
    card.className = `card ${type}`;
    card.textContent = text.replace(/;/g, '\n');
    card.dataset.text = text;
    card.dataset.type = type;
    card.dataset.eng = data.eng.toLowerCase();
    card.dataset.chi = data.chi;
    
    // 添加触摸和点击事件
    card.addEventListener('click', handleCardClick);
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleCardClick({ currentTarget: card });
    }, { passive: false });
    
    return card;
}

function handleCardClick(e) {
    const card = e.currentTarget;
    if (card.classList.contains('matched') || card.classList.contains('selected')) return;
    
    if (GameState.selectedCard) {
        const isMatch = checkMatch(GameState.selectedCard, card);
        if (isMatch) {
            matchCards(GameState.selectedCard, card);
            GameState.matchedPairs++;
            GameState.selectedCard = null;
            
            if (GameState.matchedPairs === GameState.totalPairs) {
                setTimeout(showCongrats, 600);
            }
        } else {
            handleMismatch(GameState.selectedCard, card);
        }
    } else {
        card.classList.add('selected');
        GameState.selectedCard = card;
    }
}

function checkMatch(card1, card2) {
    const type1 = card1.dataset.type, type2 = card2.dataset.type;
    return (type1 === 'english' && type2 === 'chinese' && card1.dataset.eng === card2.dataset.eng) ||
           (type1 === 'chinese' && type2 === 'english' && card1.dataset.eng === card2.dataset.eng);
}

function matchCards(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
}

function handleMismatch(card1, card2) {
    GameState.mistakes++;
    card1.classList.add('mismatch');
    card2.classList.add('mismatch');
    
    setTimeout(() => {
        card1.classList.remove('selected', 'mismatch');
        card2.classList.remove('mismatch');
        GameState.selectedCard = null;
        updateUI();
    }, 600);
}

function renderGame() {
    const container = document.getElementById('game');
    container.innerHTML = '';
    
    const cards = [];
    GameState.currentExpressions.forEach((expr) => {
        const engCard = createCard(expr.eng, 'english', expr);
        const chiCard = createCard(expr.chi, 'chinese', expr);
        cards.push(engCard, chiCard);
    });
    
    shuffle(cards).forEach(card => container.appendChild(card));
}

function startLevel(level) {
    if (level > GameState.levels) {
        endGame();
        return;
    }
    
    const startIdx = (level - 1) * GameState.pairsPerLevel;
    const endIdx = Math.min(startIdx + GameState.pairsPerLevel, ALL_EXPRESSIONS.length);
    GameState.currentExpressions = ALL_EXPRESSIONS.slice(startIdx, endIdx);
    GameState.totalPairs = GameState.currentExpressions.length;
    GameState.matchedPairs = 0;
    GameState.mistakes = 0;
    GameState.levelScore = 0;
    GameState.levelStartTime = Date.now();
    GameState.currentLevel = level;
    
    // 启动计时器
    GameState.startTimer();
    
    renderGame();
    updateUI();
    
    document.getElementById('level').textContent = level;
    document.getElementById('progress').textContent = `关卡 ${level}/${GameState.levels} | 总分: ${GameState.totalScore}`;
}

function showCongrats() {
    // 停止计时器
    GameState.stopTimer();
    
    const elapsed = (Date.now() - GameState.levelStartTime) / 1000;
    const score = GameState.calculateScore(elapsed, GameState.mistakes, GameState.totalPairs);
    GameState.levelScore = score;
    GameState.totalScore += score;
    
    // 添加记录
    const record = GameState.addLevelRecord(GameState.currentLevel, elapsed, GameState.mistakes, score);
    
    // 显示通关信息
    const congrats = document.createElement('div');
    congrats.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
        background: rgba(0,0,0,0.85); display: flex; flex-direction: column; 
        justify-content: center; align-items: center; z-index: 1002; 
        padding: 4vh; text-align: center;
    `;
    
    congrats.innerHTML = `
        <div style="font-size: clamp(1.8em, 5vw, 2.5em); margin-bottom: 2vh; color: #ffd700;">🎉 恭喜通关！</div>
        <div style="font-size: clamp(1.2em, 3.5vw, 1.5em); margin-bottom: 1vh; color: white;">第${GameState.currentLevel}关 完成！</div>
        <div style="font-size: clamp(1em, 3vw, 1.2em); margin-bottom: 2vh; color: #ddd; max-width: 90%;">
            用时: <span style="color: #3498db">${elapsed.toFixed(3)}秒</span> | 
            错误: <span style="color: #e74c3c">${GameState.mistakes}次</span><br>
            得分: <span style="color: #27ae60">${score}分</span> ${GameState.getStars(score)}
        </div>
        <div style="display: flex; gap: 2vw; margin-top: 3vh; flex-wrap: wrap; justify-content: center;">
            <button class="control-btn" onclick="nextLevel()" style="min-width: 120px;">
                ${GameState.currentLevel < GameState.levels ? '下一关' : '查看总榜'}
            </button>
            <button class="control-btn secondary" onclick="showLevelLeaderboard(${GameState.currentLevel})" style="min-width: 120px;">
                本关排行
            </button>
            <button class="control-btn warning" onclick="this.parentElement.parentElement.remove()" style="min-width: 120px;">
                继续游戏
            </button>
        </div>
    `;
    
    document.body.appendChild(congrats);
    
    updateUI();
    
    // 如果通关了最后一关
    if (GameState.currentLevel === GameState.levels) {
        const totalElapsed = (Date.now() - GameState.gameStartTime) / 1000;
        GameState.addTotalRecord(totalElapsed);
        
        setTimeout(() => {
            congrats.innerHTML = `
                <div style="font-size: clamp(1.8em, 5vw, 2.5em); margin-bottom: 2vh; color: #ffd700;">🏆 全关通关！</div>
                <div style="font-size: clamp(1.2em, 3.5vw, 1.5em); margin-bottom: 2vh; color: #ddd; max-width: 90%;">
                    <div style="margin-bottom: 1.5vh;">恭喜您完成所有关卡！</div>
                    <div style="background: rgba(255,255,255,0.1); padding: 2vh; border-radius: 10px; margin: 2vh 0;">
                        <div>总用时: <span style="color: #3498db">${totalElapsed.toFixed(3)}秒</span></div>
                        <div>总分: <span style="color: #27ae60">${GameState.totalScore}分</span></div>
                        <div>完成关卡: ${GameState.levels}关</div>
                    </div>
                </div>
                <div style="display: flex; gap: 2vw; margin-top: 3vh; flex-wrap: wrap; justify-content: center;">
                    <button class="control-btn success" onclick="showLeaderboard('total')" style="min-width: 150px;">
                        查看总排行榜
                    </button>
                    <button class="control-btn" onclick="showExportModal()" style="min-width: 150px;">
                        导出成绩
                    </button>
                    <button class="control-btn secondary" onclick="this.parentElement.parentElement.remove()" style="min-width: 150px;">
                        返回游戏
                    </button>
                </div>
            `;
        }, 1000);
    }
}

function nextLevel() {
    const congrats = document.querySelector('body > div[style*="position: fixed"]');
    if (congrats) congrats.remove();
    
    if (GameState.currentLevel < GameState.levels) {
        startLevel(GameState.currentLevel + 1);
    } else {
        showLeaderboard('total');
    }
}

function endGame() {
    alert(`🎮 游戏完成！最终得分: ${GameState.totalScore}`);
    GameState.currentLevel = 1;
    GameState.totalScore = 0;
    GameState.completedLevels.clear();
    GameState.saveProgress();
    startLevel(1);
}

function updateUI() {
    // 更新计时器显示
    GameState.updateTimerDisplay();
    
    // 更新其他UI元素
    document.getElementById('mistakes').textContent = GameState.mistakes;
    document.getElementById('levelScore').textContent = GameState.levelScore;
    document.getElementById('stars').textContent = GameState.getStars(GameState.levelScore);
    document.getElementById('totalScore').textContent = GameState.totalScore;
    document.getElementById('progress').textContent = `关卡 ${GameState.currentLevel}/${GameState.levels} | 总分: ${GameState.totalScore}`;
}

/* ========== 排行榜功能 ========== */
function showLeaderboard(initialTab = 'level1') {
    const panel = document.getElementById('leaderboardPanel');
    const tabsContainer = document.getElementById('leaderboardTabs');
    const contentContainer = document.getElementById('leaderboardContent');
    
    // 生成选项卡
    tabsContainer.innerHTML = '';
    contentContainer.innerHTML = '';
    
    // 添加关卡选项卡
    for (let i = 1; i <= GameState.levels; i++) {
        const tab = document.createElement('button');
        tab.className = `tab-btn ${initialTab === 'level' + i ? 'active' : ''}`;
        tab.textContent = `第${i}关`;
        tab.onclick = () => showLevelLeaderboard(i);
        tabsContainer.appendChild(tab);
    }
    
    // 添加总排行榜选项卡
    const totalTab = document.createElement('button');
    totalTab.className = `tab-btn ${initialTab === 'total' ? 'active' : ''}`;
    totalTab.textContent = '总排行榜';
    totalTab.onclick = () => showTotalLeaderboard();
    tabsContainer.appendChild(totalTab);
    
    // 显示初始内容
    if (initialTab === 'total') {
        showTotalLeaderboard();
    } else {
        const level = initialTab.replace('level', '');
        showLevelLeaderboard(parseInt(level));
    }
    
    panel.classList.add('active');
}

function showLevelLeaderboard(level) {
    const contentContainer = document.getElementById('leaderboardContent');
    const tabs = document.querySelectorAll('.tab-btn');
    
    // 更新选项卡状态
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[level - 1]?.classList.add('active');
    
    const records = GameState.getLevelRecords(level);
    
    if (records.length === 0) {
        contentContainer.innerHTML = `
            <li style="text-align: center; padding: 4vh; color: #7f8c8d;">
                暂无第${level}关记录<br>
                <small>成为第一个通关者！</small>
            </li>
        `;
        return;
    }
    
    contentContainer.innerHTML = '';
    records.slice(0, 20).forEach((record, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="name">${record.name}</div>
            <div class="score">${record.score}分</div>
            <div class="time">${record.time.toFixed(3)}s</div>
            <div class="level">错误:${record.mistakes}</div>
        `;
        contentContainer.appendChild(li);
    });
}

function showTotalLeaderboard() {
    const contentContainer = document.getElementById('leaderboardContent');
    const tabs = document.querySelectorAll('.tab-btn');
    
    // 更新选项卡状态
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[tabs.length - 1]?.classList.add('active');
    
    const records = GameState.getTotalRecords();
    
    if (records.length === 0) {
        contentContainer.innerHTML = `
            <li style="text-align: center; padding: 4vh; color: #7f8c8d;">
                暂无总排行榜记录<br>
                <small>完成所有关卡即可上榜！</small>
            </li>
        `;
        return;
    }
    
    contentContainer.innerHTML = '';
    records.slice(0, 20).forEach((record, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="name">${record.name}</div>
            <div class="score">${record.totalScore}分</div>
            <div class="time">${record.totalTime.toFixed(3)}s</div>
            <div class="level">${record.levelsCompleted}关</div>
        `;
        contentContainer.appendChild(li);
    });
}

function hideLeaderboard() {
    document.getElementById('leaderboardPanel').classList.remove('active');
}

/* ========== 关卡选择功能 ========== */
function showLevelSelect() {
    // 暂停当前计时器
    GameState.stopTimer();
    
    const modal = document.getElementById('levelModal');
    const grid = document.getElementById('levelGrid');
    
    grid.innerHTML = '';
    
    for (let i = 1; i <= GameState.levels; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = i;
        
        if (i === GameState.currentLevel) {
            btn.classList.add('current');
        } else if (GameState.completedLevels.has(i)) {
            btn.classList.add('completed');
        } else if (i > 1 && !GameState.completedLevels.has(i - 1)) {
            btn.classList.add('locked');
            btn.disabled = true;
        }
        
        btn.onclick = () => {
            if (!btn.classList.contains('locked')) {
                GameState.currentLevel = i;
                startLevel(i);
                hideLevelSelect();
                
                // 移除之前的通关信息
                const congrats = document.querySelector('body > div[style*="position: fixed"]');
                if (congrats) congrats.remove();
            }
        };
        
        grid.appendChild(btn);
    }
    
    modal.classList.add('active');
}

function hideLevelSelect() {
    document.getElementById('levelModal').classList.remove('active');
}

/* ========== 导入导出功能 ========== */
function showImportModal() {
    document.getElementById('importModal').classList.add('active');
    document.getElementById('importStatus').style.display = 'none';
}

function hideImportModal() {
    document.getElementById('importModal').classList.remove('active');
    document.getElementById('importFile').value = '';
}

function showExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function hideExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function downloadEncryptedData() {
    try {
        const data = DataEncryptor.exportEncryptedData();
        downloadFile(data.content, data.filename, 'application/octet-stream');
        hideExportModal();
        alert('✅ 加密数据导出成功！');
    } catch (e) {
        alert('❌ 导出失败: ' + e.message);
    }
}

function downloadPlainData() {
    try {
        const data = DataEncryptor.exportPlainData();
        downloadFile(data.content, data.filename, 'application/json');
        hideExportModal();
        alert('✅ 明文数据导出成功！');
    } catch (e) {
        alert('❌ 导出失败: ' + e.message);
    }
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function handleFileImport(file) {
    if (!file) return;
    
    const statusDiv = document.getElementById('importStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = `<p>正在处理文件: ${file.name}...</p>`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const isEncrypted = file.name.endsWith('.yzgdatae');
            
            statusDiv.innerHTML += '<p>正在解密/解析数据...</p>';
            
            const data = DataEncryptor.importData(content, isEncrypted);
            
            // 更新游戏状态
            GameState.playerName = data.playerName || '玩家';
            GameState.totalScore = data.totalScore || 0;
            GameState.currentLevel = data.currentLevel || 1;
            GameState.completedLevels = new Set(data.completedLevels || []);
            GameState.levelRecords = data.levelRecords || {};
            GameState.totalRecords = data.totalRecords || [];
            
            // 保存并更新UI
            GameState.saveProgress();
            GameState.saveLeaderboards();
            startLevel(GameState.currentLevel);
            
            statusDiv.innerHTML = `
                <p style="color: #27ae60; font-weight: bold;">✅ 导入成功！</p>
                <p>玩家: ${GameState.playerName}</p>
                <p>当前关卡: ${GameState.currentLevel}</p>
                <p>总分: ${GameState.totalScore}</p>
            `;
            
            setTimeout(hideImportModal, 3000);
        } catch (e) {
            statusDiv.innerHTML = `
                <p style="color: #e74c3c; font-weight: bold;">❌ 导入失败: ${e.message}</p>
                <p>请检查文件格式是否正确</p>
            `;
        }
    };
    
    reader.onerror = function() {
        statusDiv.innerHTML = `
            <p style="color: #e74c3c; font-weight: bold;">❌ 文件读取失败</p>
            <p>请重试或更换文件</p>
        `;
    };
    
    reader.readAsText(file);
}

/* ========== 清除数据功能 ========== */
function showClearDataModal() {
    document.getElementById('clearDataModal').classList.add('active');
}

function hideClearDataModal() {
    document.getElementById('clearDataModal').classList.remove('active');
}

function clearAllGameData() {
    if (confirm('确定要清除所有游戏数据吗？此操作不可撤销！')) {
        GameState.clearAllData();
        startLevel(1);
        hideClearDataModal();
        alert('✅ 所有游戏数据已清除！');
    }
}

/* ========== 初始化游戏 ========== */
window.onload = function() {
    GameState.init();
    startLevel(GameState.currentLevel);
};
