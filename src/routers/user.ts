import { AppError } from '@/classes'
import { userGetLastloginParam, userUpdateE5infoJson, userUpdateEmailJson, userUpdatePasswordJson, userUpdateProfileJson } from '@/schemas'
import { userGetProfileSercive, userUpdateProfileService, userUpdateAvatarService, userUpdateEmailSercive, userUpdatePasswordSercive, userUpdateE5infoSercive, userGetLastloginSercive } from '@/services'
import { useAdminSystem } from '@/system'
import type { UserJwtVariables } from '@/types'
import { handleResData, zValWEH, handleFileInFromData } from '@/utils'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

// make c.get('jwtPayload') have custom type
const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.store.jwtMainSecretKey }))

router.get('/profile', async (c) => {
  const { id } = c.get('jwtPayload')
  const data = await userGetProfileSercive(id)
  c.status(200)
  return c.json(handleResData(0, '个人信息获取成功', data))
})

router.patch(
  '/profile',
  zValWEH('json', userUpdateProfileJson),
  async (c) => {
    const { id } = c.get('jwtPayload')
    const {
      nickname, contactInfo, bio
    } = c.req.valid('json')

    await userUpdateProfileService(id, nickname, contactInfo, bio)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.put(
  '/avatar',
  async (c) => {
    const { id } = c.get('jwtPayload')
    const formData = await c.req.formData().catch(() => {
      throw new AppError('未上传表单')
    })

    const avatarBuffer = await handleFileInFromData(formData, 'avatar')

    await userUpdateAvatarService(id, avatarBuffer)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.put(
  '/email',
  zValWEH('json', userUpdateEmailJson),
  async (c) => {
    const { id } = c.get('jwtPayload')
    const {
      email
    } = c.req.valid('json')

    await userUpdateEmailSercive(id, email)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.put(
  '/password',
  zValWEH('json', userUpdatePasswordJson),
  async (c) => {
    const { id } = c.get('jwtPayload')
    const {
      oldPassword, newPassword
    } = c.req.valid('json')

    await userUpdatePasswordSercive(id, oldPassword, newPassword)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.put(
  '/e5info',
  zValWEH('json', userUpdateE5infoJson),
  async (c) => {
    const { id } = c.get('jwtPayload')
    const {
      subscriptionDate, expirationDate
    } = c.req.valid('json')

    await userUpdateE5infoSercive(id, subscriptionDate, expirationDate)

    c.status(200)
    return c.json(handleResData(0, '修改成功'))
  }
)

router.get(
  '/last-login/:userId',
  zValWEH('param', userGetLastloginParam),
  async (c) => {
    const {
      userId
    } = c.req.valid('param')

    const numberUserId = parseInt(userId)
    if (isNaN(numberUserId)) {
      throw new AppError('userId参数无效', 400)
    }

    const data = await userGetLastloginSercive(numberUserId)

    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

export default router
