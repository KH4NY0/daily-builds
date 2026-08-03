import Link from 'next/link'
import type { Build } from '@/lib/builds'

export function BuildRow({ build }: { build: Build }) {
  return (
    <article className="build-row">
      <div className="build-meta">DAY {String(build.day).padStart(2, '0')} / {build.category}</div>
      <div>
        <Link href={`/builds/${build.slug}`} className="build-title">{build.title}</Link>
        <p>{build.summary}</p>
      </div>
      <span className={`status ${build.status}`}>{build.status.replace('-', ' ')}</span>
    </article>
  )
}
