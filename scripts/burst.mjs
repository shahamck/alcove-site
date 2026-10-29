// Headless Chrome burst: screenshots every <ms> for <count> frames right after load (intro check).
// Usage: node scripts/burst.mjs <url> <outDir> <width>x<height> <ms> <count>
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const WebSocket = globalThis.WebSocket ?? createRequire(import.meta.url)('../../node_modules/ws');

const [url, out, size, ms, count] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
mkdirSync(out, { recursive: true });
const port = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--allow-file-access-from-files', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', `--remote-debugging-port=${port}`, '--hide-scrollbars', `--user-data-dir=/tmp/alcove-burst-${port}`, `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(250);
  try { const t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = t.find((x) => x.type === 'page'); if (p) ws = new WebSocket(p.webSocketDebuggerUrl); } catch {}
}
await new Promise((r) => ws.addEventListener ? ws.addEventListener('open', r) : ws.on('open', r));
let id = 0; const pending = new Map();
ws.on('message', (d) => { const e = { data: String(d) }; const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Runtime.enable');
ws.on('message', (d) => { const m = JSON.parse(String(d)); if (m.method === 'Runtime.exceptionThrown') console.log('EXC', JSON.stringify(m.params.exceptionDetails).slice(0, 600)); if (m.method === 'Runtime.consoleAPICalled' && /error|warn/.test(m.params.type)) console.log('CONSOLE', m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 400)); });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
await send('Page.navigate', { url });
const t0 = Date.now();
for (let i = 0; i < +count; i++) {
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
  if (!shot) { await sleep(+ms); continue; } // page not painted yet
  const { data } = shot;
  writeFileSync(`${out}/b-${String(i).padStart(2, '0')}-${Date.now() - t0}.jpg`, Buffer.from(data, 'base64'));
  await sleep(+ms);
}
chrome.kill();
process.exit(0);
