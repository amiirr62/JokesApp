import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db'
import { joke } from '#/db/schema'
import { desc, eq } from 'drizzle-orm'
import { authClient } from '#/lib/auth-client'

const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const jokes = await db
    .select()
    .from(joke)
    .orderBy(desc(joke.score), desc(joke.createdAt))

  return jokes
})

const voteJoke = createServerFn({ method: 'POST' }).handler(
  async ({ data }: { data: { jokeId: string; change: number } }) => {
    const foundJokes = await db
      .select()
      .from(joke)
      .where(eq(joke.id, data.jokeId))
      .limit(1)

    const foundJoke = foundJokes[0]

    if (!foundJoke) {
      throw new Error('Joke not found')
    }

    await db
      .update(joke)
      .set({
        score: foundJoke.score + data.change,
      })
      .where(eq(joke.id, data.jokeId))

    return { success: true }
  },
)

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const jokes = await getJokes()
    return jokes
  },
})

function App() {
  const jokes = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const topJokes = jokes.slice(0, 3)
  const moreJokes = jokes.slice(3)

  const handleVote = async (jokeId: string, change: number) => {
    await voteJoke({
      data: {
        jokeId,
        change,
      },
    })

    await router.invalidate()
  }

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

                <div className="rounded-[1.6rem] border border-white/70 bg-[#eb3e94] px-5 py-6">
                  <div className="mb-3 text-4xl">😆</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#6f5b20] uppercase">
                    Loop Laughter
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#ecde11] px-5 py-6">
                  <div className="mb-3 text-4xl">😹</div>
                  <p className="text-2xl font-extrabold tracking-wide text-[#6f5b20] uppercase">
                    Merge Meower
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.2rem] border border-[#e8d9c7] px-5 py-4">
                <p className="m-0 text-2xl font-semibold text-[#8a6540]">
                  Drop a joke and join the chaos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.8rem] border border-[#eadfd1] bg-white/70 p-7">
          <div className="mb-6">
            <h2 className="m-0 text-4xl font-bold text-[#2f241b]">📫 Joke Bin</h2>
            <p className="mt-3 text-lg font-bold uppercase tracking-[0.12em] text-[#8a6a45]">
              ⭐ Top 3 Jokes
            </p>
          </div>

          {isPending ? (
            <p className="m-0 text-2xl italic text-[#76829a]">Loading session...</p>
          ) : !session ? (
            <p className="m-0 text-2xl italic text-[#76829a]">
              Please log in to view jokes.
            </p>
          ) : jokes.length === 0 ? (
            <p className="m-0 text-2xl italic text-[#76829a]">No jokes found! 😥</p>
          ) : (
            <>
              <div className="space-y-4">
                {topJokes.map((oneJoke) => (
                  <article
                    key={oneJoke.id}
                    className="rounded-[1.6rem] border border-[#ead39f] bg-[#fffaf3] p-5 shadow-[0_8px_18px_rgba(80,60,30,0.04)]"
                  >
                    <div className="flex gap-4">
                      <div className="flex min-w-[54px] flex-col items-center justify-center rounded-[1rem] border border-[#eadfd1] bg-white px-2 py-3 text-lg font-bold text-[#6d5d4d]">
                        <button
                          type="button"
                          onClick={() => handleVote(oneJoke.id, 1)}
                          className="cursor-pointer leading-none"
                        >
                          ↑
                        </button>
                        <span>{oneJoke.score}</span>
                        <button
                          type="button"
                          onClick={() => handleVote(oneJoke.id, -1)}
                          className="cursor-pointer leading-none"
                        >
                          ↓
                        </button>
                      </div>

                      <div className="flex-1">
                        <h3 className="m-0 text-3xl font-bold text-[#2f241b]">
                          {oneJoke.title}
                        </h3>

                        <p className="mt-3 text-2xl leading-9 text-[#6d5d4d]">
                          {oneJoke.content}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#f0d58a] bg-[#fff1bf] px-3 py-1 text-sm font-bold uppercase tracking-wide text-[#9f6820]">
                            ⭐ Top Joke
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {moreJokes.length > 0 && (
                <div className="mt-8">
                  <p className="mb-4 text-lg font-bold uppercase tracking-[0.12em] text-[#8a6a45]">
                    More Jokes
                  </p>

                  <div className="space-y-4">
                    {moreJokes.map((oneJoke) => (
                      <article
                        key={oneJoke.id}
                        className="rounded-[1.6rem] border border-[#eadfd1] bg-white p-5 shadow-[0_8px_18px_rgba(80,60,30,0.04)]"
                      >
                        <div className="flex gap-4">
                          <div className="flex min-w-[54px] flex-col items-center justify-center rounded-[1rem] border border-[#eadfd1] bg-white px-2 py-3 text-lg font-bold text-[#6d5d4d]">
                            <button
                              type="button"
                              onClick={() => handleVote(oneJoke.id, 1)}
                              className="cursor-pointer leading-none"
                            >
                              ↑
                            </button>
                            <span>{oneJoke.score}</span>
                            <button
                              type="button"
                              onClick={() => handleVote(oneJoke.id, -1)}
                              className="cursor-pointer leading-none"
                            >
                              ↓
                            </button>
                          </div>

                          <div className="flex-1">
                            <h3 className="m-0 text-3xl font-bold text-[#2f241b]">
                              {oneJoke.title}
                            </h3>

                            <p className="mt-3 text-2xl leading-9 text-[#6d5d4d]">
                              {oneJoke.content}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}