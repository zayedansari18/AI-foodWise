export default function handler(req, res) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const hasKey = apiKey.length > 5;
  
  res.status(200).json({
    status: 'ok',
    aiStatus: hasKey ? 'active' : 'demo',
    hasGeminiKey: hasKey,
    timestamp: new Date().toISOString()
  });
}
