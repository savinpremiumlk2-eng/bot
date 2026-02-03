const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'stickermenu',
  aliases: ['smenu', 'sticker'],
  category: 'menu',
  description: 'Sticker commands menu',
  usage: '.stickermenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_(2)_1769953519419.jpg';

    const menuText = `╭───〔 🖼 STICKER MENU 〕───
│
│ 🎨 *Create Stickers*
│ ├ ${prefix}sticker - Image to sticker
│ ├ ${prefix}s - Quick sticker
│ ├ ${prefix}stickergif - GIF sticker
│ ├ ${prefix}attp - Animated text
│ ├ ${prefix}ttp - Text to picture
│
│ 🔄 *Convert*
│ ├ ${prefix}toimg - Sticker to image
│ ├ ${prefix}togif - Sticker to GIF
│ ├ ${prefix}tomp4 - Sticker to video
│
│ ✏️ *Edit Stickers*
│ ├ ${prefix}crop - Crop sticker
│ ├ ${prefix}round - Round sticker
│ ├ ${prefix}circle - Circle sticker
│
│ 🎭 *Special*
│ ├ ${prefix}emojimix - Mix emojis
│ ├ ${prefix}anime - Anime sticker
│ ├ ${prefix}wasted - Wasted effect
│ ├ ${prefix}triggered - Triggered
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
