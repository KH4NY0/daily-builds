'use client'

import { useMemo, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'

function formatCountdown(milliseconds: number) {
  if (milliseconds <= 0) return 'The planned outage has started.'
  const minutes = Math.floor(milliseconds / 60000)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m to prepare`
}

export default function PlannerPage() {
  const [start, setStart] = useState('')
  const [duration, setDuration] = useState('2')
  const [copied, setCopied] = useState(false)
  const countdown = useMemo(() => start ? new Date(start).getTime() - Date.now() : null, [start])
  const reminder = start ? `Power interruption planned for ${new Date(start).toLocaleString()} (about ${duration} hours). Please charge devices, save important work, and plan lighting / food if needed.` : ''
  async function copyReminder() { await navigator.clipboard.writeText(reminder); setCopied(true) }
  return <main><SiteHeader /><section className="build-note"><p className="eyebrow">DAY 01 / UTILITY</p><h1>Plan with less stress.</h1><p className="lede">Add the next outage window you already know about. Get a simple countdown and a household-ready reminder.</p><div className="planner"><label>Outage starts<input type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} /></label><label>Expected duration (hours)<input type="number" min="0.5" step="0.5" value={duration} onChange={(event) => setDuration(event.target.value)} /></label>{countdown !== null && <><div className="countdown">{formatCountdown(countdown)}</div><div className="checklist"><h2>Before the power goes</h2><ul><li>Charge phones and power banks.</li><li>Save important work and close devices safely.</li><li>Plan water, food, lighting, and connectivity if needed.</li><li>Share the reminder with your household.</li></ul></div><button className="button" onClick={copyReminder}>{copied ? 'Copied — paste it into WhatsApp' : 'Copy WhatsApp reminder'}</button></>}<p className="fine-print">For personal planning only. Confirm schedules with your electricity provider.</p></div></section></main>
}
