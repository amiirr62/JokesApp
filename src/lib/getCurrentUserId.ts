import { auth } from '#/lib/auth'

export async function getCurrentUserId(request: Request) {
  const sessionData = await auth.api.getSession({
    headers: request.headers,
  })

  return sessionData?.user?.id ?? null
}