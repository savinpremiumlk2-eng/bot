const store = require('../lib/lightweight_store');

module.exports = {
    command: 'antiviewonce',
    aliases: ['antivo', 'avo'],
    category: 'owner',
    description: 'Configure anti-viewonce behavior',
    usage: '.antiviewonce <owner|chat|warn>',
    ownerOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const globalSettings = await store.getAllSettings('global');
        const action = args[0]?.toLowerCase();

        if (!action) {
            const currentMode = globalSettings.antiviewonce_mode || 'owner';
            await sock.sendMessage(chatId, {
                text: `*🌟 ANTI-VIEWONCE SETUP 🌟*\n\n` +
                      `*Status:* ${globalSettings.antiviewonce ? '✅ Enabled' : '❌ Disabled'}\n` +
                      `*Mode:* ${currentMode.toUpperCase()}\n\n` +
                      `*Commands:*\n` +
                      `• \`.antiviewonce on\` - Enable feature\n` +
                      `• \`.antiviewonce off\` - Disable feature\n` +
                      `• \`.antiviewonce owner\` - Send detected media to your inbox\n` +
                      `• \`.antiviewonce chat\` - Resend detected media to original chat\n` +
                      `• \`.antiviewonce warn\` - Warn user (3 strikes before block)\n\n` +
                      `_Mode changes automatically enable the feature._`
            }, { quoted: message });
            return;
        }

        if (['owner', 'chat', 'warn'].includes(action)) {
            await store.saveSetting('global', 'antiviewonce_mode', action);
            await store.saveSetting('global', 'antiviewonce', true);
            await sock.sendMessage(chatId, { text: `✅ *Anti-ViewOnce set to ${action.toUpperCase()} mode!*` }, { quoted: message });
        } else if (action === 'on') {
            await store.saveSetting('global', 'antiviewonce', true);
            await sock.sendMessage(chatId, { text: `✅ *Anti-ViewOnce enabled!*` }, { quoted: message });
        } else if (action === 'off') {
            await store.saveSetting('global', 'antiviewonce', false);
            await sock.sendMessage(chatId, { text: `❌ *Anti-ViewOnce disabled!*` }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: '❌ *Invalid mode!*\nUse: `owner`, `chat`, or `warn`' }, { quoted: message });
        }
    }
};