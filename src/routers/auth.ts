import { Hono } from 'hono'
import { authEmailLoginJson, authRegisterJson, authUsernameLoginJson } from '@/schemas'
import { authLoginService, authRegisterUserService } from '@/services'
import { handleResData, zValWEH } from '@/utils'

import { useAdminSystem } from '@/system'
const adminSystem = useAdminSystem()

const router = new Hono()

// test
router.get('/test', (c) => {
  adminSystem.updateInfo(!adminSystem.store.couldRegister)

  c.status(201)
  return c.json(handleResData(0, `couldRegister: ${adminSystem.store.couldRegister}`))
})

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
