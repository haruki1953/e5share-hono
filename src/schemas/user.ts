import { z } from 'zod'
// import { zValidator } from '@hono/zod-validator'

const username = z.string().regex(/^[a-zA-Z0-9_]{1,32}$/, {
  message: '用户名格式错误'
})

const password = z.string().regex(/^[a-zA-Z0-9_]{6,32}$/, {
  message: '密码格式错误'
})

const email = z.string().email({ message: '邮箱格式错误' })

// Validators is a array, zValidator(with error handler) in it
// on use, need destructuring(...)
// export const authRegisterValidators = [
//   zValidator()
// ]

export const authRegisterJson = z.object({
  username, password, email
})
