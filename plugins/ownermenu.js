const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'ownermenu',
  aliases: ['omenu'],
  category: 'menu',
  description: 'Owner commands menu',
  usage: '.ownermenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_(1)_1769953514810.jpg';

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

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
