import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, language } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured in environment, query Gemini
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are AsuoSafi AI, an environmental health and Ghanaian civic rights legal assistant. The user is asking about water quality, illegal artisanal mining (galamsey), or civic rights in Ghana/Africa.
                      Respond clearly, citing relevant statutory laws (e.g. Ghana Water Resources Commission Act 522, Minerals and Mining Amendment Act 995) or WHO water safety guidelines. If language is specified as Twi, Ewe, or Hausa, provide a brief summary in that language.
                      User question: "${question}"`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            return NextResponse.json({ answer, source: 'gemini-1.5-flash' });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to expert knowledge base', geminiErr);
      }
    }

    // High-Accuracy Rule-Based Environmental & Legal Knowledge Engine Fallback
    const qLower = question.toLowerCase();
    let answer = "";

    if (qLower.includes('boil') || qLower.includes('boiling') || qLower.includes('cook')) {
      answer = `⚠️ **CRITICAL WATER SAFETY WARNING: Boiling DOES NOT Remove Mining Toxins!**\n\nBoiling water only kills biological bacteria (like E. coli or cholera). Boiling water contaminated with *galamsey* mining chemicals **concentrates heavy metals like Mercury (Hg), Cyanide (CN), Lead, and Arsenic**, making the water even more toxic.\n\n*What you must do:* Do NOT boil or drink this water. Immediately divert to verified deep groundwater boreholes or clean piped schemes identified on the AsuoSafi map.`;
    } else if (qLower.includes('penalty') || qLower.includes('law') || qLower.includes('act 995') || qLower.includes('jail') || qLower.includes('sentence')) {
      answer = `⚖️ **Statutory Penalties under Ghanaian Law:**\n\nUnder **Section 99 of the Minerals and Mining (Amendment) Act, 2019 (Act 995)**:\n* Mining in water bodies or statutory forest reserves carries a **mandatory minimum prison sentence of 15 to 25 years**.\n* Foreign nationals engaged in illegal mining face a mandatory minimum of **20 to 25 years** imprisonment.\n* Equipment used in riverbed dredging (excavators, Changfa wash plants, generators) are subject to immediate state confiscation under Section 99(6).`;
    } else if (qLower.includes('mercury') || qLower.includes('symptom') || qLower.includes('poison') || qLower.includes('health') || qLower.includes('cyanide')) {
      answer = `🧪 **Health Hazards of Galamsey Contamination:**\n\n1. **Mercury (Methylmercury):** Accumulates in river fish and drinking water. Causes neurological damage, tremors, kidney failure, memory loss, and severe congenital disabilities in unborn children (Minamata disease).\n2. **Cyanide & Lead:** Toxic chemical reagents used in gold extraction. Causes acute gastrointestinal distress, cardiac arrest, respiratory failure, and chronic organ damage.\n3. **Suspended Turbidity (>800 NTU):** Destroys water treatment filters and acts as a carrier for pathogenic bacteria.`;
    } else if (qLower.includes('anonymous') || qLower.includes('whistleblower') || qLower.includes('retaliat') || qLower.includes('protect')) {
      answer = `🛡️ **Whistleblower Protection & Anonymous Reporting:**\n\nUnder **Ghana's Whistleblower Act, 2006 (Act 720)**, citizens who report environmental crimes and public safety risks are protected from criminal liability and civil victimisation.\n\nWhen using AsuoSafi:\n* Toggle the **Anonymous Whistleblower Switch** in the Report Wizard.\n* All identifiable metadata (IP, phone number, name) are stripped on your device before transmission.\n* Photo submissions are validated through on-device geofencing without storing personal credentials.`;
    } else {
      answer = `💧 **AsuoSafi Environmental Guidance:**\n\nUnder **Article 41(k) of the 1992 Constitution of Ghana**, it is the solemn duty of every citizen to protect and safeguard the environment. \n\n* To verify a water source, check its live turbidity (WHO limit is <5 NTU) on the AsuoSafi map.\n* If water is cloudy or has a chemical scent, click **'Generate EPA / DCE Petition'** to produce an official statutory dossier citing Act 522 and Act 995 for immediate assembly enforcement.\n* Always access verified deep boreholes during river dredging alerts.`;
    }

    return NextResponse.json({
      answer,
      source: 'expert_environmental_knowledge_engine',
      disclaimer: 'Grounded in Ghana Water Resources Commission Act 522, Act 995, and WHO Standards.'
    });

  } catch (error) {
    console.error('AI advisory error:', error);
    return NextResponse.json(
      { error: 'Failed to process advisory query' },
      { status: 500 }
    );
  }
}
