# IFLOW.md

## 项目概述

这是一个名为 **WebGames** 的开源网页游戏集合项目。它旨在通过 HTML、CSS 和 JavaScript 技术开发简单有趣的游戏，为玩家提供轻松的娱乐体验，同时也为开发者提供一个学习和实践前端开发的平台。

项目包含一个主菜单页面 (`menu/index.html`)，用户可以通过该页面访问不同的游戏。目前仓库中包含以下游戏：

1.  **贪吃蛇 (snake-eating)**: 经典的动作游戏，控制小蛇避开障碍，尽可能吃掉更多的食物。
2.  **扫雷 (minesweeper)**: 经典的益智游戏，通过逻辑推理找出所有地雷的位置。
3.  **2048**: 数字益智游戏，滑动方块，合并数字，达到2048的目标。
4.  **火柴人冒险 (stickman-adventure)**: 动作冒险游戏，控制火柴人角色，通过跳跃和战斗，完成冒险任务。

技术栈主要基于 **HTML5**, **CSS3**, 和 **JavaScript**。

## 运行方式

项目是纯前端的网页应用，无需构建步骤。

1.  **本地运行**: 在浏览器中直接打开 `menu/index.html` 文件，或者将整个项目目录部署到 Web 服务器上，然后访问对应的 URL。
2.  **在线访问**: 根据 README，项目已部署在 GitHub Pages 上，可以通过 [https://webgames.yzy15.dpdns.org/menu](https://webgames.yzy15.dpdns.org/menu) 访问。

每个游戏都位于 `games/` 目录下的独立子目录中，包含 `index.html`, `script.js`, 和 `style.css` 三个核心文件。

## 开发约定

*   **项目结构**: 每个游戏都应放在 `games/` 目录下的独立文件夹中。
*   **文件组成**: 每个游戏由三个核心文件组成：`index.html` (结构), `style.css` (样式), `script.js` (逻辑)。
*   **技术栈**: 使用原生 HTML, CSS, JavaScript 开发，不依赖外部框架。
*   **主菜单**: 新增游戏需要在 `menu/index.html` 中添加相应的入口。
*   **贡献流程**: 通过 Fork 仓库、修改代码、提交 Pull Request 的方式参与贡献。