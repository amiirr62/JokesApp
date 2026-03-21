import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data: session  } = authClient.useSession()
  if(!session){
   return <main className="page-wrap px-4 pb-8 pt-14">Welcome to Dev Jokes! Please Login   </main>
  } 
  return (
    <main className="page-wrap px-4 pb-8 pt-14"><h3>{session.user.email}</h3></main>
  )
}
