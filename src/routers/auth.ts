import { Hono } from 'hono'
// import { zValidator } from '@hono/zod-validator'
import { authEmailLoginJson, authRegisterJson, authUsernameLoginJson } from '@/schemas/user'
import { zValWEH } from '@/utils/zValHandlers'
import { handleResData } from '@/utils/dataHandlers'
import { authLoginService, authRegisterUserService } from '@/services/auth'

const router = new Hono()

router.post(
  '/register',
  zValWEH('json', authRegisterJson),
  async (c) => {
    // get parameters in valid data
    const {
      username, password, email
    } = c.req.valid('json')

    await authRegisterUserService(username, password, email)

    c.status(201)
    return c.json(handleResData(0, '注册成功'))
  }
)

router.post(
  '/login/username',
  zValWEH('json', authUsernameLoginJson),
  async (c) => {
    const {
      username, password
    } = c.req.valid('json')

    const token = await authLoginService(username, password, false)

    c.status(200)
    return c.json(handleResData(0, '登录成功', undefined, token))
  }
)

router.post(
  '/login/email',
  zValWEH('json', authEmailLoginJson),
  async (c) => {
    const {
      email, password
    } = c.req.valid('json')

    const token = await authLoginService(email, password, true)

    c.status(200)
    return c.json(handleResData(0, '登录成功', undefined, token))
  }
)

export default router
