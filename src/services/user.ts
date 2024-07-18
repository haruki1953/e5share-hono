import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import Jimp from 'jimp'
import { findUniqueUserById } from './data'
import { AppError } from '@/classes'
import { avatarConfig } from '@/config/config'
import { prisma } from '@/system'
import { confirmSaveFolderExists } from '@/utils'

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

const processAvatar = async (
  avatarBuffer: ArrayBuffer
) => {
  // info for save
  // create uuid to serve as filename
  const filename = uuidv4()
  const saveFileName = `${filename}.jpg`
  const saveFilePath = path.join(avatarConfig.savePath, saveFileName)

  confirmSaveFolderExists(avatarConfig.savePath)

  try {
    const inputImage = await Jimp.read(Buffer.from(avatarBuffer))

    // resize and cover
    inputImage.cover(avatarConfig.size, avatarConfig.size)

    // save as jpg, and set quality
    await inputImage.quality(avatarConfig.quality).writeAsync(saveFilePath)
  } catch (err) {
    // if error, try del saveFilePath
    fs.unlink(saveFilePath).catch(() => {})
    throw new AppError('图片处理失败')
  }

  return saveFileName
}

export const userUpdateAvatarService = async (
  id: number, avatarBuffer: ArrayBuffer
) => {
  // process avatar (will save avatarfile)
  const avatar = await processAvatar(avatarBuffer)

  // delete old avatar
  const user = await findUniqueUserById(id)
  if (user.avatar != null) {
    fs.unlink(path.join(avatarConfig.savePath, user.avatar)).catch(() => {})
  }

  // database update avatar
  await prisma.user.update({
    where: { id },
    data: { avatar }
  }).catch(() => {
    throw new AppError('图片处理失败')
  })
}
