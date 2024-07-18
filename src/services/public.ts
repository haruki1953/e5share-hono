import { AppError } from '@/classes'
import { prisma } from '@/system'

export const publicGetAllUserService = async () => {
  const allUser = await prisma.user.findMany()
    .catch(() => {
      throw new AppError('获取失败', 400)
    })
  const data = allUser.map((user) => {
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
      helped_by_users: user.helpedByUsers
    }
  })
  return data
}
