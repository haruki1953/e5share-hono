import { AppError } from '@/classes/errors'
import { type StatusCode } from 'hono/utils/http-status'

// handle error (on catch error, call in services function)
export const handleAppError = (error: any, message: string, statusCode?: StatusCode): void => {
  if (error instanceof AppError) {
    error.message = `${message} | ${error.message}`
    if (statusCode !== undefined) error.statusCode = statusCode
    throw error
  } else {
    throw new AppError(`${message}`, statusCode)
  }
}
