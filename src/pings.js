// Unexpected Slack messages, one per hour (same order as HOURS; the last hour has none).
// `answer` is what Lucía would do: 'now' | 'later' | 'delegate'.
export const PINGS = {
  es: [
    {
      from: '#soporte-alumnos',
      text: 'Un alumno no puede entrar a la plataforma y tiene clase en una hora.',
      answer: 'now',
      why: 'Tiene clase en una hora: si no entra, pierde la sesión.',
    },
    {
      from: 'Teacher Assistant',
      text: '¿Me das acceso al material de la cohorte que empieza el mes que viene?',
      answer: 'later',
      why: 'Falta un mes y no bloquea a nadie: va a la lista de hoy, después de lo urgente.',
    },
    {
      from: 'Profesor',
      text: 'Estoy enfermo, mañana no voy a poder dar la clase.',
      answer: 'now',
      why: 'Mañana hay alumnos esperando: el sustituto se busca hoy.',
    },
    {
      from: 'Mentor',
      text: '¿Dónde encuentro las notas de mis alumnos?',
      answer: 'delegate',
      why: 'Lo resuelve el Program Manager de esa cohorte. Y si la pregunta se repite, la documento.',
    },
    {
      from: 'Dirección',
      text: 'Necesitamos abrir una cohorte nueva el mes que viene.',
      answer: 'later',
      why: 'Importante, pero no urgente. Además, la creación de cohortes está automatizada.',
    },
  ],
  en: [
    {
      from: '#student-support',
      text: "A student can't log in to the platform and has class in an hour.",
      answer: 'now',
      why: "Class is in an hour: if they can't get in, they miss the session.",
    },
    {
      from: 'Teacher Assistant',
      text: 'Can you give me access to the material for the cohort starting next month?',
      answer: 'later',
      why: "It's a month away and nobody is blocked: it goes on today's list, after the urgent things.",
    },
    {
      from: 'Teacher',
      text: "I'm sick, I won't be able to teach tomorrow's class.",
      answer: 'now',
      why: 'Students will be waiting tomorrow: the substitute has to be found today.',
    },
    {
      from: 'Mentor',
      text: "Where do I find my students' grades?",
      answer: 'delegate',
      why: "That cohort's Program Manager handles it. And if the question keeps coming up, I document it.",
    },
    {
      from: 'Leadership',
      text: 'We need to open a new cohort next month.',
      answer: 'later',
      why: 'Important, but not urgent. Besides, cohort creation is automated.',
    },
  ],
}

export const PING_COPY = {
  es: {
    title: 'Mensaje nuevo en Slack',
    ask: '¿Qué haces?',
    options: { now: 'Lo atiendo ya', later: 'Puede esperar', delegate: 'Lo delego' },
    match: 'Coincidimos.',
    differ: 'Yo habría elegido:',
    close: 'Seguir con el día',
    score: (hits, total) =>
      `Hoy resolviste ${total} ${total === 1 ? 'imprevisto' : 'imprevistos'} y coincidimos en ${hits}.`,
  },
  en: {
    title: 'New Slack message',
    ask: 'What do you do?',
    options: { now: 'I handle it now', later: 'It can wait', delegate: 'I delegate it' },
    match: 'Same call.',
    differ: 'I would have chosen:',
    close: 'Back to the day',
    score: (hits, total) =>
      `Today you handled ${total} ${total === 1 ? 'surprise' : 'surprises'} and we made the same call on ${hits}.`,
  },
}

export const NOW_COPY = {
  es: {
    time: (clock) => `Son las ${clock} en Valencia.`,
    doing: [
      'Lucía probablemente está contestando Slack con un jugo de naranja.',
      'Lucía probablemente está resolviendo un imprevisto.',
      'Lucía probablemente está construyendo una automatización.',
      'Lucía probablemente está formándose en IA.',
      'Lucía probablemente está en un sync con su equipo.',
      'Lucía probablemente está cerrando el día.',
    ],
    before: 'Lucía todavía no empezó su día.',
    after: 'Lucía ya cerró el día.',
    weekend: 'Es fin de semana: Lucía está desconectada.',
    jump: 'Empezar por esa hora',
    jumped: (time) => `Hecho: empezarás a las ${time}.`,
  },
  en: {
    time: (clock) => `It's ${clock} in Valencia.`,
    doing: [
      'Lucía is probably answering Slack with an orange juice.',
      'Lucía is probably sorting out a surprise.',
      'Lucía is probably building an automation.',
      'Lucía is probably learning about AI.',
      'Lucía is probably in a sync with her team.',
      'Lucía is probably wrapping up the day.',
    ],
    before: "Lucía hasn't started her day yet.",
    after: 'Lucía has already wrapped up the day.',
    weekend: "It's the weekend: Lucía is offline.",
    jump: 'Start at that hour',
    jumped: (time) => `Done: you'll start at ${time}.`,
  },
}

// Minutes after midnight at which each hour of the day starts, plus the end of the day.
const BOUNDARIES = [510, 600, 720, 870, 960, 1110, 1200]

// Where Lucía is in her day right now: { clock, state: 'weekend' | 'before' | 'after' | 'working', index }
export function valenciaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type).value
  const clock = `${get('hour')}:${get('minute')}`
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))
  const weekday = get('weekday')

  if (weekday === 'Sat' || weekday === 'Sun') return { clock, state: 'weekend', index: null }
  if (minutes < BOUNDARIES[0]) return { clock, state: 'before', index: null }
  if (minutes >= BOUNDARIES[BOUNDARIES.length - 1]) return { clock, state: 'after', index: null }
  const index = BOUNDARIES.findLastIndex((start) => minutes >= start)
  return { clock, state: 'working', index }
}
