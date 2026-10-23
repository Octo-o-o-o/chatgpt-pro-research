---
name: pro-research
description: 用 ChatGPT Pro 网页会话做无人值守的多轮调研或设计；只在用户明确要求 Pro 调研/设计、或同意你的提议时使用。
argument-hint: <目标> [--rounds N]
display-name: Pro Research
short-description: Bounded, resumable web-Pro research with local records
---

# Pro 调研

只在用户明确说「用 Pro 调研 / 让 Pro 看看 / Pro 设计」或同意你的提议时启动。普通问答、需要跑代码验证的任务、不能外发的材料，不要用。

网页通道固定为**单账号、单会话**：两个插件共用本机 Google Chrome 与 `~/.dsh/pro-research/browser`，不并行多账号、不扇出、不合并多份答复；同一主题始终续原会话。

## 启动：先给研究卡，不要直接跑

研究卡必须包含：

1. 主题与一句话研究问题；
2. **成功判据**（可判定的句子；自动裁决和提前停止都靠它）；
3. 准备发送的材料（路径 + 文件数 + 是否含敏感项）与 brief 要点；
4. 通道（ChatGPT Pro 网页）、轮次上限（默认 3）、记录位置（project / local）；
5. 产物路径。

请用户确认，然后调用 `pro_research`：
`action=start, confirmed=true, title, question, brief, criteria[], materials[], rounds, type`。

不要用自己写的摘要替代原始材料；`materials` 是相对当前工作目录的路径，工具会做密钥扫描和清单哈希。

## 运行期间

发出去就不要再逐轮汇报。只有用户主动问才 `action=status`；卡住时工具会把状态变成 `stalled`，并在 `stall_reason` 里给出 login / upload / ui / timeout / unknown_submission。

- `stalled` 不能自行重发。先把原因和现场告诉用户。
- `unknown_submission` 必须由用户核对后调用 `action=human_check`（conclusion=submitted / not_submitted / reopen，note 必填）。
- 登录失效：请用户运行 `action=login`，完成后再 `action=resume`。
- 账号、ToS、页面改版风险随任务说明；不要承诺一定能跑完。

## 答复回来之后

宿主模型负责裁决，不把 Pro 的话直接当结论：

1. 读原始答复与各轮 `verdict.md`；
2. 对照成功判据逐条判断：采纳 / 部分采纳 / 有依据驳回；
3. 把裁决写进项目文档，保留分歧和未决项；
4. 只把变化送进下一轮（工具会在同一主题里续轮次），不重复已确认内容。

`final.md` 是机械汇总，不是交付物；真正的方案由宿主按项目规范落盘。

## 追问

在同一主题上追加一轮用：

`pro_research(action="continue", topic_id=..., brief=..., confirmed=true)`

只送变化：上一轮裁决 + 新 brief + 新增/修改的材料。原会话丢了由宿主生成 `context.md` 重开；不要新建平行主题。已达轮次上限的主题，`continue` 会显式加一并留下记录；先向用户说明这是加轮。

## 边界

- 不自动 push，不把 GitHub 当唯一材料通道；已提交内容可给提交号 + 路径，让 Pro 自己决定要不要读。
- 密钥、凭据、`.env` 不进材料；扫描命中就换材料，不要绕过。
- 不重发提交状态未知的轮次；不把失败说成完成。
- 同一主题只有一份记录；换 `store` 需要显式迁移，不要两处各写一半。
