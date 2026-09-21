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

function getDemoResult(hintText = '') {
  const matched = DEMO_PRESETS.find(p => 
    hintText.toLowerCase().includes(p.food_name.toLowerCase()) || 
    hintText.toLowerCase().includes(p.food_category.toLowerCase())
  );
  if (matched) return matched;
  return DEMO_PRESETS[Math.floor(Math.random() * DEMO_PRESETS.length)];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg', hint } = req.body || {};
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      const demoResult = getDemoResult(hint || '');
      return res.status(200).json({
        success: true,
        isDemoMode: true,
        demoNotice: "Using Demo Mode (GEMINI_API_KEY not configured in Vercel environment). Add GEMINI_API_KEY to Vercel Environment Variables.",
        data: demoResult
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "Missing imageBase64 payload" });
    }

    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const promptText = `
You are an expert food waste visual auditor for institutional cafeterias and dining halls.
Analyze the uploaded image of leftover food waste.

Return ONLY a valid raw JSON object conforming strictly to this structure:
{
  "food_name": "Name of primary food identified (e.g. Rice, Dal, Roti, Salad, Pasta, Curry, Paneer, Chicken, Fries, Soup)",
  "food_category": "Category (Grain, Legumes, Dairy, Vegetables, Poultry, Snack, Fruit, Soup, Dessert, Other)",
  "confidence": 0.85 to 0.99,
  "waste_level": "Low" or "Medium" or "High",
  "estimated_quantity_range": "Rough estimate range like '50-80 g' or '100-150 g' or '200-250 g'",
  "reason": "Brief observation on why this leftover waste likely occurred",
  "recommendation": "Actionable portion-control or kitchen reduction tip"
}

CRITICAL RULES:
1. waste_level MUST be strictly 'Low', 'Medium', or 'High'. Never output exact weight claims, only range estimates.
2. Return ONLY JSON without markdown backticks.
`;

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
    let geminiResponseJson = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: promptText },
                { inline_data: { mime_type: mimeType.includes('svg') ? 'image/jpeg' : mimeType, data: cleanBase64 } }
              ]
            }],
            generationConfig: { temperature: 0.2, response_mime_type: "application/json" }
          })
        });

        if (response.ok) {
          geminiResponseJson = await response.json();
          break;
        }
      } catch (e) {
        // Fallback
      }
    }

    if (!geminiResponseJson) {
      const demoResult = getDemoResult(hint || '');
      return res.status(200).json({
        success: true,
        isDemoMode: true,
        demoNotice: "Gemini API returned an error. Gracefully fell back to Demo Mode.",
        data: demoResult
      });
    }

    const rawText = geminiResponseJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    if (!['Low', 'Medium', 'High'].includes(parsedData.waste_level)) {
      parsedData.waste_level = 'Medium';
    }

    return res.status(200).json({
      success: true,
      isDemoMode: false,
      data: parsedData
    });

  } catch (err) {
    const demoResult = getDemoResult(req.body?.hint || '');
    return res.status(200).json({
      success: true,
      isDemoMode: true,
      demoNotice: "An exception occurred during API processing. Gracefully fell back to Demo Mode.",
      data: demoResult
    });
  }
}
