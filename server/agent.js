import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './profile.js'

const DEFAULT_MODEL = 'claude-opus-5-5'
const MAX_QUESTION = 400
const MAX_HISTORY = 8
const MAX_TURN = 1500

// Best-effort limits. They live in the memory of one server instance, so they
// reset whenever the platform starts a new one; the hard ceiling is the API balance.
const PER_VISITOR = { limit: 6, windowMs: 60 * 60 * 1000 }
const GLOBAL = { limit: 60, windowMs: 60 * 60 * 1000 }
const hits = new Map()

const NO_INFO = '[[NO_INFO]]'

// Keeps the questions the agent could not answer, so Lucía can see what is missing
// from its profile. Only the question text and the date are stored, never who asked.
// Uses an Upstash Redis store over REST when one is connected; otherwise it only logs.
async function rememberUnanswered(question) {
  console.log('[agent] unanswered:', question)
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return
  const entry = JSON.stringify({ question, at: new Date().toISOString() })
  try {
    await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['LPUSH', 'agent:unanswered', entry],
        ['LTRIM', 'agent:unanswered', 0, 499],
      ]),
      signal: AbortSignal.timeout(2000),
    })
  } catch (error) {
    console.error('Could not store the unanswered question:', error.message)
  }
}

function allowed(key, { limit, windowMs }) {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return []
  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === 'user' || turn.role === 'assistant') &&
        typeof turn.content === 'string' &&
        turn.content.trim(),
    )
    .slice(-MAX_HISTORY)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_TURN) }))
}

// Answers one visitor question. Returns { status, body } so the same code serves
// the Vercel function and the local dev server.
export async function ask(payload, visitor) {
  const question = typeof payload?.question === 'string' ? payload.question.trim() : ''
  if (!question || question.length > MAX_QUESTION) return { status: 400, body: { error: 'invalid_question' } }
  if (!process.env.ANTHROPIC_API_KEY) return { status: 503, body: { error: 'not_configured' } }
  if (!allowed(`visitor:${visitor}`, PER_VISITOR) || !allowed('global', GLOBAL)) {
    return { status: 429, body: { error: 'rate_limited' } }
  }

  const model = process.env.AGENT_MODEL || DEFAULT_MODEL
  const history = cleanHistory(payload.history)
  // The API needs the conversation to open with a visitor turn
  while (history.length && history[0].role !== 'user') history.shift()

  const client = new Anthropic({ timeout: 25_000, maxRetries: 1 })
  const request = {
    model,
    max_tokens: 1200,
    system: SYSTEM_PROMPT,
    messages: [...history, { role: 'user', content: question }],
  }

  try {
    let response
    if (model.startsWith('claude-haiku')) {
      response = await client.messages.create(request)
    } else {
      // Short chat answers: low effort keeps them fast and cheap. If the model's
      // safety classifiers decline, the API retries on Anthropic's default fallback.
      response = await client.beta.messages.create({
        ...request,
        output_config: { effort: 'low' },
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      })
    }

    if (response.stop_reason === 'refusal') return { status: 200, body: { error: 'declined' } }
    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
    const answer = text.replaceAll(NO_INFO, '').trim()
    if (text.includes(NO_INFO)) await rememberUnanswered(question)
    if (!answer) return { status: 502, body: { error: 'empty' } }
    return { status: 200, body: { answer } }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return { status: 429, body: { error: 'rate_limited' } }
    if (error instanceof Anthropic.AuthenticationError) return { status: 503, body: { error: 'not_configured' } }
    if (error instanceof Anthropic.APIError) {
      console.error(`Agent API error ${error.status}: ${error.message}`)
      return { status: 502, body: { error: 'unavailable' } }
    }
    console.error('Agent error:', error)
    return { status: 502, body: { error: 'unavailable' } }
  }
}
