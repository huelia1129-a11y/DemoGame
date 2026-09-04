# 网页战棋游戏（原型）

这是一个简单的网页战棋（回合制）游戏原型，使用纯 HTML/CSS/JavaScript 编写，代码放在 web_tactics_game/ 目录下。

特性：
- 8x8 格子地图
- 简单的单位选择 / 移动 / 攻击逻辑（玩家回合与敌方回合）
- 易于扩展的单位与回合系统

如何运行：
1. 克隆仓库后进入本目录：
   - `cd web_tactics_game`
2. 直接在浏览器中打开 `index.html`，或使用轻量静态服务器（推荐）：
   - `python -m http.server 8000` 然后访问 `http://localhost:8000/web_tactics_game/`

下一步建议：
- 添加单位面板、移动范围高亮、技能与行动点（AP）系统
- 使用 JSON/后端持久化单位与关卡数据
- 增加更完善的 AI 或多人对战
