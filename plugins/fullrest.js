const fs = require('fs');
const path = require('path');
const store = require('../lib/lightweight_store');

module.exports = {
    command: 'fullrest',
    aliases: ['resetall', 'clearall'],
    category: 'owner',
    description: 'Reset all bot history, settings, and database content',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        
        await sock.sendMessage(chatId, { text: '⏳ *RESETTING SYSTEM...* ⏳\n\n_This will clear all settings, message history, and database records._' }, { quoted: message });

        try {
            // 1. Clear lightweight store (Database or JSON)
            if (typeof store.resetAll === 'function') {
                await store.resetAll();
            } else {
                // Fallback: Clear manual files if store.resetAll isn't available
                const dataDir = path.join(__dirname, '../data');
                if (fs.existsSync(dataDir)) {
                    const files = fs.readdirSync(dataDir);
                    for (const file of files) {
                        if (file.endsWith('.json') && file !== 'owner.json') {
                            fs.writeFileSync(path.join(dataDir, file), '{}');
                        }
                    }
                }
            }

            // 2. Clear temp media
            const tempDir = path.join(__dirname, '../tmp');
            if (fs.existsSync(tempDir)) {
                const files = fs.readdirSync(tempDir);
                for (const file of files) {
                    try { fs.unlinkSync(path.join(tempDir, file)); } catch {}
                }
            }

            await sock.sendMessage(chatId, { text: '✅ *SYSTEM RESET COMPLETE*\n\nAll history and settings have been cleared. Bot will restart now.' }, { quoted: message });
            
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        } catch (error) {
            console.error('Reset error:', error);
            await sock.sendMessage(chatId, { text: `❌ *Reset failed:* ${error.message}` }, { quoted: message });
        }
    }
};