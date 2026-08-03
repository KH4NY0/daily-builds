import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lukhanyo Radebe — Daily Builds',
  description: 'Useful technology, built beautifully and shared daily.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
