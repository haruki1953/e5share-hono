import { z } from 'zod'

export const postGetPostsParam = z.object({
  e5id: z.string()
})

export const postSendPostJson = z.object({
  e5id: z.number(),
  content: z.string()
})
