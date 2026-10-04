// One entry per hour of the day, in order. `avatar` is a file in public/avatar.
export const HOURS = [
  { time: '08:30', avatar: 'jugo', glow: true, sky: '#FFD7B5', sun: { left: '4%', top: '46%', color: '#FF9F45' } },
  { time: '10:00', avatar: 'pensando', sky: '#BDE4F7', sun: { left: '14%', top: '22%', color: '#FFB52E' } },
  { time: '12:00', avatar: 'construir', build: true, sky: '#9FD3F5', sun: { left: '32%', top: '2%', color: '#FFC93C' } },
  { time: '14:30', avatar: 'construir', sky: '#FFE39A', sun: { left: '70%', top: '24%', color: '#FFB52E' } },
  { time: '16:00', avatar: 'sync', team: true, glow: true, sky: '#F7B8A0', sun: { left: '78%', top: '66%', color: '#FF8A4C' } },
  // Night: the sun has set below the frame and the moon rises on the left
  {
    time: '18:30',
    avatar: 'despedida',
    sky: '#2B2A5C',
    night: true,
    closing: true,
    moon: { left: '8%', top: '22%' },
    sun: { left: '90%', top: '110%', color: '#FF8A4C' },
  },
  // After work: only reachable from 18:30, and about Lucía rather than her job
  {
    time: '20:30',
    avatar: 'casa',
    sky: '#1B1A40',
    night: true,
    afterHours: true,
    moon: { left: '30%', top: '3%' },
    sun: { left: '90%', top: '110%', color: '#FF8A4C' },
  },
]

export const INTRO_AVATAR = 'saludo'

export const AVATARS = [...new Set([INTRO_AVATAR, ...HOURS.map((h) => h.avatar)])]

export const SUMMARY = {
  es: {
    open: 'Ver resumen',
    close: 'Cerrar',
    title: 'Lucía Belén en 30 segundos',
    role: 'Program Manager Lead · 4Geeks Academy · Valencia, España',
    points: [
      'Coordino a los Program Managers, los cursos, los profesores y la experiencia de los alumnos en España y Latinoamérica.',
      'Equipo de hasta 5 personas; hasta 500 estudiantes activos en paralelo en múltiples programas.',
      'Automatizaciones de punta a punta: creación de cohortes, cambios de estado, seguimiento de estudiantes e incidencias.',
      'También soy desarrolladora: trabajé en el desarrollo de una plataforma interna para mentores.',
      'Antes: Head of Communication & Marketing en Casa de Galicia, con un equipo de más de 20 personas.',
      'Formación: Comunicación Social (UCU), Full Stack (4Geeks), preparación PMP y SMPC (EIGP). Inglés C1.',
    ],
    tools: 'n8n · Make · Zapier · GitHub Actions · Notion · Asana · Trello · agentes de IA',
  },
  en: {
    open: 'Quick summary',
    close: 'Close',
    title: 'Lucía Belén in 30 seconds',
    role: 'Program Manager Lead · 4Geeks Academy · Valencia, Spain',
    points: [
      'I coordinate the Program Managers, the courses, the teachers and the student experience in Spain and Latin America.',
      'A team of up to 5; up to 500 active students in parallel across multiple programs.',
      'End-to-end automations: cohort creation, status changes, student follow-up and incidents.',
      'I am also a developer: I worked on building an internal platform for mentors.',
      'Before: Head of Communication & Marketing at Casa de Galicia, leading a team of 20+ people.',
      'Education: Social Communication (UCU), Full Stack (4Geeks), PMP and SMPC preparation (EIGP). C1 English.',
    ],
    tools: 'n8n · Make · Zapier · GitHub Actions · Notion · Asana · Trello · AI agents',
  },
}

export const LINKEDIN = 'https://www.linkedin.com/in/luciabelen/'

// What changes for each kind of visitor: the order of the blocks inside an hour,
// whether flashbacks start open, and the closing card of the day.
export const ROUTES = {
  r: { order: ['forYou', 'choice', 'team', 'flash'], flashOpen: false, summaryFirst: true, actions: ['cv', 'mail', 'linkedin'] },
  c: { order: ['choice', 'forYou', 'team', 'flash'], flashOpen: false, summaryFirst: false, actions: ['mail', 'linkedin', 'cv'] },
  q: { order: ['flash', 'forYou', 'choice', 'team'], flashOpen: true, summaryFirst: false, actions: ['linkedin', 'mail', 'cv'] },
}

export const CLOSING = {
  es: {
    r: 'Dos minutos y ya sabes cómo trabajo. Llévate mi CV.',
    c: '¿Comparamos procesos? Escríbeme y cuéntame el tuyo.',
    q: 'Gracias por pasar el día conmigo. Sigamos en contacto.',
  },
  en: {
    r: 'Two minutes and you know how I work. Take my CV with you.',
    c: 'Shall we compare processes? Write to me and tell me about yours.',
    q: "Thanks for spending the day with me. Let's stay in touch.",
  },
}

// Formspree form id (the part after formspree.io/f/); messages arrive in Lucía's inbox.
export const FORMSPREE_ID = 'xqkogwbo'

export const CONTACT = {
  es: {
    title: 'Escríbeme',
    intro: 'Cuéntame en qué puedo ayudarte y te respondo por correo.',
    name: 'Tu nombre',
    email: 'Tu correo',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    sent: 'Mensaje enviado. Gracias: te respondo pronto.',
    error: 'No se pudo enviar. Inténtalo de nuevo o escríbeme por LinkedIn.',
    close: 'Cerrar',
  },
  en: {
    title: 'Write to me',
    intro: "Tell me how I can help and I'll reply by email.",
    name: 'Your name',
    email: 'Your email',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    sent: "Message sent. Thank you: I'll reply soon.",
    error: "It couldn't be sent. Try again or message me on LinkedIn.",
    close: 'Close',
  },
}

export const DRAG_HINT = {
  es: {
    sun: 'Arrastra el sol para cambiar de hora',
    moonNext: 'Arrastra la luna para ver qué hago después',
    moon: 'Arrastra la luna para empezar un nuevo día',
    tap: 'Toca a Lucía y te cuenta algo',
  },
  en: {
    sun: 'Drag the sun to change the hour',
    moonNext: 'Drag the moon to see what I do next',
    moon: 'Drag the moon to start a new day',
    tap: 'Tap Lucía and she tells you something',
  },
}
