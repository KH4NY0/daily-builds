import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">LUKHANYO RADEBE <span>/ DAILY BUILDS</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/builds">Builds</Link>
        <Link href="/about">About</Link>
        <Link href="/submit">Submit a problem</Link>
      </nav>
    </header>
  )
}
