import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const MEM0_API_KEY = process.env.MEM0_API_KEY;
const MEM0_BASE = 'https://api.mem0.ai/v1';
const headers = () => ({ Authorization: `Token ${MEM0_API_KEY}`, 'Content-Type': 'application/json' });

// Get all memories for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!MEM0_API_KEY) return res.json({ memories: [] });
  try {
    const response = await axios.get(`${MEM0_BASE}/memories/?user_id=${userId}&limit=20`, { headers: headers() });
    const raw = response.data.results || response.data || [];
    const memories = raw.map(m => ({
      id: m.id,
      text: m.memory || m.text || '',
      createdAt: m.created_at,
    }));
    res.json({ memories });
  } catch (err) {
    console.error('Memory fetch error:', err.message);
    res.json({ memories: [] });
  }
});

// Delete a memory
router.delete('/:memoryId', async (req, res) => {
  const { memoryId } = req.params;
  if (!MEM0_API_KEY) return res.json({ success: false });
  try {
    await axios.delete(`${MEM0_BASE}/memories/${memoryId}/`, { headers: headers() });
    res.json({ success: true });
  } catch (err) {
    console.error('Memory delete error:', err.message);
    res.status(500).json({ success: false });
  }
});

// Search memories
router.post('/search', async (req, res) => {
  const { query, userId } = req.body;
  if (!MEM0_API_KEY) return res.json({ memories: [] });
  try {
    const response = await axios.post(
      `${MEM0_BASE}/memories/search/`,
      { query, user_id: userId },
      { headers: headers() }
    );
    res.json({ memories: response.data || [] });
  } catch (err) {
    res.json({ memories: [] });
  }
});

export default router;
