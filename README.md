# ChatGPT Pro Research

在 DeepSeek Harness（DSH）里，用真实的 ChatGPT Pro 网页会话做无人值守的多轮调研：自动提问、按成功判据裁决并汇总成一份可复核的文档。

[![dsh.pub](https://dsh.pub/api/badges/Octo-o-o-o/chatgpt-pro-research.svg)](https://dsh.pub/zh/plugins/chatgpt-pro-research/)
[![npm](https://img.shields.io/npm/v/chatgpt-pro-research.svg)](https://www.npmjs.com/package/chatgpt-pro-research)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.2-4c1)

> English: Unattended multi-round research through a real ChatGPT Pro web session, with local records and a DSH sidebar.

> **风险提示**：这是订阅网页自动化，不是官方 API。自动化网页可能违反服务条款、触发风控或导致账号受限；页面改版也会让它失效。请自行评估风险，不要把登录态、Cookie 或凭据写进仓库或日志。

![Pro Research 面板](resources/screenshots/panel.png)

*首次安装后的空状态：侧边栏入口和面板已加载；在会话里用 `/pro-research` 开始。*

## 它解决什么问题

- 把一个研究问题拆成多轮：提问 → 追问 → 按 `criteria` 裁决 → 汇总，不需要你盯着每一轮。
- 每一轮的问题、答复、裁决和最终文档都落盘，可以中断、恢复、取消或人工核对。
- 侧边栏「Pro Research」列出主题、轮次、状态与记录路径；卡住时能直接处理。
- 适合文献/竞品/方案/技术选型调研；不适合需要官方 API 合规保证、需要多账号并行、或必须逐字引用的场景。

## 前置条件

- DSH `>= 0.2.1-rc.2 < 0.3.0`（本版本实测 `0.2.1-rc.2`）。
- Node.js 22+（DSH 自带 runtime 也可以）。
- 本机安装 Google Chrome；插件使用一个独立的 Chrome profile，不碰你日常浏览器。
- 一个可登录 ChatGPT 网页的账号；首次登录必须有人工操作（验证码/Cloudflare）。
- 网页通道固定单账号、单会话；不做多账号并行、扇出或答复合并。

## 安装

### 从 dsh.pub（推荐）

```bash
npx dshpub add Octo-o-o-o/chatgpt-pro-research
```

dsh.pub 会把仓库固定到一个公开 commit 再安装。

### 从 Git commit

```bash
dsh plugin --profile <profile> add github:Octo-o-o-o/chatgpt-pro-research#<40-char-commit>
```

`<40-char-commit>` 用仓库 Release 或 dsh.pub 记录里的完整 SHA；`<profile>` 换成你的 profile（例如 `desktop`、`web`）。

### 从 npm

```bash
dsh plugin --profile <profile> add chatgpt-pro-research
```

npm 上现有 `0.2.x`；本仓库的 `0.3.0` 以 Git/dsh.pub 分发为准。

### 启用

安装后重启 DSH，打开 **设置 → 插件**，确认 **ChatGPT Pro Research** 已启用；也可以在 profile 的 `dsh.profile.bundles` 里确认包名。插件加载后，工具列表会出现 `pro_research`，侧边栏会出现 **Pro Research** 面板。

## 首次登录

```text
pro_research(action="login")
```

插件会打开一个独立的 Chrome 窗口。登录 ChatGPT 后关闭窗口即可；登录态保存在 `~/.dsh/pro-research/browser`，与研究插件、设计插件共用，只需登录一次。

## 快速开始

直接对 agent 说“用 Pro 调研一下……”，或调用工具：

```text
pro_research(
  action="start",
  confirmed=true,
  title="DSH 插件市场对比",
  question="比较 dsh.pub 与 dsh.so 的收录规则和安装方式",
  brief="面向插件作者，输出一张对比表 + 一份提交检查清单",
  criteria=["覆盖两个市场的提交门槛", "给出可执行的提交流程", "标注不确定项"],
  materials=["docs/market-notes.md"],
  rounds=3
)
```

其余动作：`status`、`list`、`resume`、`cancel`、`human_check`、`accept`、`review`、`review_cancel`、`wake`、`regenerate`、`probe`、`login`。

- `start` 需要 `confirmed=true`，表示你已经确认问题、判据和轮次。
- `human_check` 用于回答 agent 的人工核对请求（`submitted` / `not_submitted` / `reopen`）。
- `resume` 恢复中断的主题；`cancel` 取消；`review` / `review_cancel` 处理 capped 后的交接。

## 设置

在 **设置 → 插件 → ChatGPT Pro Research** 里配置：

| 设置 | 默认 | 说明 |
|---|---|---|
| `rounds` | `3` | 每个主题默认轮次上限（1–10）。 |
| `model` | `pro` | ChatGPT 页面上的模型：`pro` 或 `thinking`。 |
| `store` | `project` | 记录位置：`project`（仓库 `docs/research`）或 `local`（DSH 本机）。 |
| `autoStart` | `false` | 研究卡是否跳过点击直接开跑。 |
| `autoReview` | `true` | capped 后唤醒原会话检查产物，决定接受或继续。 |
| `notify` | `stall-only` | 通知策略：`stall-only` 只在卡住时提醒，`all` 完成也提醒。 |
| `stallMinutes` | `45` | 无进展判定分钟数；生成中不计时。 |
| `maxRoundMinutes` | `90` | 单轮墙钟上限（分钟）。 |
| `maxFiles` | `12` | 单轮附件数量上限。 |
| `maxTotalMB` | `24` | 单轮附件总大小（MB）。 |
| `rawAnswers` | `local` | 原始答复保存位置：`local` 或 `repo`；公开仓库请用 `local`。 |
| `rawAnswersDir` | 空 | `local` 模式的原文目录；留空用 `~/.dsh/pro-research/raw`。 |
| `headless` | `false` | 无头模式仅建议用于自检；首次登录必须有头。 |
| `judgeProvider` | 空 | 自动裁决的 LLM provider；留空用 DSH 默认模型，填 `off` 关闭。 |
| `judgeModel` | 空 | 自动裁决的 model；与 provider 同时填写可覆盖。 |

## 产物与记录

```text
<project>/docs/research/<slug>/     # store=project
├── topic.json                       # 问题、判据、轮次、状态
├── round-01/                        # 每轮答复、材料、截图/附件
├── adjudication.md                  # 裁决与理由
├── receipts/                        # 提交/回执
└── final.md                         # 最终汇总文档
```

- `store=local`：`~/.dsh/chatgpt-pro-research/projects/<project>/<slug>/`。
- 原始答复默认只在 `~/.dsh/pro-research/raw/<topic-id>/`；只有 `rawAnswers=repo` 时才复制进项目。
- 登录态：`~/.dsh/pro-research/browser`（敏感，不要提交）。
- 主题列表、轮次和状态也会显示在侧边栏面板里。

## 验证清单

装好后按这个顺序确认：

1. 工具列表出现 `pro_research`，侧边栏出现 **Pro Research** 面板。
2. `pro_research(action="probe")` 返回浏览器/登录态状态。
3. `action="login"` 能打开 Chrome，并能登录 ChatGPT。
4. 跑一个 1 轮的小主题，确认 `docs/research/<slug>/` 下出现 `topic.json`、轮次目录和 `final.md`。
5. 刷新侧边栏，确认主题、状态、轮次和记录路径都在。

## 安全与隐私

- **会出网**：问题、brief、判据、材料和你选择的附件会发送到 `chatgpt.com`；自动裁决使用你配置的 DSH LLM provider。
- **本地保存**：Cookie/登录态在 `~/.dsh/pro-research/browser`；记录在项目 `docs/research` 或 `~/.dsh/chatgpt-pro-research`；原始答复在 `~/.dsh/pro-research/raw`。
- **权限边界**：插件以 DSH 进程权限运行，可以读写上述目录、启动本机 Chrome、通过 DSH 的工具/模型服务工作；它不读取与调研无关的浏览器 profile。
- **文件管理器**：插件只用固定的 `explorer.exe` / `open` / `xdg-open` 参数打开它自己生成的产物文件/目录，不拼接用户输入，也不执行 shell 命令。
- **不会**把登录态、Cookie、完整原始答复写进仓库；`rawAnswers` 默认 `local`。
- **清理**：删除主题目录即可删除该主题；卸载时见下文。不要把 `~/.dsh/pro-research` 提交到任何仓库。

## 已知限制

- 网页改版、Cloudflare 挑战、账号风控或额度限制都可能让某一轮失败；插件会保留已完成的轮次，不会假装成功。
- 只支持单账号、单会话；没有多账号并行。
- 页面上的模型/功能以 ChatGPT 网页实际提供为准，`model=pro` 不保证每个账号都有。
- 自动裁决看的是文本答复，不等同于人工评审；重要结论建议 `human_check`。
- 附件受 `maxFiles` / `maxTotalMB` 限制；单轮超时受 `maxRoundMinutes` 限制。
- 没有官方 API 通道；需要 API 合规保证的场景请另找方案。

## 故障排查

| 现象 | 先检查 |
|---|---|
| 登录窗口没出现 | 是否有残留的插件 Chrome 窗口占用 profile；关掉后重试 `login`。 |
| 登录后仍显示未登录 | `probe` 看状态；确认 `~/.dsh/pro-research/browser` 可写；必要时重新 `login`。 |
| 卡在 Cloudflare/验证码 | 在弹出的窗口里手动完成，再关闭窗口；不要用无头模式做首次登录。 |
| 某一轮一直不结束 | `status` 看轮次；到 `maxRoundMinutes` 会标记；用 `cancel` 或 `human_check`。 |
| 裁决失败/没有裁决 | 配置 `judgeProvider` + `judgeModel`，或把 `judgeProvider` 设为 `off` 后人工核对。 |
| 主题卡在 capped/reviewing | `review` 让原会话检查产物，或 `human_check` 人工决定。 |
| 附件没带上 | 检查 `maxFiles`、`maxTotalMB` 和文件路径；材料里的图片/文件要实际存在。 |
| 重启 DSH 后轮次丢失 | 已发送但未回执的轮次会停在待人工核对；用 `status` / `resume` 处理，不要自动重发。 |

## 本地验证记录

2026-10-23，DSH `0.2.1-rc.2`，空 `web` profile，从公开 commit `9e3853f` 安装：

- `--dump-config` 显示 `# == chatgpt-pro-research` 组合包层；
- `GET /chatgpt-pro-research/topics` 返回 `200 {"topics":[]}`；
- 侧边栏 **Pro Research** 入口和空面板正常加载。

> 这是安装/加载验证，不等于真实 ChatGPT 登录和完整多轮调研的验收；后者需要你自己的账号。

## 兼容性

| 项 | 值 |
|---|---|
| DSH | `0.2.1-rc.2` 实测；`engines.dsh` 为 `>=0.2.1-rc.2 <0.3.0` |
| Node.js | 22+ |
| 浏览器 | 本机 Google Chrome（稳定版） |
| 平台 | Windows 已验证；macOS/Linux 使用对应的 Chrome 启动路径，未在仓库内声明实测 |
| 插件版本 | `0.3.0` |

## 禁用与卸载

**临时禁用**：**设置 → 插件** 关闭 **ChatGPT Pro Research**；或从 profile 的 `dsh.profile.bundles` 移除 `chatgpt-pro-research`，重启 DSH。

**卸载**：

```bash
dsh plugin --profile <profile> remove chatgpt-pro-research
```

然后按需删除：

- `~/.dsh/pro-research/`（登录态、原始答复、临时文件）
- `~/.dsh/chatgpt-pro-research/`（`store=local` 的记录）
- 项目里的 `docs/research/`（只删你确认不要的主题）

## 开发

源码和开发说明在 monorepo：[Octo-o-o-o/dsh-pro](https://github.com/Octo-o-o-o/dsh-pro/tree/main/packages/research)。

```bash
npm install
npm test
npm run typecheck
npm run build
node scripts/smoke-bundle.mjs
```

本仓库是发布仓库：`lib/` 是构建产物，请不要直接改 `lib/`；改源码请到 monorepo 的 `packages/research`。

## License

MIT。
