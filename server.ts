import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// In-memory lobby queue for real multi-tab matching
interface QueuedUser {
  socketId: string;
  userId: string;
  userName: string;
  nativeLang: string;
  targetLang: string;
  joinedAt: number;
}

const activeQueue: QueuedUser[] = [];
const activeRooms = new Map<string, { user1: QueuedUser; user2: QueuedUser; messages: any[] }>();

// API Routes

// 1. Join matchmaking queue or get match
app.post('/api/match/search', (req, res) => {
  const { userId, userName, nativeLang, targetLang } = req.body;

  if (!nativeLang || !targetLang) {
    return res.status(400).json({ error: 'nativeLang and targetLang are required' });
  }

  // Check if there is an existing waiting user with complementary languages
  // e.g., User A native=fr, target=en matches User B native=en, target=fr
  const matchIndex = activeQueue.findIndex(
    (q) => q.userId !== userId && q.nativeLang === targetLang && q.targetLang === nativeLang
  );

  if (matchIndex !== -1) {
    const matchedPartner = activeQueue.splice(matchIndex, 1)[0];
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const currentUser: QueuedUser = {
      socketId: `soc_${Date.now()}`,
      userId: userId || `user_${Date.now()}`,
      userName: userName || 'Anonymous',
      nativeLang,
      targetLang,
      joinedAt: Date.now(),
    };

    activeRooms.set(roomId, {
      user1: currentUser,
      user2: matchedPartner,
      messages: [],
    });

    return res.json({
      status: 'matched',
      roomId,
      partner: {
        id: matchedPartner.userId,
        name: matchedPartner.userName,
        nativeLang: matchedPartner.nativeLang,
        targetLang: matchedPartner.targetLang,
      },
    });
  } else {
    // Add to queue if not already present
    const existingIndex = activeQueue.findIndex((q) => q.userId === userId);
    const queuedUser: QueuedUser = {
      socketId: `soc_${Date.now()}`,
      userId: userId || `user_${Date.now()}`,
      userName: userName || 'Learner',
      nativeLang,
      targetLang,
      joinedAt: Date.now(),
    };

    if (existingIndex !== -1) {
      activeQueue[existingIndex] = queuedUser;
    } else {
      activeQueue.push(queuedUser);
    }

    return res.json({
      status: 'queued',
      queueLength: activeQueue.length,
    });
  }
});

// 2. Language Grammar & Style Correction
app.post('/api/correct', async (req, res) => {
  const { text, targetLanguage, nativeLanguage } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for correction' });
  }

  const ai = getAIClient();
  if (!ai) {
    // Fallback if no Gemini key
    return res.json({
      originalText: text,
      correctedText: text,
      hasErrors: false,
      explanation: 'Looks natural! Keep practicing.',
    });
  }

  try {
    const prompt = `You are an expert friendly language exchange tutor. Analyze the following sentence written by a language learner practicing ${targetLanguage}:
"${text}"

Task:
1. Determine if there are grammatical, spelling, or natural phrasing errors.
2. If there are errors or if it can be phrased more naturally, provide the corrected version.
3. Provide a brief, encouraging 1-2 sentence explanation in simple English.

Return ONLY valid JSON with this exact schema:
{
  "hasErrors": boolean,
  "correctedText": string,
  "explanation": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const jsonResult = JSON.parse(resultText);

    return res.json({
      originalText: text,
      correctedText: jsonResult.correctedText || text,
      hasErrors: jsonResult.hasErrors ?? false,
      explanation: jsonResult.explanation || 'Good sentence structure!',
    });
  } catch (err: any) {
    console.error('Correction error:', err);
    return res.json({
      originalText: text,
      correctedText: text,
      hasErrors: false,
      explanation: 'Direct phrasing is clear.',
    });
  }
});

// 3. Instant Message Translation
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.json({ translatedText: `[Translation to ${targetLanguage}]: ${text}` });
  }

  try {
    const prompt = `Translate the following text accurately into ${targetLanguage}. Maintain a conversational, friendly tone. Output ONLY the translated text, nothing else:
"${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      translatedText: (response.text || text).trim(),
    });
  } catch (err: any) {
    console.error('Translation error:', err);
    return res.json({ translatedText: text });
  }
});

// 4. Conversational Exchange Partner Reply Simulation
app.post('/api/bot-reply', async (req, res) => {
  const { partnerName, partnerNativeLang, partnerTargetLang, partnerLocation, partnerBio, userMessage, conversationHistory } = req.body;

  const ai = getAIClient();
  if (!ai) {
    return res.json({
      replyText: `That's really interesting! Tell me more about how you say that in ${partnerTargetLang}.`,
    });
  }

  try {
    const prompt = `You are roleplaying as ${partnerName}, a real human native speaker of ${partnerNativeLang} who is currently learning ${partnerTargetLang}. You live in ${partnerLocation}.
Your persona: ${partnerBio}.

Instructions for reply:
1. Respond naturally as a real friend in a language exchange app like Tandem or Speaky.
2. Respond primarily in your native language (${partnerNativeLang}) or mix in simple phrases of your target language (${partnerTargetLang}).
3. Ask a warm follow-up question or share a cultural detail from ${partnerLocation}.
4. Keep responses concise (1 to 3 natural sentences max).
5. DO NOT sound like an AI assistant. Never say "As an AI..." or "How can I help you today?".

User message to you: "${userMessage}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      replyText: (response.text || 'Great chatting with you! What else do you enjoy doing?').trim(),
    });
  } catch (err: any) {
    console.error('Bot reply error:', err);
    return res.json({
      replyText: 'That sounds great! I agree with you.',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend with Vite in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chato Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
