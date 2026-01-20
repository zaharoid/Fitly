import { NuxtAuthHandler } from '#auth'
import GoogleProviderModule from 'next-auth/providers/google'
import EmailProviderModule from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '~/server/utils/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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
  debug: process.env.NODE_ENV === 'development',

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })]
      : []),
    EmailProvider({
      from: process.env.EMAIL_FROM!,
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },

      async sendVerificationRequest({ identifier, url, provider }: any) {
        const nodemailer = await import('nodemailer')

        const transport = nodemailer.createTransport({
          host: (provider.server as any).host,
          port: (provider.server as any).port,
          auth: (provider.server as any).auth,
        })

        try {
          await transport.verify()
          console.log('[auth] SMTP verify: OK')

          const info = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: 'Your magic link to sign in',
            text: `Sign in: ${url}`,
            html: `<p>Sign in: <a href="${url}">${url}</a></p>`,
          })
        } catch (err) {
          console.error('[auth] email send error:', err)
          throw err;
        }
      },
    }),
  ],

  pages: { signIn: '/signin' },

  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as { id?: string }).id = user.id
      return session
    },
  },
})
