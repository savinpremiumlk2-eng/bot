const settings = require("../settings");

module.exports = {
  command: 'videomenu',
  aliases: ['vmenu', 'vidmenu'],
  category: 'general',
  description: 'Video commands menu',
  usage: '.videomenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🎥 VIDEO MENU 〕───
│
│ 📹 *Download*
│ ├ ${prefix}video - Download video
│ ├ ${prefix}ytmp4 - YouTube video
│ ├ ${prefix}tiktok - TikTok video
│ ├ ${prefix}reels - Instagram reels
│
│ 🎬 *Effects*
│ ├ ${prefix}slow - Slow motion
│ ├ ${prefix}fast - Speed up
│ ├ ${prefix}reverse - Reverse video
│
│ 🔄 *Convert*
│ ├ ${prefix}togif - Video to GIF
│ ├ ${prefix}tomp3 - Video to audio
│ ├ ${prefix}compress - Compress video
│
│ ✂️ *Edit*
│ ├ ${prefix}trim - Trim video
│ ├ ${prefix}crop - Crop video
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
