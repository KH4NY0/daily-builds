export type BuildStatus = 'live' | 'testing' | 'in-progress' | 'archived'
export type BuildCategory = 'ai' | 'automation' | 'public-good' | 'utility'

export type Build = {
  day: number
  slug: string
  title: string
  date: string
  category: BuildCategory
  status: BuildStatus
  summary: string
  problem: string
  liveUrl?: string
  feedbackPrompt: string
  changelog?: { date: string; note: string }[]
}

export const builds: Build[] = [
  {
    day: 1,
    slug: 'load-shedding-planner-lite',
    title: 'Load-Shedding Planner Lite',
    date: '2026-08-03',
    category: 'utility',
    status: 'live',
    summary: 'A calmer way to prepare once you know the outage window.',
    problem: 'Power interruptions can turn ordinary tasks into last-minute stress.',
    liveUrl: '/planner',
    feedbackPrompt: 'What would make this more useful for your household?',
    changelog: [{ date: '2026-08-03', note: 'First public version shipped.' }],
  },
]

export const currentBuild = builds[0]
