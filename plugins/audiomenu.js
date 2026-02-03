const settings = require("../settings");

module.exports = {
  command: 'audiomenu',
  aliases: ['audio', 'soundmenu'],
  category: 'general',
  description: 'Audio commands menu',
  usage: '.audiomenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🎵 AUDIO MENU 〕───
│
│ 🎶 *Music*
│ ├ ${prefix}play - Play music
│ ├ ${prefix}song - Download song
│ ├ ${prefix}lyrics - Get lyrics
│ ├ ${prefix}spotify - Spotify
│
│ 🔊 *Audio Effects*
│ ├ ${prefix}bass - Bass boost
│ ├ ${prefix}slow - Slow audio
│ ├ ${prefix}fast - Speed up
│ ├ ${prefix}reverse - Reverse audio
│ ├ ${prefix}nightcore - Nightcore
│
│ 🎤 *Voice*
│ ├ ${prefix}tts - Text to speech
│ ├ ${prefix}vnote - Voice note
│ ├ ${prefix}ringtone - Ringtone
│
│ 🔄 *Convert*
│ ├ ${prefix}toaudio - Video to audio
│ ├ ${prefix}tomp3 - Convert to MP3
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
