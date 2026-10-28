(() => {
  'use strict';

  const hero = document.querySelector('[data-k-hero]');
  const film = hero?.querySelector('video[data-k-scrub]');
  const header = document.querySelector('.site-header');
  const scrollFilm = document.querySelector('[data-scroll-film]');
  const scrollFilmSection = scrollFilm?.closest('[data-scroll-film-section]');
  const phoneTitle = hero?.querySelector('.phone-film-title');
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const smooth = (n) => n * n * (3 - 2 * n);

  if (hero && header && 'IntersectionObserver' in window) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry.isIntersecting);
    }, { threshold: 0 });
    headerObserver.observe(hero);
  }

  if (scrollFilm && scrollFilmSection) {
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    let scrollFrame = 0;
    let filmObserver;
    const updateScrollFilm = () => {
      scrollFrame = 0;
      if (motionPreference.matches) return;
      const rect = scrollFilmSection.getBoundingClientRect();
      const range = Math.max(1, scrollFilmSection.offsetHeight - innerHeight);
      const progress = clamp(-rect.top / range, 0, 1);
      scrollFilmSection.style.setProperty('--film-progress', progress.toFixed(4));
      if (!scrollFilm.hasAttribute('src') || scrollFilm.readyState < 1 || !scrollFilm.duration) return;
      const target = progress * Math.max(0, scrollFilm.duration - 0.04);
      if (!scrollFilm.seeking && Math.abs(scrollFilm.currentTime - target) > 0.035) scrollFilm.currentTime = target;
    };
    const scheduleScrollFilm = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollFilm); };
    const loadScrollFilm = () => {
      if (motionPreference.matches || scrollFilm.hasAttribute('src')) return;
      const src = scrollFilm.dataset.src;
      if (!src) return;
      scrollFilm.src = src;
      scrollFilm.load();
    };
    const updateMotionMode = () => {
      const isStatic = motionPreference.matches;
      scrollFilmSection.classList.toggle('is-static', isStatic);
      if (isStatic) {
        filmObserver?.disconnect();
        scrollFilm.pause();
        scrollFilm.removeAttribute('src');
        scrollFilm.load();
        scrollFilmSection.classList.remove('is-film-ready');
        scrollFilmSection.style.setProperty('--film-progress', '0');
      } else observeScrollFilm();
    };
    const observeScrollFilm = () => {
      if (motionPreference.matches) return;
      if ('IntersectionObserver' in window) {
        filmObserver?.disconnect();
        filmObserver = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadScrollFilm();
          filmObserver.disconnect();
        }, { rootMargin: '240px 0px' });
        filmObserver.observe(scrollFilmSection);
      } else loadScrollFilm();
    };
    addEventListener('scroll', scheduleScrollFilm, { passive: true });
    addEventListener('resize', scheduleScrollFilm, { passive: true });
    scrollFilm.addEventListener('loadeddata', () => {
      scrollFilmSection.classList.add('is-film-ready');
      scheduleScrollFilm();
    });
    scrollFilm.addEventListener('loadedmetadata', scheduleScrollFilm);
    scrollFilm.addEventListener('seeked', scheduleScrollFilm);
    updateMotionMode();
    scheduleScrollFilm();
    motionPreference.addEventListener('change', () => { updateMotionMode(); scheduleScrollFilm(); });
  }

  function paintPhoneType(time, duration) {
    if (!phoneTitle || !duration || hero?.classList.contains('k-static')) return;
    const p = clamp(time / duration, 0, 1);
    // The portrait camera eases from the macro cup to the full silhouette in the first two thirds.
    // The words travel down and inward as the headphone recedes, then hold in the top negative space.
    const settle = smooth(clamp((p - 0.05) / 0.53, 0, 1));
    const x = 11 - settle * 9;
    const y = settle * 5.5;
    const scale = 0.88 + settle * 0.12;
    phoneTitle.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale})`;
  }

  if (film) {
    const update = (time = film.currentTime) => paintPhoneType(time, film.duration);
    film.addEventListener('loadeddata', () => update());
    film.addEventListener('seeked', () => update());
    film.addEventListener('timeupdate', () => update());
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const onFrame = (_now, metadata) => {
        update(metadata.mediaTime);
        film.requestVideoFrameCallback(onFrame);
      };
      film.addEventListener('loadeddata', () => film.requestVideoFrameCallback(onFrame), { once: true });
    }
    addEventListener('resize', () => update());
  }

  document.querySelectorAll('[data-finish]').forEach((button) => {
    button.addEventListener('click', () => {
      const finish = button.dataset.finish;
      document.querySelectorAll('[data-finish]').forEach((option) => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
        const status = option.querySelector('.finish-check');
        if (status) status.textContent = selected ? 'Selected' : 'Select';
      });
      const status = document.querySelector('.finish-status');
      const heroFinish = document.querySelector('.hero-price span');
      if (status) status.textContent = `${finish === 'wood' ? 'Wood' : 'Black'} finish selected.`;
      if (heroFinish) heroFinish.textContent = `· ${finish === 'wood' ? 'wood' : 'black'} finish`;
    });
  });

  document.querySelectorAll('.connection-choice[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      document.querySelectorAll('.connection-choice[data-mode]').forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle('is-active', selected);
        choice.setAttribute('aria-pressed', String(selected));
      });
      const art = document.querySelector('.connection-art');
      const state = document.querySelector('.connection-state');
      const artLabel = document.querySelector('.connection-art-label');
      if (art) art.dataset.mode = mode;
      if (state) state.textContent = `${mode === 'bluetooth' ? 'Bluetooth' : 'Optional cable'} selected.`;
      if (artLabel) artLabel.textContent = mode === 'bluetooth' ? 'Bluetooth · wireless listening' : 'Optional cable · wired listening';
    });
  });

  const paths = document.querySelectorAll('.signal-route');
  if ('IntersectionObserver' in window && paths.length) {
    const pathObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-drawn');
        pathObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    paths.forEach((path) => pathObserver.observe(path));
  } else {
    paths.forEach((path) => path.classList.add('is-drawn'));
  }
})();
