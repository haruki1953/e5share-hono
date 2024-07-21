import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRouter, postRouter, publicRouter, userRouter } from './routers'
import { handleResData, handleGlobalError } from './utils'
import { httpPort } from './config'

const app = new Hono()

// cors
app.use(cors())

app.route('/auth', authRouter)
app.route('/public', publicRouter)
app.route('/user', userRouter)
app.route('/e5post', postRouter)

app.notFound((c) => {
  c.status(404)
  return c.json(handleResData(1, '404 Not Found'))
})

// global error handler
app.onError(handleGlobalError)

console.log(`Server is running on port ${httpPort}`)
serve({
  fetch: app.fetch,
  port: httpPort
})
