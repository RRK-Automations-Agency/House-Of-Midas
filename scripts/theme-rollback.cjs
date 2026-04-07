const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function quote(value) {
  const raw = String(value || '');
  if (/^[a-zA-Z0-9._:/-]+$/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '\\"')}"`;
}

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

function readLatestRelease() {
  const latestPath = path.join(process.cwd(), 'release-artifacts', 'latest-release.json');
  if (!fs.existsSync(latestPath)) return null;
  return JSON.parse(fs.readFileSync(latestPath, 'utf8'));
}

function main() {
  const store = getArg('--store');
  if (!store) {
    console.error('Usage: node scripts/theme-rollback.cjs --store <store.myshopify.com> [--theme <themeId>]');
    process.exit(1);
  }

  let themeId = getArg('--theme');
  if (!themeId) {
    const latest = readLatestRelease();
    themeId = latest && latest.previousLiveThemeId ? String(latest.previousLiveThemeId) : null;
  }

  if (!themeId) {
    console.error('No rollback theme ID supplied and no release artifact found at release-artifacts/latest-release.json.');
    process.exit(1);
  }

  run(`shopify theme publish --store ${quote(store)} --theme ${quote(themeId)} --force`);
  console.log(`Rollback complete. Theme ${themeId} is now live on ${store}.`);
}

main();
