import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-10 text-[var(--text-color)]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-[var(--card-bg)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
        
        
        <div className="mb-8">
          <p className="mb-3 inline-block rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-1 text-sm font-semibold tracking-wide text-[var(--sea-ink)]">
            About This Project
          </p>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            React Final Project
          </h1>

          <p className="max-w-2xl text-base leading-7 text-[var(--sea-ink-soft)] sm:text-lg">
            This application was developed as a final project for the course{' '}
            <strong>COMP 3012 – Front-End Web Development with React.js</strong>.
            It demonstrates modern front-end development practices using React
            and a full-stack architecture.
          </p>
        </div>

        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--chip-bg)] p-6">
            <h2 className="mb-4 text-xl font-bold">Student Information</h2>

            <div className="space-y-3 text-sm sm:text-base">
              <p>
                <span className="font-semibold">Name:</span> Amir Hashemifar
              </p>
              <p>
                <span className="font-semibold">Student ID:</span> A01222601
              </p>
              <p>
                <span className="font-semibold">Course:</span> COMP 3012 – Front-End Web Development with React.js
              </p>
              <p>
                <span className="font-semibold">Tutor:</span> Armaan Dhanji
              </p>
            </div>
          </div>

         
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--chip-bg)] p-6">
            <h2 className="mb-4 text-xl font-bold">Technologies Used</h2>

            <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base text-[var(--sea-ink-soft)]">
              <li><strong>React</strong> for building UI components</li>
              <li><strong>TanStack Router</strong> for routing and navigation</li>
              <li><strong>TanStack Start</strong> for full-stack integration</li>
              <li><strong>TypeScript</strong> for type-safe development</li>
              <li><strong>Tailwind CSS</strong> for styling</li>
              <li><strong>Neon (PostgreSQL)</strong> for cloud database</li>
              <li><strong>Drizzle ORM</strong> for database queries</li>
            </ul>
          </div>
        </div>

        

       
        <div className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--chip-bg)] p-6">
          <h2 className="mb-4 text-xl font-bold">GitHub</h2>

          <p className="mb-4 text-sm text-[var(--sea-ink-soft)]">
            You can view my GitHub profile and projects here:
          </p>

          <a
            href="https://github.com/amiirr62"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-[var(--chip-line)] bg-[var(--header-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:scale-[1.05] hover:underline"
          >
            Visit My GitHub
          </a>
        </div>

        
        <div className="mt-8 border-t border-[var(--line)] pt-6 text-sm text-[var(--sea-ink-soft)]">
          <p>
            Designed and developed by <strong>Amir Hashemifar</strong> as part of the COMP 3012 final project.
          </p>
        </div>
      </section>
    </main>
  )
}