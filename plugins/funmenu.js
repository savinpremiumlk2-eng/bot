const settings = require("../settings");

module.exports = {
  command: 'funmenu',
  aliases: ['fun', 'gamemenu'],
  category: 'general',
  description: 'Fun and games menu',
  usage: '.funmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';

    const menuText = `╭───〔 🎮 FUN MENU 〕───
│
│ 🎲 *Games*
│ ├ ${prefix}tictactoe - Tic Tac Toe
│ ├ ${prefix}hangman - Hangman game
│ ├ ${prefix}trivia - Trivia quiz
│ ├ ${prefix}guess - Guess the number
│
│ 😂 *Fun Commands*
│ ├ ${prefix}meme - Random meme
│ ├ ${prefix}joke - Random joke
│ ├ ${prefix}8ball - Magic 8 ball
│ ├ ${prefix}dare - Dare challenge
│ ├ ${prefix}truth - Truth question
│ ├ ${prefix}wyr - Would you rather
│
│ 💕 *Love & Social*
│ ├ ${prefix}ship - Ship two people
│ ├ ${prefix}character - Character info
│ ├ ${prefix}simp - Simp rate
│ ├ ${prefix}stupid - Stupid rate
│
│ 📝 *Text Fun*
│ ├ ${prefix}shayari - Random shayari
│ ├ ${prefix}quote - Random quote
│ ├ ${prefix}why - Random why
│ ├ ${prefix}teddy - Teddy message
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
  }
};
