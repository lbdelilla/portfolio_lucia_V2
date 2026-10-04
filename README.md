# Lucía Belén · Un día conmigo

Portfolio interactivo de Lucía Belén, Program Manager Lead. En lugar de un currículum, el visitante pasa un día con ella: recorre sus horas de trabajo, toma decisiones, responde mensajes inesperados y descubre de dónde viene cada habilidad.

**En vivo:** https://luciabelen.dev

*An interactive portfolio: instead of reading a résumé, visitors spend a day with Lucía. Available in Spanish and English.*

## Qué hace

- **Un día en siete horas.** De las 08:30 a las 20:30, cada hora tiene su escena, su pose y su historia. Se puede avanzar con los botones o arrastrando el sol por el cielo.
- **Tres recorridos.** El visitante elige si es recruiter, colega o curioso, y el orden del contenido y el cierre se adaptan.
- **Decisiones e imprevistos.** Mensajes de Slack que hay que priorizar y una decisión de gestión, con la respuesta de Lucía al final.
- **Una automatización que se puede ejecutar.** Un ejemplo simplificado del tipo de flujos que construye.
- **Un agente de IA** que responde preguntas sobre su experiencia, con un límite de preguntas por visita.
- **Lado personal.** Una hora "después del trabajo", datos que cuenta el avatar al tocarlo y un juego de dos verdades y una mentira.
- **Resumen, CV descargable y formulario de contacto.**
- **Español e inglés**, con animaciones que respetan la preferencia de reducir movimiento.

## Tecnología

- [React](https://react.dev) con [Vite](https://vite.dev)
- [GSAP](https://gsap.com) para las animaciones
- Función serverless en [Vercel](https://vercel.com) para el agente, con la [API de Claude](https://platform.claude.com)
- [Upstash Redis](https://upstash.com) para guardar, de forma anónima, las preguntas que el agente no sabe responder
- [Formspree](https://formspree.io) para el formulario de contacto

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/App.jsx` | Componentes de la página |
| `src/content.js` | Textos de cada hora, en español e inglés |
| `src/scene.js` | Horas, cielo, resumen y textos de la interfaz |
| `src/pings.js` | Mensajes de Slack y la hora real de Valencia |
| `src/personal.js` | Datos personales y el juego |
| `src/flow.js` | La automatización de ejemplo |
| `src/testimonials.js` | Recomendaciones y enlaces al CV |
| `server/profile.js` | Lo único que el agente sabe sobre Lucía |
| `server/agent.js` | Lógica del agente: límites, llamada a la API y registro de preguntas |
| `api/ask.js` | Punto de entrada de la función en Vercel |
| `public/` | Ilustraciones, CV e imagen para compartir |

## Desarrollo local

```bash
npm install
npm run dev
```

La página queda en `http://localhost:5173`. Para que el agente funcione en local, crea un archivo `.env.local` con tu propia clave (git lo ignora):

```text
ANTHROPIC_API_KEY=tu-clave
AGENT_MODEL=claude-sonnet-5-5
```

Otros comandos:

```bash
npm run build
npm run lint
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `ANTHROPIC_API_KEY` | Clave de la API de Claude. Solo se usa en el servidor. |
| `AGENT_MODEL` | Modelo del agente. Si falta, usa `claude-opus-5-5`. |
| Variables de Upstash Redis | Las añade Vercel al conectar el almacén. Sin ellas, el agente funciona pero no guarda preguntas. |

## Despliegue

Cada cambio en la rama `main` se publica automáticamente en Vercel.
