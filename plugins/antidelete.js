const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs/promises');
const store = require('../lib/lightweight_store');

const messageStore = new Map();
const CONFIG_PATH = path.join(__dirname, '../data/antidelete.json');
const TEMP_MEDIA_DIR = path.join(__dirname, '../tmp');

const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);

if (!fs.existsSync(TEMP_MEDIA_DIR)) {
    fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

const getFolderSizeInMB = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (fs.statSync(filePath).isFile()) {
                totalSize += fs.statSync(filePath).size;
            }
        }

        return totalSize / (1024 * 1024);
    } catch (err) {
        console.error('Error getting folder size:', err);
        return 0;
    }
};

const cleanTempFolderIfLarge = () => {
    try {
        const sizeMB = getFolderSizeInMB(TEMP_MEDIA_DIR);
        
        if (sizeMB > 200) {
            const files = fs.readdirSync(TEMP_MEDIA_DIR);
            for (const file of files) {
                const filePath = path.join(TEMP_MEDIA_DIR, file);
                fs.unlinkSync(filePath);
            }
        }
    } catch (err) {
        console.error('Temp cleanup error:', err);
    }
};

setInterval(cleanTempFolderIfLarge, 60 * 1000);

async function loadAntideleteConfig() {
    try {
        if (HAS_DB) {
            const config = await store.getSetting('global', 'antidelete');
            return config || { enabled: false };
        } else {
            if (!fs.existsSync(CONFIG_PATH)) return { enabled: false };
            return JSON.parse(fs.readFileSync(CONFIG_PATH));
        }
    } catch {
        return { enabled: false };
    }
}

async function saveAntideleteConfig(config) {
    try {
        if (HAS_DB) {
            await store.saveSetting('global', 'antidelete', config);
        } else {
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        }
    } catch (err) {
        console.error('Config save error:', err);
    }
}

