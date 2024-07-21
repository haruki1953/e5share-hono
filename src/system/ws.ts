import { wsPort } from '@/config'
import Ws from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { type WsMessage } from '@/types'

export const useWsSystem = () => {
  const sendUpdateE5postMessage = (
    fromUserId: number, updateE5postsId: number
  ) => {
    const message: WsMessage = {
      id: uuidv4(),
      type: 'update-e5post',
      time: new Date().toISOString(),
      message: `Post with ID ${updateE5postsId} has been updated.`,
      data: {
        fromUserId,
        updateE5postsId
      }
    }
    const messageString = JSON.stringify(message)
    wss.clients.forEach((client) => {
      if (client.readyState === Ws.OPEN) {
        client.send(messageString)
      }
    })
  }

  return {
    sendUpdateE5postMessage
  }
}

const wss = new Ws.Server({ port: wsPort })
