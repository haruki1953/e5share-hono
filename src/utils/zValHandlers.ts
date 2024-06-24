import { AppError } from '@/classes/errors'
import { zValidator } from '@hono/zod-validator'

type zValPar = Parameters<typeof zValidator>

// zValidator With Error Handler
export const zValWEH = (target: zValPar[0], schema: zValPar[1]): ReturnType<typeof zValidator> => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400)
    }
  })
}
