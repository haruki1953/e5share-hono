import { z } from 'zod'

const username = z.string().regex(/^[a-zA-Z0-9_]{1,32}$/, {
  message: '用户名格式错误'
})

const password = z.string().regex(/^[a-zA-Z0-9_]{6,32}$/, {
  message: '密码格式错误'
})

const email = z.string().email({ message: '邮箱格式错误' })

// export schema
export const authRegisterJson = z.object({
  username, password, email
})

export const authUsernameLoginJson = z.object({
  username, password
})

export const authEmailLoginJson = z.object({
  email, password
})
