'use client'

import { useEffect, useMemo, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import './planner.css'

type Mode = 'household' | 'work-study' | 'community' | 'small-business'
type Routine = { mode: Mode; start: string; duration: string; recurrence: string; label: string }

const modeContent: Record<Mode, { label: string; title: string; description: string; tasks: string[] }> = {
  household: {
    label: 'Home & household', title: 'Keep the household ready', description: 'Coordinate essentials before the lights go out.',
    tasks: ['Charge phones and power banks', 'Fill water and prepare lighting', 'Save important work and close devices safely', 'Share the household reminder'],
  },
  'work-study': {
    label: 'Work & study', title: 'Protect focus and deadlines', description: 'Plan your work, connectivity and device power before an interruption.',
    tasks: ['Save work and sync important files', 'Charge laptop, hotspot and backup power', 'Download study materials or meeting notes', 'Tell your team or lecturer what to expect'],
  },
  community: {
    label: 'Community', title: 'Help people plan together', description: 'Make the outage window clear for a building, residence or neighbourhood.',
    tasks: ['Confirm the window with a trusted provider notice', 'Share the time in your building or community group', 'Flag lifts, gates or shared-access impacts', 'Check in on neighbours who may need extra support'],
  },
  'small-business': {
    label: 'Small business', title: 'Keep customers informed', description: 'Prepare staff, payments and customer expectations ahead of time.',
    tasks: ['Charge card machines, routers and backup devices', 'Save point-of-sale data and open orders', 'Alert staff to the outage window', 'Post a concise customer update if service will change'],
  },
}

function formatCountdown(milliseconds: number) {
  if (milliseconds <= 0) return 'The planned outage has started.'
  const minutes = Math.floor(milliseconds / 60000)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m to prepare`
}

function formatDate(start: string | Date) {
  return new Date(start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function nextOccurrence(start: string, recurrence: string, now: number) {
  const next = new Date(start)
  if (recurrence === 'once') return next
  const intervalDays = recurrence === 'daily' ? 1 : 7
  while (next.getTime() <= now) next.setDate(next.getDate() + intervalDays)
  return next
}

export default function PlannerPage() {
  const [mode, setMode] = useState<Mode>('household')
  const [start, setStart] = useState('')
  const [duration, setDuration] = useState('2')
  const [recurrence, setRecurrence] = useState('once')
  const [label, setLabel] = useState('My power plan')
  const [checked, setChecked] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [reminderStatus, setReminderStatus] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    const stored = window.localStorage.getItem('daily-builds-routine')
    if (stored) {
      try {
        const routine = JSON.parse(stored) as Routine
        setMode(routine.mode); setStart(routine.start); setDuration(routine.duration); setRecurrence(routine.recurrence); setLabel(routine.label); setSaved(true)
      } catch { /* Ignore malformed local data. */ }
    }
    return () => window.clearInterval(timer)
  }, [])

  const details = modeContent[mode]
  const upcomingStart = useMemo(() => start ? nextOccurrence(start, recurrence, now) : null, [start, recurrence, now])
  const countdown = upcomingStart ? upcomingStart.getTime() - now : null
  const end = upcomingStart ? new Date(upcomingStart.getTime() + Number(duration) * 60 * 60 * 1000) : null
  const reminder = upcomingStart ? `${label}: power interruption planned for ${formatDate(upcomingStart)}${recurrence !== 'once' ? ` (${recurrence})` : ''}, for about ${duration} hours. ${details.tasks.slice(0, 3).join('. ')}. Please plan ahead.` : ''

  function toggleTask(task: string) {
    setChecked((items) => items.includes(task) ? items.filter((item) => item !== task) : [...items, task])
  }

  async function copyReminder() {
    if (!reminder) return
    await navigator.clipboard.writeText(reminder)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  function saveRoutine() {
    const routine: Routine = { mode, start, duration, recurrence, label }
    window.localStorage.setItem('daily-builds-routine', JSON.stringify(routine))
    setSaved(true)
  }

  function downloadCalendar() {
    if (!upcomingStart || !end) return
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    const calendar = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Daily Builds//Load-Shedding Planner//EN\nBEGIN:VEVENT\nUID:${Date.now()}@daily-builds\nDTSTAMP:${stamp(new Date())}\nDTSTART:${stamp(upcomingStart)}\nDTEND:${stamp(end)}\nSUMMARY:${label}\nDESCRIPTION:${reminder.replace(/\n/g, ' ')}\nEND:VEVENT\nEND:VCALENDAR`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar' }))
    link.download = 'power-plan.ics'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function armBrowserReminder() {
    if (!upcomingStart || !('Notification' in window)) { setReminderStatus('Add an outage time first—then save it to your calendar for a dependable reminder.'); return }
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') { setReminderStatus('Browser reminders are not enabled. Use the calendar download instead.'); return }
    const delay = upcomingStart.getTime() - Date.now() - 30 * 60 * 1000
    if (delay <= 0 || delay > 24 * 60 * 60 * 1000) { setReminderStatus('For this demo, browser alerts work within the next 24 hours. Use the calendar download for later plans.'); return }
    window.setTimeout(() => new Notification('Power interruption in 30 minutes', { body: `${label}: time to run through your readiness list.` }), delay)
    setReminderStatus('Browser reminder armed for 30 minutes before the outage—keep this browser available.')
  }

  return <main><SiteHeader />
    <section className="planner-hero">
      <div><p className="eyebrow">DAY 01 / READINESS TOOL</p><h1>Make power interruptions <em>less disruptive.</em></h1><p>Set a plan once, save the routine, and turn the next outage window into practical action for home, work, community or business.</p></div>
      <div className="planner-badge"><strong>MANUAL<br />BY DESIGN</strong><span>Reliable planning starts with the times you trust.</span></div>
    </section>
    <section className="planner-v2">
      <aside className="mode-picker"><p className="eyebrow">CHOOSE A READINESS MODE</p>{(Object.keys(modeContent) as Mode[]).map((item) => <button key={item} className={mode === item ? 'active' : ''} onClick={() => { setMode(item); setChecked([]) }}><span>{String(Object.keys(modeContent).indexOf(item) + 1).padStart(2, '0')}</span>{modeContent[item].label}</button>)}</aside>
      <div className="planner-content">
        <div className="planner-intro"><p className="eyebrow">{details.label}</p><h2>{details.title}</h2><p>{details.description}</p></div>
        <div className="planner-fields">
          <label>Plan name<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="My power plan" /></label>
          <label>Outage starts<input type="datetime-local" value={start} onChange={(event) => { setStart(event.target.value); setSaved(false) }} /></label>
          <label>Expected duration (hours)<input type="number" min="0.5" step="0.5" value={duration} onChange={(event) => { setDuration(event.target.value); setSaved(false) }} /></label>
          <label>Repeat this plan<select value={recurrence} onChange={(event) => { setRecurrence(event.target.value); setSaved(false) }}><option value="once">Once only</option><option value="weekly">Every week</option><option value="daily">Every day</option></select></label>
        </div>
        <div className="planner-actions"><button className="button primary" onClick={saveRoutine}>{saved ? 'Saved on this device' : 'Save this routine'} <span>↗</span></button>{start && <><button className="quiet-button" onClick={downloadCalendar}>Add to calendar</button><button className="quiet-button" onClick={armBrowserReminder}>Set 30-min reminder</button></>}</div>
        {reminderStatus && <p className="reminder-status">{reminderStatus}</p>}
        {countdown !== null ? <div className="readiness-dashboard"><div className="countdown-card"><span>UP NEXT</span><strong>{formatCountdown(countdown)}</strong><p>{formatDate(upcomingStart!)} · approximately {duration} hours</p></div><div className="checklist-card"><div><span>READINESS LIST</span><b>{checked.length}/{details.tasks.length} complete</b></div>{details.tasks.map((task) => <label className="task" key={task}><input type="checkbox" checked={checked.includes(task)} onChange={() => toggleTask(task)} /><i />{task}</label>)}</div></div> : <div className="empty-plan"><span>01</span><p>Add your next outage window to unlock a focused action list, reminder options and a shareable plan.</p></div>}
        {start && <div className="share-card"><div><p className="eyebrow">SHARE THE PLAN</p><h3>Send a clear update before the interruption.</h3><p>{reminder}</p></div><button className="button primary" onClick={copyReminder}>{copied ? 'Copied for WhatsApp' : 'Copy message'} <span>↗</span></button></div>}
        <p className="planner-disclaimer">For personal planning only. Confirm schedules with your electricity provider. A verified provider-data integration is a separate future release.</p>
      </div>
    </section>
  </main>
}
