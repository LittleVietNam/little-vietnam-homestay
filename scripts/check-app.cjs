const fs = require('node:fs');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const html = fs.readFileSync('public/index.html', 'utf8');
const script = html.split('<script type="module">')[1]?.split('</script>')[0];
assert.ok(script, 'Application script missing');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'little-vietnam-check-'));
try {
  const file = path.join(temporary, 'app.mjs');
  fs.writeFileSync(file, script);
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  assert.equal(config.hosting.public, 'public');
  console.log('Application syntax and hosting configuration checked.');
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
