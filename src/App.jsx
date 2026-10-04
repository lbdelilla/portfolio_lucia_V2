import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CONTENT } from './content.js'
import { FLOW } from './flow.js'
import { AFTER_HOURS, GAME, TAP_FACTS } from './personal.js'
import { NOW_COPY, PING_COPY, PINGS, valenciaNow } from './pings.js'
import {
  AVATARS,
  CLOSING,
  CONTACT,
  DRAG_HINT,
  FORMSPREE_ID,
  HOURS,
  INTRO_AVATAR,
  LINKEDIN,
  ROUTES,
  SUMMARY,
} from './scene.js'
import { CV, TESTIMONIALS } from './testimonials.js'

gsap.registerPlugin(useGSAP)
// Handy when debugging animations from the browser console during development
if (import.meta.env.DEV) window.gsap = gsap

const PERSONA_COLORS = { r: '#FFD166', c: '#1F6F63', q: '#FF6F59' }

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // storage unavailable: fall through to the browser language
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Fixed star positions for the night sky: [left %, top %, size px, twinkle delay s]
const STARS = [
  [8, 44, 3, 0], [16, 12, 2, 0.6], [24, 30, 3, 1.1], [34, 20, 2, 0.3], [44, 38, 2, 1.6], [52, 26, 3, 0.9],
  [60, 34, 2, 0.2], [68, 24, 3, 1.3], [76, 40, 2, 0.7], [84, 28, 3, 1.8], [92, 46, 2, 0.4], [90, 30, 2, 1.0],
  [4, 26, 2, 1.4], [38, 50, 2, 0.5],
]

// Confetti pieces for a matching Slack answer: [x px, y px, rotation deg, colour]
const CONFETTI = [
  [-70, -60, 200, '#ffd166'], [-40, -90, -160, '#bfe8d2'], [-10, -70, 240, '#ffffff'], [30, -95, -220, '#ffd166'],
  [60, -65, 180, '#bfe8d2'], [90, -40, -140, '#ff6f59'], [-95, -30, 260, '#ffffff'], [10, -110, -200, '#ff6f59'],
  [45, -40, 150, '#ffd166'], [-55, -35, -240, '#bfe8d2'],
]

// Speech-bubble text that types itself out. The full text is always in the layout
// (invisible) so the bubble keeps its size while the letters appear.
function Typed({ text }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    if (count >= text.length) return
    const id = setTimeout(() => setCount(count + 1), 22)
    return () => clearTimeout(id)
  }, [count, text])

  return (
    <>
      <span className="bubble-ghost" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true">{text.slice(0, count)}</span>
    </>
  )
}

// How far each layer of the scene shifts with the pointer, in px at the edges
const PARALLAX = [
  ['.stars', 6],
  ['.sun', 8],
  ['.moon', 8],
  ['.hill-left', -10],
  ['.hill-right', -16],
  ['.avatars', 12],
]

// The sun's path across the sky, as percentages of the scene: one point per hour
const SUN_PATH = HOURS.filter((h) => !h.afterHours).map((h) => ({
  left: parseFloat(h.sun.left),
  top: parseFloat(h.sun.top),
}))
const SUN_WIDTH = 18

// Where the sun sits on its arc for a given horizontal position, and which hour that is
function sunAt(left) {
  const last = SUN_PATH.length - 1
  let k = SUN_PATH.findIndex((p) => left <= p.left)
  if (k === -1) k = last
  if (k === 0) return { top: SUN_PATH[0].top, index: 0 }
  const from = SUN_PATH[k - 1]
  const to = SUN_PATH[k]
  const t = Math.min(1, (left - from.left) / (to.left - from.left))
  return { top: from.top + (to.top - from.top) * t, index: t < 0.5 ? k - 1 : k }
}

