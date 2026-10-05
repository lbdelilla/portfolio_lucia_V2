// Builds the CV PDFs from cv/content.mjs with a headless browser.
//
//   npm run cv
//
// Public versions (no phone or email) go to public/ and are served by the site.
// Private versions, with the contact details from cv/private.json, go to cv/out/,
// which git ignores.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CV, PUBLIC_LINKS } from './content.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.dirname(here)

const BROWSERS = [
  process.env.CV_BROWSER,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function page(cv, contact) {
  const job = (j) => `
    <article class="job">
      <h3>${escape(j.title)}</h3>
      <p class="meta">${escape(j.meta)}</p>
      ${j.bullets ? `<ul>${j.bullets.map((b) => `<li>${escape(b)}</li>`).join('')}</ul>` : ''}
      ${j.text ? `<p>${escape(j.text)}</p>` : ''}
    </article>`

  return `<!doctype html>
<html lang="${cv.lang}">
<head>
<meta charset="utf-8">
<title>${escape(cv.title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Figtree:wght@400;500;700&display=swap">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    padding: 11mm 14mm 8mm;
    font-family: Figtree, Verdana, sans-serif;
    font-size: 9.3pt;
    line-height: 1.38;
    color: #221c3a;
  }
  h1, h2, h3, p, ul { margin: 0; }
  header { border-bottom: 2.5pt solid #ff6f59; padding-bottom: 7pt; margin-bottom: 8pt; }
  h1 { font-family: Fredoka, 'Trebuchet MS', sans-serif; font-size: 25pt; font-weight: 700; line-height: 1.05; }
  .role { font-family: Fredoka, 'Trebuchet MS', sans-serif; font-size: 12pt; font-weight: 500; color: #1f6f63; margin-top: 3pt; }
  .contact { margin-top: 4pt; font-size: 8.8pt; color: #4b4566; }
  h2 {
    font-family: Fredoka, 'Trebuchet MS', sans-serif;
    font-size: 11.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #1f6f63;
    margin: 9pt 0 4pt;
  }
  .job { margin-bottom: 6pt; break-inside: avoid; }
  h3 { font-size: 10.2pt; font-weight: 700; }
  .meta { color: #4b4566; font-size: 8.8pt; margin-bottom: 2pt; }
  ul { padding-left: 13pt; }
  li { margin-bottom: 1pt; }
  li::marker { color: #ff6f59; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; column-gap: 22pt; }
  .columns { break-inside: avoid; }
  .columns section:first-child h2 { margin-top: 4pt; }
  .entry { margin-bottom: 4pt; }
  .entry strong { display: block; font-weight: 700; }
  .entry span { color: #4b4566; font-size: 8.8pt; }
</style>
</head>
<body>
<header>
  <h1>${escape(cv.name)}</h1>
  <p class="role">${escape(cv.role)}</p>
  <p class="contact">${[cv.location, ...contact, ...PUBLIC_LINKS].map(escape).join(' · ')}</p>
</header>

<section>
  <h2>${escape(cv.headings.summary)}</h2>
  <p>${escape(cv.summary)}</p>
</section>

<section>
  <h2>${escape(cv.headings.experience)}</h2>
  ${cv.jobs.map(job).join('')}
</section>

<div class="columns">
  <div>
    <section>
      <h2>${escape(cv.headings.skills)}</h2>
      <p>${cv.skills.map(escape).join(' · ')}</p>
    </section>
    <section>
      <h2>${escape(cv.headings.tools)}</h2>
      <p>${cv.tools.map(escape).join(' · ')}</p>
    </section>
    <section>
      <h2>${escape(cv.headings.projects)}</h2>
      ${cv.projects.map((e) => `<p class="entry"><strong>${escape(e.title)}</strong><span>${escape(e.meta)}</span></p>`).join('')}
    </section>
  </div>
  <div>
    <section>
      <h2>${escape(cv.headings.education)}</h2>
      ${cv.education.map((e) => `<p class="entry"><strong>${escape(e.title)}</strong><span>${escape(e.meta)}</span></p>`).join('')}
    </section>
    <section>
      <h2>${escape(cv.headings.languages)}</h2>
      <p>${cv.languages.map(escape).join(' · ')}</p>
    </section>
  </div>
</div>
</body>
</html>`
}

function print(html, target) {
  const browser = BROWSERS.find((candidate) => fs.existsSync(candidate))
  if (!browser) throw new Error('No Chrome or Edge found. Set CV_BROWSER to the browser executable.')
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'))
  const source = path.join(work, 'cv.html')
  fs.writeFileSync(source, html)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      // Give the web fonts time to load before printing
      '--virtual-time-budget=8000',
      `--user-data-dir=${path.join(work, 'profile')}`,
      `--print-to-pdf=${target}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'ignore' },
  )
  fs.rmSync(work, { recursive: true, force: true })
  console.log('Wrote', path.relative(root, target))
}

const privateFile = path.join(here, 'private.json')
const contact = fs.existsSync(privateFile) ? JSON.parse(fs.readFileSync(privateFile, 'utf8')) : null

for (const cv of Object.values(CV)) {
  const code = cv.lang.toUpperCase()
  print(page(cv, []), path.join(root, 'public', `CV_Lucia_Belen_${code}.pdf`))
  if (contact) print(page(cv, [contact.phone, contact.email]), path.join(here, 'out', `CV_Lucia_Belen_${code}_contacto.pdf`))
}
if (!contact) console.log('No cv/private.json: skipped the versions with phone and email.')
