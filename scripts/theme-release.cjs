const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function quote(value) {
  const raw = String(value || '');
  if (/^[a-zA-Z0-9._:/-]+$/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '\\"')}"`;
}

function run(command, capture = false) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
  } catch (error) {
    if (capture && error && typeof error.stdout === 'string') {
      process.stdout.write(error.stdout);
    }
    if (capture && error && typeof error.stderr === 'string') {
      process.stderr.write(error.stderr);
    }
    throw error;
  }
}

function parseThemes(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.themes)) return parsed.themes;
  if (Array.isArray(parsed.data)) return parsed.data;
  return [];
}

function parsePushedTheme(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (parsed && parsed.theme && parsed.theme.id) return parsed.theme;
  if (parsed && parsed.id) return parsed;
  throw new Error('Could not parse pushed theme JSON output.');
}

function ensureReleaseDir() {
  const releaseDir = path.join(process.cwd(), 'release-artifacts');
  fs.mkdirSync(releaseDir, { recursive: true });
  return releaseDir;
}

function getGitSha() {
  try {
    return run('git rev-parse --short HEAD', true).trim();
  } catch (_err) {
    return 'unknown';
  }
}

function main() {
  const store = getArg('--store');
  if (!store) {
    console.error('Usage: node scripts/theme-release.cjs --store <store.myshopify.com> [--skip-ci] [--skip-theme-check]');
    process.exit(1);
  }

  const skipCi = hasFlag('--skip-ci');
  const skipThemeCheck = hasFlag('--skip-theme-check');
  const releaseStartedAt = new Date().toISOString();

  if (!skipCi) {
    run('npm run ci');
  }

  run('npm run shopify-build');

  if (!skipThemeCheck) {
    run('shopify theme check --path .');
  }

  const themesBefore = parseThemes(run(`shopify theme list --store ${quote(store)} --json`, true));
  const liveBefore = themesBefore.find((theme) => theme.role === 'live');
  if (!liveBefore || !liveBefore.id) {
    throw new Error('Could not identify live theme before release.');
  }

  const pushedTheme = parsePushedTheme(
    run(`shopify theme push --store ${quote(store)} --unpublished --strict --json`, true),
  );

  run(`shopify theme publish --store ${quote(store)} --theme ${quote(String(pushedTheme.id))} --force`);

  const themesAfter = parseThemes(run(`shopify theme list --store ${quote(store)} --json`, true));
  const liveAfter = themesAfter.find((theme) => theme.role === 'live');

  const artifact = {
    releaseStartedAt,
    releaseCompletedAt: new Date().toISOString(),
    store,
    commitSha: getGitSha(),
    previousLiveThemeId: Number(liveBefore.id),
    previousLiveThemeName: String(liveBefore.name || ''),
    releasedThemeId: Number(pushedTheme.id),
    releasedThemeName: String(pushedTheme.name || ''),
    liveThemeAfterId: liveAfter ? Number(liveAfter.id) : null,
    rollbackCommand: `node scripts/theme-rollback.cjs --store ${store} --theme ${liveBefore.id}`,
  };

  const releaseDir = ensureReleaseDir();
  const latestPath = path.join(releaseDir, 'latest-release.json');
  fs.writeFileSync(latestPath, JSON.stringify(artifact, null, 2));

  console.log('Release completed successfully.');
  console.log(`Release artifact: ${latestPath}`);
  console.log(`Rollback command: ${artifact.rollbackCommand}`);
}

main();
