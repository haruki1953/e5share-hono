import { z } from 'zod'

export const typesAdminStoreSchemas = z.object({
  username: z.string(),
  password: z.string(),
  couldRegister: z.boolean(),
  jwtMainSecretKey: z.string(),
  jwtAdminSecretKey: z.string()
})
