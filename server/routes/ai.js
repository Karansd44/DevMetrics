import { Router } from 'express'
import OpenAI from 'openai'

const router = Router()
let openai

router.post('/insight', async (req, res) => {
  openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  if (!req.session?.user) return res.status(401).json({ error: 'Unauthorized' })

  const { stats } = req.body
  const prompt = `Analyze this GitHub developer: ${stats.totalRepos} repos, ${stats.totalStars} stars, top languages: ${stats.topLanguages.map((l) => l.language).join(', ')}. Write 2 short punchy sentences about their profile and give one career growth tip.`

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful technical career coach.' },
        { role: 'user', content: prompt },
      ],
    })
    res.json({ insight: result.choices[0].message.content })
  } catch (err) {
    console.error('[AI]', err?.message)
    res.json({ insight: 'AI analysis unavailable. Keep coding!' })
  }
})

export default router
