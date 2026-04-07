const { spawnSync } = require('child_process');
const path = require('path');

function runScriptWithBash(scriptPath) {
  try {
    const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['bash'], { encoding: 'utf8' });
    if (which.status !== 0) {
      console.warn(`bash not found; skipping ${scriptPath} on platform ${process.platform}`);
      return 0;
    }
    const res = spawnSync('bash', [scriptPath], { stdio: 'inherit' });
    return res.status;
  } catch (err) {
    console.warn(`Failed to run ${scriptPath}:`, err.message || err);
    return 0;
  }
}

function main() {
  // On Windows, skip shell-based rule checks to avoid WSL/bash dependency.
  if (process.platform === 'win32') {
    console.warn('Running on Windows - skipping .rules/check.sh and .rules/testBuild.sh (requires bash)');
  } else {
    const checkStatus = runScriptWithBash('.rules/check.sh');
    if (checkStatus !== 0) {
      console.error('.rules/check.sh failed');
      process.exit(checkStatus);
    }
  }

  const tailwindScript = path.resolve(__dirname, 'checkTailwind.cjs');
  const tailwind = spawnSync(process.execPath, [tailwindScript], { stdio: 'inherit' });
  if (tailwind.status !== 0) {
    console.error('Tailwind check failed');
    process.exit(tailwind.status);
  }

  if (process.platform !== 'win32') {
    const testBuildStatus = runScriptWithBash('.rules/testBuild.sh');
    if (testBuildStatus !== 0) {
      console.error('.rules/testBuild.sh failed');
      process.exit(testBuildStatus);
    }
  }

  process.exit(0);
}

main();
