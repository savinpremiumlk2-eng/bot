const { Groq } = require('groq-sdk');

module.exports = {
  command: 'ai',
  aliases: ['ask','gpt','chat'],
  category: 'ai',
  description: 'Ask the AI (requires AI_API_KEY in env)',
  usage: '.ai <prompt>',

  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const prompt = args.join(' ').trim() || (message.message?.conversation || '').trim();

    if (!prompt) {
      return await sock.sendMessage(chatId, { text: 'Usage: .ai <prompt>' }, { quoted: message });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return await sock.sendMessage(chatId, { text: 'AI API key not configured. Set environment variable `AI_API_KEY`.' }, { quoted: message });
    }

    let groq;
    try {
      groq = new Groq({ apiKey });
    } catch (e) {
      console.error('Failed to construct Groq client:', e.message || e);
      return await sock.sendMessage(chatId, { text: 'AI client initialization failed.' }, { quoted: message });
    }

    try {
      await sock.sendMessage(chatId, { text: '🤖 Generating response — please wait...' }, { quoted: message });

      const chatCompletion = await groq.chat.completions.create({
        messages: [ { role: 'user', content: prompt } ],
        model: 'openai/gpt-oss-120b',
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
        reasoning_effort: 'medium'
      });

      let content = '';
      for await (const chunk of chatCompletion) {
        const delta = chunk.choices?.[0]?.delta?.content || '';
        content += delta;
      }

      if (!content || content.trim().length === 0) content = '[No response]';

      await sock.sendMessage(chatId, { text: content.trim() }, { quoted: message });
    } catch (err) {
      console.error('AI plugin error:', err && err.message ? err.message : err);
      await sock.sendMessage(chatId, { text: `AI request failed: ${err && err.message ? err.message : 'unknown'}` }, { quoted: message });
    }
  }
};
/*****************************************************************************
 *                                                                           *
 *                     Developed By Qasim Ali                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/GlobalTechInfo                         *
 *  ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                       *
 *  💬  WhatsApp :      *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the Infinity MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/


const axios = require('axios');
const fetch = require('node-fetch');

module.exports = {
  command: 'gpt',
  aliases: ['gemini', 'ai', 'chat'],
  category: 'ai',
  description: 'Ask a question to AI (GPT or Gemini)',
  usage: '.gpt <question> or .gemini <question>',
  async handler(sock, message, args, context = {}) {
    const chatId = context.chatId || message.key.remoteJid;
    const query = args.join(' ').trim();
    if (!query) {
      await sock.sendMessage(chatId, {
        text: "Please provide a query after .ai\n\nExample: .ai write a basic HTML code"
      }, { quoted: message });
      return;
    }
    try {
      await sock.sendMessage(chatId, {
        react: { text: '🤖', key: message.key }
      });

      // Use the provided endpoint for all AI queries
      const apiUrl = `https://api.srihub.store/ai/chatgpt?prompt=${encodeURIComponent(query)}&apikey=dew_FEIXBd8x3XE6eshtBtM1NwEV5IxSLI6PeRE2zLmi`;
      const response = await axios.get(apiUrl);
      if (response.data && (response.data.result || response.data.answer || response.data.message)) {
        const answer = response.data.result || response.data.answer || response.data.message;
        await sock.sendMessage(chatId, { text: answer }, { quoted: message });
      } else {
        throw new Error('Invalid response from AI API');
      }
    } catch (error) {
      console.error('AI Command Error:', error);
      await sock.sendMessage(chatId, {
        text: "❌ Failed to get AI response. Please try again later."
      }, { quoted: message });
    }
  }
};

/*****************************************************************************
 *                                                                           *
 *                   Developed By Qasim Ali                                  *
 *                                                                           *
 *   🌐 GitHub   : https://github.com/GlobalTechInfo                         *
 *   ▶️  YouTube  : https://youtube.com/@GlobalTechInfo                      *
 *   💬  WhatsApp :     *
 *                                                                           *
 *    © 2026 GlobalTechInfo. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the Infinity MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/

