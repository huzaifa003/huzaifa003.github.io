(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage may be disabled. */ }
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.textContent = dark ? 'Light mode' : 'Dark mode';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  setTheme(savedTheme === 'dark' || (savedTheme !== 'light' && systemTheme.matches));
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(savedTheme === 'dark');
    try { localStorage.setItem('portfolio-theme', savedTheme); } catch (_) { /* Theme still works for this visit. */ }
  });
  systemTheme.addEventListener('change', event => {
    if (savedTheme !== 'dark' && savedTheme !== 'light') setTheme(event.matches);
  });
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  function updateNavigation() {
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.3) current = section;
    }
    for (const link of links) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { updateNavigation(); scheduled = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
})();
