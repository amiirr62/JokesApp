import { authClient } from '#/lib/auth-client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      alert('Login failed')
      return
    }

    navigate({ to: '/' })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="email"
          value={email}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="password"
          value={password}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}