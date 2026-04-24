// Schema kept identical to the ranking-site template.
// Semantic relabels (in i18n.ts):
//   h_index   → Overall Score (0-100; weighted composite of 6 criteria)
//   citations → Code Generation Quality (×10)
//   papers    → Productivity Impact (×10)
//   field     → Tool flavor / specialty
//   native_province_*  → Tool category (group axis)
//   notable_work → Sub-scores (context/speed/IDE/pricing) + pros/cons + ideal user
//
// Weighting scheme:
//   Code generation quality      : 25%   (the whole point of the tool)
//   Context understanding        : 20%   (huge differentiator in 2026)
//   Developer productivity impact: 18%
//   Pricing                      : 13%
//   IDE integration              : 12%
//   Speed and latency            : 12%
//
// Snapshot of the AI coding assistant market, April 2026.
// Scores reflect SWE-Bench Pro / SWE-Bench Verified results, hands-on use,
// and developer-survey signal (Stack Overflow, Pragmatic Engineer, Dev.to).
// Treat as descriptive, not endorsement.

export interface Researcher {
  id: number;
  name_en: string;
  name_zh: string;
  affiliation_en: string;
  affiliation_zh: string;
  field_en: string;
  field_zh: string;
  h_index: number;     // Overall Score
  citations: number;   // Code Generation Quality ×10
  papers: number;      // Productivity Impact ×10
  notable_work_en: string;
  notable_work_zh: string;
  country: string;
  native_province_en: string;
  native_province_zh: string;
  homepage?: string;
}

export interface ProvinceStats {
  province_en: string;
  province_zh: string;
  count: number;
  researchers: Researcher[];
  avg_h_index: number;
  total_citations: number;
}

