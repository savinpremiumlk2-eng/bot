const yts = require('yt-search');
const axios = require('axios');

const rateLimiter = {
  queue: [], processing: false, lastRequest: 0, minDelay: 1000,
  add(fn) { return new Promise((resolve, reject) => { this.queue.push({ fn, resolve, reject }); this.process(); }); },
  async process() {
    if (this.processing) return; if (this.queue.length === 0) return; this.processing = true;
    const { fn, resolve, reject } = this.queue.shift();
    const now = Date.now(); const elapsed = now - this.lastRequest;
    if (elapsed < this.minDelay) await new Promise(r => setTimeout(r, this.minDelay - elapsed));
    this.lastRequest = Date.now();
    try { const result = await fn(); resolve(result); } catch (err) { reject(err); }
    this.processing = false; this.process();
  }
};

async function fetchWithRetry(url, maxRetries = 3, baseDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await axios.get(url, { timeout: 30000, validateStatus: s => s < 500 });
      if (res.status === 429) {
        const retryAfter = res.headers['retry-after'];
        const waitMs = retryAfter ? parseInt(retryAfter,10)*1000 : baseDelay * attempt;
        if (attempt < maxRetries) { await new Promise(r=>setTimeout(r, waitMs)); continue; }
        throw new Error('Rate limit exceeded.');
      }
      if (res.status >= 400) throw new Error(`API error: ${res.status} - ${res.statusText}`);
      return res.data;
    } catch (err) {
      if (attempt === maxRetries) throw err; const backoff = baseDelay * Math.pow(2, attempt-1); await new Promise(r=>setTimeout(r, backoff));
    }
  }
}

function extractVideoId(input) {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/];
  for (const re of patterns) { const match = input.match(re); if (match) return match[1]; }
  return null;
}

module.exports = {
  command: 'song', aliases: ['music','audio','mp3'], category: 'music', description: 'Download song from YouTube (MP3)', usage: '.song <song name | youtube link>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();
    if (!query) return await sock.sendMessage(chatId, { text: '🎵 Usage: .song <song name | YouTube link>' }, { quoted: message });

    try {
      let videoInfo = null; let youtubeUrl = null;
      if (query.includes('youtube.com') || query.includes('youtu.be')) {
        youtubeUrl = query;
        try { const videoId = extractVideoId(query); if (videoId) videoInfo = await yts({ videoId }); } catch (e) { /* ignore */ }
      } else {
        const results = await yts(query);
        if (!results?.videos?.length) return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
        videoInfo = results.videos[0]; youtubeUrl = videoInfo.url;
      }

      if (videoInfo?.thumbnail) {
        await sock.sendMessage(chatId, { image: { url: videoInfo.thumbnail }, caption: `🎶 ${videoInfo.title}\n⏱ ${videoInfo.timestamp || 'Unknown'}\n⏳ Downloading...` }, { quoted: message });
      } else await sock.sendMessage(chatId, { text: '⏳ Downloading...' }, { quoted: message });

      const apiUrl = 'https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=qasim-dev&format=mp3&url=' + encodeURIComponent(youtubeUrl);
      const apiResponse = await rateLimiter.add(() => fetchWithRetry(apiUrl));

      if (!apiResponse?.success || !apiResponse?.data?.downloadUrl) throw new Error('Invalid API response');
      const data = apiResponse.data;
      const urlsToTry = [data.downloadUrl, ...(data.alternativeUrls?.filter(x=>x&&x.has_ssl)?.map(x=>x.url)||[])];

      let sent = false;
      for (const url of urlsToTry) {
        try {
          await sock.sendMessage(chatId, { audio: { url }, mimetype: 'audio/mpeg', fileName: `${data.title || videoInfo?.title || 'song'}.mp3`, ptt: false }, { quoted: message });
          sent = true; break;
        } catch (err) { console.error('Failed to send from %s: %s', url, err.message); }
      }

      if (!sent) throw new Error('All download URLs failed');
    } catch (err) {
      console.error('song_alt error:', err && err.message);
      let msg = '❌ Failed to download song. Please try again later.';
      if (String(err.message).includes('Rate limit')) msg = '❌ Service busy. Try again later.';
      await sock.sendMessage(chatId, { text: msg }, { quoted: message });
    }
  }
};
