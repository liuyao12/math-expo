(() => {
  const button = document.getElementById('open-hypothesis');
  const status = document.getElementById('hypothesis-status');
  if (!button || !status) return;

  function openHypothesis() {
    const ready = () => {
      button.hidden = true;
      status.textContent = 'Use Log in in the Hypothesis sidebar to sign in.';
    };
    if (document.querySelector('hypothesis-sidebar')) {
      ready();
      return;
    }
    if (button.disabled) return;

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
  }
  button.addEventListener('click', openHypothesis);

  const readingParagraphs = '.source-body p, .proof-body p, .passage > .original p, .authored-text p, #chapter .prose p, #chapter .chapter-intro';
  function addCommentButtons(root) {
    for (const paragraph of root.querySelectorAll(readingParagraphs)) {
      if (!paragraph.textContent.trim() || paragraph.firstElementChild?.matches('.paragraph-comment')) continue;
      const addComment = document.createElement('button');
      addComment.type = 'button';
      addComment.className = 'paragraph-comment';
      addComment.setAttribute('aria-label', 'Annotate this paragraph');
      addComment.title = 'Annotate this paragraph';
      addComment.addEventListener('click', () => {
        const selection = document.getSelection();
        if (!selection) return;
        // Put the selection focus on the first line so the Hypothesis menu opens there.
        selection.setBaseAndExtent(paragraph, paragraph.childNodes.length, paragraph, 1);
        openHypothesis();
      });
      paragraph.prepend(addComment);
    }
  }
  addCommentButtons(document);

  const chapter = document.getElementById('chapter');
  if (chapter) {
    new MutationObserver(() => addCommentButtons(chapter)).observe(chapter, { childList: true });
  }
})();
