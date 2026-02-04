const settings = require("../settings");
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
  command: 'ownermenu',
  aliases: ['omenu'],
  category: 'menu',
  description: 'Owner commands menu',
  usage: '.ownermenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = pickRandomAsset() || path.join(__dirname, '../assets/unnamed_(1)_1769953514810.jpg');

    const menuText = `╭───〔 👑 OWNER MENU 〕───
│
│ 🔧 *Bot Management*
│ ├ ${prefix}restart - Restart bot
│ ├ ${prefix}shutdown - Shutdown bot
│ ├ ${prefix}update - Update bot
│ ├ ${prefix}cleartmp - Clear temp files
│ ├ ${prefix}reload - Reload plugins
│
│ 👤 *User Management*
│ ├ ${prefix}ban - Ban a user
│ ├ ${prefix}unban - Unban a user
│ ├ ${prefix}sudo - Add sudo user
│ ├ ${prefix}delsudo - Remove sudo user
│
│ ⚙️ *Settings*
│ ├ ${prefix}setbio - Set bot bio
│ ├ ${prefix}setname - Set bot name
│ ├ ${prefix}mode - Set bot mode
│ ├ ${prefix}anticall - Anti call settings
│ ├ ${prefix}antidelete - Anti delete
│
│ 📦 *Plugins*
│ ├ ${prefix}install - Install plugin
│ ├ ${prefix}delplugin - Delete plugin
│ ├ ${prefix}listcmd - List commands
│ ├ ${prefix}getplugin - Get plugin
│
│ 🔄 *Session*
│ ├ ${prefix}pair - Get pairing code
│ ├ ${prefix}clearsession - Clear session
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    try {
      const img = fs.existsSync(banner) ? fs.readFileSync(banner) : null;
      if (img) {
        await sock.sendMessage(chatId, { image: img, caption: menuText }, { quoted: message });
        return;
      }
    } catch (e) {}

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
