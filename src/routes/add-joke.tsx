import { createFileRoute, Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/add-joke')({
  component: AddJokePage,
})

function AddJokePage() {
  const { data: session, isPending } = authClient.useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (isPending) {
    return <p className="p-6">Loading...</p>
  }

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">You must sign in first</h1>
        <p className="mt-2">Please sign in to add a joke.</p>
        <Link to="/login" className="nav-link mt-4 inline-block">
          Go to Login
        </Link>
      </main>
    )
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    console.log({ title, content })

    alert('Joke submitted')

    setTitle('')
    setContent('')
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Add a Joke</h1>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Joke title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border p-3"
          required
        />

        <textarea
          placeholder="Write your joke..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded border p-3"
          rows={6}
          required
        />

        <button
          type="submit"
          className="rounded border px-4 py-2"
        >
          Add Joke
        </button>
      </form>
    </main>
  )
}