import { AppError } from '@/classes'
import crypto from 'crypto'
import fs from 'fs'

// 生成随机密钥
export const generateRandomKey = () => {
  return crypto.randomBytes(32).toString('base64')
}

// 确保保存文件的文件夹存在
export const confirmSaveFolderExists = (dirPath: string) => {
  try {
    // 检查文件夹是否存在
    fs.accessSync(dirPath)
  } catch (err) {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
    } catch (error) {
      throw new AppError('保存目录错误', 500)
    }
  }
}
