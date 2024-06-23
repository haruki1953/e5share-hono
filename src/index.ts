import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import users from '@/routers/users'

const app = new Hono()

app.route('/users', users)

let port = Number(process.env.E5SHARE_HONO_PORT)
if (Number.isNaN(port)) {
  port = 50504
}

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
