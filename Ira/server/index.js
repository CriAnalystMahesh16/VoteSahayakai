import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRouter from './routes/chat.js';
import voiceRouter from './routes/voice.js';
import memoryRouter from './routes/memory.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/memory', memoryRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Ira AI Companion', version: '1.0.0' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🌸 Ira AI Companion server running on http://localhost:${PORT}\n`);
});
