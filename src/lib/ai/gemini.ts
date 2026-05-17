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

// Models to try in order — if one hits rate limit, fall back to next
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

async function tryGenerate(text: string, modelName: string) {
  const model = getGenAI().getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESUME_JSON_SCHEMA as any,
      temperature: 0.1,
    }
  })

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `Here is the full resume text. Extract EVERY detail:\n\n---\n${text}\n---` }
  ])
  
  return result.response.text()
}

export async function parseResumeWithGemini(text: string) {
  let lastError: any = null

  for (const modelName of MODELS) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`)
      
      const rawText = await tryGenerate(text, modelName)
      console.log(`[Gemini] ${modelName} response length:`, rawText.length)
      
      const data = JSON.parse(rawText)
      
      console.log('[Gemini] Extracted:', {
        model: modelName,
        name: data.full_name,
        education: data.education?.length || 0,
        experience: data.experience?.length || 0,
        projects: data.projects?.length || 0,
        skills: data.skills?.length || 0,
        achievements: data.achievements?.length || 0,
        hasLinks: !!data.links,
      })
      
      return portfolioDataSchema.partial().parse(data)
    } catch (error: any) {
      lastError = error
      const isRateLimit = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')
      console.warn(`[Gemini] ${modelName} failed:`, isRateLimit ? '429 Rate Limited' : error.message?.substring(0, 100))
      
      if (isRateLimit) {
        // Wait before trying next model
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      // Non-rate-limit error — still try next model
      continue
    }
  }

  console.error('[Gemini] All models failed. Last error:', lastError?.message)
  throw lastError || new Error('All Gemini models failed')
}
