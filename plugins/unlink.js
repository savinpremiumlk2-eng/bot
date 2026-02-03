const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'unlink',
    aliases: ['logout', 'disconnect'],
    category: 'owner',
    description: 'Unlink the bot and clear session data',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        
        await sock.sendMessage(chatId, { text: '👋 *UNLINKING BOT...* 👋\n\n_Disconnecting from WhatsApp and clearing session data._' }, { quoted: message });

        try {
            // 1. Logout from WhatsApp
            await sock.logout();
            
            // 2. Delete session directory
            const sessionPath = path.join(__dirname, '../session');
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
            }

            console.log('Bot unlinked and session cleared.');
            
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        } catch (error) {
            console.error('Unlink error:', error);
            // Even if logout fails, try to delete session
            const sessionPath = path.join(__dirname, '../session');
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
            }
            process.exit(0);
        }
    }
};