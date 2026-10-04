import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CONTENT } from './content.js'
import { NOW_COPY, PING_COPY, PINGS, valenciaNow } from './pings.js'
import {
  AVATARS,
  CLOSING,
  CONTACT,
  FORMSPREE_ID,
  HOURS,
  INTRO_AVATAR,
  LINKEDIN,
  ROUTES,
  SUMMARY,
} from './scene.js'
import { CV, TESTIMONIALS } from './testimonials.js'

gsap.registerPlugin(useGSAP)

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

function Scene({ hourIndex, started, bubble }) {
  const root = useRef(null)
  const hour = HOURS[started ? hourIndex : 0]
  const avatar = started ? hour.avatar : INTRO_AVATAR

  useGSAP(
    () => {
      const duration = prefersReducedMotion() ? 0 : 0.9
      gsap.to(root.current, { backgroundColor: hour.sky, duration, ease: 'power2.out' })
      gsap.to('.sun', {
        left: hour.sun.left,
        top: hour.sun.top,
        backgroundColor: hour.sun.color,
        duration,
        ease: 'power2.inOut',
      })
      gsap.to('.moon', { top: started && hour.night ? '22%' : '110%', duration, ease: 'power2.inOut' })
      gsap.fromTo('.bubble', { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: duration / 2, ease: 'back.out(2)' })
    },
    { scope: root, dependencies: [hourIndex, started] },
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.to('.avatars', { yPercent: -1.6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  return (
    <div className="scene" ref={root} style={{ backgroundColor: HOURS[0].sky }}>
      <div className="sun" style={{ left: HOURS[0].sun.left, top: HOURS[0].sun.top, backgroundColor: HOURS[0].sun.color }} />
      <div className="moon" />
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
      <div className="clock">{hour.time}</div>
      <div className="bubble">{bubble}</div>
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

function Day({ copy, lang, persona, index, setIndex, score, onContact }) {
  const route = ROUTES[persona]
  const [picks, setPicks] = useState({})
  const [flashes, setFlashes] = useState({})
  const chapter = copy.ch[index]
  const pick = picks[index]
  const flashOpen = flashes[index] ?? route.flashOpen
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
              className={pick === k ? 'option is-picked' : 'option'}
              aria-pressed={pick === k}
              onClick={() => setPicks({ ...picks, [index]: k })}
            >
              {label}
            </button>
          ))}
        </div>
        {pick !== undefined && (
          <div className="reveal" aria-live="polite">
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
        {HOURS.map((h, k) => (
          <button
            key={h.time}
            type="button"
            className={k === index ? 'hour is-current' : k < index ? 'hour is-done' : 'hour'}
            aria-pressed={k === index}
            onClick={() => setIndex(k)}
          >
            {h.time}
          </button>
        ))}
      </div>

      <h2>{chapter.title}</h2>
      <p className="lead">{chapter.body}</p>

      {route.order.map((id) => blocks[id])}

      {isLast && (
        <div className="closing">
          <p className="closing-title">{CLOSING[lang][persona]}</p>
          {score && <p className="closing-score">{score}</p>}
          <Actions lang={lang} order={route.actions} mailLabel={copy.t.mail} onContact={onContact} />
        </div>
      )}

      <div className="steps">
        {index > 0 && (
          <button type="button" className="step" onClick={() => setIndex(index - 1)}>
            {copy.t.prev}
          </button>
        )}
        {!isLast && (
          <button type="button" className="step step-next" onClick={() => setIndex(index + 1)}>
            {copy.t.next} · {HOURS[index + 1].time}
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
          <p className="ping-result">
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

      <main className="main" ref={main}>
        <div className="scene-wrap">
          <Scene hourIndex={index} started={started} bubble={started ? copy.ch[index].bubble : copy.introBubble} />
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
