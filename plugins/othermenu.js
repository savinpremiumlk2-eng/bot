const settings = require("../settings");

module.exports = {
  command: 'othermenu',
  aliases: ['misc', 'extramenu'],
  category: 'general',
  description: 'Other commands menu',
  usage: '.othermenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🧪 OTHER MENU 〕───
│
│ ℹ️ *Information*
│ ├ ${prefix}alive - Check bot status
│ ├ ${prefix}ping - Response time
│ ├ ${prefix}owner - Owner contact
│ ├ ${prefix}source - Source code
│
│ 📱 *WhatsApp*
│ ├ ${prefix}vcard - Create vCard
│ ├ ${prefix}quoted - Get quoted msg
│ ├ ${prefix}forward - Forward msg
│ ├ ${prefix}viewonce - View once
│
│ 🔗 *Links*
│ ├ ${prefix}walink - WA group link
│ ├ ${prefix}revoke - Revoke link
│ ├ ${prefix}invite - Group invite
│
│ 🎨 *Miscellaneous*
│ ├ ${prefix}tourl - Upload to URL
│ ├ ${prefix}take - Take sticker
│ ├ ${prefix}spoof - Spoof message
│ ├ ${prefix}list - View list
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
