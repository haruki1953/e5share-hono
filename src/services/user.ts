import { AppError } from '@/classes/errors'
import { prisma } from '@/utils/db'

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
