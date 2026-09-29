import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// In-memory audio cache to avoid re-generating identical requests
const audioCache = new Map<string, string>();

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check / config endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    ttsModel: 'gemini-3.8-flash-tts',
  });
});

// TTS Generation Endpoint using gemini-3.8-flash-tts
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, voice = 'Kore', style, cacheKey } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS generation.' });
      return;
    }

    const effectiveCacheKey = cacheKey || `${voice}:${text.trim()}:${style || ''}`;
    if (audioCache.has(effectiveCacheKey)) {
      res.json({
        audioBase64: audioCache.get(effectiveCacheKey),
        mimeType: 'audio/wav',
        cached: true,
      });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured.',
        code: 'NO_API_KEY',
      });
      return;
    }

    const defaultStyle =
      'Warm, friendly English teacher narrating for language learners (A2 level). ' +
      'Speak clearly and slowly at about 85-90% of normal speed. Calm, gentle storytelling tone. ' +
      'Pronounce each word distinctly. Pause for about one second between paragraphs, and briefly at commas and full stops. ' +
      'Slightly adapt tone for dialogue: Ali (polite, young), Teacher (calm, encouraging), Old man (kind, warm, slow), Mother (soft, loving). ' +
      'Sound a little nervous during fear, cheerful when happy. No extra comments or sound effects.';

    const instructionStyle = style || defaultStyle;

    // Call gemini-3.8-flash-tts as specified
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: instructionStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error('No audio data returned in response:', JSON.stringify(response.candidates?.[0] || {}));
      res.status(502).json({
        error: 'TTS generation did not return audio data.',
      });
      return;
    }

    audioCache.set(effectiveCacheKey, base64Audio);

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      cached: false,
    });
  } catch (error: any) {
    console.error('TTS generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate speech audio with Gemini TTS.',
      details: error?.toString(),
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
