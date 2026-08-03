import Link from 'next/link'
import { BuildRow } from '@/components/BuildRow'
import { SiteHeader } from '@/components/SiteHeader'
import { builds, currentBuild } from '@/lib/builds'

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="pulse" /> DAY {String(currentBuild.day).padStart(2, '0')} IS LIVE</div>
          <h1>Small builds.<br /><em>Real impact.</em></h1>
          <p className="hero-lede">I build useful tools, automations, and public-good experiments for everyday life—one release at a time.</p>
          <div className="actions hero-actions">
            <Link className="button primary" href={currentBuild.liveUrl ?? '#'}>Try today’s build <span>↗</span></Link>
            <Link className="text-link dark-link" href="/builds">Explore the archive <span>→</span></Link>
          </div>
          <div className="hero-stat"><strong>01</strong><span>live build<br />and counting</span></div>
        </div>
        <div className="hero-visual" aria-label="Creative software engineer working with a laptop and phone">
          <div className="bubble bubble-one">Built in<br />South Africa</div>
          <div className="bubble bubble-two">Next.js<br />+ ideas</div>
          <div className="visual-window"><span /><span /><span /></div>
          <img src="/images/daily-builds-hero.jpg" alt="A creative software engineer with a laptop and smartphone" />
        </div>
      </section>
      <section className="featured-build">
        <div className="featured-label"><span className="section-dot" /> TODAY’S BUILD</div>
        <div className="featured-grid">
          <div><p className="eyebrow">DAY {String(currentBuild.day).padStart(2, '0')} / {currentBuild.status}</p><h2>{currentBuild.title}</h2><p>{currentBuild.summary}</p></div>
          <div className="mini-planner"><span className="mini-label">PLAN WITH LESS STRESS</span><strong>02:18:46</strong><span>until the next window</span><div className="mini-progress"><i /></div></div>
          <Link className="circle-link" href={currentBuild.liveUrl ?? '#'} aria-label="Try the Load-Shedding Planner">↗</Link>
        </div>
      </section>
      <section className="archive-preview">
        <div className="section-heading"><div><p className="eyebrow">THE BUILD SHELF</p><h2>Things I’ve made<br /><em>for people.</em></h2></div><Link href="/builds">See every build <span>→</span></Link></div>
        {builds.slice(0, 3).map((build) => <BuildRow key={build.slug} build={build} />)}
      </section>
      <section className="problem-callout">
        <div><p className="eyebrow">MAKE THE NEXT ONE BETTER</p><h2>What should be<br /><em>easier?</em></h2></div>
        <div className="callout-side"><p>Tell me about a frustrating, confusing, or time-consuming part of everyday life. It could become tomorrow’s build.</p><Link className="button lime" href="/submit">Submit a problem <span>↗</span></Link></div>
      </section>
    </main>
  )
}
