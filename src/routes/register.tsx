import { authClient } from '#/lib/auth-client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
   const result = await authClient.signUp.email({email,name,password});
   if (result.error) return;
   
   navigate({to:"/"});

  }
  return (
  <div><form onSubmit={handleSubmit}>
      <input onChange={(e) => setName(e.target.value)} type="text" name='name' placeholder='name' />
      <input onChange={(e) => setEmail(e.target.value)} type="email" name='email' placeholder='email' />
      <input onChange={(e) => setPassword(e.target.value)} type="password" name='password' placeholder='password' />
      <button>Register</button>
    </form></div>
    )
}
