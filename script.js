const root = document.documentElement;
const progress = document.querySelector('.scroll-progress span');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const confidence = document.querySelector('#confidence');
const output = document.querySelector('#confidence-output');
const message = document.querySelector('#confidence-message');
const confidenceLines = [
  [35, 'A tasteful amount of presence.'],
  [65, 'The room has noticed.'],
  [85, 'Someone just moved aside.'],
  [101, 'FULL REGGIE. No notes.']
];
function setConfidence() {
  const value = Number(confidence.value);
  root.style.setProperty('--confidence', value / 100);
  output.value = `${value}%`;
  message.textContent = confidenceLines.find(([limit]) => value < limit)[1];
}
confidence.addEventListener('input', setConfidence);
setConfidence();

const film = document.querySelector('#film');
const filmVideo = film.querySelector('video');
document.querySelectorAll('[data-open-film]').forEach((button) => button.addEventListener('click', () => {
  film.showModal();
  filmVideo.play().catch(() => {});
}));
film.querySelector('.film-close').addEventListener('click', () => film.close());
film.addEventListener('click', (event) => {
  if (event.target === film) film.close();
});
film.addEventListener('close', () => filmVideo.pause());

if (reduceMotion) {
  document.querySelectorAll('video[autoplay]').forEach((video) => video.pause());
} else if (matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });
}
