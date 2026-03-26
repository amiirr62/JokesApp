import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/add-joke')({
  component: AddJokePage,
})

function AddJokePage() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  if (isPending) {
    return <p className="p-6">Loading...</p>
  }

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">You must sign in first</h1>
        <p className="mt-2">Please Login or Register to add a joke.</p>

        <Link to="/login" className="nav-link mt-4 inline-block pl-4">
          <button className="ml-4 rounded-2xl bg-blue-500 px-4 py-4 text-white">
            Login
          </button>
        </Link>

        <Link to="/register" className="nav-link mt-4 inline-block">
          <button className="ml-4 rounded-2xl bg-blue-500 px-4 py-4 text-white">
            Register
          </button>
        </Link>
      </main>
    )
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      const response = await fetch('/api/jokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to save joke')
        return
      }

      setTitle('')
      setContent('')

      navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Add a New Joke</h1>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
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
          disabled={isSaving}
          className="rounded border px-4 py-2"
        >
          {isSaving ? 'Saving...' : 'Save Joke'}
        </button>
      </form>
    </main>
  )
}