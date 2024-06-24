import { Hono } from 'hono'
// import { zValidator } from '@hono/zod-validator'
import { authRegisterJson } from '@/schemas/user'
import { zValWEH } from '@/utils/zValHandlers'

const router = new Hono()

router.post(
  '/register',
  zValWEH('json', authRegisterJson),
  (c) => {
    return c.text('Hello Hono!')
  }
)

export default router
