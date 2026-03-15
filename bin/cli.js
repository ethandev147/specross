#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Colours ──────────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
};

const ok   = (msg) => console.log(`${c.green}✓${c.reset}  ${msg}`);
const skip = (msg) => console.log(`${c.yellow}→${c.reset}  ${c.dim}${msg}${c.reset}`);
const info = (msg) => console.log(`${c.blue}ℹ${c.reset}  ${msg}`);
const err  = (msg) => console.log(`${c.red}✗${c.reset}  ${msg}`);
const head = (msg) => console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}`);
const rule = ()    => console.log(`${c.dim}${'─'.repeat(56)}${c.reset}`);

// ─── AI tool destinations ──────────────────────────────────────────────────────
const AI_TOOLS = {
  '1': {
    name: 'Claude Code',
    commandsDir: '.claude/commands',
    agentsDir:   '.claude/agents',
    hint: 'Slash commands auto-loaded. Run: claude .',
  },
  '2': {
    name: 'Cursor',
    commandsDir: '.cursor/rules',
    agentsDir:   '.cursor/rules',
    hint: 'Rules auto-loaded by Cursor. Open your project in Cursor.',
  },
  '3': {
    name: 'Windsurf',
    commandsDir: '.windsurf/rules',
    agentsDir:   '.windsurf/rules',
    hint: 'Rules auto-loaded by Windsurf. Open your project in Windsurf.',
  },
  '4': {
    name: 'Other / Manual',
    commandsDir: 'ai/commands',
    agentsDir:   'ai/agents',
    hint: 'Files copied to ai/. Load them manually into your AI tool.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function copyDir(src, dest, overwrite = false) {
  const results = { copied: [], skipped: [] };
  if (!fs.existsSync(src)) return results;

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      const sub = copyDir(srcPath, destPath, overwrite);
      results.copied.push(...sub.copied);
      results.skipped.push(...sub.skipped);
    } else {
      if (fs.existsSync(destPath) && !overwrite) {
        results.skipped.push(destPath);
      } else {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        results.copied.push(destPath);
      }
    }
  }
  return results;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

function rel(p) { return path.relative(process.cwd(), p); }

function readConfig(cwd) {
  const cfgPath = path.join(cwd, '.specross.json');
  if (fs.existsSync(cfgPath)) return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  return null;
}

function writeConfig(cwd, cfg) {
  fs.writeFileSync(path.join(cwd, '.specross.json'), JSON.stringify(cfg, null, 2));
}

// ─── init ─────────────────────────────────────────────────────────────────────

async function cmdInit() {
  const cwd  = process.cwd();
  const tmpl = path.join(__dirname, '..', 'template');

  console.log(`\n${c.bold}${c.cyan}Specross${c.reset} — installing into ${c.bold}${cwd}${c.reset}\n`);
  rule();

  // Ask which AI tool
  head('Which AI tool are you using?');
  console.log('');
  Object.entries(AI_TOOLS).forEach(([key, tool]) => {
    console.log(`  ${c.bold}${key}${c.reset}. ${tool.name}`);
  });
  console.log('');

  let toolKey = await ask(`  ${c.yellow}Enter number (default: 1) ${c.reset}`);
  if (!toolKey || !AI_TOOLS[toolKey]) toolKey = '1';
  const tool = AI_TOOLS[toolKey];

  console.log(`\n  Installing for ${c.bold}${c.cyan}${tool.name}${c.reset}\n`);
  rule();

  // Save choice so `update` knows where to update
  writeConfig(cwd, { aiTool: toolKey, commandsDir: tool.commandsDir, agentsDir: tool.agentsDir });

  // 1. commands — always safe to overwrite
  head('Step 1 — Commands');
  const cmdRes = copyDir(path.join(tmpl, 'commands'), path.join(cwd, tool.commandsDir), true);
  cmdRes.copied.forEach(f => ok(`Installed  ${rel(f)}`));

  // 2. agents — skip if already exist (user may have customized)
  head('Step 2 — Role agents  (yours if already customized)');
  const agentRes = copyDir(path.join(tmpl, 'agents'), path.join(cwd, tool.agentsDir), false);
  agentRes.copied.forEach(f  => ok(`Installed  ${rel(f)}`));
  agentRes.skipped.forEach(f => skip(`Kept       ${rel(f)}  (your custom version)`));

  // 3. templates — skip if already exist
  head('Step 3 — Output templates  (yours if already customized)');
  const tmplRes = copyDir(path.join(tmpl, '_templates'), path.join(cwd, '_templates'), false);
  tmplRes.copied.forEach(f  => ok(`Installed  ${rel(f)}`));
  tmplRes.skipped.forEach(f => skip(`Kept       ${rel(f)}  (your custom version)`));

  // 4. project folders
  head('Step 4 — Project folders');
  for (const folder of ['ba', 'stories']) {
    const dir = path.join(cwd, folder);
    if (ensureDir(dir)) {
      fs.writeFileSync(path.join(dir, '.gitkeep'), '');
      ok(`Created    ${folder}/`);
    } else {
      skip(`Exists     ${folder}/`);
    }
  }

  // 5. CLAUDE.md
  head('Step 5 — CLAUDE.md');
  const mdDest = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(mdDest)) {
    fs.copyFileSync(path.join(tmpl, 'CLAUDE.md'), mdDest);
    ok('Created    CLAUDE.md');
  } else {
    skip('Kept       CLAUDE.md  (already exists)');
  }

  rule();
  console.log(`\n${c.green}${c.bold}Specross installed!${c.reset}\n`);
  console.log(`${c.bold}Next steps:${c.reset}`);
  console.log(`  1. Fill in ${c.bold}CLAUDE.md${c.reset} with your tech stack and team`);
  console.log(`  2. Customize agents in:   ${c.cyan}${tool.agentsDir}/${c.reset}`);
  console.log(`  3. Customize templates in: ${c.cyan}_templates/${c.reset}`);
  console.log(`  4. ${tool.hint}`);
  console.log(`  5. First story:  ${c.cyan}/ba:new-story my-feature${c.reset}\n`);
}

// ─── update ───────────────────────────────────────────────────────────────────

async function cmdUpdate() {
  const cwd  = process.cwd();
  const tmpl = path.join(__dirname, '..', 'template');

  console.log(`\n${c.bold}${c.cyan}Specross${c.reset} — updating\n`);
  rule();

  // Read saved config to know where commands live
  const cfg = readConfig(cwd);
  let tool;

  if (cfg) {
    tool = AI_TOOLS[cfg.aiTool];
    info(`Detected: ${tool.name} (from .specross.json)\n`);
  } else {
    head('Which AI tool are you using?');
    console.log('');
    Object.entries(AI_TOOLS).forEach(([key, t]) => {
      console.log(`  ${c.bold}${key}${c.reset}. ${t.name}`);
    });
    console.log('');
    let toolKey = await ask(`  ${c.yellow}Enter number (default: 1) ${c.reset}`);
    if (!toolKey || !AI_TOOLS[toolKey]) toolKey = '1';
    tool = AI_TOOLS[toolKey];
    writeConfig(cwd, { aiTool: toolKey, commandsDir: tool.commandsDir, agentsDir: tool.agentsDir });
  }

  info('Commands will be updated to the latest version.');
  info('Agents and templates will NOT be touched — your customizations are safe.\n');

  const ans = await ask(`  ${c.yellow}Continue? (y/N) ${c.reset}`);
  if (ans.toLowerCase() !== 'y') { console.log('\nCancelled.\n'); process.exit(0); }

  // Only overwrite commands
  head('Updating commands');
  const cmdRes = copyDir(path.join(tmpl, 'commands'), path.join(cwd, tool.commandsDir), true);
  cmdRes.copied.forEach(f => ok(`Updated  ${rel(f)}`));

  rule();
  console.log(`\n${c.green}${c.bold}Commands updated!${c.reset}`);
  console.log(`${c.dim}Agents and templates were not changed.${c.reset}\n`);

  // Offer optional resets
  const resetAgents = await ask(`  ${c.yellow}Also reset agents to default? Overwrites customizations. (y/N) ${c.reset}`);
  if (resetAgents.toLowerCase() === 'y') {
    const res = copyDir(path.join(tmpl, 'agents'), path.join(cwd, tool.agentsDir), true);
    res.copied.forEach(f => ok(`Reset  ${rel(f)}`));
    console.log('');
  }

  const resetTmpls = await ask(`  ${c.yellow}Also reset templates to default? Overwrites customizations. (y/N) ${c.reset}`);
  if (resetTmpls.toLowerCase() === 'y') {
    const res = copyDir(path.join(tmpl, '_templates'), path.join(cwd, '_templates'), true);
    res.copied.forEach(f => ok(`Reset  ${rel(f)}`));
    console.log('');
  }

  console.log(`${c.green}${c.bold}Done!${c.reset}\n`);
}

// ─── help ─────────────────────────────────────────────────────────────────────

function cmdHelp() {
  console.log(`
