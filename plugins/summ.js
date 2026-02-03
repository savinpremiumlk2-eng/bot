const store = require('../lib/lightweight_store');
const commandHandler = require('../lib/commandHandler');
const settings = require('../settings');
const fs = require('fs');

module.exports = {
    command: 'summ',
    aliases: ['summary', 'botstats'],
    category: 'tools',
    description: 'Get full bot summary and statistics',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const stats = store.getStats();
        const commandsCount = commandHandler.commands.size;
        const totalUsers = Object.keys(store.contacts || {}).length;
        
        const summary = `📊 *INFINITY MD - FULL SUMMARY* 📊\n\n` +
            `*🤖 Bot Status:* Online\n` +
            `*⏱️ Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
            `*📊 Commands:* ${commandsCount}\n` +
            `*👥 Total Users:* ${totalUsers}\n` +
            `*🗄️ Backend:* ${stats.backend}\n` +
            `*🚀 RAM Usage:* ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n` +
            `*📡 Platform:* ${process.platform}\n` +
            `*👤 Owner:* ${settings.botOwner}\n\n` +
            `> 💫 *INFINITY MD BOT* - Powered by AI`;

        const banner = './assets/unnamed_1769953510098.jpg';
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(banner),
            caption: summary
        }, { quoted: message });
    }
};