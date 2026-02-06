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
      const dataBuffer = encoder.encode(GameState.encryptionSeed);
      return await crypto.subtle.importKey(
        "raw",
        dataBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      );
    } catch (e) {
      console.error('生成密钥失败:', e);
      throw e;
    }
  },

  // 从密码派生密钥
  async deriveKey(password) {
    try {
      const encoder = new TextEncoder();
      const salt = encoder.encode('Ms.WuYYDS#2025Salt'); // 固定盐值

      const baseKey = await this.generateKey();
      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      return derivedKey;
    } catch (e) {
      console.error('派生密钥失败:', e);
      throw e;
    }
  },

  // 加密数据
  async encryptData(data) {
    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 12字节IV

      const key = await this.deriveKey(GameState.encryptionSeed);
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encodedData
      );

      // 将IV和加密数据合并
      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv, 0);
      result.set(new Uint8Array(encrypted), iv.length);

      // 转换为Base64字符串
      return btoa(String.fromCharCode(...result));
    } catch (e) {
      console.error('加密数据失败:', e);
      throw e;
    }
  },

  // 解密数据
  async decryptData(encryptedData) {
    try {
      // 从Base64解码
      const binaryString = atob(encryptedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 提取IV（前12字节）
      const iv = bytes.slice(0, 12);
      // 提取加密数据
      const encrypted = bytes.slice(12);

      const key = await this.deriveKey(GameState.encryptionSeed);
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      const decoded = decoder.decode(decrypted);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('解密数据失败:', e);
      throw e;
    }
  },

  // 导出加密的游戏数据
  async exportEncryptedData() {
    try {
      const data = {
        progress: JSON.parse(localStorage.getItem('wordGameProgress') || '{}'),
        levelRecords: JSON.parse(localStorage.getItem('wordGameLevelRecords') || '{}'),
        totalRecords: JSON.parse(localStorage.getItem('wordGameTotalRecords') || '{}'),
        speedrunRecords: JSON.parse(localStorage.getItem('wordGameSpeedrunRecords') || '{}'),
        timestamp: Date.now(),
        version: GameState.gameVersion
      };

      return await this.encryptData(data);
    } catch (e) {
      console.error('导出加密数据失败:', e);
      throw e;
    }
  },

  // 导入加密的游戏数据
  async importEncryptedData(encryptedData) {
    try {
      const data = await this.decryptData(encryptedData);

      // 验证数据完整性
      if (!data.version || !data.timestamp) {
        throw new Error('数据格式无效');
      }

      // 保存数据
      if (data.progress) {
        localStorage.setItem('wordGameProgress', JSON.stringify(data.progress));

        // 更新GameState
        if (data.progress.currentLevel) GameState.currentLevel = data.progress.currentLevel;
        if (data.progress.totalScore) GameState.totalScore = data.progress.totalScore;
        if (data.progress.playerName) GameState.playerName = data.progress.playerName;
        if (data.progress.difficulty) GameState.difficulty = data.progress.difficulty;
        if (data.progress.completedLevels) GameState.completedLevels = new Set(data.progress.completedLevels);
      }

      if (data.levelRecords) {
        localStorage.setItem('wordGameLevelRecords', JSON.stringify(data.levelRecords));
        GameState.levelRecords = data.levelRecords;
      }

      if (data.totalRecords) {
        localStorage.setItem('wordGameTotalRecords', JSON.stringify(data.totalRecords));
        GameState.totalRecords = data.totalRecords;
      }

      if (data.speedrunRecords) {
        localStorage.setItem('wordGameSpeedrunRecords', JSON.stringify(data.speedrunRecords));
        GameState.speedrunRecords = data.speedrunRecords;
      }

      return true;
    } catch (e) {
      console.error('导入加密数据失败:', e);
      throw e;
    }
  },

  // 导出排行榜数据
  exportLeaderboardData() {
    try {
      const data = {
        levelRecords: GameState.levelRecords,
        totalRecords: GameState.totalRecords,
        speedrunRecords: GameState.speedrunRecords,
        timestamp: Date.now(),
        version: GameState.gameVersion
      };

      // 转换为JSON字符串并编码
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch (e) {
      console.error('导出排行榜数据失败:', e);
      throw e;
    }
  },

  // 导入排行榜数据
  importLeaderboardData(encodedData) {
    try {
      // 解码并解析数据
      const data = JSON.parse(decodeURIComponent(escape(atob(encodedData))));

      // 验证数据完整性
      if (!data.version || !data.timestamp) {
        throw new Error('数据格式无效');
      }

      // 合并排行榜数据
      if (data.levelRecords) {
        // 深度合并关卡记录
        for (const [difficulty, levels] of Object.entries(data.levelRecords)) {
          if (!GameState.levelRecords[difficulty]) {
            GameState.levelRecords[difficulty] = {};
          }
          for (const [level, records] of Object.entries(levels)) {
            if (!GameState.levelRecords[difficulty][level]) {
              GameState.levelRecords[difficulty][level] = [];
            }
            // 合并记录并去重
            const existingIds = new Set(GameState.levelRecords[difficulty][level].map(r => r.recordId));
            const newRecords = records.filter(r => !existingIds.has(r.recordId));
            GameState.levelRecords[difficulty][level].push(...newRecords);
            // 按分数和时间排序
            GameState.levelRecords[difficulty][level].sort((a, b) => b.score - a.score || a.time - b.time);
            // 只保留前50名
            GameState.levelRecords[difficulty][level] = GameState.levelRecords[difficulty][level].slice(0, 50);
          }
        }
      }

      if (data.totalRecords) {
        // 合并总记录
        for (const [difficulty, records] of Object.entries(data.totalRecords)) {
          if (!GameState.totalRecords[difficulty]) {
            GameState.totalRecords[difficulty] = [];
          }
          const existingIds = new Set(GameState.totalRecords[difficulty].map(r => r.recordId));
          const newRecords = records.filter(r => !existingIds.has(r.recordId));
          GameState.totalRecords[difficulty].push(...newRecords);
          // 按总分和时间排序
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
            <button class="control-btn secondary" onclick="showLeaderboard('level${GameState.currentLevel}')" style="min-width: 120px;">
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

  // 更新排行榜容器结构，实现上部分选难度，下部分选关卡或速通榜，底下再显示排行榜
  leaderboardContainer.innerHTML = `
        <div class="leaderboard-header">
            <h2>🏆 排行榜</h2>
            <button class="close-btn" onclick="hideLeaderboard()">×</button>
        </div>
        
        <!-- 上半部分：难度选择 -->
        <div class="leaderboard-difficulty-section">
            <h3>难度选择:</h3>
            <div class="difficulty-buttons">
                <button class="difficulty-btn ${GameState.difficulty === 'easy' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('easy')">简单</button>
                <button class="difficulty-btn ${GameState.difficulty === 'normal' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('normal')">普通</button>
                <button class="difficulty-btn ${GameState.difficulty === 'hard' ? 'active' : ''}" onclick="changeLeaderboardDifficulty('hard')">困难</button>
            </div>
        </div>
        
        <!-- 上半部分：关卡/速通榜选择 -->
        <div class="leaderboard-tabs-section">
            <h3>选择排行榜类型:</h3>
            <div class="leaderboard-tabs" id="leaderboardTabs">
                <!-- 选项卡将通过JS动态生成 -->
            </div>
        </div>
        
        <!-- 下半部分：排行榜内容 -->
        <div class="leaderboard-content-section">
            <h3>排行榜结果:</h3>
            <div class="leaderboard-content" id="leaderboardContent">
                <!-- 内容将通过JS动态生成 -->
            </div>
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
  for (let i = 1; i
