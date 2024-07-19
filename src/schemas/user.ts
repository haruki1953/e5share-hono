import { z } from 'zod'

const username = z.string().regex(/^[a-zA-Z0-9_]{1,32}$/, {
  message: '用户名格式错误'
})

const password = z.string().regex(/^[a-zA-Z0-9_]{6,32}$/, {
  message: '密码格式错误'
})

const email = z.string().email({ message: '邮箱格式错误' })

const nickname = z.string()
  .min(1, { message: '昵称格式错误' })
  .max(32, { message: '昵称格式错误' })
// regex(/^[\s\S]{1,32}$/, { message: '昵称格式错误' })

const contactInfo = z.string().max(500, { message: '联系信息，不超过500字' })

const bio = z.string().max(500, { message: '简介，不超过500字' })

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

export const userUpdateProfileJson = z.object({
  nickname, contactInfo, bio
})

export const userUpdateEmailJson = z.object({
  email
})

export const userUpdatePasswordJson = z.object({
  oldPassword: password,
  newPassword: password
})

export const userUpdateE5infoJson = z.object({
  subscriptionDate: z.string(),
  expirationDate: z.string()
})

export const userGetLastloginParam = z.object({
  userId: z.string()
})
