import path from 'path'

export const adminContact = 'X/Twitter: @harukiO_0'

export const jwtConfig = {
  expSeconds: 120 * 24 * 60 * 60 // Token expires in 120 days
}

export const avatarConfig = {
  savePath: path.join(__dirname, '../../uploads/avatar/'), // 处理后的保存路径
  size: 256, // 图片大小
  quality: 64, // 图片质量
  cacheMaxAge: '1y' // 浏览器缓存时间 y年 m月 d天
}
