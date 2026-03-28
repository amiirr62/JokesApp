import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/db'
import { joke } from '#/db/schema'
import { desc, eq } from 'drizzle-orm'
import { authClient } from '#/lib/auth-client'
import { Link } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const jokes = await getJokes()
    return jokes
  },
})

const getJokes = createServerFn({ method: 'GET' }).handler(async () => {
  const jokes = await db.select().from(joke).orderBy(desc(joke.score))
  return jokes
})

const voteJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: { jokeId: number; change: number }) => data)
  .handler(async ({ data }: { data: { jokeId: number; change: number } }) => {
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
  })



function App() {
  const jokes = Route.useLoaderData()
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const topJokes = jokes.slice(0, 3)
  const moreJokes = jokes.slice(3)

  const handleVote = async (jokeId: number, change: number) => {
    await voteJoke({
      data: {
        jokeId,
        change,
      },
    })

    await router.invalidate()
  }

  const handleDelete = async (jokeId: number) => {
  try {
    const response = await fetch('/api/jokes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: jokeId }),
    })

    const result = await response.json()

    if (!response.ok) {
      alert(result.error || 'Failed to delete joke')
      return
    }

    await router.invalidate()
  } catch (error) {
    console.error(error)
    alert('Failed to delete joke')
  }
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
                  <p className="text-2xl font-extrabold uppercase tracking-wide text-[#6b4a22]">
                    Crash Cackler
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#0dbdbd] px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 text-4xl">😂</div>
                  <p className="text-2xl font-extrabold uppercase tracking-wide text-[#5d4b32]">
                    Pun Pilot
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#eb3e94] px-5 py-6">
                  <div className="mb-3 text-4xl">😆</div>
                  <p className="text-2xl font-extrabold uppercase tracking-wide text-[#6f5b20]">
                    Loop Laughter
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/70 bg-[#ecde11] px-5 py-6">
                  <div className="mb-3 text-4xl">😹</div>
                  <p className="text-2xl font-extrabold uppercase tracking-wide text-[#6f5b20]">
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

        <section className="mt-8 rounded-[2rem] border border-[#e7d7c5] bg-white/80 p-8 shadow-[0_10px_30px_rgba(80,60,30,0.06)] md:p-10">
          {!session ? (
            <div className="text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a6540]">
                Members Only
              </p>

              <h2 className="mt-2 text-4xl font-bold text-[#2f241b]">
                Log in or register to see the jokes
              </h2>

              <p className="mx-auto mt-4 max-w-[700px] text-xl leading-9 text-[#6d5d4d]">
                The joke leaderboard is only available to signed-in users. Please log in
                or create an account to browse, vote, and enjoy the chaos.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="rounded-full border border-[#e4b56d] bg-[#045720] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[#9f6820] no-underline"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="rounded-full border border-[#a7d7cf] bg-[#045720]  px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[#2c7c73] no-underline"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a6540]">
                  Leaderboard
                </p>
                <h2 className="mt-2 text-4xl font-bold text-[#2f241b]">
                  Top voted jokes
                </h2>
              </div>

              {jokes.length === 0 ? (
                <p className="text-xl text-[#6d5d4d]">No jokes yet.</p>
              ) : (
                <>
                  <div className="space-y-5">
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

                            <p className="mt-3 text-xl leading-9 text-[#6d5d4d]">
                              {oneJoke.content}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-[#f0d58a] bg-[#fff1bf] px-3 py-1 text-sm font-bold uppercase tracking-wide text-[#9f6820]">
                                Top Joke
                              </span>

                              {session?.user?.id === oneJoke.userId && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(oneJoke.id)}
                                  className="rounded-full border border-[#efc7cf] bg-[#fff0f2] px-3 py-1 text-sm font-bold text-[#c25a70]"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {moreJokes.length > 0 && (
                    <div className="mt-10">
                      <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a6540]">
                        More jokes
                      </p>

                      <div className="space-y-5">
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

                                <p className="mt-3 text-xl leading-9 text-[#6d5d4d]">
                                  {oneJoke.content}
                                </p>

                                {session?.user?.id === oneJoke.userId && (
                                  <div className="mt-4">
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(oneJoke.id)}
                                      className="rounded-full border border-[#efc7cf] bg-[#fff0f2] px-3 py-1 text-sm font-bold text-[#c25a70]"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}