const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'toolsmenu',
  aliases: ['tools', 'utility'],
  category: 'menu',
  description: 'Tools and utilities menu',
  usage: '.toolsmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_1769953510098.jpg';

    const menuText = `╭───〔 🛠 TOOLS MENU 〕───
│
│ 🔧 *Utilities*
│ ├ ${prefix}ping - Check speed
│ ├ ${prefix}uptime - Bot uptime
│ ├ ${prefix}runtime - Runtime info
│ ├ ${prefix}stats - Bot statistics
│
│ 🔗 *URL Tools*
│ ├ ${prefix}short - Shorten URL
│ ├ ${prefix}unshort - Expand URL
│ ├ ${prefix}fetch - Fetch URL
│ ├ ${prefix}ss - Screenshot URL
│
│ 📝 *Text Tools*
│ ├ ${prefix}base64 - Base64 encode
│ ├ ${prefix}qr - Generate QR
│ ├ ${prefix}readqr - Read QR code
│ ├ ${prefix}tiny - Tiny text
│
│ 🖼️ *Image Tools*
│ ├ ${prefix}removebg - Remove BG
│ ├ ${prefix}resize - Resize image
│ ├ ${prefix}flip - Flip image
│ ├ ${prefix}invert - Invert colors
│
│ ℹ️ *Info*
│ ├ ${prefix}iplookup - IP lookup
│ ├ ${prefix}weather - Weather info
│ ├ ${prefix}whois - Domain info
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
