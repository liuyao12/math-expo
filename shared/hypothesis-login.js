(() => {
  const button = document.getElementById('open-hypothesis');
  const status = document.getElementById('hypothesis-status');
  if (!button || !status) return;

  button.addEventListener('click', () => {
    const ready = () => {
      button.hidden = true;
      status.textContent = 'Use Log in in the Hypothesis sidebar to sign in.';
    };
    if (document.querySelector('hypothesis-sidebar')) {
      ready();
      return;
    }

    button.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'Loading Hypothesis…';
    const config = document.createElement('script');
    config.type = 'application/json';
    config.className = 'js-hypothesis-config';
    config.textContent = JSON.stringify({ openSidebar: true });
    const script = document.createElement('script');
    script.src = 'https://hypothes.is/embed.js';
    script.addEventListener('load', ready, { once: true });
    script.addEventListener('error', () => {
      script.remove();
      config.remove();
      button.disabled = false;
      status.classList.add('is-error');
      status.textContent = 'Hypothesis could not load. Try again.';
    }, { once: true });
    document.head.append(config, script);
  });
})();
