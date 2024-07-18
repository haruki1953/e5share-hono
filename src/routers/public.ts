import { publicGetAllUserService } from '@/services'
import { handleResData } from '@/utils'
import { Hono } from 'hono'

const router = new Hono()

router.get('/users', async (c) => {
  const data = await publicGetAllUserService()
  c.status(200)
  return c.json(handleResData(0, '获取成功', data))
})

export default router
