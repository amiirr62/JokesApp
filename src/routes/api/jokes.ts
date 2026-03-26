import { createFileRoute } from '@tanstack/react-router'
import { db } from '#/db'
import { joke, session } from '#/db/schema'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/jokes')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { title, content } = body

          if (!title?.trim() || !content?.trim()) {
            return Response.json(
              { error: 'Title and content are required' },
              { status: 400 },
            )
          }

          const cookieHeader = request.headers.get('cookie') ?? ''
          const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/)
          const token = tokenMatch?.[1]

          if (!token) {
            return Response.json(
              { error: 'You must be logged in' },
              { status: 401 },
            )
          }

          const currentSession = await db
            .select({
              userId: session.userId,
            })
            .from(session)
            .where(eq(session.token, token))
            .limit(1)

          if (!currentSession[0]) {
            return Response.json(
              { error: 'Invalid session' },
              { status: 401 },
            )
          }

          const insertedJoke = await db
            .insert(joke)
            .values({
              title: title.trim(),
              content: content.trim(),
              userId: currentSession[0].userId,
            })
            .returning()

          return Response.json(
            { message: 'Joke saved', joke: insertedJoke[0] },
            { status: 201 },
          )
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to save joke' },
            { status: 500 },
          )
        }
      },

      GET: async () => {
        try {
          const jokes = await db
            .select({
              id: joke.id,
              title: joke.title,
              content: joke.content,
              score: joke.score,
              createdAt: joke.createdAt,
              userId: joke.userId,
            })
            .from(joke)

          return Response.json(jokes)
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to load jokes' },
            { status: 500 },
          )
        }
      },
    },
  },
})