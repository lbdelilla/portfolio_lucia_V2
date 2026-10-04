import { ask } from '../server/agent.js'

// Vercel serverless function: POST /api/ask { question, history }
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  const visitor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  const result = await ask(req.body ?? {}, visitor)
  res.status(result.status).json(result.body)
}
