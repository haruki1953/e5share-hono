import { AppError } from '@/classes'
import { userUpdateProfileJson } from '@/schemas'
import { userGetProfileSercive, userUpdateProfileService, userUpdateAvatarService } from '@/services'
import { useAdminSystem } from '@/system'
import type { UserJwtVariables } from '@/types'
import { handleResData, zValWEH, handleFileInFromData } from '@/utils'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const adminSystem = useAdminSystem()

// make c.get('jwtPayload') have custom type
const router = new Hono<{ Variables: UserJwtVariables }>()

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

export default router
