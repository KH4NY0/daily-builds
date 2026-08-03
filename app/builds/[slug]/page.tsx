import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { builds } from '@/lib/builds'

export function generateStaticParams() { return builds.map(({ slug }) => ({ slug })) }

export default function BuildPage({ params }: { params: { slug: string } }) {
  const build = builds.find((item) => item.slug === params.slug)
  if (!build) notFound()
  return <main><SiteHeader /><article className="build-note"><p className="eyebrow">DAY {String(build.day).padStart(2, '0')} / {build.status}</p><h1>{build.title}</h1><p className="lede">{build.summary}</p><hr /><h2>The problem</h2><p>{build.problem}</p><h2>What shipped</h2><p>This is the first small, public version. Try it, then tell me where it falls short.</p>{build.liveUrl && <Link className="button" href={build.liveUrl}>Try the build</Link>}<h2>Feedback I need</h2><p>{build.feedbackPrompt}</p><h2>Changelog</h2><ul>{build.changelog?.map((item) => <li key={item.date}><strong>{item.date}</strong> — {item.note}</li>)}</ul></article></main>
}
