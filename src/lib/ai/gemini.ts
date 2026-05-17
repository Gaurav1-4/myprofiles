import { GoogleGenerativeAI } from '@google/generative-ai'
import { portfolioDataSchema } from '../validations/portfolio.schema'
import { SYSTEM_PROMPT, RESUME_JSON_SCHEMA } from './prompts'

let _genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }
  return _genAI
}

export async function parseResumeWithGemini(text: string) {
  // Use gemini-2.0-flash for better extraction quality (free tier available)
  const model = getGenAI().getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESUME_JSON_SCHEMA as any,
      temperature: 0.1,  // Low temperature for precise extraction, minimal creativity
    }
  })

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Here is the full resume text. Extract EVERY detail:\n\n---\n${text}\n---` }
    ])
    
    const response = await result.response
    const rawText = response.text()
    
    // Log for debugging
    console.log('[Gemini] Raw response length:', rawText.length)
    
    let data
    try {
      data = JSON.parse(rawText)
    } catch (parseError) {
      console.error('[Gemini] JSON parse failed on:', rawText.substring(0, 500))
      throw new Error('Gemini returned invalid JSON')
    }
    
    // Log extraction stats for debugging
    console.log('[Gemini] Extracted:', {
      name: data.full_name,
      education: data.education?.length || 0,
      experience: data.experience?.length || 0,
      projects: data.projects?.length || 0,
      skills: data.skills?.length || 0,
      achievements: data.achievements?.length || 0,
      hasLinks: !!data.links,
    })
    
    // Validate with partial schema (allows missing optional fields)
    return portfolioDataSchema.partial().parse(data)
  } catch (error) {
    console.error('[Gemini] Parsing Error:', error)
    throw error
  }
}
