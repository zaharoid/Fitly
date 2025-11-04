export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email & password required' })
  }

  const origin = getRequestURL(event).origin
  const res = await $fetch.raw(`${origin}/api/auth/callback/credentials?json=true`, {
    method: 'POST',
    body: {
      email: body.email,
      password: body.password,
      callbackUrl: '/app',
    },
    headers: { cookie: getHeader(event, 'cookie') || '' },
    redirect: 'manual',
  })

  const setCookie = res.headers.get('set-cookie')
  if (setCookie) setHeader(event, 'set-cookie', setCookie)

  return res._data ?? { ok: true }
})