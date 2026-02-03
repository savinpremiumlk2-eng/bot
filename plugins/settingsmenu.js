const settings = require("../settings");

module.exports = {
  command: 'settingsmenu',
  aliases: ['setmenu', 'config'],
  category: 'general',
  description: 'Settings menu',
  usage: '.settingsmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 ⚙️ SETTINGS MENU 〕───
│
│ 🤖 *Bot Settings*
│ ├ ${prefix}mode - Bot mode (public/private)
│ ├ ${prefix}prefix - Change prefix
│ ├ ${prefix}language - Set language
│
│ 🔔 *Notifications*
│ ├ ${prefix}autoreact - Auto reactions
│ ├ ${prefix}cmdreact - Command reactions
│ ├ ${prefix}autoread - Auto read
│ ├ ${prefix}autotyping - Auto typing
│
│ 🛡️ *Protection*
│ ├ ${prefix}anticall - Block calls
│ ├ ${prefix}antispam - Anti spam
│ ├ ${prefix}pmblocker - PM blocker
│
│ 📝 *Status*
│ ├ ${prefix}autostatus - Auto status view
│ ├ ${prefix}seenstatus - Seen status
│
│ 👻 *Stealth*
│ ├ ${prefix}stealth - Stealth mode
│ ├ ${prefix}ghost - Ghost mode
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
