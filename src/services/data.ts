import { AppError } from '@/classes/errors'
import { prisma } from '@/utils/db'

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
