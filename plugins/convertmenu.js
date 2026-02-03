const settings = require("../settings");

module.exports = {
  command: 'convertmenu',
  aliases: ['convert', 'convmenu'],
  category: 'general',
  description: 'Conversion commands menu',
  usage: '.convertmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🧠 CONVERT MENU 〕───
│
│ 🖼️ *Image Convert*
│ ├ ${prefix}toimg - Sticker to image
│ ├ ${prefix}topng - Convert to PNG
│ ├ ${prefix}tojpg - Convert to JPG
│ ├ ${prefix}towebp - Convert to WebP
│
│ 🎵 *Audio Convert*
│ ├ ${prefix}tomp3 - Convert to MP3
│ ├ ${prefix}toaudio - Video to audio
│ ├ ${prefix}tovn - To voice note
│
│ 🎥 *Video Convert*
│ ├ ${prefix}tomp4 - Convert to MP4
│ ├ ${prefix}togif - Video to GIF
│ ├ ${prefix}compress - Compress video
│
│ 📄 *Document Convert*
│ ├ ${prefix}topdf - Convert to PDF
│ ├ ${prefix}tourl - Media to URL
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
