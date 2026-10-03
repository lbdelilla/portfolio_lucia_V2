// One entry per hour of the day, in order. `avatar` is a file in public/avatar.
export const HOURS = [
  { time: '08:30', avatar: 'jugo', sky: '#FFD7B5', sun: { left: '4%', top: '46%', color: '#FF9F45' } },
  { time: '10:00', avatar: 'pensando', sky: '#BDE4F7', sun: { left: '14%', top: '22%', color: '#FFB52E' } },
  { time: '12:00', avatar: 'construir', sky: '#9FD3F5', sun: { left: '32%', top: '2%', color: '#FFC93C' } },
  { time: '14:30', avatar: 'construir', sky: '#FFE39A', sun: { left: '70%', top: '24%', color: '#FFB52E' } },
  { time: '16:00', avatar: 'sync', team: true, sky: '#F7B8A0', sun: { left: '78%', top: '66%', color: '#FF8A4C' } },
  // Night: the sun has set below the frame and the moon rises on the left
  { time: '18:30', avatar: 'despedida', sky: '#2B2A5C', night: true, sun: { left: '80%', top: '110%', color: '#FF8A4C' } },
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

export const EMAIL = 'lbdelilla@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/luciabelen/'
