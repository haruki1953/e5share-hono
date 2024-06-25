import bcrypt from 'bcryptjs'
import { AppError } from '@/classes/errors'
import { prisma } from '@/utils/db'
import { handleAppError } from '@/utils/errorHandlers'
import { confirmEmailNotExists, confirmUsernameNotExists, findUniqueUserByEmail, findUniqueUserByUsername } from './data'
import { type PromiseType } from '@prisma/client/extension'
import { jwtConfig } from '@/config'
import { sign } from 'hono/jwt'

export const authRegisterUserService = async (
  username: string, password: string, email: string
): Promise<void> => {
  try {
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
  } catch (error) {
    handleAppError(error, '用户注册失败')
  }
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
  const token = await sign(payload, jwtConfig.secretKey)
  return token
}

export const authLoginService = async (
  usernameOrEmail: string, password: string, isEmail: boolean
) => {
  let token = 'Bearer '
  try {
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
  } catch (error) {
    handleAppError(error, '登录失败')
  }
  return token
}
