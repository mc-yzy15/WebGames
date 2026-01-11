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
    difficulty: 'normal', // 难度：easy, normal, hard
    difficulties: {
        easy: {
            pairsPerLevel: 6,
            maxMistakes: Infinity, // 无限容错
            timeFactor: 0.3 // 时间惩罚系数
        },
        normal: {
            pairsPerLevel: 9,
            maxMistakes: 3,
            timeFactor: 0.5
        },
        hard: {
            pairsPerLevel: 12,
            maxMistakes: 1,
            timeFactor: 0.8
        }
    },
    completedLevels: new Set(),
    levelRecords: {}, // 各关卡排行榜 {difficulty: {level: [{name, score, time, date}]}}
    totalRecords: {}, // 总排行榜 {difficulty: [{name, totalScore, totalTime, levelsCompleted, date}]}
    speedrunRecords: [], // 速通榜 [{name, totalTime, difficulty, date}]
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
                difficulty: this.difficulty,
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
                this.difficulty = data.difficulty || 'normal';
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
            localStorage.setItem('wordGameSpeedrunRecords', JSON.stringify(this.speedrunRecords));
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
            this.totalRecords = JSON.parse(localStorage.getItem('wordGameTotalRecords')) || {};
            this.speedrunRecords = JSON.parse(localStorage.getItem('wordGameSpeedrunRecords')) || [];
            return true;
        } catch (e) {
            console.warn('加载排行榜失败:', e);
            this.levelRecords = {};
            this.totalRecords = {};
            this.speedrunRecords = [];
            return false;
        }
    },

    // 清除所有数据
    clearAllData() {
        try {
            localStorage.removeItem('wordGameProgress');
            localStorage.removeItem('wordGameLevelRecords');
            localStorage.removeItem('wordGameTotalRecords');
            localStorage.removeItem('wordGameSpeedrunRecords');

            this.currentLevel = 1;
            this.totalScore = 0;
            this.completedLevels = new Set();
            this.levelRecords = {};
            this.totalRecords = {};
            this.speedrunRecords = [];

            return true;
        } catch (e) {
            console.warn('清除数据失败:', e);
            return false;
        }
    },

    // 添加关卡记录
    addLevelRecord(level, time, mistakes, score) {
        // 确保难度分类存在
        if (!this.levelRecords[this.difficulty]) {
            this.levelRecords[this.difficulty] = {};
        }
        if (!this.levelRecords[this.difficulty][level]) {
            this.levelRecords[this.difficulty][level] = [];
        }

        const record = {
            name: this.playerName,
            level: level,
            score: score,
            time: parseFloat(time),
            mistakes: mistakes,
            difficulty: this.difficulty,
            date: Date.now(),
            recordId: this.generateRecordId()
        };

        this.levelRecords[this.difficulty][level].push(record);
        this.levelRecords[this.difficulty][level].sort((a, b) => b.score - a.score || a.time - b.time);

        // 只保留每个关卡前50名
        if (this.levelRecords[this.difficulty][level].length > 50) {
            this.levelRecords[this.difficulty][level] = this.levelRecords[this.difficulty][level].slice(0, 50);
        }

        this.completedLevels.add(level);
        this.saveProgress();
        this.saveLeaderboards();

        return record;
    },

    // 添加总记录
    addTotalRecord(totalTime) {
        // 确保难度分类存在
        if (!this.totalRecords[this.difficulty]) {
            this.totalRecords[this.difficulty] = [];
        }

        const record = {
            name: this.playerName,
            totalScore: this.totalScore,
            totalTime: parseFloat(totalTime),
            levelsCompleted: this.levels,
            difficulty: this.difficulty,
            date: Date.now(),
            recordId: this.generateRecordId()
        };

        this.totalRecords[this.difficulty].push(record);
        this.totalRecords[this.difficulty].sort((a, b) => b.totalScore - a.totalScore || a.totalTime - b.totalTime);

        if (this.totalRecords[this.difficulty].length > 50) {
            this.totalRecords[this.difficulty] = this.totalRecords[this.difficulty].slice(0, 50);
        }

        // 添加到速通榜
        this.addSpeedrunRecord(totalTime);

        this.saveLeaderboards();
        return record;
    },

    // 添加速通记录
    addSpeedrunRecord(totalTime) {
        const record = {
            name: this.playerName,
            totalTime: parseFloat(totalTime),
            difficulty: this.difficulty,
            levelsCompleted: this.levels,
            date: Date.now(),
            recordId: this.generateRecordId()
        };

        this.speedrunRecords.push(record);
        this.speedrunRecords.sort((a, b) => {
            // 先按难度排序（easy < normal < hard），再按时间排序
            const difficultyOrder = { easy: 0, normal: 1, hard: 2 };
            if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            }
            return a.totalTime - b.totalTime;
        });

        if (this.speedrunRecords.length > 50) {
            this.speedrunRecords = this.speedrunRecords.slice(0, 50);
        }
    },

    // 生成唯一的记录ID
    generateRecordId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    // 获取关卡记录
    getLevelRecords(level, difficulty = this.difficulty) {
        return this.levelRecords[difficulty]?.[level] || [];
    },

    // 获取总记录
    getTotalRecords(difficulty = this.difficulty) {
        return this.totalRecords[difficulty] || [];
    },

    // 获取速通记录
    getSpeedrunRecords(difficulty = null) {
        if (!difficulty) {
            return this.speedrunRecords;
        }
        return this.speedrunRecords.filter(record => record.difficulty === difficulty);
    },

    // 设置难度
    setDifficulty(difficulty) {
        if (this.difficulties[difficulty]) {
            this.difficulty = difficulty;
            this.saveProgress();
            return true;
        }
        return false;
    },

    // 获取当前难度配置
    getCurrentDifficultyConfig() {
        return this.difficulties[this.difficulty] || this.difficulties.normal;
    },

    // 计算得分
    calculateScore(time, mistakes, pairs) {
        const config = this.getCurrentDifficultyConfig();
        const baseScore = 100;
        const timePenalty = Math.min(time * config.timeFactor, 30);
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
    // 使用 Web Crypto API 生成 AES-256 密钥
    async generateKey() {
        try {
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(GameState.encryptionSeed),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            return crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: encoder.encode('SentenceGameSalt_2024'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
        } catch (e) {
            console.error('生成密钥失败:', e);
            throw e;
        }
    },

    // AES-256-GCM 加密数据
    async encryptData(data) {
        try {
            const key = await this.generateKey();
            const encoder = new TextEncoder();
            const jsonStr = JSON.stringify(data);
            const iv = crypto.getRandomValues(new Uint8Array(12)); // 12字节IV，GCM模式推荐

            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encoder.encode(jsonStr)
            );

            // 组合 IV 和加密数据
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encryptedData), iv.length);

            // 转换为 base64 字符串
            return btoa(String.fromCharCode(...combined));
        } catch (e) {
            console.error('加密失败:', e);
            return null;
        }
    },

    // AES-256-GCM 解密数据
    async decryptData(encryptedStr) {
        try {
            const key = await this.generateKey();
            // 转换 base64 为 Uint8Array
            const combined = new Uint8Array([...atob(encryptedStr)].map(c => c.charCodeAt(0)));

            // 分离 IV 和加密数据
            const iv = combined.slice(0, 12);
            const encryptedData = combined.slice(12);

            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encryptedData
            );

            const decoder = new TextDecoder();
            const jsonStr = decoder.decode(decryptedData);
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error('解密失败:', e);
            return null;
        }
    },

    // 导出加密数据
    async exportEncryptedData() {
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

        const encrypted = await this.encryptData(data);
        if (!encrypted) throw new Error('加密失败');

        return {
            content: encrypted,
            filename: `sentencegame_${GameState.playerName}_${new Date().toISOString().slice(0, 10)}.yzgdatae`
        };
    },

    // 导出排行榜数据（仅排行榜数据，不包含玩家进度）
    async exportLeaderboardData() {
        const data = {
            version: GameState.gameVersion,
            levelRecords: GameState.levelRecords,
            totalRecords: GameState.totalRecords,
            speedrunRecords: GameState.speedrunRecords,
            exportTime: Date.now(),
            type: 'leaderboard_only'
        };

        const encrypted = await this.encryptData(data);
        if (!encrypted) throw new Error('加密失败');

        return {
            content: encrypted,
            filename: `sentencegame_leaderboards_${new Date().toISOString().slice(0, 10)}.yzgldrb`
        };
    },

    // 导入数据
    async importData(content, isEncrypted) {
        try {
            let data;

            if (isEncrypted) {
                data = await this.decryptData(content);
            } else {
                // 严格禁止导入明文敏感数据
                throw new Error('禁止导入明文敏感数据，请使用加密数据格式');
            }

            // 验证数据完整性
            if (!data.version) {
                throw new Error('数据格式错误');
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
    },

    // 仅导入排行榜数据
    async importLeaderboardData(content, isEncrypted) {
        try {
            const data = await this.importData(content, isEncrypted);

            // 验证是否为排行榜数据
            if (!data.levelRecords || !data.totalRecords) {
                throw new Error('无效的排行榜数据格式');
            }

            // 合并排行榜数据
            if (data.levelRecords) {
                for (const difficulty in data.levelRecords) {
                    if (!GameState.levelRecords[difficulty]) {
                        GameState.levelRecords[difficulty] = {};
                    }
                    for (const level in data.levelRecords[difficulty]) {
                        if (!GameState.levelRecords[difficulty][level]) {
                            GameState.levelRecords[difficulty][level] = [];
                        }
                        // 合并记录并去重
                        const existingIds = new Set(GameState.levelRecords[difficulty][level].map(r => r.recordId));
                        const newRecords = data.levelRecords[difficulty][level].filter(r => !existingIds.has(r.recordId));
                        GameState.levelRecords[difficulty][level].push(...newRecords);
                        // 按分数和时间排序
                        GameState.levelRecords[difficulty][level].sort((a, b) => b.score - a.score || a.time - b.time);
                        // 只保留前50名
                        GameState.levelRecords[difficulty][level] = GameState.levelRecords[difficulty][level].slice(0, 50);
                    }
                }
            }

            if (data.totalRecords) {
                for (const difficulty in data.totalRecords) {
                    if (!GameState.totalRecords[difficulty]) {
                        GameState.totalRecords[difficulty] = [];
                    }
                    // 合并记录并去重
                    const existingIds = new Set(GameState.totalRecords[difficulty].map(r => r.recordId));
                    const newRecords = data.totalRecords[difficulty].filter(r => !existingIds.has(r.recordId));
                    GameState.totalRecords[difficulty].push(...newRecords);
                    // 按分数和时间排序
                    GameState.totalRecords[difficulty].sort((a, b) => b.totalScore - a.totalScore || a.totalTime - b.totalTime);
                    // 只保留前50名
                    GameState.totalRecords[difficulty] = GameState.totalRecords[difficulty].slice(0, 50);
                }
            }

            if (data.speedrunRecords) {
                // 合并速通记录并去重
                const existingIds = new Set(GameState.speedrunRecords.map(r => r.recordId));
                const newRecords = data.speedrunRecords.filter(r => !existingIds.has(r.recordId));
                GameState.speedrunRecords.push(...newRecords);
                // 按难度和时间排序
                GameState.speedrunRecords.sort((a, b) => {
                    const difficultyOrder = { easy: 0, normal: 1, hard: 2 };
                    if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
                        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                    }
                    return a.totalTime - b.totalTime;
                });
                // 只保留前50名
                GameState.speedrunRecords = GameState.speedrunRecords.slice(0, 50);
            }

            GameState.saveLeaderboards();
            return true;
        } catch (e) {
            console.error('导入排行榜数据失败:', e);
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
        // 如果选择了同类型的卡片，取消上一个选择并选择当前卡片
        if (GameState.selectedCard.dataset.type === card.dataset.type) {
            GameState.selectedCard.classList.remove('selected');
            card.classList.add('selected');
            GameState.selectedCard = card;
        } else {
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

    // 检查是否超过当前难度的最大容错次数
    const config = GameState.getCurrentDifficultyConfig();
    if (GameState.mistakes > config.maxMistakes) {
        setTimeout(() => {
            // 游戏结束，重置
            GameState.stopTimer();
            alert(`❌ 游戏结束！您已超过最大容错次数（${config.maxMistakes}次）。`);
            startLevel(GameState.currentLevel);
        }, 600);
    } else {
        setTimeout(() => {
            card1.classList.remove('selected', 'mismatch');
            card2.classList.remove('mismatch');
            GameState.selectedCard = null;
            updateUI();
        }, 600);
    }
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

    const config = GameState.getCurrentDifficultyConfig();
    const pairsPerLevel = config.pairsPerLevel;

    const startIdx = (level - 1) * pairsPerLevel;
    const endIdx = Math.min(startIdx + pairsPerLevel, ALL_EXPRESSIONS.length);
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
    document.getElementById('progress').textContent = `关卡 ${level}/${GameState.levels} | 总分: ${GameState.totalScore} | 难度: ${GameState.difficulty === 'easy' ? '简单' : GameState.difficulty === 'normal' ? '普通' : '困难'}`;
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
    const leaderboardContainer = document.querySelector('.leaderboard-container');

    // 更新排行榜容器结构，添加难度选择
    leaderboardContainer.innerHTML = `
        <div class="leaderboard-header">
            <h2>🏆 排行榜</h2>
            <button class="close-btn" onclick="hideLeaderboard()">×</button>
        </div>
        
        <!-- 难度选择区域 -->
        <div class="leaderboard-controls">
            <div class="difficulty-selector">
                <h3>难度选择:</h3>
                <div class="difficulty-buttons">
                    <button class="difficulty-btn ${GameState.difficulty === 'easy' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('easy')">简单</button>
                    <button class="difficulty-btn ${GameState.difficulty === 'normal' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('normal')">普通</button>
                    <button class="difficulty-btn ${GameState.difficulty === 'hard' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('hard')">困难</button>
                </div>
            </div>
            
            <div class="leaderboard-tabs" id="leaderboardTabs">
                <!-- 选项卡将通过JS动态生成 -->
            </div>
        </div>
        
        <!-- 排行榜内容区域 -->
        <div class="leaderboard-content" id="leaderboardContent">
            <!-- 内容将通过JS动态生成 -->
        </div>
    `;

    // 生成选项卡
    generateLeaderboardTabs(initialTab);

    // 显示初始内容
    if (initialTab === 'total') {
        showTotalLeaderboard();
    } else if (initialTab === 'speedrun') {
        showSpeedrunLeaderboard();
    } else {
        const level = initialTab.replace('level', '');
        showLevelLeaderboard(parseInt(level));
    }

    panel.classList.add('active');
}

// 生成排行榜选项卡
function generateLeaderboardTabs(initialTab) {
    const tabsContainer = document.getElementById('leaderboardTabs');
    tabsContainer.innerHTML = '';

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

    // 添加速通榜选项卡
    const speedrunTab = document.createElement('button');
    speedrunTab.className = `tab-btn ${initialTab === 'speedrun' ? 'active' : ''}`;
    speedrunTab.textContent = '速通榜';
    speedrunTab.onclick = () => showSpeedrunLeaderboard();
    tabsContainer.appendChild(speedrunTab);
}

// 切换排行榜难度
function changeLeaderboardDifficulty(difficulty) {
    GameState.setDifficulty(difficulty);

    // 获取当前激活的选项卡
    let initialTab = 'level1';
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        if (activeTab.textContent === '总排行榜') {
            initialTab = 'total';
        } else if (activeTab.textContent === '速通榜') {
            initialTab = 'speedrun';
        } else {
            const level = activeTab.textContent.replace('第', '').replace('关', '');
            initialTab = 'level' + level;
        }
    }

    generateLeaderboardTabs(initialTab);

    // 重新显示内容
    if (initialTab === 'total') {
        showTotalLeaderboard();
    } else if (initialTab === 'speedrun') {
        showSpeedrunLeaderboard();
    } else {
        const level = initialTab.replace('level', '');
        showLevelLeaderboard(parseInt(level));
    }

    // 更新难度按钮状态
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.difficulty-btn[onclick*="${difficulty}"]`).classList.add('active');
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
    const totalTab = Array.from(tabs).find(tab => tab.textContent === '总排行榜');
    if (totalTab) totalTab.classList.add('active');

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

// 显示速通榜
function showSpeedrunLeaderboard() {
    const contentContainer = document.getElementById('leaderboardContent');
    const tabs = document.querySelectorAll('.tab-btn');

    // 更新选项卡状态
    tabs.forEach(tab => tab.classList.remove('active'));
    const speedrunTab = Array.from(tabs).find(tab => tab.textContent === '速通榜');
    if (speedrunTab) speedrunTab.classList.add('active');

    const records = GameState.getSpeedrunRecords(GameState.difficulty);

    if (records.length === 0) {
        contentContainer.innerHTML = `
            <li style="text-align: center; padding: 4vh; color: #7f8c8d;">
                暂无速通记录<br>
                <small>快速完成所有关卡即可上榜！</small>
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
            <div class="time">${record.totalTime.toFixed(3)}s</div>
            <div class="level">${record.levelsCompleted}关</div>
            <div class="difficulty">${record.difficulty === 'easy' ? '简单' : record.difficulty === 'normal' ? '普通' : '困难'}</div>
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

async function downloadEncryptedData() {
    try {
        const data = await DataEncryptor.exportEncryptedData();
        downloadFile(data.content, data.filename, 'application/octet-stream');
        hideExportModal();
        alert('✅ 加密数据导出成功！');
    } catch (e) {
        alert('❌ 导出失败: ' + e.message);
    }
}

async function downloadLeaderboardData() {
    try {
        const data = await DataEncryptor.exportLeaderboardData();
        downloadFile(data.content, data.filename, 'application/octet-stream');
        hideExportModal();
        alert('✅ 排行榜数据导出成功！');
    } catch (e) {
        alert('❌ 导出排行榜数据失败: ' + e.message);
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
    reader.onload = async function (e) {
        try {
            const content = e.target.result;
            const isEncrypted = file.name.endsWith('.yzgdatae') || file.name.endsWith('.yzgldrb');
            const isLeaderboardOnly = file.name.endsWith('.yzgldrb');

            statusDiv.innerHTML += '<p>正在解密/解析数据...</p>';

            if (isLeaderboardOnly) {
                // 仅导入排行榜数据
                await DataEncryptor.importLeaderboardData(content, isEncrypted);

                statusDiv.innerHTML = `
                    <p style="color: #27ae60; font-weight: bold;">✅ 排行榜数据导入成功！</p>
                    <p>排行榜数据已合并到现有排行榜中</p>
                `;
            } else {
                // 导入完整游戏数据
                const data = await DataEncryptor.importData(content, isEncrypted);

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
            }

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
