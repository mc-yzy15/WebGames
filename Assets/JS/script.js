// 导航网站脚本
document.addEventListener('DOMContentLoaded', function () {
    // 网站数据
    const sitesData = {
        'my-games': [
            {
                id: 1,
                title: 'WebGames',
                category: '游戏集合',
                description: '一个开源的网页游戏集合，包含贪吃蛇、扫雷、2048、火柴人冒险等经典游戏。',
                url: './menu/',
                icon: '🎮'
            },
            {
                id: 2,
                title: 'ZerOS',
                category: '系统',
                description: '浏览器虚拟操作系统，提供完整的桌面体验，包含游戏中心、应用商店等功能。',
                url: 'http://zeros.xin',
                icon: '🖥️'
            },
            {
                id: 3,
                title: '塔科夫私人服务器',
                category: '射击游戏',
                description: '完全免费的逃离塔科夫离线服务器（可联机），拥有优秀的管理团队和优异的服务器性能。',
                url: 'https://eftserver.yzy15.dpdns.org',
                icon: '🔫'
            },
            {
                id: 4,
                title: 'Word Game系列',
                category: '文字游戏',
                description: '包含英语单词游戏和句子游戏，锻炼你的语言能力。',
                url: './games/2024-2027WordGames-MS/',
                icon: '📚'
            },
            {
                id: 5,
                title: '贪吃蛇',
                category: '经典游戏',
                description: '经典贪吃蛇游戏，在线免费玩，支持键盘和触屏操作，挑战你的反应能力。',
                url: './games/snake-eating/',
                icon: '🐍'
            },
            {
                id: 6,
                title: '扫雷',
                category: '益智游戏',
                description: '经典扫雷游戏，通过逻辑推理找出所有地雷的位置，考验你的思维能力。',
                url: './games/minesweeper/',
                icon: '💣'
            },
            {
                id: 7,
                title: '2048',
                category: '数字游戏',
                description: '数字益智游戏，滑动方块合并数字，达到2048目标，锻炼你的数学思维。',
                url: './games/2048/',
                icon: '🔢'
            }
        ],
        'arcade-games': [
            {
                id: 101,
                title: 'Coolmath Games',
                category: '休闲游戏',
                description: '知名的在线游戏网站，提供各种教育性和娱乐性兼具的休闲游戏。',
                url: 'https://www.coolmathgames.com',
                icon: '🎯'
            },
            {
                id: 102,
                title: 'Kongregate',
                category: '街机游戏',
                description: '大型在线游戏平台，拥有数千款免费游戏，涵盖各种类型。',
                url: 'https://www.kongregate.com',
                icon: '🕹️'
            },
            {
                id: 103,
                title: 'Poki',
                category: '在线游戏',
                description: '免费在线游戏平台，提供最新最流行的小游戏，适合所有年龄。',
                url: 'https://poki.com',
                icon: '🎮'
            },
            {
                id: 104,
                title: 'Armor Games',
                category: '冒险游戏',
                description: '提供高品质的Flash和HTML5游戏，以冒险和策略游戏为主。',
                url: 'https://armorgames.com',
                icon: '⚔️'
            },
            {
                id: 105,
                title: 'Addicting Games',
                category: '休闲游戏',
                description: '经典游戏网站，提供各种类型的上瘾小游戏，让人欲罢不能。',
                url: 'https://www.addictinggames.com',
                icon: '🎲'
            }
        ],
        'puzzle-games': [
            {
                id: 201,
                title: 'BrainBashers',
                category: '智力游戏',
                description: '每日更新的智力游戏和逻辑谜题，挑战你的大脑。',
                url: 'https://www.brainbashers.com',
                icon: '🧠'
            },
            {
                id: 202,
                title: 'Lumosity',
                category: '脑力训练',
                description: '科学的脑力训练平台，通过游戏提升记忆力、注意力等认知能力。',
                url: 'https://www.lumosity.com',
                icon: '💡'
            },
            {
                id: 203,
                title: 'Simon Tatham\'s Puzzles',
                category: '经典谜题',
                description: '包含数十种经典逻辑谜题，如数独、拼图、连线等。',
                url: 'https://www.chiark.greenend.org.uk/~sgtatham/puzzles/',
                icon: '🧩'
            },
            {
                id: 204,
                title: 'Puzzle Baron',
                category: '逻辑谜题',
                description: '提供各种类型的逻辑谜题，包括逻辑网格、单词搜索等。',
                url: 'https://puzzlebaron.com',
                icon: '🔍'
            }
        ],
        'retro-games': [
            {
                id: 301,
                title: 'Internet Arcade',
                category: '复古街机',
                description: '经典街机游戏收藏，包含数千款复古街机游戏，重温童年回忆。',
                url: 'https://archive.org/details/internetarcade',
                icon: ' nostalg ic'
            },
            {
                id: 302,
                title: 'Classic Games',
                category: '经典游戏',
                description: '收集了众多经典电脑游戏，如俄罗斯方块、推箱子等。',
                url: 'https://www.classicgames.com',
                icon: '💾'
            },
            {
                id: 303,
                title: 'Free Online Games',
                category: '怀旧游戏',
                description: '免费怀旧游戏网站，提供各种复古风格的小游戏。',
                url: 'https://classicreload.com',
                icon: '📻'
            },
            {
                id: 304,
                title: 'My Abandonware',
                category: '老游戏',
                description: '提供大量经典的老游戏下载，可以重温过去的经典作品。',
                url: 'https://www.myabandonware.com',
                icon: '💿'
            }
        ],
        'strategy-games': [
            {
                id: 401,
                title: 'StrategyPlanet',
                category: '策略游戏',
                description: '策略游戏门户网站，提供各种策略游戏指南和在线策略游戏。',
                url: 'https://www.strategyplanet.com',
                icon: '♟️'
            },
            {
                id: 402,
                title: 'BoardGameArena',
                category: '桌游',
                description: '在线多人桌游平台，提供超过200种策略桌游。',
                url: 'https://en.boardgamearena.com',
                icon: '🎲'
            },
            {
                id: 403,
                title: 'TripleA',
                category: '战略游戏',
                description: '开源的回合制战略游戏，支持多种历史战役和自定义地图。',
                url: 'https://triplea-game.org',
                icon: '🗺️'
            },
            {
                id: 404,
                title: 'Hex Empire',
                category: '策略战争',
                description: '在线六边形帝国战略游戏，征服世界，扩张领土。',
                url: 'https://www.hexempire.com',
                icon: '⚔️'
            }
        ],
        'multiplayer-games': [
            {
                id: 501,
                title: 'Agar.io',
                category: '多人竞技',
                description: '流行的多人在线游戏，控制细胞吞噬对手，成为最大的球。',
                url: 'https://agar.io',
                icon: '🔵'
            },
            {
                id: 502,
                title: 'Krunker.io',
                category: '多人射击',
                description: '快节奏的多人FPS游戏，支持浏览器直接游玩。',
                url: 'https://krunker.io',
                icon: '🔫'
            },
            {
                id: 503,
                title: 'Slither.io',
                category: '多人竞技',
                description: '多人在线贪吃蛇游戏，控制蛇身吞噬光点，成为最长的蛇。',
                url: 'https://slither.io',
                icon: '🐍'
            },
            {
                id: 504,
                title: 'Diep.io',
                category: '坦克战斗',
                description: '多人坦克战斗游戏，升级武器，摧毁其他玩家。',
                url: 'https://diep.io',
                icon: '-tank'
            }
        ]
    };

    // 初始化页面
    initializePage();

    // 导航菜单事件监听
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            // 移除所有激活状态
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });

            // 添加当前激活状态
            this.classList.add('active');

            // 显示对应内容
            const sectionId = this.getAttribute('data-target');
            showSection(sectionId);
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterSites(searchTerm);
        });
    }

    // 初始化页面函数
    function initializePage() {
        // 默认显示我的游戏
        showSection('my-games');

        // 设置默认激活的导航项
        document.querySelector('.nav-item[data-target="my-games"]').classList.add('active');
    }

    // 显示指定内容区域
    function showSection(sectionId) {
        // 隐藏所有内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // 显示目标内容区域
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            renderSites(sectionId);
        }
    }

    // 渲染网站卡片
    function renderSites(sectionId) {
        const container = document.getElementById(`${sectionId}-container`);
        if (!container) return;

        const sites = sitesData[sectionId] || [];

        container.innerHTML = sites.map(site => `
            <div class="card">
                <div class="card-content">
                    <div class="card-icon">${site.icon}</div>
                    <h3 class="card-title">${site.title}</h3>
                    <div class="card-category">${site.category}</div>
                    <p class="card-description">${site.description}</p>
                    <a href="${site.url}" class="visit-btn" target="_blank">访问网站</a>
                </div>
            </div>
        `).join('');
    }

    // 过滤网站
    function filterSites(searchTerm) {
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;

        const sectionId = activeSection.id;
        const sites = sitesData[sectionId] || [];
        const container = document.getElementById(`${sectionId}-container`);

        if (!container) return;

        const filteredSites = sites.filter(site =>
            site.title.toLowerCase().includes(searchTerm) ||
            site.description.toLowerCase().includes(searchTerm) ||
            site.category.toLowerCase().includes(searchTerm)
        );

        container.innerHTML = filteredSites.map(site => `
            <div class="card">
                <div class="card-content">
                    <div class="card-icon">${site.icon}</div>
                    <h3 class="card-title">${site.title}</h3>
                    <div class="card-category">${site.category}</div>
                    <p class="card-description">${site.description}</p>
                    <a href="${site.url}" class="visit-btn" target="_blank">访问网站</a>
                </div>
            </div>
        `).join('');
    }

    // 添加一些动画效果
    function addScrollEffect() {
        const cards = document.querySelectorAll('.card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    // 页面加载完成后添加滚动效果
    window.addEventListener('load', addScrollEffect);
});