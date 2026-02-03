const commandHandler = require('../lib/commandHandler');
const settings = require('../settings');
const fs = require('fs');

module.exports = {
    command: 'allmenu',
    aliases: ['commands', 'helpall'],
    category: 'main',
    description: 'Show all commands in a clear list',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const prefix = settings.prefixes[0];
        
        const categories = {};
        commandHandler.commands.forEach(cmd => {
            const cat = cmd.category || 'misc';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.command);
        });

        let menuText = `🤖 *INFINITY MD - ALL COMMANDS* 🤖\n\n`;
        
        for (const [category, commands] of Object.entries(categories)) {
            menuText += `*╭───〔 ${category.toUpperCase()} 〕───*\n`;
            commands.sort().forEach(cmd => {
                menuText += `│ ├ ${prefix}${cmd}\n`;
            });
            menuText += `*╰────────────────────*\n\n`;
        }
        
        menuText += `> 💫 *INFINITY MD BOT* - Powered by AI`;

        const banner = './assets/unnamed_(2)_1769953519419.jpg';
        await sock.sendMessage(chatId, {
            image: fs.readFileSync(banner),
            caption: menuText
        }, { quoted: message });
    }
};
