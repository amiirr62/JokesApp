import { createFileRoute } from '@tanstack/react-router'
import { desc, eq } from 'drizzle-orm'
import { db } from '#/db'
import { joke } from '#/db/schema'
import { getCurrentUserId } from '#/lib/getCurrentUserId'

export const Route = createFileRoute('/api/jokes')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const jokes = await db
            .select({
              id: joke.id,
              title: joke.title,
              content: joke.content,
              score: joke.score,
              userId: joke.userId,
              createdAt: joke.createdAt,
            })
            .from(joke)
            .orderBy(desc(joke.score), desc(joke.createdAt))

          return Response.json(jokes)
        } catch (error) {
          console.error('GET /api/jokes error:', error)
          return Response.json(
            { error: 'Failed to load jokes' },
            { status: 500 },
          )
        }
      },

      POST: async ({ request }) => {
        try {
          const userId = await getCurrentUserId(request)

          if (!userId) {
            return Response.json(
              { error: 'You must be logged in to create a joke' },
              { status: 401 },
            )
          }

          const body = await request.json()
          const { title, content } = body

          if (!title?.trim() || !content?.trim()) {
            return Response.json(
              { error: 'Title and content are required' },
              { status: 400 },
            )
          }

          const insertedJokes = await db
            .insert(joke)
            .values({
              title: title.trim(),
              content: content.trim(),
              score: 0,
              userId,
            })
            .returning({
              id: joke.id,
              title: joke.title,
              content: joke.content,
              score: joke.score,
              userId: joke.userId,
              createdAt: joke.createdAt,
            })

          return Response.json(insertedJokes[0], { status: 201 })
        } catch (error) {
          console.error('POST /api/jokes error:', error)
          return Response.json(
            { error: 'Failed to create joke' },
            { status: 500 },
          )
        }
      },

      DELETE: async ({ request }) => {
        try {
          const userId = await getCurrentUserId(request)

          if (!userId) {
            return Response.json(
              { error: 'You must be logged in to delete a joke' },
              { status: 401 },
            )
          }

          const body = await request.json()
          const id = Number(body.id)

          if (!id || Number.isNaN(id)) {
            return Response.json(
              { error: 'Valid joke id is required' },
              { status: 400 },
            )
          }

          const foundJokes = await db
            .select({
              id: joke.id,
              userId: joke.userId,
            })
            .from(joke)
            .where(eq(joke.id, id))
            .limit(1)

          const foundJoke = foundJokes[0]

          if (!foundJoke) {
            return Response.json(
              { error: 'Joke not found' },
              { status: 404 },
            )
          }

          if (foundJoke.userId !== userId) {
            return Response.json(
              { error: 'You are not allowed to delete this joke' },
              { status: 403 },
            )
          }

          await db.delete(joke).where(eq(joke.id, id))

          return Response.json({ success: true, deletedId: id })
        } catch (error) {
          console.error('DELETE /api/jokes error:', error)
          return Response.json(
            { error: 'Failed to delete joke' },
            { status: 500 },
          )
        }
      },
    },
  },
})