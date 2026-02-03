const settings = require("../settings");

module.exports = {
  command: 'dbmenu',
  aliases: ['database', 'datamenu'],
  category: 'general',
  description: 'Database commands menu',
  usage: '.dbmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🗄 DATABASE MENU 〕───
│
│ 📊 *Statistics*
│ ├ ${prefix}stats - Bot statistics
│ ├ ${prefix}rank - User rankings
│ ├ ${prefix}leaderboard - Leaderboard
│
│ 💾 *Data Management*
│ ├ ${prefix}backup - Backup data
│ ├ ${prefix}restore - Restore data
│ ├ ${prefix}reset - Reset data
│
│ 📝 *Notes*
│ ├ ${prefix}notes - View notes
│ ├ ${prefix}addnote - Add note
│ ├ ${prefix}delnote - Delete note
│
│ ⚙️ *Settings Storage*
│ ├ ${prefix}getvar - Get variable
│ ├ ${prefix}setvar - Set variable
│ ├ ${prefix}delvar - Delete variable
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