export function getProvinceStats(data: Researcher[]): ProvinceStats[] {
  const map = new Map<string, Researcher[]>();
  for (const r of data) {
    const key = r.native_province_en;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const stats: ProvinceStats[] = [];
  for (const [province_en, rs] of map) {
    stats.push({
      province_en,
      province_zh: rs[0].native_province_zh,
      count: rs.length,
      researchers: rs.sort((a, b) => b.h_index - a.h_index),
      avg_h_index: Math.round(rs.reduce((s, r) => s + r.h_index, 0) / rs.length),
      total_citations: rs.reduce((s, r) => s + r.citations, 0),
    });
  }
  return stats.sort((a, b) => b.count - a.count || b.avg_h_index - a.avg_h_index);
}

type _R = {
  n: string; z: string;
  a: string; az: string;
  f: string; fz: string;
  h: number; c: number; p: number;
  w: string; wz: string;
  g: string;
  pn: string; pz: string;
  hp?: string;
};

const _data: _R[] = [
  // === AI-NATIVE IDEs ===
  {n:"Cursor",z:"Cursor",a:"Anysphere",az:"Anysphere",f:"AI-native VS Code fork · Composer agent · tab",fz:"AI 原生 VS Code 分支 · Composer 代理 · Tab 补全",h:93,c:95,p:100,w:"Context 9·Speed 8·IDE 10·Price 7 ($20/Pro). Pros: Composer multi-file agent, autocomplete that learns your style, inherits VS Code marketplace, .cursorrules customization. Cons: $20 + model API at scale, Electron RAM. Ideal: full-time pros shipping daily.",wz:"上下文 9 · 速度 8 · IDE 10 · 价格 7 ($20/Pro)。优点：Composer 多文件代理，自适应 Tab 补全，继承 VS Code 插件市场，.cursorrules 定制；缺点：规模化时 $20 + API 双重收费，Electron 吃内存；适合：每日发布的全职专业开发者。",g:"🇺🇸",pn:"AI-Native IDE",pz:"AI 原生 IDE",hp:"https://cursor.com"},
  {n:"Windsurf",z:"Windsurf",a:"OpenAI (acq. Codeium)",az:"OpenAI (收购自 Codeium)",f:"Cursor-style IDE · Cascade agent",fz:"类 Cursor IDE · Cascade 代理",h:89,c:90,p:95,w:"Context 9·Speed 9·IDE 9·Price 8 ($15/Pro). Pros: Cascade agent rivals Composer, generous free tier, OpenAI acquisition (May 2025) accelerated capabilities. Cons: ecosystem still maturing post-acquisition. Ideal: devs wanting Cursor capability cheaper.",wz:"上下文 9 · 速度 9 · IDE 9 · 价格 8 ($15/Pro)。优点：Cascade 代理可比肩 Composer，免费版大方，2025 年 5 月被 OpenAI 收购后能力加速；缺点：收购后生态仍在整合；适合：想要 Cursor 能力但更便宜的开发者。",g:"🇺🇸",pn:"AI-Native IDE",pz:"AI 原生 IDE",hp:"https://windsurf.com"},
  {n:"Zed (with AI)",z:"Zed (含 AI)",a:"Zed Industries",az:"Zed Industries",f:"Rust-native IDE · multi-model AI · multiplayer",fz:"Rust 原生 IDE · 多模型 AI · 多人协作",h:84,c:80,p:88,w:"Context 8·Speed 10·IDE 8·Price 9 (free + paid models). Pros: insanely fast (Rust + GPU), multiplayer collab, swap Claude/GPT/Gemini/local per task. Cons: smaller plugin ecosystem. Ideal: senior devs sick of Electron.",wz:"上下文 8 · 速度 10 · IDE 8 · 价格 9 (免费 + 付费模型)。优点：极快 (Rust + GPU)，多人协作，可按任务切换 Claude/GPT/Gemini/本地模型；缺点：插件生态较小；适合：受够 Electron 的资深开发者。",g:"🇺🇸",pn:"AI-Native IDE",pz:"AI 原生 IDE",hp:"https://zed.dev"},
  {n:"Trae",z:"Trae",a:"ByteDance",az:"字节跳动",f:"Free AI IDE · Doubao + Claude switcher",fz:"免费 AI IDE · 豆包 + Claude 可切换",h:78,c:75,p:85,w:"Context 8·Speed 8·IDE 8·Price 10 (free for everyone). Pros: completely free including Claude/Doubao access, slick UX, China-friendly. Cons: ByteDance privacy concerns for sensitive code. Ideal: budget-conscious devs, Asia-based teams.",wz:"上下文 8 · 速度 8 · IDE 8 · 价格 10 (全员免费)。优点：完全免费含 Claude/豆包接入，UX 漂亮，国内可用；缺点：敏感代码有字节跳动隐私顾虑；适合：预算有限的开发者，亚洲团队。",g:"🇨🇳",pn:"AI-Native IDE",pz:"AI 原生 IDE",hp:"https://trae.ai"},
  {n:"Void",z:"Void",a:"Open source",az:"开源",f:"Open-source Cursor alternative",fz:"开源 Cursor 替代品",h:73,c:70,p:75,w:"Context 7·Speed 7·IDE 8·Price 10 (free, BYO API key). Pros: open source, run any model (incl. local Ollama), AGPL. Cons: less polished, fewer features. Ideal: tinkerers, privacy-first devs.",wz:"上下文 7 · 速度 7 · IDE 8 · 价格 10 (免费，自带 API)。优点：开源，可用任意模型 (含本地 Ollama)，AGPL；缺点：精致度低，功能少；适合：折腾党、隐私优先的开发者。",g:"🌍",pn:"AI-Native IDE",pz:"AI 原生 IDE"},

  // === IDE PLUGINS ===
  {n:"GitHub Copilot",z:"GitHub Copilot",a:"GitHub / Microsoft",az:"GitHub / 微软",f:"VS Code · JetBrains · Vim · Xcode plugin · agent mode",fz:"VS Code · JetBrains · Vim · Xcode 插件 · 代理模式",h:88,c:88,p:90,w:"Context 8·Speed 9·IDE 10·Price 9 ($10/mo, $20 Pro+). Pros: every IDE has it, model router (Claude/GPT/Gemini), enterprise-friendly, agent mode added 2025. Cons: feels behind Cursor on agent loops. Ideal: enterprise-aligned developers.",wz:"上下文 8 · 速度 9 · IDE 10 · 价格 9 ($10/月，$20 Pro+)。优点：每个 IDE 都支持，模型路由器 (Claude/GPT/Gemini)，企业友好，2025 加入代理模式；缺点：代理循环不及 Cursor；适合：企业对齐的开发者。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件",hp:"https://github.com/features/copilot"},
  {n:"Sourcegraph Cody",z:"Sourcegraph Cody",a:"Sourcegraph",az:"Sourcegraph",f:"Codebase-context plugin · enterprise-grade",fz:"代码库上下文插件 · 企业级",h:80,c:85,p:85,w:"Context 10·Speed 8·IDE 9·Price 7 ($9-19/mo). Pros: best whole-codebase context (Sourcegraph indexing), enterprise SSO/audit, model agnostic. Cons: requires Sourcegraph for full power. Ideal: enterprise dev teams with large monorepos.",wz:"上下文 10 · 速度 8 · IDE 9 · 价格 7 ($9-19/月)。优点：全代码库上下文最佳 (Sourcegraph 索引)，企业 SSO/审计，模型无关；缺点：完整功能需 Sourcegraph 部署；适合：有大型 monorepo 的企业开发团队。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Codeium (free)",z:"Codeium (免费版)",a:"Codeium",az:"Codeium",f:"Free Copilot alternative · Pro available",fz:"免费 Copilot 替代 · 含 Pro 版",h:78,c:80,p:80,w:"Context 7·Speed 9·IDE 10·Price 10 (free for individuals). Pros: free for individual use, 70+ language support, every major IDE. Cons: now Windsurf-shadowed, less aggressive feature push. Ideal: solo devs, students.",wz:"上下文 7 · 速度 9 · IDE 10 · 价格 10 (个人免费)。优点：个人用户免费，支持 70+ 语言，所有主流 IDE；缺点：被 Windsurf 抢了风头，功能推进放缓；适合：独立开发者、学生。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Tabnine",z:"Tabnine",a:"Tabnine",az:"Tabnine",f:"Code completion · privacy-first · self-hostable",fz:"代码补全 · 隐私优先 · 可自部署",h:72,c:72,p:75,w:"Context 7·Speed 9·IDE 9·Price 7 ($12/mo). Pros: self-hostable for sensitive code, no training on your code, JetBrains-friendly. Cons: feels behind on agent capabilities, less differentiation. Ideal: regulated industries, privacy-sensitive teams.",wz:"上下文 7 · 速度 9 · IDE 9 · 价格 7 ($12/月)。优点：可私有部署用于敏感代码，不用你的代码训练，JetBrains 友好；缺点：代理能力落后，差异化弱；适合：受监管行业、注重隐私的团队。",g:"🇮🇱",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Continue.dev",z:"Continue.dev",a:"Open source",az:"开源",f:"Open-source IDE plugin · BYO model · custom rules",fz:"开源 IDE 插件 · 自带模型 · 自定义规则",h:78,c:78,p:80,w:"Context 8·Speed 8·IDE 9·Price 10 (free, BYO API). Pros: open source, swap any model (Claude/GPT/local), .continuerc.json customization. Cons: setup harder than Copilot, BYO model = BYO bill. Ideal: tinkerers, devs who want model freedom.",wz:"上下文 8 · 速度 8 · IDE 9 · 价格 10 (免费，自带 API)。优点：开源，可换任意模型 (Claude/GPT/本地)，.continuerc.json 定制；缺点：配置比 Copilot 麻烦，模型自费；适合：折腾党、想要模型自由的开发者。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Amazon Q Developer",z:"Amazon Q Developer",a:"AWS",az:"AWS",f:"AWS-aware coding · transformation · CloudShell",fz:"AWS 感知编程 · 代码改造 · CloudShell",h:75,c:75,p:78,w:"Context 8·Speed 8·IDE 8·Price 8 (free tier + $19/mo Pro). Pros: AWS docs/services native, Java upgrade transformations, free tier strong. Cons: AWS-shop centric, less general. Ideal: AWS-heavy enterprises.",wz:"上下文 8 · 速度 8 · IDE 8 · 价格 8 (免费版 + $19/月 Pro)。优点：原生 AWS 文档/服务，Java 升级改造，免费版强；缺点：AWS 中心化，通用性弱；适合：重度使用 AWS 的企业。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"JetBrains AI Assistant + Junie",z:"JetBrains AI Assistant + Junie",a:"JetBrains",az:"JetBrains",f:"In-IDE AI · Junie agent · all JB IDEs",fz:"IDE 内 AI · Junie 代理 · 全家桶",h:80,c:80,p:82,w:"Context 9·Speed 8·IDE 10·Price 7 ($10-20/mo, included in All Products Pack). Pros: deepest IntelliJ-family integration, Junie agent for complex tasks, multi-model. Cons: JetBrains-only. Ideal: IntelliJ/PyCharm/WebStorm/Rider users.",wz:"上下文 9 · 速度 8 · IDE 10 · 价格 7 ($10-20/月，All Products Pack 已含)。优点：IntelliJ 全家桶最深集成，Junie 代理处理复杂任务，多模型；缺点：仅限 JetBrains；适合：IntelliJ/PyCharm/WebStorm/Rider 用户。",g:"🇨🇿",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Augment Code",z:"Augment Code",a:"Augment",az:"Augment",f:"Enterprise codebase context · Claude-powered",fz:"企业代码库上下文 · 基于 Claude",h:80,c:85,p:85,w:"Context 10·Speed 8·IDE 9·Price 6 ($30/mo). Pros: 200K-token context window of YOUR code, enterprise SOC 2, signed by ex-Google leadership. Cons: pricier than alternatives. Ideal: senior devs in large codebases.",wz:"上下文 10 · 速度 8 · IDE 9 · 价格 6 ($30/月)。优点：你自己代码的 20 万 token 上下文窗口，企业 SOC 2，前 Google 高管创办；缺点：比同类贵；适合：大型代码库中的资深开发者。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},
  {n:"Supermaven (now in Cursor)",z:"Supermaven (已并入 Cursor)",a:"Anysphere (acq.)",az:"Anysphere (收购)",f:"Sub-100ms autocomplete · 1M token context",fz:"亚 100ms 补全 · 100 万 token 上下文",h:74,c:80,p:80,w:"Context 9·Speed 10·IDE 8·Price 8 (was $10/mo). Pros: fastest autocomplete in the industry, 1M context. Cons: now folded into Cursor; standalone product on life support. Ideal: covered by Cursor users now.",wz:"上下文 9 · 速度 10 · IDE 8 · 价格 8 (原 $10/月)。优点：业界最快补全，100 万上下文；缺点：已并入 Cursor，独立产品基本停摆；适合：已被 Cursor 用户继承。",g:"🇺🇸",pn:"IDE Plugin",pz:"IDE 插件"},

  // === TERMINAL CODERS ===
  {n:"Claude Code",z:"Claude Code",a:"Anthropic",az:"Anthropic",f:"Terminal-native agentic coder · Sonnet/Opus",fz:"终端原生编程代理 · Sonnet/Opus",h:94,c:100,p:100,w:"Context 10·Speed 8·IDE 8·Price 9 (in Claude Pro/Max plans). Pros: best agentic coding on hard SWE-Bench, runs in terminal/VS Code/JetBrains, hooks/sub-agents/skills system. Cons: terminal CLI may intimidate, requires Claude subscription. Ideal: senior pros tackling hard problems.",wz:"上下文 10 · 速度 8 · IDE 8 · 价格 9 (Claude Pro/Max 已含)。优点：硬 SWE-Bench 上代理编程最强，运行于终端/VS Code/JetBrains，含 hooks/子代理/skills 系统；缺点：终端 CLI 略有门槛，需 Claude 订阅；适合：处理硬问题的资深专业人士。",g:"🇺🇸",pn:"Terminal Coder",pz:"终端编程",hp:"https://claude.com/claude-code"},
  {n:"Aider",z:"Aider",a:"Open source",az:"开源",f:"Terminal pair-programmer · git-aware · BYO model",fz:"终端结对编程 · 懂 git · 自带模型",h:84,c:90,p:88,w:"Context 9·Speed 8·IDE 6·Price 10 (free, BYO API). Pros: git-aware (commits each change), works with any LLM, model leaderboard, /architect mode. Cons: terminal CLI, you pay model API costs. Ideal: principled OSS-loving devs.",wz:"上下文 9 · 速度 8 · IDE 6 · 价格 10 (免费，自带 API)。优点：懂 git (每次改动自动 commit)，兼容任意 LLM，含模型排行榜，/architect 模式；缺点：CLI 门槛，模型 API 自费；适合：原则性强、爱开源的开发者。",g:"🌍",pn:"Terminal Coder",pz:"终端编程",hp:"https://aider.chat"},
  {n:"OpenAI Codex CLI",z:"OpenAI Codex CLI",a:"OpenAI",az:"OpenAI",f:"OpenAI's terminal coder · GPT-5 · sandbox by default",fz:"OpenAI 终端编程 · GPT-5 · 默认沙盒",h:86,c:92,p:90,w:"Context 9·Speed 9·IDE 7·Price 8 (incl. ChatGPT Plus/Pro). Pros: OpenAI's answer to Claude Code, sandbox-by-default, gpt-5-codex specialised model. Cons: terminal-only, less mature ecosystem than Claude Code. Ideal: OpenAI-aligned devs.",wz:"上下文 9 · 速度 9 · IDE 7 · 价格 8 (ChatGPT Plus/Pro 已含)。优点：OpenAI 对标 Claude Code 之作，默认沙盒，gpt-5-codex 专用模型；缺点：仅终端，生态不及 Claude Code；适合：OpenAI 阵营的开发者。",g:"🇺🇸",pn:"Terminal Coder",pz:"终端编程"},
  {n:"Goose",z:"Goose",a:"Block (Square)",az:"Block (Square)",f:"Open-source terminal AI agent · MCP-native",fz:"开源终端 AI 代理 · MCP 原生",h:78,c:75,p:80,w:"Context 8·Speed 8·IDE 6·Price 10 (free, BYO model). Pros: MCP-native (extensibility), Block-backed open source, model agnostic. Cons: terminal-only, smaller community. Ideal: extensibility-loving devs.",wz:"上下文 8 · 速度 8 · IDE 6 · 价格 10 (免费，自带模型)。优点：MCP 原生 (强扩展)，Block 支持的开源项目，模型无关；缺点：仅终端，社区较小；适合：爱扩展性的开发者。",g:"🇺🇸",pn:"Terminal Coder",pz:"终端编程"},
  {n:"Plandex",z:"Plandex",a:"Open source",az:"开源",f:"Terminal · long-running multi-step tasks",fz:"终端 · 长任务多步规划",h:76,c:75,p:80,w:"Context 8·Speed 7·IDE 6·Price 10 (free, BYO API). Pros: planning-first design (sandboxed branches), multi-LLM, can pause/resume. Cons: niche, learning curve. Ideal: planners on big refactors.",wz:"上下文 8 · 速度 7 · IDE 6 · 价格 10 (免费，自带 API)。优点：规划优先设计 (沙盒分支)，多 LLM，可暂停/恢复；缺点：垂直，学习曲线；适合：做大型重构、爱规划的开发者。",g:"🌍",pn:"Terminal Coder",pz:"终端编程"},
  {n:"Crush (Charm)",z:"Crush (Charm)",a:"Charm",az:"Charm",f:"Beautiful terminal AI · TUI-native",fz:"漂亮终端 AI · TUI 原生",h:75,c:75,p:78,w:"Context 8·Speed 9·IDE 6·Price 10 (free, BYO API). Pros: gorgeous TUI by Charm (Bubble Tea makers), multi-model, fast. Cons: very new, terminal-only. Ideal: terminal-aesthetes.",wz:"上下文 8 · 速度 9 · IDE 6 · 价格 10 (免费，自带 API)。优点：Charm (Bubble Tea 团队) 出品的漂亮 TUI，多模型，快；缺点：很新，仅终端；适合：终端美学党。",g:"🇺🇸",pn:"Terminal Coder",pz:"终端编程"},

  // === CLOUD / BROWSER CODERS ===
  {n:"v0",z:"v0",a:"Vercel",az:"Vercel",f:"Prompt-to-UI · React + shadcn · deploy to Vercel",fz:"提示生成 UI · React + shadcn · 一键部署 Vercel",h:84,c:88,p:88,w:"Context 8·Speed 9·IDE N/A·Price 8 ($20/mo Premium). Pros: best React UI generator, shadcn aware, deploys directly. Cons: locked to React/shadcn, monthly credits cap. Ideal: front-end builders, designers.",wz:"上下文 8 · 速度 9 · IDE 不适用 · 价格 8 ($20/月 Premium)。优点：最强 React UI 生成器，懂 shadcn，可直接部署；缺点：锁定 React/shadcn，月度 credits 限制；适合：前端构建者、设计师。",g:"🇺🇸",pn:"Cloud Coder",pz:"云端编程",hp:"https://v0.app"},
  {n:"Bolt.new",z:"Bolt.new",a:"StackBlitz",az:"StackBlitz",f:"Browser-native full-stack gen · WebContainers",fz:"浏览器全栈生成 · WebContainers",h:80,c:80,p:90,w:"Context 7·Speed 8·IDE N/A·Price 7 ($20/mo Pro). Pros: full-stack apps in browser tab via WebContainers, Stripe/Supabase integrations, deploy in one click. Cons: token-burning, complex apps still buggy. Ideal: founders shipping MVPs.",wz:"上下文 7 · 速度 8 · IDE 不适用 · 价格 7 ($20/月 Pro)。优点：浏览器内 WebContainers 全栈生成，集成 Stripe/Supabase，一键部署；缺点：消耗 token 快，复杂应用易 bug；适合：发布 MVP 的创始人。",g:"🇺🇸",pn:"Cloud Coder",pz:"云端编程",hp:"https://bolt.new"},
  {n:"Lovable",z:"Lovable",a:"Lovable",az:"Lovable",f:"Prompt-to-app · GitHub sync · Supabase native",fz:"提示生成应用 · GitHub 同步 · 原生 Supabase",h:81,c:82,p:88,w:"Context 8·Speed 8·IDE N/A·Price 7 ($20/mo Pro). Pros: GitHub roundtrip, Supabase out-of-box, fastest-growing prompt-to-app product, beautiful default designs. Cons: design-system rigidity. Ideal: solo founders, agencies.",wz:"上下文 8 · 速度 8 · IDE 不适用 · 价格 7 ($20/月 Pro)。优点：与 GitHub 双向同步，原生 Supabase，最快增长的'文生应用'产品，默认设计漂亮；缺点：设计系统较死板；适合：独立创始人、代理公司。",g:"🇸🇪",pn:"Cloud Coder",pz:"云端编程",hp:"https://lovable.dev"},
  {n:"Replit Agent",z:"Replit Agent",a:"Replit",az:"Replit",f:"Cloud IDE + autonomous agent · publish to web",fz:"云端 IDE + 自主代理 · 一键发布",h:80,c:80,p:90,w:"Context 8·Speed 8·IDE 8·Price 7 (Replit Core $20/mo). Pros: best onboarding for beginners, agent builds full apps, publish + always-on hosting. Cons: limited vs local IDEs for complex projects. Ideal: students, hackathons, prototypers.",wz:"上下文 8 · 速度 8 · IDE 8 · 价格 7 (Replit Core $20/月)。优点：新手入门最佳，代理构建完整应用，发布即享常驻托管；缺点：复杂项目仍不如本地 IDE；适合：学生、黑客马拉松、原型快速验证。",g:"🇺🇸",pn:"Cloud Coder",pz:"云端编程"},
  {n:"Devin",z:"Devin",a:"Cognition",az:"Cognition",f:"Autonomous SWE agent · Slack/Linear integration",fz:"自主软件工程师代理 · Slack/Linear 集成",h:75,c:75,p:80,w:"Context 9·Speed 6·IDE N/A·Price 4 ($500/mo). Pros: long-running autonomous coding, plans + executes, Slack integration. Cons: very expensive, mixed real-world results, demos > production. Ideal: enterprises with budget for experimentation.",wz:"上下文 9 · 速度 6 · IDE 不适用 · 价格 4 ($500/月)。优点：长时自主编程，规划+执行，集成 Slack；缺点：极贵，实战效果参差，演示效果优于生产；适合：有实验预算的企业。",g:"🇺🇸",pn:"Cloud Coder",pz:"云端编程"},
  {n:"Manus (coding mode)",z:"Manus (编程模式)",a:"Butterfly Effect",az:"Butterfly Effect",f:"Autonomous agent · browse + code + reason",fz:"自主代理 · 浏览+编程+推理",h:74,c:75,p:85,w:"Context 8·Speed 6·IDE N/A·Price 5 (credit-heavy). Pros: long-running autonomous tasks (browse + code), viral demos. Cons: credits expensive, results inconsistent, Chinese-origin friction. Ideal: research-heavy single-user tasks.",wz:"上下文 8 · 速度 6 · IDE 不适用 · 价格 5 (credit 消耗大)。优点：长时自主任务 (浏览+编程)，演示常刷屏；缺点：credit 贵，结果不稳定，国内外访问参差；适合：研究密集型的单人任务。",g:"🇨🇳",pn:"Cloud Coder",pz:"云端编程"},
  {n:"Cline",z:"Cline",a:"Open source",az:"开源",f:"VS Code agent extension · BYO model · MCP-aware",fz:"VS Code 代理扩展 · 自带模型 · 懂 MCP",h:78,c:78,p:82,w:"Context 8·Speed 8·IDE 9·Price 10 (free, BYO API). Pros: open-source agent in VS Code, MCP support, plan/act modes. Cons: BYO model = BYO bill. Ideal: dev tinkerers wanting agent autonomy in VS Code.",wz:"上下文 8 · 速度 8 · IDE 9 · 价格 10 (免费，自带 API)。优点：VS Code 内开源代理，支持 MCP，规划/执行双模式；缺点：模型自费；适合：想在 VS Code 里玩代理的开发者。",g:"🌍",pn:"Cloud Coder",pz:"云端编程"},
  {n:"Jules",z:"Jules",a:"Google DeepMind",az:"谷歌 DeepMind",f:"Async coding agent · GitHub Issues to PR",fz:"异步编程代理 · GitHub Issue 转 PR",h:76,c:80,p:78,w:"Context 8·Speed 6·IDE N/A·Price 8 (Gemini Advanced incl.). Pros: async (assign Jules a GitHub issue, walk away), Gemini-powered, auto-PR. Cons: limited model picker (Gemini only), early product. Ideal: small teams with steady issue backlog.",wz:"上下文 8 · 速度 6 · IDE 不适用 · 价格 8 (Gemini Advanced 已含)。优点：异步 (把 GitHub issue 派给 Jules 走人即可)，Gemini 驱动，自动开 PR；缺点：仅 Gemini 模型，早期产品；适合：有稳定 issue 队列的小团队。",g:"🇺🇸",pn:"Cloud Coder",pz:"云端编程"},

  // === WEB CHAT (with code) ===
  {n:"ChatGPT (with code)",z:"ChatGPT (含代码)",a:"OpenAI",az:"OpenAI",f:"GPT-5.5 web chat · code interpreter · canvas",fz:"GPT-5.5 网页 · Code Interpreter · Canvas",h:84,c:90,p:80,w:"Context 8·Speed 9·IDE N/A·Price 8 ($20/Plus). Pros: instant exploration, runs Python in sandbox, image+code combo. Cons: copy-paste workflow, no real IDE integration. Ideal: exploration, data analysis, learning.",wz:"上下文 8 · 速度 9 · IDE 不适用 · 价格 8 ($20/Plus)。优点：即时探索，沙盒跑 Python，图像+代码结合；缺点：复制粘贴工作流，无真正的 IDE 集成；适合：探索、数据分析、学习。",g:"🇺🇸",pn:"Web Chat",pz:"网页对话"},
  {n:"Claude.ai (web)",z:"Claude.ai (网页版)",a:"Anthropic",az:"Anthropic",f:"Sonnet/Opus web chat · Artifacts · Projects",fz:"Sonnet/Opus 网页 · Artifacts · Projects",h:86,c:95,p:82,w:"Context 9·Speed 9·IDE N/A·Price 8 ($20/Pro). Pros: best long-form coding chat, Artifacts (live preview), Projects for file context. Cons: web-only workflow, copy-paste. Ideal: code reviews, architecture discussion.",wz:"上下文 9 · 速度 9 · IDE 不适用 · 价格 8 ($20/Pro)。优点：长篇代码对话最佳，Artifacts 实时预览，Projects 含文件上下文；缺点：仅网页，仍需复制粘贴；适合：代码审查、架构讨论。",g:"🇺🇸",pn:"Web Chat",pz:"网页对话"},
  {n:"Gemini (with code)",z:"Gemini (含代码)",a:"Google DeepMind",az:"谷歌 DeepMind",f:"Gemini 3.1 Pro web · 1M context · Workspace",fz:"Gemini 3.1 Pro 网页 · 100 万上下文 · Workspace",h:80,c:85,p:78,w:"Context 10·Speed 9·IDE N/A·Price 9 (Advanced $20). Pros: 1M-2M context can ingest whole codebases, Workspace integration, free tier. Cons: less polished coding UX than Claude. Ideal: huge-codebase code review.",wz:"上下文 10 · 速度 9 · IDE 不适用 · 价格 9 (Advanced $20)。优点：100-200 万上下文可吃下整个代码库，Workspace 整合，有免费版；缺点：编程 UX 不及 Claude 精致；适合：超大代码库审查。",g:"🇺🇸",pn:"Web Chat",pz:"网页对话"},

  // === SPECIALIZED MODELS ===
  {n:"DeepSeek V4",z:"DeepSeek V4",a:"DeepSeek",az:"深度求索",f:"Open-weights model · 1M context · cheapest frontier",fz:"开源权重模型 · 100 万上下文 · 最便宜的前沿模型",h:84,c:90,p:80,w:"Context 10·Speed 8·IDE 7 (via API)·Price 10 ($1.74/$3.48 per M tokens). Pros: open weights, near-frontier coding, $0.14/$0.28 Flash variant ridiculously cheap. Cons: not a tool — you wire it into Cline/Aider/etc. Ideal: cost-conscious teams, self-hosters.",wz:"上下文 10 · 速度 8 · IDE 7 (经 API) · 价格 10 ($1.74/$3.48 每百万 token)。优点：开源权重，编程接近前沿，Flash 版 $0.14/$0.28 便宜到夸张；缺点：本身不是工具 — 需接入 Cline/Aider 等；适合：成本敏感的团队、自托管者。",g:"🇨🇳",pn:"Specialized Model",pz:"专用模型",hp:"https://deepseek.com"},
  {n:"GLM-5.1",z:"GLM-5.1",a:"Z.ai (Zhipu)",az:"Z.ai (智谱 AI)",f:"Open-weights · #1 SWE-Bench Pro · Huawei Ascend trained",fz:"开源权重 · SWE-Bench Pro 榜首 · 华为昇腾训练",h:82,c:92,p:80,w:"Context 8·Speed 8·IDE 7 (via API)·Price 9. Pros: tops SWE-Bench Pro (58.4), open weights, no NVIDIA used. Cons: not a tool itself, ecosystem still catching up. Ideal: open-weights coding teams.",wz:"上下文 8 · 速度 8 · IDE 7 (经 API) · 价格 9。优点：SWE-Bench Pro 榜首 (58.4)，开源权重，全程未用 NVIDIA；缺点：本身非工具，生态仍追赶；适合：开源权重路线的编程团队。",g:"🇨🇳",pn:"Specialized Model",pz:"专用模型"},
  {n:"Qwen3-Coder",z:"通义千问3 Coder",a:"Alibaba",az:"阿里巴巴",f:"480B MoE coding model · 1M context",fz:"480B MoE 编程模型 · 100 万上下文",h:80,c:88,p:78,w:"Context 10·Speed 8·IDE 7 (via API)·Price 9. Pros: huge MoE, 1M context for whole-codebase work, open-weights. Cons: model only, you wire it in. Ideal: long-context coding tasks (codebase-wide refactors).",wz:"上下文 10 · 速度 8 · IDE 7 (经 API) · 价格 9。优点：超大 MoE，100 万上下文可处理整个代码库，开源权重；缺点：仅模型，需自接入；适合：长上下文编程任务（全代码库重构）。",g:"🇨🇳",pn:"Specialized Model",pz:"专用模型"},
  {n:"Codestral 25",z:"Codestral 25",a:"Mistral",az:"Mistral",f:"Coding specialist · 80+ languages",fz:"编程专家 · 80+ 语言",h:74,c:80,p:75,w:"Context 7·Speed 9·IDE 7 (via plugins)·Price 9. Pros: Mistral's coding-specialist line, free for non-prod, 80+ language support. Cons: not as smart as DeepSeek V4 / Claude. Ideal: cheap, fast autocomplete via Continue/Aider.",wz:"上下文 7 · 速度 9 · IDE 7 (经插件) · 价格 9。优点：Mistral 编程专用线，非生产免费，80+ 编程语言支持；缺点：智能不及 DeepSeek V4 / Claude；适合：经 Continue/Aider 的低价快速补全。",g:"🇫🇷",pn:"Specialized Model",pz:"专用模型"},
  {n:"DeepSeek-Coder V4",z:"DeepSeek-Coder V4",a:"DeepSeek",az:"深度求索",f:"Coding-line refresh on V4 backbone · open-weights",fz:"基于 V4 底座的编程线更新 · 开源权重",h:82,c:88,p:80,w:"Context 8·Speed 9·IDE 7·Price 10. Pros: native fill-in-the-middle, very cheap, open weights. Cons: model only, ecosystem matters. Ideal: budget-conscious self-hosters.",wz:"上下文 8 · 速度 9 · IDE 7 · 价格 10。优点：原生中间填充，价格极低，开源权重；缺点：仅模型，需考虑接入生态；适合：成本敏感的自托管用户。",g:"🇨🇳",pn:"Specialized Model",pz:"专用模型"},
  {n:"Magic.dev (LTM-2)",z:"Magic.dev (LTM-2)",a:"Magic",az:"Magic",f:"100M-token context model · enterprise pilot",fz:"1 亿 token 上下文模型 · 企业试点",h:75,c:80,p:75,w:"Context 10·Speed 5·IDE N/A·Price 5 (enterprise quote). Pros: insane 100M-token context, can ingest entire orgs' codebases. Cons: very early, slow, enterprise-only. Ideal: massive-codebase enterprises in pilot phase.",wz:"上下文 10 · 速度 5 · IDE 不适用 · 价格 5 (企业报价)。优点：1 亿 token 上下文，可吞下整个公司代码库；缺点：极早期，慢，仅企业版；适合：超大代码库的企业试点。",g:"🇺🇸",pn:"Specialized Model",pz:"专用模型"},
];

export const researchers: Researcher[] = _data.map((d, i) => ({
  id: i + 1,
  name_en: d.n, name_zh: d.z,
  affiliation_en: d.a, affiliation_zh: d.az,
  field_en: d.f, field_zh: d.fz,
  h_index: d.h, citations: d.c, papers: d.p,
  notable_work_en: d.w, notable_work_zh: d.wz,
  country: d.g,
  native_province_en: d.pn, native_province_zh: d.pz,
  homepage: d.hp,
}));

export type SortKey = "h_index" | "citations" | "papers";

export function sortResearchers(data: Researcher[], key: SortKey): Researcher[] {
  return [...data].sort((a, b) => (b[key] as number) - (a[key] as number));
}
