import { type StatusCode } from 'hono/utils/http-status'

// 自定义错误类
export class AppError extends Error {
  statusCode: StatusCode | undefined
  constructor (message: string, statusCode?: StatusCode) {
    super(message) // 调用父类构造函数
    this.name = 'AppError'
    this.message = message
    this.statusCode = statusCode
  }
}
