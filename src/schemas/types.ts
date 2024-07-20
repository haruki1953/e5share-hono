import { z } from 'zod'

export const typesAdminStoreSchema = z.object({
  username: z.string(),
  password: z.string(),
  couldRegister: z.boolean(),
  jwtMainSecretKey: z.string(),
  jwtAdminSecretKey: z.string()
})

export const typesE5PostSchema = z.object({
  id: z.string(),
  userId: z.number(),
  content: z.string(),
  time: z.string()
})
