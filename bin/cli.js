#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
const rl   = require('readline');

// ─── Colours ──────────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',  bold:  '\x1b[1m',  dim:   '\x1b[2m',
  green:  '\x1b[32m', yellow:'\x1b[33m', blue:  '\x1b[34m',
  cyan:   '\x1b[36m', red:   '\x1b[31m',
};
const ok   = (msg) => console.log(`${c.green}✓${c.reset}  ${msg}`);
const skip = (msg) => console.log(`${c.yellow}→${c.reset}  ${c.dim}${msg}${c.reset}`);
const info = (msg) => console.log(`${c.blue}ℹ${c.reset}  ${msg}`);
const err  = (msg) => console.log(`${c.red}✗${c.reset}  ${msg}`);
const head = (msg) => console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}`);
const rule = ()    => console.log(`${c.dim}${'─'.repeat(56)}${c.reset}`);

// ─── Tool adapters ────────────────────────────────────────────────────────────
// Each adapter defines where files go and how they're formatted for that tool.
const TOOLS = {
  claude: {
    label:       'Claude Code',
    commandsDir: '.claude/commands',
    agentsDir:   '.claude/agents',
    ext:         '.md',
    // Claude Code keeps the nested ba/dev/qc folder structure
    flatCommands: false,
    frontmatter:  null,
    contextFile: 'CLAUDE.md',
    hint:        'Run: claude .',
  },
  cursor: {
    label:       'Cursor',
    commandsDir: '.cursor/rules',
    agentsDir:   '.cursor/rules',
    ext:         '.mdc',
    // Cursor rules are flat — no subdirectories
    flatCommands: true,
    frontmatter: (slug, desc) =>
      `---\ndescription: "${desc}"\nglobs:\nalwaysApply: false\n---\n\n`,
    contextFile: 'CLAUDE.md',
    hint:        'Open Cursor. Use @rulename to reference a rule, or just ask.',
  },
  windsurf: {
    label:       'Windsurf',
    commandsDir: '.windsurf/rules',
    agentsDir:   '.windsurf/rules',
    ext:         '.md',
    flatCommands: true,
    frontmatter: null,
    contextFile: 'CLAUDE.md',
    hint:        'Open Windsurf in this folder.',
  },
  codex: {
    label:       'Codex (OpenAI)',
    commandsDir: '.codex/instructions',
    agentsDir:   '.codex/instructions',
    ext:         '.md',
    flatCommands: true,
    frontmatter: null,
    contextFile: 'CLAUDE.md',
    hint:        'Open Codex CLI in this folder.',
  },
};

// Short descriptions used as Cursor rule descriptions
const COMMAND_DESCS = {
  'ba/new-story':       'BA — create new story with US-N ID and guided questions',
  'ba/review':          'BA — review story for gaps before releasing',
  'ba/impact':          'BA — preview Dev/QC impact before releasing an update',
  'ba/release':         'BA — promote story from ba/ to stories/',
  'dev/review':         'Dev — check implementation vs AC',
  'dev/sync':           'Dev — update tech files after story changes',
  'dev/status':         'Dev — scan all stories for spec + handoff state',
  'dev/done':           'Dev — mark story complete, create handoff.md for QC',
  'qc/gen-test-cases':  'QC — generate test cases from story',
  'qc/run':             'QC — run test cases interactively, auto bug report on fail',
  'qc/retest':          'QC — retest after fix, auto-close bug on pass',
  'qc/sync':            'QC — update test cases after story changes',
  'qc/status':          'QC — scan all stories for handoff + test result state',
  'qc/bug-report':      'QC — generate structured bug report',
  'qc/gen-scripts':     'QC — generate automation test scripts',
};

const AGENT_DESCS = {
  'ba':  'BA agent persona — analytical, thorough, spec-focused',
  'dev': 'Dev agent persona — pragmatic, implementation-focused',
  'qc':  'QC agent persona — detail-oriented, coverage-focused',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ask(question) {
  const iface = rl.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => iface.question(question, ans => { iface.close(); resolve(ans.trim()); }));
}

function rel(p) { return path.relative(process.cwd(), p); }

function ensureDir(dir) {
  const created = !fs.existsSync(dir);
  fs.mkdirSync(dir, { recursive: true });
  return created;
}

function readConfig(cwd) {
  const p = path.join(cwd, '.specross.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

function writeConfig(cwd, cfg) {
  fs.writeFileSync(path.join(cwd, '.specross.json'), JSON.stringify(cfg, null, 2));
}

// Walk a directory and return all files as { rel, abs }
function walkFiles(dir, base = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(abs, base));
    else results.push({ rel: path.relative(base, abs), abs });
  }
  return results;
}

// Install command files for a given tool adapter
function installCommands(tool, tmplCommandsDir, destDir, overwrite) {
  const results = { copied: [], skipped: [] };
  const files = walkFiles(tmplCommandsDir);

  for (const { rel: relPath, abs: srcAbs } of files) {
    const slug = relPath.replace(/\.md$/, '');  // e.g. "ba/new-story"

    let destName;
    if (tool.flatCommands) {
      // Flatten: ba/new-story.md → ba-new-story.mdc
      destName = slug.replace(/\//g, '-') + tool.ext;
    } else {
      destName = slug + tool.ext;
    }

    const destAbs = path.join(destDir, destName);

    if (fs.existsSync(destAbs) && !overwrite) {
      results.skipped.push(destAbs);
      continue;
    }

    fs.mkdirSync(path.dirname(destAbs), { recursive: true });

    let content = fs.readFileSync(srcAbs, 'utf8');
    if (tool.frontmatter) {
      const desc = COMMAND_DESCS[slug] || slug;
      content = tool.frontmatter(slug, desc) + content;
    }

    fs.writeFileSync(destAbs, content);
    results.copied.push(destAbs);
  }

  return results;
}

// Install agent files for a given tool adapter
function installAgents(tool, tmplAgentsDir, destDir, overwrite) {
  const results = { copied: [], skipped: [] };
  const files = walkFiles(tmplAgentsDir);

  for (const { rel: relPath, abs: srcAbs } of files) {
    const slug = relPath.replace(/\.md$/, '');  // e.g. "ba"

    let destName;
    if (tool.flatCommands) {
      destName = slug + '-agent' + tool.ext;
    } else {
      destName = relPath.replace(/\.md$/, tool.ext);
    }

    const destAbs = path.join(destDir, destName);

    if (fs.existsSync(destAbs) && !overwrite) {
      results.skipped.push(destAbs);
      continue;
    }

    fs.mkdirSync(path.dirname(destAbs), { recursive: true });

    let content = fs.readFileSync(srcAbs, 'utf8');
    if (tool.frontmatter) {
      const desc = AGENT_DESCS[slug] || `${slug} agent persona`;
      content = tool.frontmatter(slug + '-agent', desc) + content;
    }

    fs.writeFileSync(destAbs, content);
    results.copied.push(destAbs);
  }

  return results;
}

// ─── Auto-detect installed tools ──────────────────────────────────────────────
function detectTools(cwd) {
  const detected = [];
  if (fs.existsSync(path.join(cwd, '.claude')))    detected.push('claude');
  if (fs.existsSync(path.join(cwd, '.cursor')))    detected.push('cursor');
  if (fs.existsSync(path.join(cwd, '.windsurf')))  detected.push('windsurf');
  if (fs.existsSync(path.join(cwd, '.codex')))     detected.push('codex');
  return detected;
}

async function pickTool(cwd) {
  const detected = detectTools(cwd);

  console.log(`\n${c.bold}Which AI tool are you using?${c.reset}`);
  const entries = Object.entries(TOOLS);
  entries.forEach(([key, t], i) => {
    const tag = detected.includes(key) ? `${c.green} (detected)${c.reset}` : '';
    console.log(`  ${c.cyan}${i + 1}${c.reset}. ${t.label}${tag}`);
  });
  console.log(`  ${c.cyan}${entries.length + 1}${c.reset}. All of the above`);

  const ans = await ask(`\n  ${c.yellow}Choice (1–${entries.length + 1}): ${c.reset}`);
  const n = parseInt(ans);

  if (n === entries.length + 1) return entries.map(([k]) => k);
  if (n >= 1 && n <= entries.length) return [entries[n - 1][0]];

  err('Invalid choice — defaulting to Claude Code.');
  return ['claude'];
}

// ─── init ─────────────────────────────────────────────────────────────────────
async function cmdInit() {
  const cwd  = process.cwd();
  const tmpl = path.join(__dirname, '..', 'template');

  console.log(`\n${c.bold}${c.cyan}Specross${c.reset} — installing into ${c.bold}${cwd}${c.reset}\n`);
  rule();

  const toolKeys = await pickTool(cwd);

  writeConfig(cwd, { tools: toolKeys });

  for (const key of toolKeys) {
    const tool = TOOLS[key];
    head(`Installing for ${c.bold}${tool.label}${c.reset}`);

    // Commands — always overwrite (latest version)
    info(`Commands → ${tool.commandsDir}/`);
    const cmdRes = installCommands(tool, path.join(tmpl, 'commands'), path.join(cwd, tool.commandsDir), true);
    cmdRes.copied.forEach(f  => ok(`Installed  ${rel(f)}`));
    cmdRes.skipped.forEach(f => skip(`Kept       ${rel(f)}`));

    // Agents — skip if already customized
    info(`Agents   → ${tool.agentsDir}/`);
    const agentRes = installAgents(tool, path.join(tmpl, 'agents'), path.join(cwd, tool.agentsDir), false);
    agentRes.copied.forEach(f  => ok(`Installed  ${rel(f)}`));
    agentRes.skipped.forEach(f => skip(`Kept       ${rel(f)}  (your custom version)`));
  }

  // Templates — tool-agnostic, skip if customized
  head('Output templates  (yours if already customized)');
  const tmplFiles = walkFiles(path.join(tmpl, '_templates'));
  for (const { rel: relPath, abs: srcAbs } of tmplFiles) {
    const destAbs = path.join(cwd, '_templates', relPath);
    if (fs.existsSync(destAbs)) { skip(`Kept       ${rel(destAbs)}  (your custom version)`); continue; }
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.copyFileSync(srcAbs, destAbs);
    ok(`Installed  ${rel(destAbs)}`);
  }

  // Project folders
  head('Project folders');
  for (const folder of ['ba', 'stories']) {
    const dir = path.join(cwd, folder);
    if (ensureDir(dir)) {
      fs.writeFileSync(path.join(dir, '.gitkeep'), '');
      ok(`Created    ${folder}/`);
    } else {
      skip(`Exists     ${folder}/`);
    }
  }

  // Context file
  head('Project context file');
  const ctxDest = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(ctxDest)) {
    fs.copyFileSync(path.join(tmpl, 'CLAUDE.md'), ctxDest);
    ok('Created    CLAUDE.md');
  } else {
    skip('Kept       CLAUDE.md  (already exists)');
  }

  rule();
  console.log(`\n${c.green}${c.bold}Specross installed!${c.reset}\n`);
  console.log(`${c.bold}Next steps:${c.reset}`);
  console.log(`  1. Fill in ${c.bold}CLAUDE.md${c.reset} with your stack and team`);
  for (const key of toolKeys) {
    const tool = TOOLS[key];
    console.log(`  ${c.cyan}[${tool.label}]${c.reset} ${tool.hint}`);
  }
  console.log(`  First story: ${c.cyan}/ba:new-story my-feature${c.reset}\n`);
}

// ─── update ───────────────────────────────────────────────────────────────────
async function cmdUpdate() {
  const cwd  = process.cwd();
  const tmpl = path.join(__dirname, '..', 'template');

  console.log(`\n${c.bold}${c.cyan}Specross${c.reset} — updating\n`);
  rule();

  const cfg = readConfig(cwd);
  const toolKeys = cfg?.tools ?? ['claude'];

  info(`Updating commands for: ${toolKeys.map(k => TOOLS[k].label).join(', ')}`);
  info('Agents and templates will NOT be touched — your customizations are safe.\n');

  const ans = await ask(`  ${c.yellow}Continue? (y/N) ${c.reset}`);
  if (ans.toLowerCase() !== 'y') { console.log('\nCancelled.\n'); process.exit(0); }

  for (const key of toolKeys) {
    const tool = TOOLS[key];
    head(`Updating ${tool.label}`);
    const cmdRes = installCommands(tool, path.join(tmpl, 'commands'), path.join(cwd, tool.commandsDir), true);
    cmdRes.copied.forEach(f => ok(`Updated  ${rel(f)}`));
  }

  rule();
  console.log(`\n${c.green}${c.bold}Commands updated!${c.reset}`);
  console.log(`${c.dim}Agents and templates were not changed.${c.reset}\n`);

  const resetAgents = await ask(`  ${c.yellow}Also reset agents to default? Overwrites customizations. (y/N) ${c.reset}`);
  if (resetAgents.toLowerCase() === 'y') {
    for (const key of toolKeys) {
      const tool = TOOLS[key];
      const res = installAgents(tool, path.join(tmpl, 'agents'), path.join(cwd, tool.agentsDir), true);
      res.copied.forEach(f => ok(`Reset  ${rel(f)}`));
    }
    console.log('');
  }

  const resetTmpls = await ask(`  ${c.yellow}Also reset templates to default? Overwrites customizations. (y/N) ${c.reset}`);
  if (resetTmpls.toLowerCase() === 'y') {
    const tmplFiles = walkFiles(path.join(tmpl, '_templates'));
    for (const { rel: relPath, abs: srcAbs } of tmplFiles) {
      const destAbs = path.join(cwd, '_templates', relPath);
      fs.mkdirSync(path.dirname(destAbs), { recursive: true });
      fs.copyFileSync(srcAbs, destAbs);
      ok(`Reset  ${rel(destAbs)}`);
    }
    console.log('');
  }

  console.log(`${c.green}${c.bold}Done!${c.reset}\n`);
}

// ─── help ─────────────────────────────────────────────────────────────────────
function cmdHelp() {
  console.log(`
${c.bold}${c.cyan}specross${c.reset} — Spec-driven development (SDD) for AI coding assistants

${c.bold}Usage:${c.reset}
  npx specross init      Install Specross into the current project
  npx specross update    Update commands only (keeps your customizations)
  npx specross help      Show this help

${c.bold}Supported AI tools:${c.reset}
  Claude Code      → .claude/commands/       + .claude/agents/
  Cursor           → .cursor/rules/          (flat .mdc files)
  Windsurf         → .windsurf/rules/        (flat .md files)
  Codex (OpenAI)   → .codex/instructions/   (flat .md files)

${c.bold}What gets installed:${c.reset}
  commands/       Slash commands for BA, Dev, QC (tool-specific format)
  agents/         Role personas — customize per role (never overwritten by update)
  _templates/     Output format — customize freely (never overwritten by update)
  ba/             BA draft workspace
  stories/        Released stories (source of truth for Dev & QC)
  CLAUDE.md       Project context — fill this in!

${c.bold}Commands available after install:${c.reset}
  /ba:new-story   /ba:review      /ba:impact    /ba:release
  /dev:gen-tech-spec  /dev:implement  /dev:review   /dev:sync  /dev:done
  /qc:gen-test-cases  /qc:run  /qc:sync

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
