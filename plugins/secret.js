const store = require('../lib/lightweight_store');
const settings = require('../settings');
const os = require('os');
const fs = require('fs');

module.exports = {
  command: 'secretonlyownermegamdmenupass=savi',
  category: 'owner',
  description: 'Internal system information',
  ownerOnly: true,

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    
    try {
      const botMode = await store.getBotMode();
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      
      const dbType = process.env.POSTGRES_URL ? 'PostgreSQL' : 
                     process.env.MONGO_URL ? 'MongoDB' : 
                     process.env.MYSQL_URL ? 'MySQL' : 'SQLite/JSON';
      const dbUrl = process.env.POSTGRES_URL || 'N/A';

      const pgVersion = process.env.POSTGRES_URL ? 'PostgreSQL 16.10' : 'N/A';
      const internalInfo = `╭───〔 🔒 *INTERNAL SYSTEM* 〕───
│
│ 🛠️ *Database:* ${dbType}
│ 🔗 *DB URL:* ${dbUrl}
│ 📊 *DB Version:* ${pgVersion}
│ ⚙️ *Bot Mode:* ${botMode}
│ 🕒 *Uptime:* ${hours}h ${minutes}m
│ 🖥️ *Platform:* ${os.platform()} (${os.arch()})
│ 💾 *Memory Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
│ 📁 *Session Folder:* exists (${fs.existsSync('./session')})
│ 🔑 *Prefixes:* ${settings.prefixes.join(' ')}
│ 🌐 *Firebase:* ${fs.existsSync('./lib/firebase.js') ? 'Connected' : 'Not Connected'}
│
╰──────────────────────────────

> 💫 *INFINITY MD SECRET ACCESS*`;

      await sock.sendMessage(chatId, { text: internalInfo }, { quoted: message });
    } catch (error) {
      await sock.sendMessage(chatId, { text: `❌ Internal Error: ${error.message}` }, { quoted: message });
    }
  }
};
