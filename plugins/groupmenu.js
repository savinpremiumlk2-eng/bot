const settings = require("../settings");
const fs = require('fs');

module.exports = {
  command: 'groupmenu',
  aliases: ['gmenu', 'grpmenu'],
  category: 'menu',
  description: 'Group commands menu',
  usage: '.groupmenu',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prefix = settings.prefixes ? settings.prefixes[0] : '.';
    const banner = './assets/unnamed_1769953510098.jpg';

    const menuText = `╭───〔 🧩 GROUP MENU 〕───
│
│ 👥 *Member Management*
│ ├ ${prefix}kick - Kick member
│ ├ ${prefix}add - Add member
│ ├ ${prefix}promote - Promote to admin
│ ├ ${prefix}demote - Demote from admin
│ ├ ${prefix}warn - Warn a member
│
│ 🏷️ *Tagging*
│ ├ ${prefix}tagall - Tag all members
│ ├ ${prefix}tag - Tag specific members
│ ├ ${prefix}staff - Tag admins
│ ├ ${prefix}tagnotadmin - Tag non-admins
│
│ ⚙️ *Group Settings*
│ ├ ${prefix}groupinfo - Group info
│ ├ ${prefix}setdesc - Set description
│ ├ ${prefix}setname - Set group name
│ ├ ${prefix}setpp - Set group photo
│
│ 🛡️ *Protection*
│ ├ ${prefix}antilink - Anti link
│ ├ ${prefix}antitag - Anti tag
│ ├ ${prefix}antibadword - Anti badword
│ ├ ${prefix}mute - Mute group
│ ├ ${prefix}unmute - Unmute group
│
│ 👋 *Greetings*
│ ├ ${prefix}welcome - Welcome message
│ ├ ${prefix}goodbye - Goodbye message
│
╰────────────────────

> 💫 *INFINITY MD BOT* - Powered by AI`;

    await sock.sendMessage(chatId, { 
      image: fs.readFileSync(banner),
      caption: menuText 
    }, { quoted: message });
  }
};