function Scene({ hourIndex, started, bubble, facts, tapLabel, onHour }) {
  const root = useRef(null)
  // The fact the avatar is telling, and the hour it was told in: { hour, i }
  const [fact, setFact] = useState(null)
  const dragging = useRef(false)
  const moonStart = useRef(null)
  const layers = useRef([])
  const hour = HOURS[started ? hourIndex : 0]
  // The hour the sun should settle on when a drag ends (handlers can outlive a render)
  const settleOn = useRef(hour)

  useEffect(() => {
    settleOn.current = hour
  }, [hour])
  const avatar = started ? hour.avatar : INTRO_AVATAR
  const telling = started && fact && fact.hour === hourIndex
  const said = telling ? facts[fact.i % facts.length] : bubble

  const settleSun = (sun, target, duration) =>
    gsap.to(sun, {
      left: target.sun.left,
      top: target.sun.top,
      backgroundColor: target.sun.color,
      duration,
      ease: 'power2.inOut',
    })

  useGSAP(
    () => {
      const duration = prefersReducedMotion() ? 0 : 0.9
      gsap.to(root.current, { backgroundColor: hour.sky, duration, ease: 'power2.out' })
      // While the visitor is dragging the sun, it follows the pointer instead
      if (dragging.current) gsap.to('.sun', { backgroundColor: hour.sun.color, duration })
      else settleSun('.sun', hour, duration)
      gsap.to('.moon', {
        left: hour.moon?.left ?? '8%',
        top: started && hour.night ? hour.moon.top : '110%',
        duration,
        ease: 'power2.inOut',
      })
      gsap.fromTo('.bubble', { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: duration / 2, ease: 'back.out(2)' })
      gsap.fromTo(
        '.clock',
        { rotationX: -80, transformPerspective: 400, autoAlpha: 0 },
        { rotationX: 0, autoAlpha: 1, duration: duration / 2, ease: 'power2.out' },
      )
    },
    { scope: root, dependencies: [hourIndex, started] },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      layers.current = PARALLAX.map(([selector, reach]) => ({
        reach,
        move: gsap.quickTo(selector, 'x', { duration: 0.6, ease: 'power3.out' }),
      }))
      // Page entrance: hills rise, the sun comes up, Lucía pops in; then she keeps gently bobbing
      gsap.from('.hill', { yPercent: 120, duration: 0.9, stagger: 0.12, ease: 'power3.out' })
      gsap.fromTo(
        '.sun',
        { top: '110%' },
        { top: HOURS[0].sun.top, duration: 1.3, ease: 'power2.out', overwrite: 'auto' },
      )
      gsap
        .timeline()
        .from('.avatars', { yPercent: 25, autoAlpha: 0, duration: 0.8, delay: 0.25, ease: 'back.out(1.4)' })
        .to('.avatars', { yPercent: -1.6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  // Parallax: layers drift a little with the mouse to give the scene depth
  const tilt = (event) => {
    if (event.pointerType !== 'mouse') return
    const box = root.current.getBoundingClientRect()
    const offset = (event.clientX - box.left) / box.width - 0.5
    layers.current.forEach((layer) => layer.move(offset * 2 * layer.reach))
  }

  const level = () => layers.current.forEach((layer) => layer.move(0))

  const tellFact = () => {
    setFact({ hour: hourIndex, i: fact ? fact.i + 1 : 0 })
    if (prefersReducedMotion()) return
    gsap.fromTo(
      root.current.querySelector('.avatars'),
      { y: 0 },
      { y: -16, duration: 0.14, ease: 'power1.out', yoyo: true, repeat: 1, overwrite: 'auto' },
    )
  }

  const startSunDrag = (event) => {
    if (!started || hour.night) return
    event.preventDefault()
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    gsap.killTweensOf(event.currentTarget, 'left,top')
  }

  const dragSun = (event) => {
    if (!dragging.current) return
    // The button was released without a pointerup reaching us: finish the drag
    if (event.buttons === 0) return endSunDrag(event)
    const box = root.current.getBoundingClientRect()
    const pointer = ((event.clientX - box.left) / box.width) * 100
    const left = Math.max(0, Math.min(92, pointer - SUN_WIDTH / 2))
    const { top, index } = sunAt(left)
    gsap.set(event.currentTarget, { left: `${left}%`, top: `${top}%` })
    settleOn.current = HOURS[index]
    if (index !== hourIndex) onHour(index)
  }

  function endSunDrag(event) {
    if (!dragging.current) return
    dragging.current = false
    settleSun(event.currentTarget, settleOn.current, prefersReducedMotion() ? 0 : 0.5)
  }

  // At night there is no sun to drag: pulling the moon aside moves on to the
  // after-work hour, and from there to a new day
  const startMoonDrag = (event) => {
    if (!started || !hour.night) return
    event.preventDefault()
    moonStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const dragMoon = (event) => {
    if (moonStart.current === null) return
    if (Math.abs(event.clientX - moonStart.current) > 24) {
      moonStart.current = null
      onHour((hourIndex + 1) % HOURS.length)
    }
  }

  const endMoonDrag = () => {
    moonStart.current = null
  }

  return (
    <div
      className={['scene', started && 'is-live', started && hour.night && 'is-night', started && hour.glow && 'is-glow']
        .filter(Boolean)
        .join(' ')}
      ref={root}
      style={{ backgroundColor: HOURS[0].sky }}
      onPointerMove={tilt}
      onPointerLeave={level}
    >
      <div className="glow" />
      <div className="stars" aria-hidden="true">
        {STARS.map(([left, top, size, delay]) => (
          <span
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <div
        className="sun"
        style={{ left: HOURS[0].sun.left, top: HOURS[0].sun.top, backgroundColor: HOURS[0].sun.color }}
        onPointerDown={startSunDrag}
        onPointerMove={dragSun}
        onPointerUp={endSunDrag}
        onPointerCancel={endSunDrag}
        onLostPointerCapture={endSunDrag}
      />
      <div
        className="moon"
        onPointerDown={startMoonDrag}
        onPointerMove={dragMoon}
        onPointerUp={endMoonDrag}
        onPointerCancel={endMoonDrag}
      />
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="hill hill-left" />
      <div className="hill hill-right" />
      <div className="avatars">
        {AVATARS.map((name) => (
          <img
            key={name}
            src={`./avatar/${name}.webp`}
            alt=""
            className={name === avatar ? 'avatar is-active' : 'avatar'}
          />
        ))}
      </div>
      {started && (
        <button
          type="button"
          className="avatar-hit"
          aria-label={tapLabel}
          onClick={tellFact}
        />
      )}
      <div className="clock">{hour.time}</div>
      <div className="bubble" role="status" aria-label={said}>
        <Typed key={said} text={said} />
      </div>
    </div>
  )
}

function NowLine({ lang, now, startIndex, onJump }) {
  const c = NOW_COPY[lang]
  const working = now.state === 'working'
  return (
    <div className="now">
      <span className={working ? 'now-dot is-live' : 'now-dot'} />
      <span>
        {c.time(now.clock)} {working ? c.doing[now.index] : c[now.state]}
      </span>
      {working && now.index > 0 && (
        <button type="button" className="link" onClick={onJump} disabled={startIndex === now.index}>
          {startIndex === now.index ? c.jumped(HOURS[now.index].time) : c.jump}
        </button>
      )}
    </div>
  )
}

function Intro({ copy, lang, now, startIndex, onJump, onPick }) {
  return (
    <div className="panel">
      <NowLine lang={lang} now={now} startIndex={startIndex} onJump={onJump} />
      <h1>{copy.t.hello}</h1>
      <p className="lead">{copy.t.invite}</p>
      <p className="question">{copy.t.who}</p>
      <div className="personas">
        {copy.personas.map((p) => (
          <button key={p.id} type="button" className="persona" onClick={() => onPick(p.id)}>
            <span className="persona-dot" style={{ background: PERSONA_COLORS[p.id] }} />
            <span className="persona-text">
              <span className="persona-title">{p.title}</span>
              <span className="persona-sub">{p.text}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Testimonials({ lang }) {
  const t = TESTIMONIALS[lang]
  return (
    <section className="testimonials" aria-label={t.title}>
      <p className="question">{t.title}</p>
      {t.items.map((item) => (
        <figure key={item.name} className="testimonial">
          <span className="testimonial-initial" aria-hidden="true">
            {item.name[0]}
          </span>
          <div>
            <figcaption>
              <strong>{item.name}</strong> · {item.context}
            </figcaption>
            <blockquote>{item.quote}</blockquote>
          </div>
        </figure>
      ))}
      <p className="testimonials-source">{t.source}</p>
    </section>
  )
}

function MailAction({ label, primary, onContact }) {
  return (
    <button type="button" className={primary ? 'cta' : 'cta cta-plain'} onClick={onContact}>
      {label}
    </button>
  )
}

function Actions({ lang, order, mailLabel, onContact }) {
  const links = {
    linkedin: { href: LINKEDIN, label: 'LinkedIn', external: true },
    cv: { href: CV[lang].file, label: CV[lang].label, download: true },
  }
  return (
    <div className="contact">
      {order.map((id, k) => {
        if (id === 'mail') return <MailAction key={id} label={mailLabel} primary={k === 0} onContact={onContact} />
        const link = links[id]
        return (
          <a
            key={id}
            className={k === 0 ? 'cta' : 'cta cta-plain'}
            href={link.href}
            download={link.download}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

function Picker({ label, options, value, onChange, disabled }) {
  return (
    <div className="flow-picker" role="group" aria-label={label}>
      <span className="flow-picker-label">{label}</span>
      {options.map((option, k) => (
        <button
          key={option}
          type="button"
          className={value === k ? 'flow-pill is-current' : 'flow-pill'}
          aria-pressed={value === k}
          disabled={disabled}
          onClick={() => onChange(k)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// A runnable miniature of the cohort-creation automation
function FlowDemo({ lang }) {
  const c = FLOW[lang]
  const [program, setProgram] = useState(0)
  const [region, setRegion] = useState(0)
  // How many steps have completed; null while idle
  const [progress, setProgress] = useState(null)
  const running = progress !== null && progress < c.steps.length
  const finished = progress === c.steps.length

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => setProgress(progress + 1), prefersReducedMotion() ? 0 : 700)
    return () => clearTimeout(id)
  }, [running, progress])

  return (
    <section className="flow" aria-label={c.title}>
      <p className="question">{c.title}</p>
      <p className="flow-intro">{c.intro}</p>
      <Picker label={c.programLabel} options={c.programs} value={program} onChange={setProgram} disabled={running} />
      <Picker label={c.regionLabel} options={c.regions} value={region} onChange={setRegion} disabled={running} />
      <ol className="flow-steps">
        {c.steps.map((step, k) => {
          const state = progress === null ? 'idle' : k < progress ? 'done' : k === progress ? 'active' : 'idle'
          return (
            <li key={step.kind} className={`flow-step is-${state}`}>
              <span className="flow-dot" aria-hidden="true" />
              <span>
                <strong>{step.kind}</strong> {step.text}
              </span>
            </li>
          )
        })}
      </ol>
      {finished && (
        <p className="flow-done" role="status">
          {c.done(c.programs[program], c.regions[region])}
        </p>
      )}
      <button type="button" className="step step-next" disabled={running} onClick={() => setProgress(0)}>
        {running ? c.running : finished ? c.again : c.run}
      </button>
    </section>
  )
}

function Game({ lang }) {
  const c = AFTER_HOURS[lang]
  const statements = GAME[lang]
  const [pick, setPick] = useState(null)
  if (!statements.some((statement) => statement.lie)) return null

  return (
    <div className="choice">
      <p className="question">{c.gameTitle}</p>
      <p className="game-ask">{c.gameAsk}</p>
      <div className="options">
        {statements.map((statement, k) => (
          <button
            key={statement.text}
            type="button"
            className={pick !== k ? 'option' : statement.lie ? 'option is-picked is-right' : 'option is-picked'}
            aria-pressed={pick === k}
            onClick={() => setPick(k)}
          >
            {statement.text}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className={statements[pick].lie ? 'reveal is-right' : 'reveal'} aria-live="polite">
          <strong>{statements[pick].lie ? c.right : c.wrong}</strong>
          <span>{statements[pick].detail}</span>
        </div>
      )}
    </div>
  )
}

function Personal({ lang }) {
  const c = AFTER_HOURS[lang]
  return (
    <>
      <section className="facts" aria-label={c.factsTitle}>
        <p className="question">{c.factsTitle}</p>
        <div className="facts-grid">
          {c.facts.map((item) => (
            <div key={item.title} className="fact">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>
      <Game lang={lang} />
    </>
  )
}

function Day({ copy, lang, persona, index, setIndex, score, onContact }) {
  const route = ROUTES[persona]
  const [picks, setPicks] = useState({})
  const [flashes, setFlashes] = useState({})
  const chapter = copy.ch[index]
  const pick = picks[index]
  const flashOpen = flashes[index] ?? route.flashOpen
  const here = HOURS[index]
  const isLast = index === HOURS.length - 1

  const blocks = {
    forYou: (
      <div key="forYou" className="for-you">
        <span className="for-you-dot" />
        <span>
          <strong>{copy.forYou[persona]}</strong> {chapter.extra[persona]}
        </span>
      </div>
    ),
    choice: chapter.options && (
      <div key="choice" className="choice">
        <p className="question">{chapter.question}</p>
        <div className="options">
          {chapter.options.map((label, k) => (
            <button
              key={label}
              type="button"
              className={pick !== k ? 'option' : k === chapter.mine ? 'option is-picked is-right' : 'option is-picked'}
              aria-pressed={pick === k}
              onClick={() => setPicks({ ...picks, [index]: k })}
            >
              {label}
            </button>
          ))}
        </div>
        {pick !== undefined && (
          <div className={pick === chapter.mine ? 'reveal is-right' : 'reveal'} aria-live="polite">
            <strong>{chapter.feedback[pick]}</strong>
            <span>{chapter.reveal}</span>
          </div>
        )}
      </div>
    ),
    team: HOURS[index].team && <Testimonials key="team" lang={lang} />,
    flash: chapter.flash && (
      <div key="flash" className="flashback">
        <button
          type="button"
          className="flash-toggle"
          aria-expanded={flashOpen}
          onClick={() => setFlashes({ ...flashes, [index]: !flashOpen })}
        >
          {flashOpen ? copy.t.flashClose : copy.t.flashOpen}
        </button>
        {flashOpen && (
          <div className="flash-card">
            <strong>{chapter.flashWhen}</strong>
            <span>{chapter.flash}</span>
          </div>
        )}
      </div>
    ),
  }

  return (
    <div className="panel">
      <div className="hours" role="group" aria-label={copy.t.dayLabel}>
        {HOURS.map((h, k) =>
          // The after-work hour only shows up once the visitor gets there
          h.afterHours && k !== index ? null : (
            <button
              key={h.time}
              type="button"
              className={k === index ? 'hour is-current' : k < index ? 'hour is-done' : 'hour'}
              aria-pressed={k === index}
              onClick={() => setIndex(k)}
            >
              {h.time}
            </button>
          ),
        )}
      </div>

      <h2>{chapter.title}</h2>
      <p className="lead">{chapter.body}</p>

      {route.order.map((id) => blocks[id])}

      {here.build && <FlowDemo lang={lang} />}

      {here.afterHours && <Personal lang={lang} />}

      {here.closing && (
        <div className="closing">
          <p className="closing-title">{CLOSING[lang][persona]}</p>
          {score && <p className="closing-score">{score}</p>}
          <Actions lang={lang} order={route.actions} mailLabel={copy.t.mail} onContact={onContact} />
        </div>
      )}

      {here.afterHours && <Actions lang={lang} order={route.actions} mailLabel={copy.t.mail} onContact={onContact} />}

      <div className="steps">
        {index > 0 && (
          <button type="button" className="step" onClick={() => setIndex(index - 1)}>
            {copy.t.prev}
          </button>
        )}
        {!isLast && (
          <button type="button" className="step step-next" onClick={() => setIndex(index + 1)}>
            {HOURS[index + 1].afterHours ? AFTER_HOURS[lang].next : `${copy.t.next} · ${HOURS[index + 1].time}`}
          </button>
        )}
      </div>
    </div>
  )
}

function Ping({ lang, ping, answer, onAnswer }) {
  const c = PING_COPY[lang]
  const [shown, setShown] = useState(false)
  // Already answered on an earlier visit to this hour: don't bring it back
  const [closed, setClosed] = useState(answer !== undefined)

  useEffect(() => {
    const id = setTimeout(() => setShown(true), 1800)
    return () => clearTimeout(id)
  }, [])

  if (!shown || closed) return null

  return (
    <aside className="ping" aria-live="polite">
      <div className="ping-head">
        <span className="ping-badge" />
        <span>{c.title}</span>
      </div>
      <p className="ping-text">
        <strong>{ping.from}</strong> {ping.text}
      </p>
      {answer === undefined ? (
        <>
          <p className="ping-ask">{c.ask}</p>
          <div className="ping-options">
            {Object.entries(c.options).map(([id, label]) => (
              <button key={id} type="button" className="ping-option" onClick={() => onAnswer(id)}>
                {label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {answer === ping.answer && (
            <div className="confetti" aria-hidden="true">
              {CONFETTI.map(([x, y, turn, color]) => (
                <span key={`${x}${y}`} style={{ '--x': `${x}px`, '--y': `${y}px`, '--turn': `${turn}deg`, background: color }} />
              ))}
            </div>
          )}
          <p className={answer === ping.answer ? 'ping-result is-match' : 'ping-result'}>
            <strong>{answer === ping.answer ? c.match : `${c.differ} ${c.options[ping.answer]}.`}</strong> {ping.why}
          </p>
          <button type="button" className="step step-next" onClick={() => setClosed(true)}>
            {c.close}
          </button>
        </>
      )}
    </aside>
  )
}

function ContactForm({ lang, onClose }) {
  const c = CONTACT[lang]
  const dialog = useRef(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    dialog.current.showModal()
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    setStatus('sending')
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(response.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <dialog className="summary" ref={dialog} onClose={onClose} aria-labelledby="contact-title">
      <h2 id="contact-title">{c.title}</h2>
      {status === 'sent' ? (
        <p className="form-status" role="status">
          {c.sent}
        </p>
      ) : (
        <form className="form" onSubmit={submit}>
          <p className="form-intro">{c.intro}</p>
          <label>
            {c.name}
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label>
            {c.email}
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            {c.message}
            <textarea name="message" rows="5" required />
          </label>
          {/* Honeypot: real visitors never see or fill this field */}
          <input type="text" name="_gotcha" className="form-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {status === 'error' && (
            <p className="form-status is-error" role="alert">
              {c.error}
            </p>
          )}
          <button type="submit" className="cta" disabled={status === 'sending'}>
            {status === 'sending' ? c.sending : c.send}
          </button>
        </form>
      )}
      <button type="button" className="step" onClick={() => dialog.current.close()}>
        {c.close}
      </button>
    </dialog>
  )
}

function Summary({ lang, onClose, onContact }) {
  const s = SUMMARY[lang]
  const dialog = useRef(null)

  useEffect(() => {
    dialog.current.showModal()
    // Start at the top: showModal focuses the first link, which sits at the bottom on phones
    dialog.current.querySelector('h2').focus()
    dialog.current.scrollTop = 0
  }, [])

  return (
    <dialog className="summary" ref={dialog} onClose={onClose} aria-labelledby="summary-title">
      <h2 id="summary-title" tabIndex={-1}>{s.title}</h2>
      <p className="summary-role">{s.role}</p>
      <ul>
        {s.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="summary-tools">{s.tools}</p>
      <div className="contact">
        <MailAction label={CONTENT[lang].t.mail} primary onContact={onContact} />
        <a className="cta cta-plain" href={LINKEDIN} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="cta cta-plain" href={CV[lang].file} download>
          {CV[lang].label}
        </a>
        <button type="button" className="step" onClick={() => dialog.current.close()}>
          {s.close}
        </button>
      </div>
    </dialog>
  )
}

export default function App() {
  const [lang, setLang] = useState(initialLang)
  const [persona, setPersona] = useState(null)
  const [index, setIndex] = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [answers, setAnswers] = useState({})
  const [now] = useState(valenciaNow)
  const [startIndex, setStartIndex] = useState(0)
  const main = useRef(null)
  const copy = CONTENT[lang]
  const started = persona !== null

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // storage unavailable: the choice just won't persist
    }
  }, [lang])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.panel > *',
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
      )
    },
    { scope: main, dependencies: [index, started] },
  )

  const restart = () => {
    setPersona(null)
    setIndex(0)
    setStartIndex(0)
    setAnswers({})
  }

  const start = (id) => {
    setIndex(startIndex)
    setPersona(id)
    if (ROUTES[id].summaryFirst) setSummaryOpen(true)
  }

  const ping = PINGS[lang][index]
  const answered = Object.keys(answers)
  const hits = answered.filter((k) => answers[k] === PINGS[lang][k].answer).length
  const score = answered.length > 0 ? PING_COPY[lang].score(hits, answered.length) : null

  return (
    <div className="page">
      <nav className="nav">
        <div className="brand">Lucía Belén</div>
        <div className="nav-actions">
          <button type="button" className="link" onClick={() => setSummaryOpen(true)}>
            {SUMMARY[lang].open}
          </button>
          {started && (
            <button type="button" className="link" onClick={restart}>
              {copy.t.restart}
            </button>
          )}
          <div className="lang">
            {['es', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                className={lang === code ? 'lang-btn is-current' : 'lang-btn'}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className={started ? 'main is-day' : 'main'} ref={main}>
        <div className="scene-wrap">
          <Scene
            hourIndex={index}
            started={started}
            bubble={started ? copy.ch[index].bubble : copy.introBubble}
            facts={TAP_FACTS[lang]}
            tapLabel={DRAG_HINT[lang].tap}
            onHour={setIndex}
          />
          {started && (
            <p className="drag-hint">
              {DRAG_HINT[lang][!HOURS[index].night ? 'sun' : HOURS[index].afterHours ? 'moon' : 'moonNext']}
              {' · '}
              {DRAG_HINT[lang].tap}
            </p>
          )}
        </div>
        {started ? (
          <Day
            key={persona}
            copy={copy}
            lang={lang}
            persona={persona}
            index={index}
            setIndex={setIndex}
            score={score}
            onContact={() => setContactOpen(true)}
          />
        ) : (
          <Intro
            copy={copy}
            lang={lang}
            now={now}
            startIndex={startIndex}
            onJump={() => setStartIndex(now.index)}
            onPick={start}
          />
        )}
      </main>

      {started && ping && !summaryOpen && (
        <Ping
          key={index}
          lang={lang}
          ping={ping}
          answer={answers[index]}
          onAnswer={(id) => setAnswers({ ...answers, [index]: id })}
        />
      )}

      {summaryOpen && (
        <Summary lang={lang} onClose={() => setSummaryOpen(false)} onContact={() => setContactOpen(true)} />
      )}

      {contactOpen && <ContactForm lang={lang} onClose={() => setContactOpen(false)} />}
    </div>
  )
}
