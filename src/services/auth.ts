import { AppError } from '@/classes'
import { jwtConfig } from '@/config/config'
import { prisma, useAdminSystem } from '@/system'
import bcrypt from 'bcryptjs'
import { sign } from 'hono/jwt'
import { confirmUsernameNotExists, confirmEmailNotExists, findUniqueUserByUsername, findUniqueUserByEmail } from '.'
import { type PromiseType } from '@prisma/client/extension'

const adminSystem = useAdminSystem()

export const authRegisterUserService = async (
  username: string, password: string, email: string
) => {
  // confirm user could register
  adminSystem.confirmCouldRegister()

  // confirm username is not existing
  await confirmUsernameNotExists(username)

  // confirm email is not existing
  await confirmEmailNotExists(email)

  // password to hash
  const passwordHash = bcrypt.hashSync(password, 10)

  // create User,UserE5Post,UserNotification,UsersE5SharedInfo
  // prisma already have transaction in nested query
  await prisma.user.create({
    data: {
      username,
      passwordHash,
      email,
      userE5Post: {
        create: {}
      },
      userNotification: {
        create: {}
      },
      usersE5SharedInfo: {
        create: {}
      }
    }
  }).catch(() => {
    throw new AppError('用户创建失败', 500)
  })
}

// confirm password
const confirmUserPassword = (
  user: PromiseType<ReturnType<typeof findUniqueUserByUsername>>,
  password: string
) => {
  const passwordRight: boolean = bcrypt.compareSync(password, user.passwordHash)
  if (!passwordRight) {
    throw new AppError('密码错误', 400)
  }
}

// generate token
const generateToken = async (
  user: PromiseType<ReturnType<typeof findUniqueUserByUsername>>
) => {
  const payload = {
    id: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + jwtConfig.expSeconds
  }
  const token = await sign(payload, adminSystem.store.jwtMainSecretKey)
  return token
}

export const authLoginService = async (
  usernameOrEmail: string, password: string, isEmail: boolean
) => {
  let token = 'Bearer '

  // confirm user exist, and get user
  let user: PromiseType<ReturnType<typeof findUniqueUserByUsername>>
  if (isEmail) {
    user = await findUniqueUserByEmail(usernameOrEmail)
  } else {
    user = await findUniqueUserByUsername(usernameOrEmail)
  }

  // confirm password
  confirmUserPassword(user, password)

  // generate token
  token += await generateToken(user)
  return token
}
