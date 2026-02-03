const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'searchmenu',
  aliases: ['srchmenu', 'findmenu'],
  category: 'menu',
  description: 'Search commands menu',
  usage: '.searchmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_(2)_1769953519419.jpg';

    const menuText = `╭───〔 🔍 SEARCH MENU 〕───
│
│ 🌐 *Web Search*
│ ├ ${prefix}google - Google search
│ ├ ${prefix}bing - Bing search
│ ├ ${prefix}wikipedia - Wikipedia
│ ├ ${prefix}define - Dictionary
│
│ 🎵 *Media Search*
│ ├ ${prefix}ytsearch - YouTube search
│ ├ ${prefix}spotify - Spotify search
│ ├ ${prefix}itunes - iTunes search
│ ├ ${prefix}scloud - SoundCloud
│
│ 👤 *Stalk*
│ ├ ${prefix}gstalk - GitHub stalk
│ ├ ${prefix}igstalk - Instagram stalk
│ ├ ${prefix}ttstalk - TikTok stalk
│ ├ ${prefix}tgstalk - Telegram stalk
│
│ 🎮 *Gaming*
│ ├ ${prefix}genshin - Genshin info
│ ├ ${prefix}pokedex - Pokemon info
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
