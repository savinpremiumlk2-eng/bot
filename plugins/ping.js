const settings = require('../settings');
const os = require('os');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

function pickRandomAsset() {
  const assetsDir = path.join(__dirname, '../assets');
  try {
    const files = fs.readdirSync(assetsDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    if (!files || files.length === 0) return null;
    const choice = files[Math.floor(Math.random() * files.length)];
    return path.join(assetsDir, choice);
  } catch (e) {
    return null;
  }
}

module.exports = {
  command: 'ping',
  aliases: ['p', 'pong'],
  category: 'general',
  description: 'Check bot response time',
  usage: '.ping',
  isPrefixless: true,

  async handler(sock, message, args) {
    const chatId = message.key.remoteJid;

    // Measure a small network operation (DNS lookup) for a realistic ping
    let latencyMs = 0;
    try {
      const t0 = process.hrtime.bigint();
      await dns.promises.lookup('google.com');
      const t1 = process.hrtime.bigint();
      latencyMs = Number(t1 - t0) / 1e6;
    } catch (e) {
      latencyMs = -1;
    }

    const uptimeSec = Math.floor(process.uptime());
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    const secs = uptimeSec % 60;

    const mem = process.memoryUsage();
    const rssMB = (mem.rss || 0) / 1024 / 1024;
    const heapUsedMB = (mem.heapUsed || 0) / 1024 / 1024;
    const heapTotalMB = (mem.heapTotal || 0) / 1024 / 1024;

    const cpus = os.cpus() || [];
    const cpuModel = cpus[0] ? cpus[0].model : 'unknown';
    const cpuCount = cpus.length || 1;
    const platform = `${os.type()} ${os.arch()}`;
    const load1 = os.loadavg()[0] ? os.loadavg()[0].toFixed(2) : '0.00';

    const botName = settings.botName || 'Infinity MD';
    const version = settings.version || 'unknown';

    const lines = [];
    lines.push('╭─〔 ⚡ INFINITY MD — STATUS 〕─╮');
    lines.push(`│ 💠 ${botName} — v${version}`);
    lines.push('│');
    lines.push(`│ 🏓 RTT        : ${latencyMs.toFixed(2)} ms`);
    lines.push(`│ ⏱ Uptime     : ${days}d ${hours}h ${mins}m ${secs}s`);
    lines.push(`│ 💾 RSS        : ${rssMB.toFixed(1)} MB`);
    lines.push(`│ 📦 Heap       : ${heapUsedMB.toFixed(1)} / ${heapTotalMB.toFixed(1)} MB`);
    lines.push(`│ 🧮 Load(1m)   : ${load1}    │ CPU Cores: ${cpuCount}`);
    lines.push(`│ 🖥 Platform   : ${platform}`);
    lines.push(`│ ⚙️ CPU Model  : ${cpuModel}`);
    lines.push('│');
    lines.push('│ ✨ Stay awesome — Infinity MD ✨');
    lines.push('╰──────────────────────────────╯');

    const caption = lines.join('\n');

    // Prefer to use the same banner as the menu (bot_image.jpg) if available
    try {
      const imgPath = pickRandomAsset();
      if (imgPath && fs.existsSync(imgPath)) {
        await sock.sendMessage(chatId, { image: fs.readFileSync(imgPath), caption }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: caption }, { quoted: message });
      }
    } catch (e) {
      await sock.sendMessage(chatId, { text: caption }, { quoted: message });
    }
  }
};
