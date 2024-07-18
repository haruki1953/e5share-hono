import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRouter, publicRouter, userRouter } from './routers'
import { handleResData, handleGlobalError } from './utils'

const app = new Hono()

// cors
app.use(cors())

app.route('/auth', authRouter)
app.route('/public', publicRouter)
app.route('/user', userRouter)

app.notFound((c) => {
  c.status(404)
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
