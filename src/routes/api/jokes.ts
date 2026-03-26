import { createFileRoute } from '@tanstack/react-router'
import { db } from '#/db'
import { joke } from '#/db/schema'
import { auth } from '#/lib/auth'

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

          const currentSession = await auth.api.getSession({
            headers: request.headers,
          })

          if (!currentSession?.user?.id) {
            return Response.json(
              { error: 'You must be logged in' },
              { status: 401 },
            )
          }

          const insertedJoke = await db
            .insert(joke)
            .values({
              title: title.trim(),
              content: content.trim(),
              userId: currentSession.user.id,
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