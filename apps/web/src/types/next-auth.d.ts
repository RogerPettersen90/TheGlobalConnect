import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      handle: string
    } & DefaultSession['user']
    accessToken?: string
  }

  interface User {
    handle: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    handle: string
    suspended: boolean
    accessToken?: string
  }
}