import { BuildRow } from '@/components/BuildRow'
import { SiteHeader } from '@/components/SiteHeader'
import { builds } from '@/lib/builds'

export default function BuildsPage() {
  return <main><SiteHeader /><section className="page-intro"><p className="eyebrow">PUBLIC ARCHIVE</p><h1>Small tools. Real problems. Built daily.</h1></section><section className="build-list">{builds.map((build) => <BuildRow key={build.slug} build={build} />)}</section></main>
}
