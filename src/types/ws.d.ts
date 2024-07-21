export interface WsMessage {
  id: string
  type: string // 'update-e5post'
  time: string
  message: string
  data?: {
    fromUserId?: number
    updateE5postsId?: number
  }
}
