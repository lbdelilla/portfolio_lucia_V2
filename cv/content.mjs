// Text of the CV in both languages. Edit here and run `npm run cv` to rebuild the PDFs.
export const CV = {
  es: {
    lang: 'es',
    title: 'CV de Lucía Belén',
    name: 'Lucía Belén',
    role: 'Program Manager Lead · Operaciones y automatización de procesos',
    location: 'Valencia, España',
    headings: {
      summary: 'Resumen',
      experience: 'Experiencia',
      skills: 'Competencias',
      tools: 'Herramientas',
      projects: 'Proyectos',
      education: 'Formación',
      languages: 'Idiomas',
    },
    summary:
      'Program Manager Lead con más de cinco años liderando equipos y coordinando operaciones en educación tecnológica y salud. Coordino programas de formación en España y Latinoamérica y construyo yo misma las automatizaciones y herramientas que el equipo necesita: combino gestión, procesos y perfil técnico como desarrolladora Full Stack. Inglés C2.',
    jobs: [
      {
        title: 'Program Manager Lead · España y Latinoamérica',
        meta: '4Geeks Academy · 2023 - Actualidad · Remoto · Reporto al Director Académico',
        bullets: [
          'Lidero al equipo de Program Managers y Prework Advisors (hasta 5 personas) y coordino cursos, profesores y la experiencia de los alumnos en dos regiones.',
          'Hemos supervisado hasta 500 estudiantes activos en paralelo en programas de Full Stack, Data Science y AI Engineering.',
          'Lideré la unificación operativa entre España y Latinoamérica: procesos y flujos comunes para dos sedes que trabajaban con criterios distintos.',
          'Diseñé e implementé automatizaciones de punta a punta para la creación de cohortes, los cambios de estado, el seguimiento de estudiantes y las incidencias, con n8n, Make, Zapier y GitHub Actions.',
          'Automaticé para el departamento de Carreras el seguimiento de graduados en búsqueda de empleo.',
          'Gestiono los gastos de mentores, cursos y mentorías de los programas.',
          'Codesarrollé una plataforma interna con la que los mentores gestionan a sus alumnos.',
          'Implanté un modelo de seguimiento estructurado que mejoró las valoraciones de los alumnos y la tasa de graduación.',
        ],
      },
      {
        title: 'Head of Communication & Marketing',
        meta: 'Casa de Galicia · 2020 - 2022 · Montevideo, Uruguay · Reportaba a la Dirección Técnica',
        bullets: [
          'Lideré un equipo multidisciplinar de más de 20 personas en Atención al Cliente, Comercial y Comunicación.',
          'Fui el enlace entre departamentos, equipo técnico y dirección en la migración del CRM a un sistema desarrollado a medida y en la actualización del sistema de gestión médica.',
          'Coordiné la presencia en más de 12 eventos y ferias al año sin presupuesto asignado, consiguiendo recursos mediante acuerdos y colaboraciones.',
          'Aumenté más de un 80 % los seguidores y la interacción en redes sociales y un 20 % la tasa de conversión de la web.',
          'Creé e implanté el manual de imagen corporativa de la organización.',
        ],
      },
      {
        title: 'Etapas anteriores en Casa de Galicia',
        meta: '2008 - 2020 · Montevideo, Uruguay',
        text: 'Comunicación y redes sociales (2018 - 2020). Administración, atención al cliente y área comercial (2008 - 2018).',
      },
    ],
    skills: [
      'Gestión de programas y proyectos',
      'Liderazgo de equipos',
      'Gestión de stakeholders',
      'Coordinación entre regiones',
      'Mejora continua (Kanban)',
      'Automatización de procesos',
    ],
    tools: ['n8n', 'Make', 'Zapier', 'GitHub Actions', 'Agentes de IA', 'Looker Studio', 'Notion', 'Asana', 'Trello', 'Figma', 'JavaScript', 'React', 'Python'],
    education: [
      { title: 'Curso de gestión de proyectos (metodologías PMP y Scrum)', meta: 'EIGP · 2025' },
      { title: 'Full Stack Software Developer', meta: '4Geeks Academy España · 2022 - 2023' },
      { title: 'Licenciatura en Comunicación Social, énfasis en Publicidad', meta: 'Universidad Católica del Uruguay · 2013 - 2018' },
    ],
    languages: ['Español: nativo', 'Inglés: C2 (certificado EF SET, 2026 · cert.efset.org/en/3b2C4T)'],
    projects: [
      {
        title: 'luciabelen.dev',
        meta: 'Portfolio interactivo con un agente de IA: React, GSAP y API de Claude. Código en github.com/lbdelilla/portfolio_lucia_V2',
      },
    ],
  },
  en: {
    lang: 'en',
    title: 'Lucía Belén CV',
    name: 'Lucía Belén',
    role: 'Program Manager Lead · Operations and process automation',
    location: 'Valencia, Spain',
    headings: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills',
      tools: 'Tools',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
    },
    summary:
      'Program Manager Lead with more than five years leading teams and coordinating operations in technology education and healthcare. I coordinate training programmes across Spain and Latin America and build the automations and tools my team needs myself, combining management, process and a technical profile as a Full Stack developer. English C2.',
    jobs: [
      {
        title: 'Program Manager Lead · Spain and Latin America',
        meta: '4Geeks Academy · 2023 - Present · Remote · Reporting to the Academic Director',
        bullets: [
          'Lead the team of Program Managers and Prework Advisors (up to 5 people) and coordinate courses, teachers and the student experience across two regions.',
          'Our team has overseen up to 500 active students in parallel across Full Stack, Data Science and AI Engineering programmes.',
          'Led the operational unification of Spain and Latin America: shared processes and workflows for two sites that worked with different criteria.',
          'Designed and implemented end-to-end automations for cohort creation, status changes, student follow-up and incidents, using n8n, Make, Zapier and GitHub Actions.',
          'Automated, for the Careers department, the follow-up of graduates looking for a job.',
          'Manage the expenses for mentors, courses and mentoring sessions across the programmes.',
          'Co-developed an internal platform that mentors use to manage their students.',
          'Introduced a structured follow-up model that improved student ratings and the graduation rate.',
        ],
      },
      {
        title: 'Head of Communication & Marketing',
        meta: 'Casa de Galicia · 2020 - 2022 · Montevideo, Uruguay · Reported to Technical Management',
        bullets: [
          'Led a multidisciplinary team of more than 20 people across Customer Service, Sales and Communication.',
          'Acted as the link between departments, the technical team and management for the CRM migration to a custom-built system and the upgrade of the medical management system.',
          "Coordinated the organisation's presence at more than 12 events and fairs a year with no assigned budget, securing resources through agreements and partnerships.",
          'Grew social media followers and engagement by more than 80% and the website conversion rate by 20%.',
          "Created and rolled out the organisation's corporate identity manual.",
        ],
      },
      {
        title: 'Earlier roles at Casa de Galicia',
        meta: '2008 - 2020 · Montevideo, Uruguay',
        text: 'Communication and social media (2018 - 2020). Administration, customer service and sales (2008 - 2018).',
      },
    ],
    skills: [
      'Programme and project management',
      'Team leadership',
      'Stakeholder management',
      'Cross-regional coordination',
      'Continuous improvement (Kanban)',
      'Process automation',
    ],
    tools: ['n8n', 'Make', 'Zapier', 'GitHub Actions', 'AI agents', 'Looker Studio', 'Notion', 'Asana', 'Trello', 'Figma', 'JavaScript', 'React', 'Python'],
    education: [
      { title: 'Project management course (PMP and Scrum methodologies)', meta: 'EIGP · 2025' },
      { title: 'Full Stack Software Developer', meta: '4Geeks Academy Spain · 2022 - 2023' },
      { title: "Bachelor's Degree in Social Communication, major in Advertising", meta: 'Universidad Católica del Uruguay · 2013 - 2018' },
    ],
    languages: ['Spanish: native', 'English: C2 (EF SET certificate, 2026 · cert.efset.org/en/3b2C4T)'],
    projects: [
      {
        title: 'luciabelen.dev',
        meta: 'Interactive portfolio with an AI agent: React, GSAP and the Claude API. Code at github.com/lbdelilla/portfolio_lucia_V2',
      },
    ],
  },
}

export const PUBLIC_LINKS = ['luciabelen.dev', 'linkedin.com/in/luciabelen']
