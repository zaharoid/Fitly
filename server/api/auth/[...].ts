import { NuxtAuthHandler } from '#auth'
import GoogleProviderModule from 'next-auth/providers/google'
import EmailProviderModule from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '~/server/utils/prisma'

const GoogleProvider: any =
  typeof GoogleProviderModule === 'function'
    ? GoogleProviderModule
    : (GoogleProviderModule as any).default

const EmailProvider: any =
  typeof EmailProviderModule === 'function'
    ? EmailProviderModule
    : (EmailProviderModule as any).default

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'database' },
  useSecureCookies: false,

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })]
      : []),

    ...(process.env.EMAIL_SERVER_HOST
      ? [EmailProvider({
          async sendVerificationRequest({ identifier, url }) {
            // создаём transporter ТОЛЬКО здесь
            const { createTransport } = await import('nodemailer')
            const transporter = createTransport({
              host: process.env.EMAIL_SERVER_HOST,
              port: Number(process.env.EMAIL_SERVER_PORT || 587),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
              },
              secure: false
            })
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: identifier,
              subject: 'Your Fitly magic link',
              text: url,
              html: `<a href="${url}">${url}</a>`
            })
          }
        })]
      : [])
  ],

  pages: { signIn: '/signin' },
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as { id?: string }).id = user.id
      return session
    }
  }
})
