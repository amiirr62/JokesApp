import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><form action="" method='POST'>
      
      <input type="email" name='email' placeholder='email' />
      <input type="password" name='password' placeholder='password' />
      <button>Login</button>
    </form></div>
}
