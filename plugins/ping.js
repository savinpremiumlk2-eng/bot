const settings = require('../settings');
const os = require('os');

module.exports = {
  command: 'ping',
  aliases: ['p', 'pong'],
  category: 'general',
  description: 'Check bot response time',
  usage: '.ping',
  isPrefixless: true,

  async handler(sock, message, args) {
    const t0 = Date.now();
    const chatId = message.key.remoteJid;

    const sent = await sock.sendMessage(chatId, { text: '⏳ Checking ping...' });
    const t1 = Date.now();
    const latency = t1 - t0;

    const uptimeSec = Math.floor(process.uptime());
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    const secs = uptimeSec % 60;

    const mem = process.memoryUsage();
    const usedMb = Math.round((mem.rss || 0) / 1024 / 1024);

    const cpus = os.cpus() || [];
    const cpuModel = cpus[0] ? cpus[0].model : 'unknown';
    const cpuCount = cpus.length || 1;
    const platform = `${os.type()} ${os.arch()}`;

    const botName = settings.botName || 'Infinity MD';
    const version = settings.version || 'unknown';

    const lines = [];
    lines.push('╭───〔 ⚡ INFINITY MD — STATUS 〕───');
    lines.push(`│ 💠 ${botName} — v${version}`);
    lines.push(`│`);
    lines.push(`│ 🏓 Latency : ${latency} ms`);
    lines.push(`│ ⏱️ Uptime : ${days}d ${hours}h ${mins}m ${secs}s`);
    lines.push(`│ 🧠 Memory : ${usedMb} MB`);
    lines.push(`│ 🖥️ Platform: ${platform}`);
    lines.push(`│ ⚙️ CPU    : ${cpuModel} ×${cpuCount}`);
    lines.push('│');
    lines.push('│ ✨ Stay awesome — Infinity MD ✨');
    lines.push('╰──────────────────────────────');

    const caption = lines.join('\n');

    // Prefer a small sticker/branding image from assets
    try {
      await sock.sendMessage(chatId, { image: { url: 'assets/stickintro.webp' }, caption }, { quoted: sent });
    } catch (e) {
      await sock.sendMessage(chatId, { text: caption }, { quoted: sent });
    }
  }
};
