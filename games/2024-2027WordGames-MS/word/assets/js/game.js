/* 单词闯关游戏 JavaScript 代码 */

/* ========== 游戏核心数据 ========== */
const ALL_EXPRESSIONS = [
    {
        "eng": "upset",
        "chi": "令人烦恼的;使人不高兴的(adj.)"
    },
    {
        "eng": "ripple",
        "chi": "涟漪 (n.)"
    },
    {
        "eng": "cozy",
        "chi": "温暖舒适的 (adj.)"
    },
    {
        "eng": "immediately",
        "chi": "立即地 (adv.)"
    },
    {
        "eng": "overwhelming",
        "chi": "压倒性的 (adj.)"
    },
    {
        "eng": "hesitation",
        "chi": "犹豫 (n.)"
    },
    {
        "eng": "plumber",
        "chi": "水管工 (n.)"
    },
    {
        "eng": "attentively",
        "chi": "专心地, 仔细地 (adv.)"
    },
    {
        "eng": "shovel",
        "chi": "（用铲子）铲起 (v.)"
    },
    {
        "eng": "handle",
        "chi": "处理，应付(v.)"
    },
    {
        "eng": "diverse",
        "chi": "多样化的；多样的 (adj.)"
    },
    {
        "eng": "eventually",
        "chi": "最终；终于 (adv.)"
    },
    {
        "eng": "hospitable",
        "chi": "好客的 (adj.)"
    },
    {
        "eng": "bother",
        "chi": "打扰；妨碍 (v.)"
    },
    {
        "eng": "privacy",
        "chi": "隐私 (n.)"
    },
    {
        "eng": "private",
        "chi": "私有的；秘密的 (adj.)"
    },
    {
        "eng": "mutual",
        "chi": "相互的 (adj.)"
    },
    {
        "eng": "conflict",
        "chi": "冲突 (n.)"
    },
    {
        "eng": "harmonious",
        "chi": "和谐的 (adj.)"
    },
    {
        "eng": "interaction",
        "chi": "交流 (n.)"
    },
    {
        "eng": "compassion",
        "chi": "同情 (n.)"
    },
    {
        "eng": "considerate",
        "chi": "体贴的 (adj.)"
    },
    {
        "eng": "admire",
        "chi": "钦佩；赞赏；仰慕 (v.)"
    },
    {
        "eng": "admirer",
        "chi": "钦佩者；赞赏者 (n.)"
    },
    {
        "eng": "respectfully",
        "chi": "尊敬地 (adv.)"
    },
    {
        "eng": "interfere",
        "chi": "干涉；介入 (v.)"
    },
    {
        "eng": "right",
        "chi": "权利；公正 (n.)"
    },
    {
        "eng": "trap",
        "chi": "使陷入困境 (v.)"
    },
    {
        "eng": "isolation",
        "chi": "孤立 (n.)"
    },
    {
        "eng": "invite sb. to do sth.",
        "chi": "邀请某人做某事"
    },
    {
        "eng": "chat with sb.",
        "chi": "与某人聊天"
    },
    {
        "eng": "set a time limit",
        "chi": "设定时间限制"
    },
    {
        "eng": "reduce stress",
        "chi": "减轻压力"
    },
    {
        "eng": "cheer oneself up",
        "chi": "使自己振奋起来"
    },
    {
        "eng": "as soon as",
        "chi": "一…就…"
    },
    {
        "eng": "in the meantime",
        "chi": "与此同时"
    },
    {
        "eng": "sort out",
        "chi": "解决"
    },
    {
        "eng": "argue over sth.",
        "chi": "为某事争论"
    },
    {
        "eng": "lend a hand to sb.",
        "chi": "向某人伸出援手"
    },
    {
        "eng": "after all",
        "chi": "毕竟"
    },
    {
        "eng": "due to",
        "chi": "由于"
    },
    {
        "eng": "make fun of sb.",
        "chi": "取笑某人"
    },
    {
        "eng": "concentrate on sth.",
        "chi": "专注于某事"
    },
    {
        "eng": "respond to sb./sth.",
        "chi": "回应某人或某事"
    },
    {
        "eng": "set good example",
        "chi": "树立好榜样"
    },
    {
        "eng": "try out sth.",
        "chi": "使用某物"
    },
    {
        "eng": "forget about sth.",
        "chi": "忘记某事"
    },
    {
        "eng": "speak up",
        "chi": "大胆说；大声说"
    },
    {
        "eng": "be dependent on sb./sth.",
        "chi": "依赖于某人或某事"
    },
    {
        "eng": "Put yourself in other people’s shoes",
        "chi": "设身处地为他人着想"
    },
    {
        "eng": "source",
        "chi": "来源(n.)"
    },
    {
        "eng": "concept",
        "chi": "概念(n.)"
    },
    {
        "eng": "in person",
        "chi": "亲自"
    },
    {
        "eng": "user-friendly",
        "chi": "方便用户的(adj.)"
    },
    {
        "eng": "recommend",
        "chi": "推荐(v.)"
    },
    {
        "eng": "compare…to …",
        "chi": "把…比作…"
    },
    {
        "eng": "turn into",
        "chi": "变成；转变为"
    },
    {
        "eng": "comparison",
        "chi": "比较(n.)"
    },
    {
        "eng": "follow the rules",
        "chi": "遵守规则"
    },
    {
        "eng": "reinforce",
        "chi": "强化(v.)"
    },
    {
        "eng": "create a positive learning atmosphere",
        "chi": "营造积极的学习氛围"
    },
    {
        "eng": "more than",
        "chi": "不仅仅，不只是"
    },
    {
        "eng": "burn out",
        "chi": "精疲力竭"
    },
    {
        "eng": "be amazed at",
        "chi": "对…感到惊讶"
    },
    {
        "eng": "focus on",
        "chi": "专注"
    },
    {
        "eng": "a renewed sense of hope",
        "chi": "重新燃起的希望感"
    },
    {
        "eng": "teach sb. a lesson",
        "chi": "给某人一个教训"
    },
    {
        "eng": "over and over again",
        "chi": "一再地；反复地"
    },
    {
        "eng": "hand sb over to…",
        "chi": "把某人移交给…"
    },
    {
        "eng": "disturb",
        "chi": "打扰；干扰(v.)"
    },
    {
        "eng": "stand",
        "chi": "忍受、承受（v.）"
    },
    {
        "eng": "annoying",
        "chi": "令人讨厌的（adj.）"
    },
    {
        "eng": "status",
        "chi": "状态(n.)"
    },
    {
        "eng": "social media accounts",
        "chi": "社交媒体账户"
    },
    {
        "eng": "track",
        "chi": "跟踪，追踪（v.）"
    },
    {
        "eng": "browse",
        "chi": "浏览(v.)"
    },
    {
        "eng": "personalize",
        "chi": "个性化(v.)"
    },
    {
        "eng": "block",
        "chi": "阻塞；阻挡(v.)"
    },
    {
        "eng": "digital footprints",
        "chi": "数字足迹"
    },
    {
        "eng": "stop sb. doing sth.",
        "chi": "阻止某人做某事"
    },
    {
        "eng": "recognize",
        "chi": "认出；识别出（v.）"
    },
    {
        "eng": "facial recognition",
        "chi": "面部识别"
    },
    {
        "eng": "feature",
        "chi": "功能，特征（n.）"
    },
    {
        "eng": "pattern",
        "chi": "模式(n.)"
    },
    {
        "eng": "fingerprints",
        "chi": "指纹(n.)"
    },
    {
        "eng": "fake",
        "chi": "假的；伪造的(adj.)"
    },
    {
        "eng": "hack into",
        "chi": "非法侵入（计算机系统等）"
    },
    {
        "eng": "a number of photos",
        "chi": "大量照片"
    },
    {
        "eng": "expert",
        "chi": "专家(n.)"
    },
    {
        "eng": "as long as",
        "chi": "只要"
    },
    {
        "eng": "make lives easier and better",
        "chi": "让生活更轻松、更美好"
    },
    {
        "eng": "stress",
        "chi": "强调(v.)"
    },
    {
        "eng": "involve",
        "chi": "涉及；包含；使参与(v.)"
    },
    {
        "eng": "balance…with…",
        "chi": "使…与…保持平衡"
    },
    {
        "eng": "useful resources",
        "chi": "有用的资源"
    },
    {
        "eng": "framework",
        "chi": "框架(n.)"
    },
    {
        "eng": "from time to time",
        "chi": "时不时地；偶尔"
    },
    {
        "eng": "attack",
        "chi": "攻击(v.)"
    },
    {
        "eng": "be responsible for",
        "chi": "对…负责"
    },
    {
        "eng": "earthquake",
        "chi": "地震 (n.)"
    },
    {
        "eng": "hurricane",
        "chi": "飓风 (n.)"
    },
    {
        "eng": "typhoon",
        "chi": "台风 (n.)"
    },
    {
        "eng": "courage",
        "chi": "勇气 (n.)"
    },
    {
        "eng": "tricky",
        "chi": "困难的，棘手的 (adj.)"
    },
    {
        "eng": "possess",
        "chi": "拥有 (v.)"
    },
    {
        "eng": "pretend",
        "chi": "假装 (v.)"
    },
    {
        "eng": "permission",
        "chi": "允许 (n.)"
    },
    {
        "eng": "porridge",
        "chi": "麦片粥 (n.)"
    },
    {
        "eng": "discover",
        "chi": "发现 (v.)"
    },
    {
        "eng": "wonder",
        "chi": "感到疑惑，想要知道 (v.)"
    },
    {
        "eng": "hand out",
        "chi": "分发"
    },
    {
        "eng": "socialize",
        "chi": "交往，交际 (v.)"
    },
    {
        "eng": "make a difference",
        "chi": "有影响，起重要作用"
    },
    {
        "eng": "yell at",
        "chi": "朝...大吼"
    },
    {
        "eng": "communicate",
        "chi": "沟通，与...交流信息 (v.)"
    },
    {
        "eng": "repair",
        "chi": "修理 (v.)"
    },
    {
        "eng": "offer",
        "chi": "主动提出，自动给予 (v.)"
    },
    {
        "eng": "get along with",
        "chi": "和...友好相处"
    },
    {
        "eng": "provide",
        "chi": "提供 (v.)"
    },
    {
        "eng": "exhibition",
        "chi": "展览 (n.)"
    },
    {
        "eng": "encourage",
        "chi": "鼓励 (v.)"
    },
    {
        "eng": "stick to",
        "chi": "坚持"
    },
    {
        "eng": "a number of",
        "chi": "许多"
    },
    {
        "eng": "panic",
        "chi": "恐慌(n.)"
    },
    {
        "eng": "cause",
        "chi": "引起，造成 (v.)"
    },
    {
        "eng": "mad",
        "chi": "生气的，疯狂的 (adj.)"
    },
    {
        "eng": "blame",
        "chi": "责备，指责 (v.)"
    },
    {
        "eng": "mend",
        "chi": "修理，修补 (v.)"
    },
    {
        "eng": "wrist",
        "chi": "手腕 (n.)"
    },
    {
        "eng": "refer to",
        "chi": "指的是"
    },
    {
        "eng": "understand",
        "chi": "理解 (v.)"
    },
    {
        "eng": "lack",
        "chi": "缺乏 (n.)"
    },
    {
        "eng": "spread",
        "chi": "传播 (v.)"
    },
    {
        "eng": "as time goes by",
        "chi": "随着时间的推移"
    },
    {
        "eng": "method",
        "chi": "方法 (n.)"
    },
    {
        "eng": "influence",
        "chi": "影响 (v.)"
    },
    {
        "eng": "disadvantage",
        "chi": "缺点，劣势 (n.)"
    },
    {
        "eng": "exploration",
        "chi": "探索，探险 (n.)"
    },
    {
        "eng": "be sick of",
        "chi": "厌烦，受够了"
    },
    {
        "eng": "get in shape",
        "chi": "健身，保持身材"
    },
    {
        "eng": "prepare",
        "chi": "准备 (v.)"
    },
    {
        "eng": "consider",
        "chi": "考虑，细想 (v.)"
    },
    {
        "eng": "ancient",
        "chi": "古代的 (adj.)"
    },
    {
        "eng": "necessary",
        "chi": "必要的 (adj.)"
    },
    {
        "eng": "for instance",
        "chi": "比如"
    },
    {
        "eng": "develop",
        "chi": "发展 (v.)"
    },
    {
        "eng": "overcome",
        "chi": "克服 (v.)"
    },
    {
        "eng": "unmatched",
        "chi": "无与伦比的 (adj.)"
    },
    {
        "eng": "perfectly",
        "chi": "完全地 (adv.)"
    },
    {
        "eng": "understandable",
        "chi": "可以理解的 (adj.)"
    },
    {
        "eng": "throw one’s arms around sb.",
        "chi": "拥抱某人"
    },
    {
        "eng": "be based on",
        "chi": "以……为基础"
    },
    {
        "eng": "on a diet",
        "chi": "节食，控制饮食"
    },
    {
        "eng": "put on weight",
        "chi": "体重增加，长胖"
    },
    {
        "eng": "except",
        "chi": "除…..之外 (prep.)"
    },
    {
        "eng": "be forever doing",
        "chi": "反复发生，持续不断"
    },
    {
        "eng": "count sb. in",
        "chi": "把某人算进去"
    },
    {
        "eng": "see sb. doing",
        "chi": "看见某人正在做某事"
    },
    {
        "eng": "see sb. do",
        "chi": "看见某人做某事全过程"
    },
    {
        "eng": "make daily tasks faster",
        "chi": "让日常事务更高效"
    },
    {
        "eng": "effect",
        "chi": "影响，效果 (n.)"
    },
    {
        "eng": "waterproof",
        "chi": "防水的 (adj.)"
    },
    {
        "eng": "shockproof",
        "chi": "防震的 (adj.)"
    },
    {
        "eng": "cable",
        "chi": "电缆，线缆 (n.)"
    },
    {
        "eng": "increasing numbers",
        "chi": "越来越多，数量不断增加"
    },
    {
        "eng": "site",
        "chi": "网站，平台 (n.)"
    },
    {
        "eng": "ironically",
        "chi": "讽刺的是 (adv.)"
    },
    {
        "eng": "be less likely to",
        "chi": "不太可能"
    },
    {
        "eng": "on the other hand",
        "chi": "另一方面"
    },
    {
        "eng": "make contact with",
        "chi": "与……取得联系"
    },
    {
        "eng": "all over the country",
        "chi": "全国各地"
    },
    {
        "eng": "addiction",
        "chi": "上瘾 (n.)"
    },
    {
        "eng": "adopter",
        "chi": "尝鲜者，采用者 (n.)"
    },
    {
        "eng": "constantly",
        "chi": "持续不断地 (adv.)"
    },
    {
        "eng": "get off phones",
        "chi": "放下手机"
    },
    {
        "eng": "cut off",
        "chi": "切断，中断"
    },
    {
        "eng": "in case of",
        "chi": "万一，假使"
    },
    {
        "eng": "emergency",
        "chi": "紧急情况，突发事件 (n.)"
    },
    {
        "eng": "a matter of time",
        "chi": "只是时间的问题"
    },
    {
        "eng": "trend",
        "chi": "趋势 (n.)"
    },
    {
        "eng": "determine",
        "chi": "确定，决定，查明 (v.)"
    },
    {
        "eng": "incredible",
        "chi": "难以置信的 (adj.)"
    },
    {
        "eng": "scroll up",
        "chi": "向上滚动"
    },
    {
        "eng": "mechanical",
        "chi": "机械的 (adj.)"
    },
    {
        "eng": "be familiar with",
        "chi": "熟悉，通晓"
    },
    {
        "eng": "unusual insects",
        "chi": "罕见的昆虫"
    },
    {
        "eng": "general sense",
        "chi": "直觉"
    },
    {
        "eng": "make out the road",
        "chi": "看清道路，辨认出道路"
    },
    {
        "eng": "turn a blind eye to",
        "chi": "对……视而不见"
    },
    {
        "eng": "support evidence",
        "chi": "佐证，支持性证据"
    },
    {
        "eng": "make sense",
        "chi": "有道理，合乎情理"
    },
    {
        "eng": "mature",
        "chi": "成熟的 (adj.)"
    },
    {
        "eng": "be impressed by",
        "chi": "对……印象深刻"
    },
    {
        "eng": "turn in",
        "chi": "上交"
    },
    {
        "eng": "persuade",
        "chi": "说服，劝说 (v.)"
    },
    {
        "eng": "get in the way of",
        "chi": "妨碍"
    },
    {
        "eng": "take over",
        "chi": "占据"
    },
    {
        "eng": "lend sb. a hand",
        "chi": "帮某人的忙"
    },
    {
        "eng": "a warning sign",
        "chi": "一个警示牌"
    },
    {
        "eng": "an artificial arm",
        "chi": "一只人造手臂"
    },
    {
        "eng": "plastic",
        "chi": "塑料的(adj.)"
    },
    {
        "eng": "be born",
        "chi": "出生"
    },
    {
        "eng": "one after another",
        "chi": "一个接一个地"
    },
    {
        "eng": "one another",
        "chi": "(三者及以上)彼此，互相"
    },
    {
        "eng": "for free",
        "chi": "免费的"
    },
    {
        "eng": "endless",
        "chi": "无尽的(adj.)"
    },
    {
        "eng": "sense",
        "chi": "感知(n./v.)"
    },
    {
        "eng": "code",
        "chi": "编码(v.)"
    },
    {
        "eng": "apply to",
        "chi": "申请；适用"
    },
    {
        "eng": "go bad",
        "chi": "（食物）变质"
    },
    {
        "eng": "ingredient",
        "chi": "成分，要素(n.)"
    },
    {
        "eng": "recipe",
        "chi": "食谱，配方(n.)"
    },
    {
        "eng": "make progress",
        "chi": "取得进步"
    },
    {
        "eng": "pay for",
        "chi": "支付"
    },
    {
        "eng": "peanut butter",
        "chi": "花生酱"
    },
    {
        "eng": "stay up late",
        "chi": "熬夜"
    },
    {
        "eng": "by accident",
        "chi": "出于偶然"
    },
    {
        "eng": "on purpose",
        "chi": "故意地"
    },
    {
        "eng": "soda water",
        "chi": "苏打水"
    },
    {
        "eng": "in the late 1800s",
        "chi": "在19世纪末期"
    },
    {
        "eng": "speed up",
        "chi": "加速"
    },
    {
        "eng": "help out",
        "chi": "协助"
    },
    {
        "eng": "tablet",
        "chi": "平板电脑(n.)"
    },
    {
        "eng": "take advantage of",
        "chi": "利用"
    },
    {
        "eng": "video chatting",
        "chi": "视频聊天"
    },
    {
        "eng": "cut down",
        "chi": "减少、砍伐"
    },
    {
        "eng": "hold back",
        "chi": "抑制、阻止"
    },
    {
        "eng": "golden ratio",
        "chi": "黄金分割比"
    },
    {
        "eng": "laptop",
        "chi": "笔记本电脑 (n.)"
    },
    {
        "eng": "humanity",
        "chi": "人性(n.)"
    },
    {
        "eng": "pillow",
        "chi": "枕头(n.)"
    },
    {
        "eng": "germs/bacteria",
        "chi": "细菌(n.)"
    },
    {
        "eng": "allergy",
        "chi": "过敏反应(n.)"
    },
    {
        "eng": "assistant",
        "chi": "助手(n.)"
    },
    {
        "eng": "sneeze",
        "chi": "打喷嚏(v.)"
    },
    {
        "eng": "navigate",
        "chi": "导航(v.)"
    },
    {
        "eng": "surrender",
        "chi": "投降、任凭摆布(v.)"
    },
    {
        "eng": "enjoy doing",
        "chi": "喜欢做某事"
    },
    {
        "eng": "practice doing",
        "chi": "练习做某事"
    },
    {
        "eng": "keep doing",
        "chi": "保持做某事"
    },
    {
        "eng": "decide to do",
        "chi": "决定做某事"
    },
    {
        "eng": "plan to do",
        "chi": "计划做某事"
    },
    {
        "eng": "want to do",
        "chi": "想要做某事"
    },
    {
        "eng": "ask sb. to do",
        "chi": "要求某人做某事"
    },
    {
        "eng": "look forward to doing",
        "chi": "期待做某事"
    },
    {
        "eng": "make sb. do",
        "chi": "迫使某人做某事"
    },
    {
        "eng": "here and there",
        "chi": "到处"
    },
    {
        "eng": "be away",
        "chi": "外出"
    },
    {
        "eng": "shout in a very angry voice",
        "chi": "怒气冲冲的吼道"
    },
    {
        "eng": "hear birds singing",
        "chi": "听到鸟儿在唱歌"
    },
    {
        "eng": "knock down",
        "chi": "推倒"
    },
    {
        "eng": "can’t wait to do",
        "chi": "迫不及待地做某事"
    },
    {
        "eng": "set up",
        "chi": "建立"
    },
    {
        "eng": "fly through the clouds",
        "chi": "飞跃云层"
    },
    {
        "eng": "narrow lane",
        "chi": "窄巷"
    },
    {
        "eng": "traditional Chinese units",
        "chi": "中国传统的计量单位"
    },
    {
        "eng": "start back",
        "chi": "始于"
    },
    {
        "eng": "reach an agreement",
        "chi": "达成一致"
    },
    {
        "eng": "have a position high up in the government",
        "chi": "在朝廷中身居高位"
    },
    {
        "eng": "feel ashamed",
        "chi": "感到羞愧"
    },
    {
        "eng": "in return",
        "chi": "作为回报"
    },
    {
        "eng": "give up",
        "chi": "放弃"
    },
    {
        "eng": "six-chi-wide lane",
        "chi": "六尺巷"
    },
    {
        "eng": "keep the poem in mind",
        "chi": "心中牢记这首诗"
    },
    {
        "eng": "walk down the lane",
        "chi": "经过这条小巷"
    },
    {
        "eng": "hundreds of years",
        "chi": "数百年"
    },
    {
        "eng": "six chi away, but closer together",
        "chi": "远六尺，近人心"
    },
    {
        "eng": "dividing line",
        "chi": "分界线"
    },
    {
        "eng": "shared joy",
        "chi": "分享快乐"
    },
    {
        "eng": "two meters wide",
        "chi": "两米宽"
    },
    {
        "eng": "break rules",
        "chi": "违反规则"
    },
    {
        "eng": "play loud music",
        "chi": "大声播放音乐"
    },
    {
        "eng": "say sorry to sb.",
        "chi": "向某人道歉"
    },
    {
        "eng": "tell the truth",
        "chi": "说实话"
    },
    {
        "eng": "get on the train",
        "chi": "登上火车"
    },
    {
        "eng": "in order to",
        "chi": "为了"
    },
    {
        "eng": "jump up in surprise",
        "chi": "惊讶地跳起来"
    },
    {
        "eng": "next to",
        "chi": "紧挨着"
    },
    {
        "eng": "several packets of food",
        "chi": "几包食物"
    },
    {
        "eng": "block the noise",
        "chi": "阻挡噪音"
    },
    {
        "eng": "so as to",
        "chi": "以便"
    },
    {
        "eng": "take a deep breath",
        "chi": "深呼吸"
    },
    {
        "eng": "the famous line from Shakespeare’s play",
        "chi": "莎士比亚戏剧中的经典台词"
    },
    {
        "eng": "in some urgent situations",
        "chi": "在某些紧急情况下"
    },
    {
        "eng": "cause an accident",
        "chi": "引发事故"
    },
    {
        "eng": "have very bad effects",
        "chi": "产生恶劣影响"
    },
    {
        "eng": "take part in a debate",
        "chi": "参加辩论"
    },
    {
        "eng": "support arguments",
        "chi": "支持论点"
    },
    {
        "eng": "in conclusion",
        "chi": "总之"
    },
    {
        "eng": "chat face to face with loved ones far away",
        "chi": "与远方的亲人面对面聊天"
    },
    {
        "eng": "get in touch with sb.",
        "chi": "与某人取得联系"
    },
    {
        "eng": "be aware of",
        "chi": "意识到"
    },
    {
        "eng": "be careful with",
        "chi": "谨慎对待"
    },
    {
        "eng": "ask for help",
        "chi": "寻求帮助"
    },
    {
        "eng": "stay safe",
        "chi": "确保安全"
    },
    {
        "eng": "look away",
        "chi": "把目光移开"
    },
    {
        "eng": "instead of doing…",
        "chi": "代替做，而不是做"
    },
    {
        "eng": "make sb. nervous",
        "chi": "使得某人紧张"
    },
    {
        "eng": "look up",
        "chi": "抬头看"
    },
    {
        "eng": "look in the mirror",
        "chi": "照镜子"
    },
    {
        "eng": "turn away",
        "chi": "避开"
    },
    {
        "eng": "to one’s surprise",
        "chi": "使某人惊奇的是"
    },
    {
        "eng": "something special and different",
        "chi": "一些特别和与众不同的东西"
    },
    {
        "eng": "must be",
        "chi": "一定是"
    },
    {
        "eng": "be good at doing sth.",
        "chi": "擅长做某事"
    },
    {
        "eng": "make sb easy to recognise",
        "chi": "使某人容易认出来"
    },
    {
        "eng": "help sb. reach things down",
        "chi": "帮助某人把东西够下来"
    },
    {
        "eng": "accept one’s weakness",
        "chi": "接受某人的弱点"
    },
    {
        "eng": "move to a new town",
        "chi": "搬到一个新小镇"
    },
    {
        "eng": "come up with an idea",
        "chi": "想出一个主意"
    },
    {
        "eng": "hold sb. back",
        "chi": "拖某人的后腿"
    },
    {
        "eng": "a very risky decision",
        "chi": "一个非常冒险的决定"
    },
    {
        "eng": "at such an age",
        "chi": "在那样的年龄"
    },
    {
        "eng": "choose to stop running",
        "chi": "选择停止跑步"
    },
    {
        "eng": "make history",
        "chi": "创造历史"
    },
    {
        "eng": "the first Chinese athlete",
        "chi": "第一个中国运动员"
    },
    {
        "eng": "have a try",
        "chi": "尝试"
    },
    {
        "eng": "overcome the difficulties and challenges",
        "chi": "克服困难和挑战"
    },
    {
        "eng": "one’s efforts and success",
        "chi": "一个人的努力和成功"
    },
    {
        "eng": "ride a shared bike",
        "chi": "骑共享单车"
    },
    {
        "eng": "cost an arm and a leg",
        "chi": "花一大笔钱，耗资巨大"
    },
    {
        "eng": "live a more convenient life",
        "chi": "生活变得更方便"
    },
    {
        "eng": "in the old days",
        "chi": "很久以前；当年"
    },
    {
        "eng": "check out cool pictures",
        "chi": "浏览炫酷的照片"
    },
    {
        "eng": "take some interesting courses",
        "chi": "选几门有意思的课程"
    },
    {
        "eng": "step by step",
        "chi": "循序渐进，一步步来"
    },
    {
        "eng": "get too caught up in",
        "chi": "太投入于……;深陷于……"
    },
    {
        "eng": "get around",
        "chi": "玩转、出行、四处走动"
    },
    {
        "eng": "be glued to",
        "chi": "黏在……上; 沉迷于……"
    },
    {
        "eng": "stay away from",
        "chi": "远离……;避开……"
    },
    {
        "eng": "stand still",
        "chi": "原地不动"
    },
    {
        "eng": "move across a screen",
        "chi": "在屏幕上滑动/切换"
    },
    {
        "eng": "in the opening",
        "chi": "最开始"
    },
    {
        "eng": "light up",
        "chi": "照亮、变得明亮"
    },
    {
        "eng": "adaptation from",
        "chi": "改编自"
    },
    {
        "eng": "the development of technology",
        "chi": "科技的发展；技术的进步"
    },
    {
        "eng": "explore other fun activities",
        "chi": "多去探索些有意思的活动"
    },
    {
        "eng": "stay in touch with",
        "chi": "和……保持联系；与……常来往"
    },
    {
        "eng": "connect with others",
        "chi": "与他人联系"
    },
    {
        "eng": "the offline world",
        "chi": "现实世界"
    },
    {
        "eng": "delivery service",
        "chi": "外卖服务"
    },
    {
        "eng": "except for",
        "chi": "除……之外"
    },
    {
        "eng": "payment system",
        "chi": "支付系统"
    },
    {
        "eng": "screen generation",
        "chi": "屏幕一代；屏生代"
    },
    {
        "eng": "digital natives",
        "chi": "数字原住民"
    },
    {
        "eng": "drive people to invent",
        "chi": "驱使人们去发明"
    },
    {
        "eng": "a 14-year-old student",
        "chi": "一个14岁的学生"
    },
    {
        "eng": "at a science fair",
        "chi": "在一场科学展览"
    },
    {
        "eng": "be able to do",
        "chi": "能够去做某事"
    },
    {
        "eng": "make money from",
        "chi": "从中赚钱"
    },
    {
        "eng": "have a hard time moving around",
        "chi": "行动不便"
    },
    {
        "eng": "take risks",
        "chi": "冒风险"
    },
    {
        "eng": "give it a try",
        "chi": "尝试一下"
    },
    {
        "eng": "keep in touch with",
        "chi": "与…保持联系"
    },
    {
        "eng": "have a talent for",
        "chi": "做…有天赋"
    },
    {
        "eng": "turn images into sounds",
        "chi": "把图转变为声音"
    },
    {
        "eng": "make a difference",
        "chi": "有所作为"
    },
    {
        "eng": "end up",
        "chi": "以…为结束"
    },
    {
        "eng": "throughout the day",
        "chi": "一整天"
    },
    {
        "eng": "lower the chance of",
        "chi": "降低…的几率"
    },
    {
        "eng": "from then on",
        "chi": "从那时起"
    },
    {
        "eng": "shake hands with",
        "chi": "与… 握手"
    },
    {
        "eng": "remember to come",
        "chi": "记得来"
    },
    {
        "eng": "found it perfect for sticking notes",
        "chi": "发现它很适合用来贴纸条"
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
