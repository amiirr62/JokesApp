import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {db} from "#/db"
import {joke} from "#/db/schema"

const getJokes = createServerFn({method:"GET"}).handler(async() => {
  const jokes =await db.select().from(joke)
  return jokes
})

export const Route = createFileRoute('/')({ 
  component: App,
  loader: async() => {
    //TODO: Start talking to drizzle and ask for the jokes
    const jokes =await getJokes();
    return jokes
  }
 }) 

function App() {
  const jokes = Route.useLoaderData()
  
  const { data: session  } = authClient.useSession()
  if(!session){
   return <main className="page-wrap px-4 pb-8 pt-14">Welcome to Dev Jokes! Please Login   </main>
  } 
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h3>{session.user.email}</h3>
      {jokes.map(joke => (
        <p>{joke.content}</p>
      ) )}
    </main>
  )
}
