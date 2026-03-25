import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db'
import { joke } from '#/db/schema'

const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const jokes = await db.select().from(joke)
  return jokes
})

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const jokes = await getJokes()
    return jokes
  },
})

function App() {
  const jokes = Route.useLoaderData()

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-[1600px]">
        <section className="rounded-[2rem] border border-[#e7d7c5] bg-[linear-gradient(90deg,#f8f3ea_0%,#f8f2e8_58%,#f4e5d7_100%)] p-8 shadow-[0_10px_30px_rgba(80,60,30,0.06)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-[#2d69da]">
                Freshly Deployed Humor
              </p>

              <h1 className="max-w-[720px] text-5xl leading-[1.05] font-medium tracking-[-0.03em] text-[#2f241b] md:text-7xl">
                Welcome to DevJokes,
                <br />
                where commits come
                <br />
                with chuckles.
              </h1>

              <p className="mt-6 max-w-[720px] text-xl leading-10 text-[#6d5d4d]">
                Browse the hottest jokes, vote the funniest one to the top, and
                keep your debugging sessions dangerously entertaining.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#e4b56d] bg-[#f7ecd7] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#9f6820]">
                  Punchline Powered
                </span>
                <span className="rounded-full border border-[#a7d7cf] bg-[#dff3ef] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.14em] text-[#2c7c73]">
                  Community Voted
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] p-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-white/70 bg-[#4cee4c] px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 text-4xl">🤣</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#6b4a22] uppercase">
                    Crash Cackler
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#0dbdbd] px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 text-4xl">😂</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#5d4b32] uppercase">
                    Pun Pilot
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#eb3e94] px-5 py-6 ">
                  <div className="mb-3 text-4xl">😆</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#6f5b20] uppercase">
                    Loop Laughter
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#ecde11] px-5 py-6 ">
                  <div className="mb-3 text-4xl">😹</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#6f5b20] uppercase">
                    Merge Meower
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.2rem] border border-[#e8d9c7]  px-5 py-4">
                <p className="m-0 text-2xl font-semibold text-[#8a6540]">
                  Drop a joke and join the chaos.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Display Jokes Here */} 
        <section className="mt-6 rounded-[1.8rem] border border-[#161616] bg-white/70 p-7 ">
          {jokes.length === 0 ? (
            <p className="m-0 text-2xl italic text-[#76829a]">No jokes found!😥</p>
          ) : (
            <div className="space-y-4">
              {jokes.map((oneJoke) => (
                <article
                  key={oneJoke.id}
                  className="rounded-[1.3rem] border border-[#eadfd1] bg-[#fffaf3] p-5"
                >
                  <p className="m-0 text-xl leading-8 text-[#2f241b]">
                    {oneJoke.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}