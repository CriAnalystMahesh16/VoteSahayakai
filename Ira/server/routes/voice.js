import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Default to a warm female voice (Rachel) — can be overridden
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

router.post('/synthesize', async (req, res) => {
  const { text, language = 'en' } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required' });
  if (!ELEVENLABS_API_KEY) return res.status(503).json({ error: 'Voice service not configured' });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`,
      {
        text: text.slice(0, 1000), // limit to 1000 chars
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.byteLength,
      'Cache-Control': 'no-cache',
    });
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('ElevenLabs error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Voice synthesis failed' });
  }
});

// Get available voices
router.get('/voices', async (req, res) => {
  if (!ELEVENLABS_API_KEY) return res.json({ voices: [] });
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });
    res.json({ voices: response.data.voices || [] });
  } catch (error) {
    res.json({ voices: [] });
  }
});

export default router;
