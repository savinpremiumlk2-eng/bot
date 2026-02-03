const CommandHandler = require('../lib/commandHandler');
const settings = require("../settings");
const fs = require('fs');
const path = require('path');
const os = require('os');

function formatUptime() {
    let uptime = Math.floor(process.uptime());
    const days = Math.floor(uptime / 86400);
    uptime %= 86400;
    const hours = Math.floor(uptime / 3600);
    uptime %= 3600;
    const minutes = Math.floor(uptime / 60);
    const seconds = uptime % 60;

    const parts = [];
    if (days) parts.push(`${days} days`);
    if (hours) parts.push(`${hours} hours`);
    if (minutes) parts.push(`${minutes} minutes`);
    if (seconds || parts.length === 0) parts.push(`${seconds} seconds`);
    return parts.join(' ');
}

function getRAMUsage() {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2);
    return `${usedMem}MB / ${totalMem}GB`;
}

module.exports = {
  command: 'smenu',
  aliases: ['shelp', 'smart', 'menu', 'help'],
  category: 'general',
  description: 'Interactive smart menu with live status',
  usage: '.menu',
  isPrefixless: true,

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;

    try {
      const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
      const thumbnail = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

      const commandCount = CommandHandler.commands.size;
      const prefix = settings.prefixes ? settings.prefixes[0] : '.';

      let menuText = `╭───〔 🤖 INFINITY MD 〕───
│ 👤 *Owner* : ${settings.botOwner || 'Default Publisher'}
│ 📊 *Commands* : ${commandCount}+
│ ⏱ *Uptime* : ${formatUptime()}
│ 🚀 *RAM* : ${getRAMUsage()}
│ ⌨️ *Prefix* : ${prefix}
╰────────────────────

╭───〔 📂 MAIN MENUS 〕───
│ 👑 ${prefix}ownermenu
│ 🧩 ${prefix}groupmenu
│ 📥 ${prefix}dlmenu
│ 🎮 ${prefix}funmenu
│ 🤖 ${prefix}aimenu
│ 🖼 ${prefix}stickermenu
│ 🎵 ${prefix}audiomenu
│ 🎥 ${prefix}videomenu
│ 🔍 ${prefix}searchmenu
│ 🛠 ${prefix}toolsmenu
│ 🧠 ${prefix}convertmenu
│ ⚙️ ${prefix}settingsmenu
│ 🗄 ${prefix}dbmenu
│ 🧪 ${prefix}othermenu
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

      if (thumbnail) {
        await sock.sendMessage(chatId, {
          image: thumbnail,
          caption: menuText
        }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, {
          text: menuText
        }, { quoted: message });
      }

    } catch (error) {
      console.error('Menu Error:', error);
      await sock.sendMessage(chatId, { 
        text: `❌ *Menu Error*\n\n${error.message}`
      }, { quoted: message });
    }
  }
};
