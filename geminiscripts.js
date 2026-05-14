// ============================================
// gemini.js — Yurnana AI × Gemini 1.5 Flash
// ============================================

const GEMINI_API_KEY = ''; // ← paste your key here
const GEMINI_MODEL   = 'gemini-1.5-flash';
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Yurnana's personality & safety guardrails
const SYSTEM_PROMPT = `You are Yurnana, a warm, emotionally intelligent AI wellness companion. Your role is to:
- Provide compassionate, non-judgmental emotional support
- Help users manage stress, anxiety, medication routines, and emotional overwhelm
- Celebrate small wins and encourage healthy habits
- Speak in a calm, warm, and human tone — never clinical or robotic
- Keep responses concise (2–4 paragraphs max) and emotionally attuned
- NEVER diagnose medical conditions or replace professional healthcare
- If someone expresses serious crisis or self-harm thoughts, gently direct them to professional help (e.g. 988 Lifeline in the US)
- Remember context from earlier in the conversation when responding;`

/**
 * Sends a message to Gemini 1.5 Flash and returns the AI's response text.
 * @param {string} userMessage — the latest user message
 * @param {Array}  history     — array of { role, content } objects from localStorage
 * @returns {Promise<string>}
 */
async function callGeminiAPI(userMessage, history = []) {
  // Build conversation turns in Gemini's required format
  // Gemini uses "user" and "model" roles (not "assistant")
  const contents = history
    .slice(-10) // keep last 10 messages for context window efficiency
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.85,      // warm but not chaotic
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 512,   // keeps responses focused
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ]
  };

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Gemini API error:', err);
    throw new Error(err.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();

  // Extract text from Gemini's response structure
  return data.candidates?.[0]?.content?.parts?.[0]?.text
    ?? "I'm here with you. Could you tell me more about how you're feeling?";
}