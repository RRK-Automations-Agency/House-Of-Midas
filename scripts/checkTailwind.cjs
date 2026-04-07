const { spawnSync } = require('child_process');

// Run tailwindcss to validate the input CSS. Capture stderr and search for
// CssSyntaxError or Error lines that indicate problems.
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['tailwindcss', '-i', './src/index.css', '-o', '/dev/null'];

const res = spawnSync(cmd, args, { encoding: 'utf8' });
const stderr = (res.stderr || '') + (res.stdout || '');

const lines = stderr.split(/\r?\n/).filter(Boolean);
const errors = lines.filter(l => /^CssSyntaxError|^Error/.test(l));
if (errors.length > 0) {
  console.error('Tailwind CSS reported errors:');
  errors.forEach(e => console.error(e));
  process.exit(1);
}

// No errors
process.exit(0);
