const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'aimenu',
  aliases: ['ai', 'chatmenu'],
  category: 'menu',
  description: 'AI commands menu',
  usage: '.aimenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_(1)_1769953514810.jpg';

    const menuText = `╭───〔 🤖 AI MENU 〕───
│
│ 💬 *Chat AI*
│ ├ ${prefix}gpt - ChatGPT
│ ├ ${prefix}chatbot - Toggle chatbot
│ ├ ${prefix}ask - Ask AI
│
│ 🎨 *Image AI*
│ ├ ${prefix}imagine - Generate image
│ ├ ${prefix}dalle - DALL-E image
│ ├ ${prefix}enhance - Enhance image
│
│ 📝 *Text AI*
│ ├ ${prefix}translate - Translate text
│ ├ ${prefix}summarize - Summarize text
│ ├ ${prefix}rewrite - Rewrite text
│
│ 🔊 *Voice AI*
│ ├ ${prefix}tts - Text to speech
│ ├ ${prefix}stt - Speech to text
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
