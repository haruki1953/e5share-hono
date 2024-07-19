import { AppError } from '@/classes'
import { postGetPostsParam } from '@/schemas'
import { postGetPostsService } from '@/services'
import { useAdminSystem } from '@/system'
import { type UserJwtVariables } from '@/types'
import { handleResData, strToNumber, zValWEH } from '@/utils'
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

// make c.get('jwtPayload') have custom type
const router = new Hono<{ Variables: UserJwtVariables }>()

const adminSystem = useAdminSystem()
router.use(jwt({ secret: adminSystem.store.jwtMainSecretKey }))

router.get(
  '/posts/:e5id',
  zValWEH('param', postGetPostsParam),
  async (c) => {
    // const { id } = c.get('jwtPayload')
    const { e5id } = c.req.valid('param')

    const numberE5id = await strToNumber(e5id).catch(() => {
      throw new AppError('参数错误 | id无效')
    })

    const data = await postGetPostsService(numberE5id)

    c.status(200)
    return c.json(handleResData(0, '获取成功', data))
  }
)

export default router
