import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

declare global {
    var prisma: PrismaClient | undefined
}
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prismadb;
}

export async function checkAuthentication() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('You must be logged in to perform this action')
  }
  return session.user
}

export default prismadb;