${c.bold}${c.cyan}specross${c.reset} — Spec-driven AI collaboration for BA, Dev & QC teams

${c.bold}Usage:${c.reset}
  npx specross init      Install Specross into the current project
  npx specross update    Update commands only (keeps your customizations)
  npx specross help      Show this help

${c.bold}Supported AI tools:${c.reset}
  1. Claude Code  → .claude/commands/  + .claude/agents/
  2. Cursor       → .cursor/rules/
  3. Windsurf     → .windsurf/rules/
  4. Other        → ai/commands/  + ai/agents/

${c.bold}What gets installed:${c.reset}
  commands/       12 slash commands for BA, Dev, QC
  agents/         Role personas — customize per role (never overwritten by update)
  _templates/     Output format — customize freely (never overwritten by update)
  ba/             BA draft workspace
  stories/        Released stories (source of truth for Dev & QC)
  CLAUDE.md       Project config — fill this in!

${c.bold}Commands available after install:${c.reset}
  /help  (list all commands with descriptions)

  /ba:new-story   /ba:review   /ba:release   /ba:impact
  /dev:gen-tech-spec   /dev:gen-scaffold   /dev:review   /dev:sync   /dev:status
  /qc:gen-test-cases   /qc:gen-scripts   /qc:bug-report   /qc:sync   /qc:status

${c.dim}Docs: https://github.com/ethandev147/specross${c.reset}
`);
}

// ─── Entry ────────────────────────────────────────────────────────────────────

const command = process.argv[2] || 'help';
switch (command) {
  case 'init':   cmdInit().catch(console.error);   break;
  case 'update': cmdUpdate().catch(console.error); break;
  case 'help': case '--help': case '-h': cmdHelp(); break;
  default:
    err(`Unknown command: ${command}`);
    cmdHelp();
    process.exit(1);
}
