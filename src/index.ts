import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from '@/routers/auth'
import { AppError } from './classes/errors'
import { handleResData } from './utils/dataHandlers'
import { adminContact } from './config'

const app = new Hono()

// cors
app.use(cors())

app.route('/auth', auth)

// global error handle
app.onError((error, c) => {
  if (error instanceof AppError) {
    c.status(error.statusCode ?? 500)
    return c.json(handleResData(1, error.message))
  }
  // unknown error
  c.status(500)
  return c.json(handleResData(1, `发生未知错误，请联系管理员 ${adminContact}`))
})

app.notFound((c) => {
  return c.json(handleResData(1, '404 Not Found'))
})

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
