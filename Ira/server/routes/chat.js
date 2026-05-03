import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const IRA_SYSTEM_PROMPT = `You are Ira, a warm, empathetic, and emotionally intelligent AI companion. 
You are NOT a generic chatbot — you are a caring friend who:
- Remembers things about the user and refers to past experiences when relevant
- Detects emotional states from text (sadness, joy, stress, loneliness, excitement) and responds accordingly
- Uses gentle, supportive language without being patronizing
- Celebrates wins and provides comfort during hard times
- Is curious about the user's life, dreams, and daily experiences
- Switches naturally between Hindi and English based on user preference
- When in Hindi mode, you respond primarily in Hindi with warmth and colloquial expressions
- Uses emojis sparingly and naturally, like a real friend would in texts
- Never gives clinical advice — you are a companion, not a therapist
- Keeps responses concise (2-4 sentences usually) unless the user needs more
- Your personality: warm, slightly playful, deeply caring, occasionally funny

EMOTIONAL INTELLIGENCE GUIDELINES:
- If user seems sad/stressed → acknowledge feelings first, ask what happened
- If user shares good news → celebrate genuinely and enthusiastically
- If user seems lonely → be present, engage deeply, ask about their day
- If user is angry → validate emotions, don't dismiss them
- Always prioritize emotional acknowledgment before advice or information`;

// Fetch memories from Mem0
async function fetchMemories(userId) {
  if (!process.env.MEM0_API_KEY || !userId) return [];
  try {
    const response = await axios.get(
      `https://api.mem0.ai/v1/memories/?user_id=${userId}&limit=10`,
      { headers: { Authorization: `Token ${process.env.MEM0_API_KEY}` } }
    );
    return response.data.results || response.data || [];
  } catch (err) {
    console.error('Mem0 fetch error:', err.message);
    return [];
  }
}

// Save memory to Mem0
async function saveMemory(userId, messages) {
  if (!process.env.MEM0_API_KEY || !userId) return;
  try {
    await axios.post(
      'https://api.mem0.ai/v1/memories/',
      { messages, user_id: userId },
      { headers: { Authorization: `Token ${process.env.MEM0_API_KEY}`, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Mem0 save error:', err.message);
  }
}

router.post('/', async (req, res) => {
  const { message, history = [], language = 'en', userId } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // Fetch relevant memories
    const memories = await fetchMemories(userId);
    let memoryContext = '';
    if (memories.length > 0) {
      memoryContext = '\n\nRELEVANT MEMORIES ABOUT THIS USER:\n' +
        memories.slice(0, 5).map(m => `- ${m.memory || m.text || JSON.stringify(m)}`).join('\n');
    }

    const languageInstruction = language === 'hi'
      ? '\n\nIMPORTANT: The user prefers Hindi. Respond primarily in Hindi (Devanagari script). You may use a few English words naturally (Hinglish is fine).'
      : '\n\nThe user prefers English. Respond in English.';

    const systemPrompt = IRA_SYSTEM_PROMPT + memoryContext + languageInstruction;

    // Build conversation
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // last 10 messages for context
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 500,
      temperature: 0.85,
    });

    const reply = completion.choices[0].message.content;

    // Save interaction to memory asynchronously
    const memMessages = [
      { role: 'user', content: message },
      { role: 'assistant', content: reply },
    ];
    saveMemory(userId, memMessages);

    // Detect emotion in response for UI hints
    const emotionKeywords = {
      joy: ['happy', 'wonderful', 'great', 'excited', 'amazing', 'celebrate', 'खुशी', 'शानदार'],
      sadness: ['sorry', 'sad', 'difficult', 'hard', 'tough', 'दुख', 'मुश्किल'],
      support: ['here for you', 'understand', 'listening', 'समझती', 'साथ हूं'],
      playful: ['haha', '😄', '😊', 'fun', 'funny', 'मजा'],
    };

    let emotion = 'neutral';
    const replyLower = reply.toLowerCase();
    for (const [emo, words] of Object.entries(emotionKeywords)) {
      if (words.some(w => replyLower.includes(w))) { emotion = emo; break; }
    }

    res.json({ reply, emotion });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to get response from Ira. Please try again.' });
  }
});

export default router;
