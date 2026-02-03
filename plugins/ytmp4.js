const axios = require('axios');
const yts = require('yt-search');

module.exports = {
  command: 'ytmp4',
  aliases: ['ytvideo', 'ytv'],
  category: 'download',
  description: 'Download YouTube video as MP4',
  usage: '.ytmp4 <youtube link | search query>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();

    if (!query) {
      return await sock.sendMessage(chatId, {
        text: '🎥 *What video do you want to download?*\n\nUsage: .ytmp4 <youtube link | search query>'
      }, { quoted: message });
    }

    try {
      await sock.sendMessage(chatId, { text: '🔍 *Searching and processing...*' }, { quoted: message });

      let videoUrl = query;
      if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
        const search = await yts(query);
        if (!search.all || search.all.length === 0) {
          return await sock.sendMessage(chatId, { text: '❌ No videos found!' }, { quoted: message });
        }
        videoUrl = search.all[0].url;
      }

      // Using a more reliable API endpoint
      const apiUrl = `https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=qasim-dev&format=360&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl, { timeout: 60000 });

      if (!response.data || !response.data.success || !response.data.data?.downloadUrl) {
        throw new Error('API failed to provide a download link');
      }

      const { title, downloadUrl, thumbnail, quality, size } = response.data.data;

      await sock.sendMessage(chatId, {
        video: { url: downloadUrl },
        caption: `🎬 *Title:* ${title}\n🎚️ *Quality:* ${quality || '360p'}\n⚖️ *Size:* ${size || 'Unknown'}\n\n> 💫 *INFINITY MD BOT*`,
        mimetype: 'video/mp4',
        thumbnail: thumbnail ? { url: thumbnail } : null
      }, { quoted: message });

    } catch (error) {
      console.error('YTMP4 Error:', error);
      await sock.sendMessage(chatId, {
        text: `❌ *Download failed!*\n\n*Error:* ${error.message}\n\n💡 Try again or use another link.`
      }, { quoted: message });
    }
  }
};
