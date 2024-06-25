import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from '@/routers/auth'
import { handleResData } from './utils/dataHandlers'
import { handleGlobalError } from './utils/errorHandlers'

const app = new Hono()

// cors
app.use(cors())

app.route('/auth', auth)

app.notFound((c) => {
  return c.json(handleResData(1, '404 Not Found'))
})

// global error handler
app.onError(handleGlobalError)

// get backend port from env
let port = Number(process.env.E5SHARE_HONO_PORT)
// default port
if (Number.isNaN(port)) {
  port = 3007
}

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
