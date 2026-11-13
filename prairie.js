/* Lauraline — le décor évolue, les médias originaux du doudou restent inchangés. */
(() => {
  'use strict';
  const scene = document.getElementById('scene');
  const panel = document.getElementById('digicode');
  const actor = document.getElementById('actorWrap');
  const video = document.getElementById('reaction');
  const fallback = document.getElementById('fallback');
  if (!scene || !panel || !actor || !video || !fallback) return;

  let seed = 2122026;
  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const between = (a, b) => a + random() * (b - a);

  /* Ciel, coucher de soleil, collines et plaine. */
  scene.insertAdjacentHTML('afterbegin',
    '<div class="scene-sky" aria-hidden="true">' +
      '<div class="scene-sun"></div><div class="sun-streak"></div>' +
      '<div class="scene-cloud a"></div><div class="scene-cloud b"></div><div class="scene-cloud c"></div>' +
    '</div>' +
    '<div class="scene-hills" aria-hidden="true"><div class="ridge far"></div><div class="ridge middle"></div><div class="ridge near"></div></div>' +
    '<div class="field-grass" aria-hidden="true"></div>' +
    '<div class="field-flowers back" aria-hidden="true"></div>' +
    '<div class="meadow-sparkles" aria-hidden="true"></div>'
  );
  const objects = scene.querySelector('.objects');
  const title = document.createElement('h1');
  title.className = 'headline';
  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'La date qui nous relit ???';
  title.appendChild(titleSpan);
  scene.insertBefore(title, objects);

  const frontField = document.createElement('div');
  frontField.className = 'field-flowers front';
  frontField.setAttribute('aria-hidden', 'true');
  scene.appendChild(frontField);
  const backField = scene.querySelector('.field-flowers.back');

  const shapes = ['✿','❀','✽','✾','✿','❀'];
  const colors = ['#ffe9fa','#ffd6de','#fff3c3','#f7b1c7','#f0c7ff','#fff0e3','#ddcaff','#ffc7a6'];
  function plant(where, isFront, amount) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < amount; i++) {
      const flower = document.createElement('span');
      flower.className = 'field-flower';
      const x = isFront ? (random() < .5 ? between(1,24) : between(78,99)) : between(0,100);
      const y = isFront ? between(0,21) : between(0,36);
      const size = isFront ? between(15,31) : between(8,23);
      flower.style.setProperty('--x', x.toFixed(2) + '%');
      flower.style.setProperty('--y', y.toFixed(2) + '%');
      flower.style.setProperty('--stem', (size * between(1.9,3.8)).toFixed(1) + 'px');
      flower.style.setProperty('--size', size.toFixed(1) + 'px');
      flower.style.setProperty('--bloom', colors[Math.floor(random() * colors.length)]);
      flower.style.setProperty('--sway-time', between(2.9,6.5).toFixed(2) + 's');
      flower.style.setProperty('--delay', (-between(0,6)).toFixed(2) + 's');
      flower.style.setProperty('--opacity', isFront ? between(.72,.98).toFixed(2) : between(.55,.96).toFixed(2));
      flower.style.setProperty('--blur', y > 31 ? '.8px' : '0px');
      const stem = document.createElement('i');
      stem.className = 'flower-stem';
      const bloom = document.createElement('b');
      bloom.className = 'flower-bloom';
      bloom.textContent = shapes[Math.floor(random() * shapes.length)];
      flower.append(stem, bloom);
      fragment.appendChild(flower);
    }
    where.appendChild(fragment);
  }
  plant(backField, false, matchMedia('(max-width:720px)').matches ? 110 : 170);
  plant(frontField, true, 26);

  /* Vraie ouverture : bouquets de roses propulsés depuis le centre. */
  const intro = document.createElement('div');
  intro.className = 'intro-roses';
  intro.setAttribute('aria-hidden', 'true');
  const glow = document.createElement('div');
  glow.className = 'intro-center';
  intro.appendChild(glow);
  const roses = document.createDocumentFragment();
  const maxSpread = Math.hypot(innerWidth, innerHeight) * .66;
  const roseCount = matchMedia('(max-width:720px)').matches ? 54 : 78;
  for (let i = 0; i < roseCount; i++) {
    const rose = document.createElement('span');
    rose.className = 'intro-rose';
    rose.textContent = i % 7 === 0 ? '🌸' : '🌹';
    const angle = (i / roseCount) * Math.PI * 2 + between(-.2,.2);
    const distance = between(70,maxSpread);
    rose.style.setProperty('--dx', (Math.cos(angle) * distance).toFixed(1) + 'px');
    rose.style.setProperty('--dy', (Math.sin(angle) * distance).toFixed(1) + 'px');
    rose.style.setProperty('--rotation', between(-270,270).toFixed(1) + 'deg');
    rose.style.setProperty('--scale', between(.65,1.55).toFixed(2));
    rose.style.setProperty('--size', between(27,68).toFixed(1) + 'px');
    rose.style.setProperty('--delay', between(0,.55).toFixed(2) + 's');
    rose.style.setProperty('--flight', between(2.0,2.65).toFixed(2) + 's');
    roses.appendChild(rose);
  }
  intro.appendChild(roses);
  document.body.appendChild(intro);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => intro.classList.add('leaving'), reducedMotion ? 100 : 2850);
  window.setTimeout(() => intro.remove(), reducedMotion ? 450 : 3800);

  /* Deuxième écran autonome, accessible uniquement après le bon code. */
  const next = document.createElement('section');
  next.className = 'second-page';
  next.id = 'notre-histoire';
  next.hidden = true;
  next.setAttribute('aria-label', 'La page suivante de notre histoire');
  next.innerHTML =
    '<div class="next-content">' +
       '<span class="date">02 · 12</span>' +
       '<h2>Tu as trouvé notre date ♡</h2>' +
       '<p>Et ce n’est que le début de notre histoire…</p>' +
       '<button id="backToMeadow" type="button">↶ Revenir à la prairie</button>' +
    '</div>';
  document.body.appendChild(next);
  let nextScheduled = false;
  function openNextPage() {
    if (!panel.classList.contains('correct') || nextScheduled === false) return;
    next.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('show')));
  }
  next.querySelector('#backToMeadow').addEventListener('click', () => {
    next.classList.remove('show');
    window.setTimeout(() => {
      next.hidden = true;
      document.getElementById('erase').click();
      nextScheduled = false;
    }, 800);
  });

  /* Les médias existants restent identiques. Une lecture 2x est appliquée
     à la vidéo de colère; sa version WebP 2x est intégrée dans index.html
     pour iPhone/Safari, sans supprimer de frames ni les réencoder. */
  function clearMediaTransition() {
    actor.classList.remove('media-ready','reacting');
    video.classList.remove('ready');
  }
  document.querySelectorAll('[data-digit],#erase').forEach(button => {
    button.addEventListener('click', clearMediaTransition, {capture:true});
  });
  document.addEventListener('keydown', event => {
    if (/^[0-9]$/.test(event.key) || event.key === 'Backspace') clearMediaTransition();
  }, {capture:true});

  video.addEventListener('playing', () => {
    video.classList.add('ready');
    actor.classList.add('media-ready');
    if (panel.classList.contains('error') && video.playbackRate !== 2) video.playbackRate = 2;
  });
  fallback.addEventListener('load', () => {
    if (fallback.classList.contains('visible')) actor.classList.add('media-ready');
  });
  const monitor = new MutationObserver(() => {
    if (panel.classList.contains('error')) {
      actor.classList.add('reacting');
      actor.classList.remove('media-ready');
      video.classList.remove('ready');
      video.loop = true;
      video.defaultPlaybackRate = 2;
      video.playbackRate = 2;
    } else if (panel.classList.contains('correct')) {
      actor.classList.add('reacting');
      actor.classList.remove('media-ready');
      video.classList.remove('ready');
      video.loop = false;
      video.defaultPlaybackRate = 1;
      video.playbackRate = 1;
      if (!nextScheduled) {
        nextScheduled = true;
        window.setTimeout(openNextPage, reducedMotion ? 700 : 1650);
      }
    } else {
      actor.classList.remove('reacting');
    }
  });
  monitor.observe(panel, {attributes:true,attributeFilter:['class']});
})();