async function storeMessage(sock, message) {
    try {
        const config = await loadAntideleteConfig();
        const globalSettings = await store.getAllSettings('global');
        const antideleteEnabled = config.enabled || globalSettings.antidelete;
        const antiviewonceEnabled = globalSettings.antiviewonce;

        if (!antideleteEnabled && !antiviewonceEnabled) return;

        if (!message.key?.id) return;

        const messageId = message.key.id;
        let content = '';
        let mediaType = '';
        let mediaPath = '';
        let isViewOnce = false;

        const sender = message.key.participant || message.key.remoteJid;

        const viewOnceContainer = message.message?.viewOnceMessageV2?.message || message.message?.viewOnceMessage?.message || message.message?.viewOnceMessageV2 || message.message?.viewOnceMessage;
        if (viewOnceContainer && antiviewonceEnabled) {
            if (viewOnceContainer.imageMessage) {
                mediaType = 'image';
                content = viewOnceContainer.imageMessage.caption || '';
                const stream = await downloadContentFromMessage(viewOnceContainer.imageMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
                await writeFile(mediaPath, buffer);
                isViewOnce = true;
            } else if (viewOnceContainer.videoMessage) {
                mediaType = 'video';
                content = viewOnceContainer.videoMessage.caption || '';
                const stream = await downloadContentFromMessage(viewOnceContainer.videoMessage, 'video');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
                await writeFile(mediaPath, buffer);
                isViewOnce = true;
            }

            if (isViewOnce && mediaType && fs.existsSync(mediaPath)) {
                try {
                    const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    const senderName = sender.split('@')[0];
                    const mode = globalSettings.antiviewonce_mode || 'owner'; // 'chat', 'owner', 'warn'
                    
                    const reportText = `*🌟 ANTI-VIEWONCE DETECTED 🌟*\n\n` +
                                     `*👤 From:* @${senderName}\n` +
                                     `*🕒 Type:* ${mediaType.toUpperCase()}\n` +
                                     `*📅 Time:* ${new Date().toLocaleString()}\n`;

                    const mediaOptions = {
                        caption: reportText + `\n> 💫 *INFINITY MD BOT*`,
                        mentions: [sender]
                    };

                    if (mode === 'owner') {
                        if (mediaType === 'image') await sock.sendMessage(ownerNumber, { image: { url: mediaPath }, ...mediaOptions });
                        else await sock.sendMessage(ownerNumber, { video: { url: mediaPath }, ...mediaOptions });
                    } else if (mode === 'chat') {
                        if (mediaType === 'image') await sock.sendMessage(message.key.remoteJid, { image: { url: mediaPath }, ...mediaOptions });
                        else await sock.sendMessage(message.key.remoteJid, { video: { url: mediaPath }, ...mediaOptions });
                    } else if (mode === 'warn') {
                        const warnCount = (await store.getSetting(sender, 'viewonce_warns')) || 0;
                        const newWarns = parseInt(warnCount) + 1;
                        await store.saveSetting(sender, 'viewonce_warns', newWarns);
                        
                        await sock.sendMessage(message.key.remoteJid, { 
                            text: `*⚠️ VIEWONCE WARNING ⚠️*\n\n@${senderName}, ViewOnce media is not allowed! This is warning *${newWarns}/3*.\n\n_System has detected and logged the media._`,
                            mentions: [sender]
                        });

                        if (newWarns >= 3) {
                            await sock.sendMessage(message.key.remoteJid, { text: `❌ @${senderName} has reached 3 warnings and will be blocked.` }, { mentions: [sender] });
                            await sock.updateBlockStatus(sender, 'block');
                        }
                    }
                    try { fs.unlinkSync(mediaPath); } catch {}
                } catch (e) {
                    console.error('Error in viewonce handler:', e);
                }
            }
        } else if (message.message?.conversation) {
            content = message.message.conversation;
        } else if (message.message?.extendedTextMessage?.text) {
            content = message.message.extendedTextMessage.text;
        } else if (message.message?.imageMessage) {
            mediaType = 'image';
            content = message.message.imageMessage.caption || '';
            const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.stickerMessage) {
            mediaType = 'sticker';
            const stream = await downloadContentFromMessage(message.message.stickerMessage, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.videoMessage) {
            mediaType = 'video';
            content = message.message.videoMessage.caption || '';
            const stream = await downloadContentFromMessage(message.message.videoMessage, 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
            await writeFile(mediaPath, buffer);
        } else if (message.message?.audioMessage) {
            mediaType = 'audio';
            const mime = message.message.audioMessage.mimetype || '';
            const ext = mime.includes('mpeg') ? 'mp3' : (mime.includes('ogg') ? 'ogg' : 'mp3');
            const stream = await downloadContentFromMessage(message.message.audioMessage, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.${ext}`);
            await writeFile(mediaPath, buffer);
        }

        if (content || mediaPath) {
            const mode = globalSettings.antidelete_mode || 'owner';
            const isGroup = message.key.remoteJid.endsWith('@g.us');
            const isPrivate = !isGroup;

            // Mode 'private' only tracks private chats
            if (mode === 'private' && isGroup) return;

            messageStore.set(messageId, {
                content,
                mediaType,
                mediaPath,
                sender,
                group: isGroup ? message.key.remoteJid : null,
                timestamp: new Date().toISOString()
            });
        }

    } catch (err) {
        console.error('storeMessage error:', err);
    }
}

async function handleMessageRevocation(sock, revocationMessage) {
    try {
        const config = await loadAntideleteConfig();
        const globalSettings = await store.getAllSettings('global');
        if (!config.enabled && !globalSettings.antidelete) return;

        const messageId = revocationMessage.message.protocolMessage.key.id;
        const deletedBy = revocationMessage.message.protocolMessage.key.participant || revocationMessage.message.protocolMessage.key.remoteJid;
        const ownerNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

        if (deletedBy.includes(sock.user.id) || deletedBy === ownerNumber) return;

        const original = messageStore.get(messageId);
        if (!original) return;

        const sender = original.sender;
        const senderName = sender.split('@')[0];
        const groupName = original.group ? (await sock.groupMetadata(original.group)).subject : '';

        const time = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const mode = globalSettings.antidelete_mode || 'owner'; // 'owner', 'chat', 'private'

        let text = `*🔰 ANTIDELETE REPORT 🔰*\n\n` +
            `*🗑️ Deleted By:* @${deletedBy.split('@')[0]}\n` +
            `*👤 Sender:* @${senderName}\n` +
            `*📱 Number:* ${sender}\n` +
            `*🕒 Time:* ${time}\n`;

        if (groupName) text += `*👥 Group:* ${groupName}\n`;

        if (original.content) {
            text += `\n*💬 Deleted Message:*\n${original.content}`;
        }

        // Mode 'owner': Send everything to owner
        // Mode 'chat': Send to group (if group) OR to owner (if private)
        // Mode 'private': Track only private, reports to owner

        const reportTarget = (mode === 'chat' && original.group) ? original.group : ownerNumber;

        await sock.sendMessage(reportTarget, {
            text,
            mentions: [deletedBy, sender]
        });

        // Mode 'chat' - Resend to original chat
        if (mode === 'chat' && original.content) {
            await sock.sendMessage(original.group || original.sender, {
                text: `*🔰 ANTIDELETE RESEND 🔰*\n\n` +
                      `*👤 From:* @${senderName}\n` +
                      `*💬 Message:* ${original.content}`,
                mentions: [sender]
            });
        }

        if (original.mediaType && fs.existsSync(original.mediaPath)) {
            const mediaOptions = {
                caption: `*Deleted ${original.mediaType}*\nFrom: @${senderName}`,
                mentions: [sender]
            };

            try {
                switch (original.mediaType) {
                    case 'image':
                        await sock.sendMessage(ownerNumber, {
                            image: { url: original.mediaPath },
                            ...mediaOptions
                        });
                        // Resend to chat
                        await sock.sendMessage(original.group || original.sender, {
                            image: { url: original.mediaPath },
                            caption: `*🔰 ANTIDELETE RESEND 🔰*\n*👤 From:* @${senderName}`,
                            mentions: [sender]
                        });
                        break;
                    case 'sticker':
                        await sock.sendMessage(ownerNumber, {
                            sticker: { url: original.mediaPath },
                            ...mediaOptions
                        });
                        // Resend to chat
                        await sock.sendMessage(original.group || original.sender, {
                            sticker: { url: original.mediaPath }
                        });
                        break;
                    case 'video':
                        await sock.sendMessage(ownerNumber, {
                            video: { url: original.mediaPath },
                            ...mediaOptions
                        });
                        // Resend to chat
                        await sock.sendMessage(original.group || original.sender, {
                            video: { url: original.mediaPath },
                            caption: `*🔰 ANTIDELETE RESEND 🔰*\n*👤 From:* @${senderName}`,
                            mentions: [sender]
                        });
                        break;
                    case 'audio':
                        await sock.sendMessage(ownerNumber, {
                            audio: { url: original.mediaPath },
                            mimetype: 'audio/mpeg',
                            ptt: false,
                            ...mediaOptions
                        });
                        // Resend to chat
                        await sock.sendMessage(original.group || original.sender, {
                            audio: { url: original.mediaPath },
                            mimetype: 'audio/mpeg',
                            ptt: false
                        });
                        break;
                }
            } catch (err) {
                await sock.sendMessage(ownerNumber, {
                    text: `⚠️ Error sending media: ${err.message}`
                });
            }

            try {
                fs.unlinkSync(original.mediaPath);
            } catch (err) {
                console.error('Media cleanup error:', err);
            }
        }

        messageStore.delete(messageId);

    } catch (err) {
        console.error('handleMessageRevocation error:', err);
    }
}

module.exports = {
    command: 'antidelete',
    aliases: ['antidel', 'adel'],
    category: 'owner',
    description: 'Enable or disable antidelete feature to track deleted messages',
    usage: '.antidelete <on|off>',
    ownerOnly: true,

    async handler(sock, message, args, context = {}) {
        const chatId = context.chatId || message.key.remoteJid;
        const globalSettings = await store.getAllSettings('global');
        const action = args[0]?.toLowerCase();

        if (!action) {
            const currentMode = globalSettings.antidelete_mode || 'owner';
            await sock.sendMessage(chatId, {
                text: `*🔰 ANTIDELETE SETUP 🔰*\n\n` +
                      `*Status:* ${globalSettings.antidelete ? '✅ Enabled' : '❌ Disabled'}\n` +
                      `*Mode:* ${currentMode.toUpperCase()}\n\n` +
                      `*Commands:*\n` +
                      `• \`.antidelete on\` - Enable\n` +
                      `• \`.antidelete off\` - Disable\n` +
                      `• \`.antidelete owner\` - Reports to your inbox only\n` +
                      `• \`.antidelete chat\` - Reports/resends in original chat\n` +
                      `• \`.antidelete private\` - Track only private messages\n\n` +
                      `*Current Anti-ViewOnce Mode:* ${(globalSettings.antiviewonce_mode || 'owner').toUpperCase()}\n` +
                      `• Use \`.antiviewonce <owner|chat|warn>\` to change.`
            }, { quoted: message });
            return;
        }

        if (['owner', 'chat', 'private'].includes(action)) {
            await store.saveSetting('global', 'antidelete_mode', action);
            await store.saveSetting('global', 'antidelete', true);
            await sock.sendMessage(chatId, { text: `✅ *Antidelete set to ${action.toUpperCase()} mode!*` }, { quoted: message });
        } else if (action === 'on') {
            await store.saveSetting('global', 'antidelete', true);
            await sock.sendMessage(chatId, { text: `✅ *Antidelete enabled!*` }, { quoted: message });
        } else if (action === 'off') {
            await store.saveSetting('global', 'antidelete', false);
            await sock.sendMessage(chatId, { text: `❌ *Antidelete disabled!*` }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: '❌ *Invalid mode!*\nUse: `owner`, `chat`, or `private`' }, { quoted: message });
        }
    },

    handleMessageRevocation,
    storeMessage,
    loadAntideleteConfig,
    saveAntideleteConfig
};
