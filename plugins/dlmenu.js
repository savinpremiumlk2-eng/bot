const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'dlmenu',
  aliases: ['downloadmenu', 'download'],
  category: 'menu',
  description: 'Download commands menu',
  usage: '.dlmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_(2)_1769953519419.jpg';

    const menuText = `╭───〔 📥 DOWNLOAD MENU 〕───
│
│ 🎵 *Music & Audio*
│ ├ ${prefix}play - Play music
│ ├ ${prefix}song - Download song
│ ├ ${prefix}spotify - Spotify download
│ ├ ${prefix}scloud - SoundCloud
│
│ 🎬 *Video*
│ ├ ${prefix}video - Download video
│ ├ ${prefix}ytmp4 - YouTube video
│ ├ ${prefix}ytmp3 - YouTube audio
│
│ 📱 *Social Media*
│ ├ ${prefix}tiktok - TikTok video
│ ├ ${prefix}instagram - Instagram
│ ├ ${prefix}facebook - Facebook
│ ├ ${prefix}twitter - Twitter/X
│ ├ ${prefix}snapchat - Snapchat
│
│ 🖼️ *Images*
│ ├ ${prefix}pinterest - Pinterest
│ ├ ${prefix}gimage - Google Images
│ ├ ${prefix}alamy - Alamy images
│ ├ ${prefix}getty - Getty images
│
│ 📁 *Files*
│ ├ ${prefix}mediafire - Mediafire
│ ├ ${prefix}terabox - Terabox
│ ├ ${prefix}apk - APK download
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
