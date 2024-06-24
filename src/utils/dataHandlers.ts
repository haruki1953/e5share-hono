import { type ResData } from '@/types/res'

// handle response data
export const handleResData = (
  code: number, message: string, data?: any, token?: string
): ResData => {
  return {
    code,
    message,
    data,
    token
  }
}
