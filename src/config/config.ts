import path from 'path'

// get backend port from env
let httpPort = Number(process.env.E5SHARE_HONO_PORT)
// default port
if (Number.isNaN(httpPort)) {
  httpPort = 3007
}
let wsPort = Number(process.env.E5SHARE_WS_PORT)
if (Number.isNaN(wsPort)) {
  wsPort = 3008
}
export { httpPort, wsPort }

export const adminContact = 'X/Twitter: @harukiO_0'

export const jwtConfig = {
  expSeconds: 120 * 24 * 60 * 60 // Token expires in 120 days
}

export const avatarConfig = {
  savePath: path.join(__dirname, '../../data/public/avatar/'), // 处理后的保存路径
  size: 256, // 图片大小
  quality: 64, // 图片质量
  cacheMaxAge: '1y' // 浏览器缓存时间 y年 m月 d天
}
