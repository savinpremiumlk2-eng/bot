const store = require('../lib/lightweight_store');

module.exports = {
    command: 'ghost',
    aliases: ['stealth', 'invisible'],
    category: 'owner',
    description: 'Toggle ghost/stealth mode (hides online status and read receipts)',
    ownerOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const action = args[0]?.toLowerCase();
        const ghostMode = await store.getSetting('global', 'stealthMode') || { enabled: false };

        if (!action) {
            await sock.sendMessage(chatId, {
                text: `*👻 GHOST MODE SETUP 👻*\n\n` +
                      `*Current Status:* ${ghostMode.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                      `*Commands:*\n` +
                      `• \`.ghost on\` - Enable stealth mode\n` +
                      `• \`.ghost off\` - Disable stealth mode\n\n` +
                      `_When enabled, the bot will hide its online status and will not send blue ticks/read receipts._`
            }, { quoted: message });
            return;
        }

        if (action === 'on') {
            await store.saveSetting('global', 'stealthMode', { enabled: true });
            await sock.sendMessage(chatId, { text: '✅ *Ghost mode enabled!*\n_The bot will now hide online status and read receipts. Bot will restart to apply changes._' }, { quoted: message });
            setTimeout(() => process.exit(0), 2000);
        } else if (action === 'off') {
            await store.saveSetting('global', 'stealthMode', { enabled: false });
            await sock.sendMessage(chatId, { text: '❌ *Ghost mode disabled!*\n_Bot will restart to apply changes._' }, { quoted: message });
            setTimeout(() => process.exit(0), 2000);
        } else {
            await sock.sendMessage(chatId, { text: '❌ *Invalid action!*\nUse: `.ghost on` or `.ghost off`' }, { quoted: message });
        }
    }
};