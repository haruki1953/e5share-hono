import { AppError } from '@/classes'
import { prisma } from '@/system'
import { findUniqueUserById } from './data'
import { accountStatus } from '@/config'
import { z } from 'zod'
import { typesE5PostSchema } from '@/schemas'
import { v4 as uuidv4 } from 'uuid'
import { type E5Post } from '@/types/types'

// Api Service
export const postGetPostsService = async (
  e5id: number
) => {
  const e5Post = await findE5PostById(e5id)
  return e5Post.posts
}

export const postSendPostService = async (
  userId: number, e5id: number, content: string
) => {
  await confirmPostAccessPermission(userId, e5id)

  await addE5PostToEPDB(e5id, { userId, content })
}

// base func
async function addE5PostToEPDB (
  e5id: number, postInfo: { userId: number, content: string }
) {
  const e5postArray = await getE5PostArray(e5id)
  const newPost = {
    id: uuidv4(),
    userId: postInfo.userId,
    content: postInfo.content,
    time: new Date().toISOString()
  }
  e5postArray.push(newPost)
  await saveE5PostArray(e5id, e5postArray)
}

const getE5PostArray = async (e5id: number) => {
  const e5postRow = await prisma.userE5Post.findUnique({
    where: { userId: e5id }
  })
  if (e5postRow == null) {
    throw new AppError('e5帐号主不存在')
  }
  return parseStrE5PostArray(e5postRow.posts)
}

const saveE5PostArray = async (e5id: number, e5PostArray: E5Post[]) => {
  await prisma.userE5Post.update({
    where: { userId: e5id },
    data: {
      posts: JSON.stringify(e5PostArray)
    }
  })
}

const confirmPostAccessPermission = async (userId: number, e5id: number) => {
  const e5user = await findUniqueUserById(e5id)
  // accountStatus must is sharing
  if (e5user.accountStatus !== accountStatus.sharing) {
    throw new AppError('e5账号主未在分享', 400)
  }
  // if user not current e5user, and not helped by e5user,
  // the user cant send post
  if (userId !== e5id &&
    !parseStrNumberArray(e5user.helpingUsers).includes(userId)) {
    throw new AppError('无权访问动态', 400)
  }
}

function parseStrE5PostArray (str: string) {
  const data = parseJsonWAE(str)
  const arrayE5PostData = z.array(typesE5PostSchema).safeParse(data)
  if (!arrayE5PostData.success) {
    throw new AppError('E5Post数组解析失败')
  }
  return arrayE5PostData.data
}

const parseStrNumberArray = (str: string) => {
  const data = parseJsonWAE(str)
  const arrayData = z.array(z.number()).safeParse(data)
  if (!arrayData.success) {
    throw new AppError('数字数组解析失败')
  }
  return arrayData.data
}

// parse JSON With AppError
function parseJsonWAE (str: string) {
  let temp: any = null
  try {
    temp = JSON.parse(str)
  } catch (error) {
    throw new AppError('JSON解析失败')
  }
  return temp
}

const findE5PostById = async (e5id: number) => {
  const e5Post = await prisma.userE5Post.findUnique({
    where: { userId: e5id }
  })
  if (e5Post == null) {
    throw new AppError('e5账号主不存在')
  }
  return e5Post
}
