import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// List of fallback food presets for seamless Demo Mode behavior
const DEMO_PRESETS = [
  {
    food_name: "Steamed Rice",
    food_category: "Grain",
    confidence: 0.94,
    waste_level: "High",
    estimated_quantity_range: "120-160 g",
    reason: "Large portion served during lunch peak hours left unconsumed on plate.",
    recommendation: "Implement half-portion options at the serving counter to reduce plate waste."
  },
  {
    food_name: "Yellow Dal Tadka",
    food_category: "Legumes",
    confidence: 0.89,
    waste_level: "Medium",
    estimated_quantity_range: "80-120 g",
    reason: "Excess gravy served relative to rice quantity.",
    recommendation: "Use smaller ladles and allow diner self-adjustment during serving."
  },
  {
    food_name: "Paneer Butter Masala",
    food_category: "Dairy",
    confidence: 0.92,
    waste_level: "Medium",
    estimated_quantity_range: "60-100 g",
    reason: "Rich curry left over due to spice preference variations.",
    recommendation: "Offer mild and spicy gravy options separately."
  },
  {
    food_name: "Whole Wheat Roti",
    food_category: "Grain",
    confidence: 0.88,
    waste_level: "Low",
    estimated_quantity_range: "30-50 g",
    reason: "Partial bread crust leftover.",
    recommendation: "Keep rotis warm in smaller insulated baskets to avoid drying out."
  },
  {
    food_name: "Fresh Garden Salad",
    food_category: "Vegetables",
    confidence: 0.91,
    waste_level: "High",
    estimated_quantity_range: "100-140 g",
    reason: "Pre-dressed salad became soggy before consumption.",
    recommendation: "Provide dressings on the side rather than pre-mixing."
  }
];

// Helper to pick a demo preset based on text or random
function getDemoResult(hintText = '') {
  const matched = DEMO_PRESETS.find(p => 
    hintText.toLowerCase().includes(p.food_name.toLowerCase()) || 
    hintText.toLowerCase().includes(p.food_category.toLowerCase())
  );
  if (matched) return matched;
  return DEMO_PRESETS[Math.floor(Math.random() * DEMO_PRESETS.length)];
}

// Health check endpoint (verifies key existence without revealing value)
app.get('/api/health', (req, res) => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const hasKey = apiKey.length > 5;
  res.json({
    status: 'ok',
    aiStatus: hasKey ? 'active' : 'demo',
    hasGeminiKey: hasKey,
    timestamp: new Date().toISOString()
  });
});

// AI Waste Analysis endpoint
app.post('/api/analyze-waste', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', hint } = req.body;
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    // Check if API key is missing -> return Demo Mode response
    if (!apiKey) {
      console.log('ℹ️ GEMINI_API_KEY missing. Gracefully returning Demo Mode response.');
      const demoResult = getDemoResult(hint || '');
      return res.json({
        success: true,
        isDemoMode: true,
        demoNotice: "Using Demo Mode (GEMINI_API_KEY not configured). Add GEMINI_API_KEY to .env for live Gemini Vision AI.",
        data: demoResult
      });
    }

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: "Missing imageBase64 payload"
      });
    }

    // Clean up base64 string if it contains data URI header
    const cleanBase64 = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    const promptText = `
You are an expert food waste visual auditor for institutional cafeterias and dining halls.
Analyze the uploaded image of leftover food waste.

Return ONLY a valid raw JSON object conforming strictly to this structure:
{
  "food_name": "Name of primary food identified (e.g. Rice, Dal, Roti, Salad, Pasta, Curry, Paneer, Chicken, Fries, Soup)",
  "food_category": "Category (Grain, Legumes, Dairy, Vegetables, Poultry, Snack, Fruit, Soup, Dessert, Other)",
  "confidence": 0.85 to 0.99 (float representing estimation confidence),
  "waste_level": "Low" or "Medium" or "High" (MUST be one of these 3 values only),
  "estimated_quantity_range": "Rough estimate range like '50-80 g' or '100-150 g' or '200-250 g'",
  "reason": "Brief observation on why this leftover waste likely occurred",
  "recommendation": "Actionable portion-control or kitchen reduction tip"
}

CRITICAL RULES:
1. waste_level MUST be strictly 'Low', 'Medium', or 'High'. Never output exact weight claims, only range estimates.
2. Return ONLY JSON without markdown backticks or commentary text.
`;

    // Candidate Gemini model endpoints (tries gemini-1.5-flash first, then gemini-2.0-flash)
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError = null;
    let geminiResponseJson = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const requestBody = {
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: mimeType.includes('svg') ? 'image/jpeg' : mimeType,
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            response_mime_type: "application/json"
          }
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          geminiResponseJson = await response.json();
          break; // Success!
        } else {
          const errText = await response.text();
          lastError = `HTTP ${response.status}: ${errText}`;
          console.warn(`Gemini Model ${model} returned error status ${response.status}. Trying fallback model if available.`);
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!geminiResponseJson) {
      console.warn(`All Gemini API models failed (${lastError}). Gracefully falling back to Demo Mode.`);
      const demoResult = getDemoResult(hint || '');
      return res.json({
        success: true,
        isDemoMode: true,
        demoNotice: "Gemini API call encountered an error. Gracefully fell back to Demo Mode.",
        data: demoResult
      });
    }

    const rawText = geminiResponseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty text returned from Gemini API");
    }

    // Clean any markdown formatting if present
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // Validate waste_level fallback
    if (!['Low', 'Medium', 'High'].includes(parsedData.waste_level)) {
      parsedData.waste_level = 'Medium';
    }

    console.log(`✅ Live Gemini AI Analysis Success for food: "${parsedData.food_name}" (${parsedData.waste_level} waste)`);

    return res.json({
      success: true,
      isDemoMode: false,
      data: parsedData
    });

  } catch (error) {
    console.error("AI Analysis API Exception:", error.message);
    const demoResult = getDemoResult(req.body?.hint || '');
    return res.json({
      success: true,
      isDemoMode: true,
      demoNotice: "An exception occurred during API processing. Gracefully fell back to Demo Mode.",
      data: demoResult
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI-foodWISE Express server running on http://localhost:${PORT}`);
});
