import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Serves /api/ask during `npm run dev`, with the same code Vercel runs in production.
// The API key comes from .env.local and stays on the server side.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      for (const name of ['ANTHROPIC_API_KEY', 'AGENT_MODEL']) {
        if (env[name]) process.env[name] = env[name]
      }
      server.middlewares.use('/api/ask', async (req, res) => {
        let raw = ''
        for await (const chunk of req) raw += chunk
        let result
        try {
          const { ask } = await server.ssrLoadModule('/server/agent.js')
          result = await ask(JSON.parse(raw || '{}'), req.socket.remoteAddress ?? 'local')
        } catch (error) {
          console.error(error)
          result = { status: 500, body: { error: 'unavailable' } }
        }
        res.statusCode = result.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result.body))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build also works when served from a subpath
  base: './',
  plugins: [react(), devApi()],
})
