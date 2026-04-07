const { spawnSync } = require('child_process');

function runScriptWithBash(scriptPath) {
  // Try to run the script via bash. If bash isn't available, skip on Windows.
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

async function main() {
  // Run the rule checks (.rules/check.sh) using bash when possible
  const checkStatus = runScriptWithBash('.rules/check.sh');
  if (checkStatus !== 0) {
    console.error('.rules/check.sh failed');
    process.exit(checkStatus);
  }

  // Run Tailwind check (cross-platform)
  const tailwind = spawnSync(process.execPath, [require('path').resolve(__dirname, 'checkTailwind.js')], { stdio: 'inherit' });
  if (tailwind.status !== 0) {
    console.error('Tailwind check failed');
    process.exit(tailwind.status);
  }

  // Run test build script (.rules/testBuild.sh) via bash when possible
  const testBuildStatus = runScriptWithBash('.rules/testBuild.sh');
  if (testBuildStatus !== 0) {
    console.error('.rules/testBuild.sh failed');
    process.exit(testBuildStatus);
  }

  process.exit(0);
}

main();
