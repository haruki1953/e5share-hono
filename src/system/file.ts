import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { avatarConfig } from '@/config'
import { confirmSaveFolderExists } from '@/utils'
import Jimp from 'jimp'
import { AppError } from '@/classes'
import fs from 'fs/promises'

export const useFileAvatarSystem = () => {
  const processAvatar = async (
    avatarBuffer: ArrayBuffer
  ) => {
    // info for save
    // create uuid to serve as filename
    const filename = uuidv4()
    const saveFileName = `${filename}.jpg`
    const saveFilePath = path.join(avatarSavePath, saveFileName)

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

  const delAvatar = async (avatar: string) => {
    await fs.unlink(path.join(avatarSavePath, avatar)).catch(() => {})
  }

  return {
    processAvatar,
    delAvatar
  }
}

const avatarSavePath = avatarConfig.savePath

const setup = () => {
  confirmSaveFolderExists(avatarSavePath)
}
setup()
