import Link from 'next/link'
import { BuildRow } from '@/components/BuildRow'
import { SiteHeader } from '@/components/SiteHeader'
import { builds, currentBuild } from '@/lib/builds'

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="current-build">
        <div className="eyebrow">DAY {String(currentBuild.day).padStart(2, '0')} — {currentBuild.date}</div>
        <p className="kicker">TODAY’S BUILD</p>
        <h1>{currentBuild.title}</h1>
        <p className="lede">{currentBuild.summary}</p>
        <div className="actions">
          <Link className="button" href={currentBuild.liveUrl ?? '#'}>Try the build</Link>
          <Link className="text-link" href={`/builds/${currentBuild.slug}`}>Read the build note →</Link>
        </div>
        <p className="feedback">{currentBuild.feedbackPrompt}</p>
      </section>
      <section className="archive-preview">
        <div className="section-heading"><p className="eyebrow">BUILD ARCHIVE</p><Link href="/builds">View all →</Link></div>
        {builds.slice(0, 3).map((build) => <BuildRow key={build.slug} build={build} />)}
      </section>
      <section className="problem-callout">
        <p className="eyebrow">MAKE THE NEXT ONE BETTER</p>
        <h2>What is taking too long, feeling confusing, or simply not working for people?</h2>
        <Link className="button dark" href="/submit">Submit a problem</Link>
      </section>
    </main>
  )
}
