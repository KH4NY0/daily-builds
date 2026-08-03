'use client'

import { useMemo, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import './job-decoder.css'

const skillLibrary = ['javascript', 'typescript', 'python', 'react', 'next.js', 'node.js', 'sql', 'excel', 'figma', 'communication', 'leadership', 'project management', 'data analysis', 'customer service', 'salesforce', 'marketing', 'content creation', 'design', 'research', 'english']
const requirementWords = ['required', 'requirements', 'must have', 'qualification', 'experience', 'responsibilities', 'skills', 'competencies', 'you will', 'what you bring']

function cleanLine(line: string) {
  return line.replace(/^[\s•*\-–—\d.)]+/, '').replace(/\s+/g, ' ').trim()
}

export default function JobDecoderPage() {
  const [jobPost, setJobPost] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const analysis = useMemo(() => {
    const lines = jobPost.split('\n').map(cleanLine).filter(Boolean)
    const lowered = jobPost.toLowerCase()
    const skills = skillLibrary.filter((skill) => lowered.includes(skill))
    const requirementLines = lines.filter((line) => requirementWords.some((word) => line.toLowerCase().includes(word)) || /^(at least|minimum|degree|diploma|[0-9]+\+? years)/i.test(line)).slice(0, 7)
    const bulletLines = lines.filter((line) => /^(manage|build|create|support|work|develop|lead|deliver|analyse|analyze|coordinate|communicate)/i.test(line)).slice(0, 6)
    const title = lines.find((line) => /\b(manager|designer|engineer|developer|assistant|intern|specialist|coordinator|analyst|officer|consultant)\b/i.test(line)) || 'This role'
    const checklist = [
      'Tailor your CV headline and summary to this role',
      ...(skills.slice(0, 3).map((skill) => `Show evidence of ${skill} in your CV or portfolio`)),
      'Prepare one short example for the strongest responsibility',
      'Write a direct, role-specific application message',
    ]
    return { title, skills, requirementLines, bulletLines, checklist }
  }, [jobPost])

  const ready = jobPost.trim().length > 80
  const summary = ready ? `I’m applying for ${analysis.title}. Key skills: ${analysis.skills.join(', ') || 'review the role requirements'}. My next steps: ${analysis.checklist.join('; ')}.` : ''

  function toggle(item: string) { setChecked((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]) }
  async function copySummary() { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 2500) }

  return <main><SiteHeader />
    <section className="decoder-hero"><div><p className="eyebrow">DAY 02 / JOB UTILITY</p><h1>Read the job.<br /><em>See the path.</em></h1><p>Paste a job advert and turn the important parts into a focused, practical application plan.</p></div><div className="decoder-stamp">JOB POST<br />DECODER<br /><span>FOR CLEARER APPLICATIONS</span></div></section>
    <section className="decoder-shell"><div className="decoder-input"><div className="decoder-heading"><div><p className="eyebrow">01 / PASTE THE ROLE</p><h2>What does the job actually ask for?</h2></div><span>{jobPost.length} characters</span></div><textarea value={jobPost} onChange={(event) => { setJobPost(event.target.value); setChecked([]) }} placeholder="Paste the full job post here. This version analyses text directly in your browser—do not paste sensitive information." /><p className="decoder-note">No account. No upload. Start with the job description you already have.</p></div>
      <div className={ready ? 'decoder-results ready' : 'decoder-results'}><div className="decoder-heading"><div><p className="eyebrow">02 / YOUR APPLICATION PLAN</p><h2>{ready ? analysis.title : 'Your clearer next step starts here.'}</h2></div>{ready && <button onClick={copySummary}>{copied ? 'Copied' : 'Copy plan ↗'}</button>}</div>{ready ? <div className="results-grid"><section><span className="result-label">SKILLS TO SHOW</span><div className="skill-cloud">{analysis.skills.length ? analysis.skills.map((skill) => <i key={skill}>{skill}</i>) : <p>Review the advert and add the most repeated skills to your CV.</p>}</div></section><section><span className="result-label">WHAT TO PROVE</span><ul>{(analysis.requirementLines.length ? analysis.requirementLines : analysis.bulletLines).map((item) => <li key={item}>{item}</li>)}</ul></section><section className="checklist"><div><span className="result-label">APPLICATION CHECKLIST</span><b>{checked.length}/{analysis.checklist.length}</b></div>{analysis.checklist.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} /><i />{item}</label>)}</section></div> : <div className="decoder-empty"><strong>02</strong><p>Paste a job post above. You’ll get the key skills, evidence to prepare, and a checklist for the application.</p></div>}<p className="decoder-disclaimer">This is a planning aid, not a guarantee of suitability or hiring success. Always confirm requirements in the original job advert.</p></div></section>
  </main>
}
