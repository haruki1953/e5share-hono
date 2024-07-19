import bcrypt from 'bcryptjs'
import { confirmEmailNotExists, confirmUserPassword, findUniqueUserById } from './data'
import { AppError } from '@/classes'
import { prisma, useFileAvatarSystem } from '@/system'
import { strBeijingToDate } from '@/utils'

const avatarSystem = useFileAvatarSystem()

export const userGetProfileSercive = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userNotification: true
    }
  })
  if (user == null) {
    throw new AppError('个人信息获取失败：用户不存在', 400)
  }
  await prisma.user.update({
    where: { id },
    data: { lastLogin: new Date() }
  })

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    contact_info: user.contactInfo,
    bio: user.bio,
    registered_at: user.registeredAt,
    last_login: user.lastLogin,
    account_status: user.accountStatus,
    e5_subscription_date: user.e5SubscriptionDate,
    e5_expiration_date: user.e5ExpirationDate,
    helping_users: user.helpingUsers,
    helped_users: user.helpedUsers,
    helping_by_users: user.helpingByUsers,
    helped_by_users: user.helpedByUsers,
    notifications: user.userNotification?.notifications
  }
}

export const userUpdateProfileService = async (
  id: number, nickname: string, contactInfo: string, bio: string
) => {
  await prisma.user.update({
    where: {
      id
    },
    data: {
      nickname,
      contactInfo,
      bio
    }
  }).catch(() => {
    throw new AppError('修改失败')
  })
}

export const userUpdateAvatarService = async (
  id: number, avatarBuffer: ArrayBuffer
) => {
  // process avatar (will save avatarfile)
  const avatar = await avatarSystem.processAvatar(avatarBuffer)

  // delete old avatar
  const user = await findUniqueUserById(id)
  if (user.avatar != null) {
    avatarSystem.delAvatar(user.avatar).catch(() => {})
  }

  // database update avatar
  await prisma.user.update({
    where: { id },
    data: { avatar }
  }).catch(() => {
    throw new AppError('图片处理失败')
  })
}

export const userUpdateEmailSercive = async (
  id: number, email: string
) => {
  await confirmEmailNotExists(email)

  await prisma.user.update({
    where: { id },
    data: { email }
  })
}

export const userUpdatePasswordSercive = async (
  id: number, oldPassword: string, newPassword: string
) => {
  const user = await findUniqueUserById(id)
  confirmUserPassword(user, oldPassword)

  const passwordHash = bcrypt.hashSync(newPassword, 10)

  await prisma.user.update({
    where: { id },
    data: { passwordHash }
  })
}

export const userUpdateE5infoSercive = async (
  id: number, subscriptionDate: string, expirationDate: string
) => {
  // 不能为同一天
  if (subscriptionDate === expirationDate) {
    throw new AppError('到期日期与订阅日期不能是同一天', 400)
  }

  const on2dateError = () => {
    throw new AppError('参数错误 | 日期无效')
  }
  const subDate = await strBeijingToDate(subscriptionDate).catch(on2dateError)
  const expDate = await strBeijingToDate(expirationDate).catch(on2dateError)

  // 检查 expDate 是否早于 subDate
  if (expDate < subDate) {
    throw new AppError('到期日期不能早于订阅日期', 400)
  }

  // update
  await prisma.user.update({
    where: { id },
    data: {
      e5SubscriptionDate: subDate,
      e5ExpirationDate: expDate
    }
  })
}

export const userGetLastloginSercive = async (
  userId: number
) => {
  const user = await findUniqueUserById(userId)

  return user.lastLogin
}
