// The personal side: what the avatar says when tapped, and the "after work" hour.

// Short facts the avatar says when a visitor taps her, in order
export const TAP_FACTS = {
  es: [
    '¿Sabías que no tomo café?',
    'Estoy estudiando coreano.',
    'Mi perrita se llama Canela.',
    'Mi película favorita es Grease.',
    'Star Wars es mi saga favorita.',
    'Quiero volver a Grecia e Italia.',
    'No me gusta el deporte, pero sí el gimnasio.',
  ],
  en: [
    "Did you know I don't drink coffee?",
    "I'm learning Korean.",
    'My dog is called Canela.',
    'My favourite film is Grease.',
    'Star Wars is my favourite saga.',
    'I want to go back to Greece and Italy.',
    "I don't like sports, but I do like the gym.",
  ],
}

export const AFTER_HOURS = {
  es: {
    next: '¿Y después del trabajo?',
    factsTitle: 'Para conocerme un poco',
    facts: [
      { title: 'Idiomas', text: 'Me encanta aprender idiomas. Ahora estudio coreano.' },
      { title: 'Canela', text: 'Tengo una perrita que se llama Canela.' },
      { title: 'Cine', text: 'Mi película favorita es Grease y amo los musicales. En ciencia ficción, mi saga es Star Wars.' },
      { title: 'Viajes', text: 'Quiero volver a Grecia e Italia. Me falta conocer Asia y Suecia.' },
      { title: 'Gimnasio', text: 'No me gusta el deporte, pero sí ir al gimnasio.' },
    ],
    gameTitle: 'Dos verdades y una mentira',
    gameAsk: '¿Cuál es la mentira?',
    right: '¡Exacto! Esa es la mentira.',
    wrong: 'Esa es verdad.',
  },
  en: {
    next: 'And after work?',
    factsTitle: 'To get to know me a little',
    facts: [
      { title: 'Languages', text: "I love learning languages. Right now I'm studying Korean." },
      { title: 'Canela', text: 'I have a little dog called Canela.' },
      { title: 'Films', text: 'My favourite film is Grease and I love musicals. In science fiction, my saga is Star Wars.' },
      { title: 'Travel', text: "I want to go back to Greece and Italy. Asia and Sweden are still on my list." },
      { title: 'Gym', text: "I don't like sports, but I do like going to the gym." },
    ],
    gameTitle: 'Two truths and a lie',
    gameAsk: 'Which one is the lie?',
    right: "Exactly! That's the lie.",
    wrong: "That one is true.",
  },
}

// Two truths and a lie
export const GAME = {
  es: [
    { text: 'Me hice un vestido de fiesta sin saber coser.', lie: false, detail: 'Lo hice, y lo usé.' },
    { text: 'Corrí una media maratón.', lie: true, detail: 'No me gusta el deporte. Lo mío es el gimnasio.' },
    { text: 'Armo mis propios muebles.', lie: false, detail: 'Me encanta crear con las manos.' },
  ],
  en: [
    { text: 'I made myself a party dress without knowing how to sew.', lie: false, detail: 'I did, and I wore it.' },
    { text: 'I ran a half marathon.', lie: true, detail: "I don't like sports. The gym is more my thing." },
    { text: 'I build my own furniture.', lie: false, detail: 'I love making things with my hands.' },
  ],
}
