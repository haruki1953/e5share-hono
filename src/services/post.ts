import { AppError } from '@/classes'
import { prisma } from '@/system'

const findE5PostById = async (e5id: number) => {
  const e5Post = await prisma.userE5Post.findUnique({
    where: { userId: e5id }
  })
  if (e5Post == null) {
    throw new AppError('e5账号主不存在')
  }
  return e5Post
}

export const postGetPostsService = async (
  e5id: number
) => {
  const e5Post = await findE5PostById(e5id)
  return e5Post.posts
}
