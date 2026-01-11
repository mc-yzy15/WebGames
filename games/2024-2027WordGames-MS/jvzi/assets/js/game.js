/* 单词闯关游戏 JavaScript 代码 */

/* ========== 游戏核心数据 ========== */
const ALL_EXPRESSIONS = [
    {
        "eng": "Do not do to others what you do not want others to do to you.",
        "chi": "己所不欲，勿施于人。"
    },
    {
        "eng": "Here and there, over the grass, stand beautiful flowers, like stars.",
        "chi": "草地上到处都是漂亮的花朵，像星星一样散落其中。"
    },
    {
        "eng": "Since then, he hasn\’t seen a child there.",
        "chi": "从那以后，他再也没在花园里见过一个孩子。"
    },
    {
        "eng": "I haven\’t heard that beautiful birdsong for a while.",
        "chi": "我已经有段时间没听过如此美妙的鸟鸣了。"
    },
    {
        "eng": "The trees are so glad that they have covered themselves with flowers.",
        "chi": "树木们开心得满身都开满了花。"
    },
    {
        "eng": "Its story started back in the Qing Dynasty.",
        "chi": "它的故事始于清朝。"
    },
    {
        "eng": "In return, they decided to do the same thing.",
        "chi": "作为回报，他们决定如法炮制。"
    },
    {
        "eng": "Hundreds of years have passed since then, and the lane is still there.",
        "chi": "数百年光阴流转，古巷依然静立。"
    },
    {
        "eng": "After reading it, the Zhang family felt ashamed.",
        "chi": "读毕，张氏族人感到羞愧难当。"
    },
    {
        "eng": "They couldn\’t reach an agreement.",
        "chi": "他们无法达成一致。"
    },
    {
        "eng": "My anger grew. My face turned as red as a tomato.",
        "chi": "我越来越生气。我的脸变得像番茄一样红。"
    },
    {
        "eng": "I covered my nose so as to reduce the smell coming from Mr Smelly Food.",
        "chi": "我捂住鼻子，以减少臭味先生的气味。"
    },
    {
        "eng": "I went to a quiet area in order to read.",
        "chi": "为了读书，我去了一节安静的车厢。"
    },
    {
        "eng": "The rules aren\’t just on the wall but also in our minds and hearts.",
        "chi": "规则不仅写在墙上，更存在于我们的脑海和心中。"
    },
    {
        "eng": "Rules are there for us to follow!",
        "chi": "规则存在就是为了让我们去遵守的！"
    },
    {
        "eng": "Remember that behaving badly online has costs.",
        "chi": "记住，网上的不良行为是有代价的。"
    },
    {
        "eng": "If you find yourself in hot water, don\’t answer any bad messages.",
        "chi": "如果你陷入困境，不要回复任何不良信息。"
    },
    {
        "eng": "Avoid posting personal information online.",
        "chi": "避免在网上发布个人信息。"
    },
    {
        "eng": "We get in touch with anyone with just one click. But the internet has also brought new risks.",
        "chi": "我们只需轻轻一点就能联系到任何人。但互联网也带来了新的风险。"
    },
    {
        "eng": "Here are the basic rules you need to know to stay safe online.",
        "chi": "以下是你需要了解的基本规则，以确保在线安全。"
    },
    {
        "eng": "I have seen the film. I don\’t want to see it again.",
        "chi": "这部电影我已经看过了，不想再看了。"
    },
    {
        "eng": "I have entered lots of competitions.",
        "chi": "我参加过很多比赛。"
    },
    {
        "eng": "Have you ever won any prizes before?",
        "chi": "你以前得过奖吗？"
    },
    {
        "eng": "My aunt has travelled all over the world.",
        "chi": "我姑姑已经周游了世界。"
    },
    {
        "eng": "Many people have agreed to help us.",
        "chi": "许多人都同意帮助我们。"
    },
    {
        "eng": "Instead of looking away, Maddie studied my face.",
        "chi": "Maddie没有挪开视线，反而仔细地看着我的脸。"
    },
    {
        "eng": "Nothing is impossible as long as you try and stick to it.",
        "chi": "只要你尝试并坚持下去，没有什么是不可能的。"
    },
    {
        "eng": "On crowded buses and trains, it felt just like a disaster.",
        "chi": "在拥挤的公交车和火车上，感觉就像灾难。"
    },
    {
        "eng": "When I got home, I rushed to the bathroom and looked in the mirror.",
        "chi": "当我到家的时候，我冲进浴室照镜子。"
    },
    {
        "eng": "Su fought his fears and became a sporting hero.",
        "chi": "苏战胜了恐惧，成为了一名体育英雄。"
    },
    {
        "eng": "It\’s amazing to see my family.",
        "chi": "能见到家人，真是太令人开心了。"
    },
    {
        "eng": "I have been back in the UK for three days.",
        "chi": "我回到英国已经三年了。"
    },
    {
        "eng": "It feels like a century.",
        "chi": "感觉像是过了一个世纪。（度日如年）"
    },
    {
        "eng": "It took forever to find a bike.",
        "chi": "找辆自行车可真费劲，耗了老半天。"
    },
    {
        "eng": "I was so tired that I gave up on cooking.",
        "chi": "我太累了，干脆不做饭了。"
    },
    {
        "eng": "I am looking forward to going back to China.",
        "chi": "我满心期待能回到中国。"
    },
    {
        "eng": "The food was stone-cold.",
        "chi": "饭菜彻底凉透。"
    },
    {
        "eng": "We should use the digital technology wisely.",
        "chi": "我们得明智（合理）地运用数字技术。"
    },
    {
        "eng": "I am afraid I have to disagree.",
        "chi": "恐怕我不能苟同。"
    },
    {
        "eng": "I ordered food through an app.",
        "chi": "我通过软件点了外卖。"
    },
    {
        "eng": "It was strange to read the words.",
        "chi": "阅读这些文字的时候，让人有一种奇怪的感觉。"
    },
    {
        "eng": "What\’s worse, children like her grow quickly and need new arms all the time.",
        "chi": "更糟糕的是，像她这样的孩子长得快，需要一直更换新的假肢。"
    },
    {
        "eng": "Last month, Lily decided to design a new cup to help her grandpa.",
        "chi": "上个月，Lily决定设计一个新杯子来帮助她的爷爷。"
    },
    {
        "eng": "Instead of being created on purpose, some inventions are created completely by accident.",
        "chi": "有些发明创造并非有意为之，而是完全出于偶然。"
    },
    {
        "eng": "Today, penicillin is one of the most used medicines in the world.",
        "chi": "如今，盘尼西林（penicillin）是世界上最常用的药品之一。"
    },
    {
        "eng": "His curiosity led him to invent the lightning rod.",
        "chi": "他的好奇心驱使他发明了避雷针。"
    },
    {
        "eng": "Zhang Heng spent years studying the sky and the earth.",
        "chi": "张衡花费数年研究天文地理。"
    },
    {
        "eng": "Her achievements continue to influence scientists today.",
        "chi": "她的成就依旧影响着现代的科学家们。"
    },
    {
        "eng": "In the past years, he always tried to improve his work.",
        "chi": "过去的几年里，他一直努力改进他的作品。"
    },
    {
        "eng": "Because of Parkinson\’s disease, the old man keeps knocking his drinks over.",
        "chi": "因为帕金森，这个老人一直打翻他的水。"
    },
    {
        "eng": "In my life, I enjoy fixing problems one after another.",
        "chi": "生活中，我很享受解决一个又一个的问题。"
    }
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
    reader.onload = function (e) {
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

    reader.onerror = function () {
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
window.onload = function () {
    GameState.init();
    startLevel(GameState.currentLevel);
};
