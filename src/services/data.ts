import { AppError } from '@/classes/errors'
import { prisma } from '@/system'
import { type PromiseType } from '@prisma/client/extension'
import bcrypt from 'bcryptjs'

export const findUniqueUserByUsername = async (
  username: string
) => {
  const user = await prisma.user.findUnique({
    where: { username }
  })
  if (user == null) {
    throw new AppError('用户名不存在', 400)
  }
  return user
}

export const findUniqueUserByEmail = async (
  email: string
) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (user == null) {
    throw new AppError('邮箱未被注册', 400)
  }
  return user
}

export const findUniqueUserById = async (
  id: number
) => {
  const user = await prisma.user.findUnique({
    where: { id }
  })
  if (user == null) {
    throw new AppError('用户id不存在', 400)
  }
  return user
}

export const confirmUsernameNotExists = async (
  username: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { username }
  })
  if (user != null) {
    throw new AppError('用户名已存在', 400)
  }
}

export const confirmEmailNotExists = async (
  email: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (user != null) {
    throw new AppError('邮箱已被注册', 400)
  }
}

// confirm password
export const confirmUserPassword = (
  user: PromiseType<ReturnType<typeof findUniqueUserByUsername>>,
  password: string
) => {
  const passwordRight: boolean = bcrypt.compareSync(password, user.passwordHash)
  if (!passwordRight) {
    throw new AppError('密码错误', 400)
  }
}
