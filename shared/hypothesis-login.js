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

  const chapter = document.getElementById('chapter');
  const drafts = new Map();
  let draftDialog;
  let activeDraft;

  function openDraft(paragraph, key) {
    if (!draftDialog) {
      draftDialog = document.createElement('dialog');
      draftDialog.className = 'paragraph-draft';
      draftDialog.setAttribute('aria-labelledby', 'paragraph-draft-title');
      draftDialog.innerHTML = `
        <form>
          <h2 id="paragraph-draft-title">Comment on this paragraph</h2>
          <label for="paragraph-draft-text">Your comment</label>
          <textarea id="paragraph-draft-text" rows="6" required></textarea>
          <p class="paragraph-draft-hint" aria-live="polite"></p>
          <div class="paragraph-draft-actions">
            <button type="button">Close</button>
            <button type="submit">Save to Hypothesis</button>
          </div>
        </form>`;
      document.body.append(draftDialog);

      const form = draftDialog.querySelector('form');
      const text = form.querySelector('textarea');
      const hint = form.querySelector('.paragraph-draft-hint');
      const save = form.querySelector('[type="submit"]');
      form.querySelector('[type="button"]').addEventListener('click', () => draftDialog.close());
      text.addEventListener('input', () => {
        drafts.set(activeDraft.key, text.value);
        try {
          if (text.value) localStorage.setItem(activeDraft.key, text.value);
          else localStorage.removeItem(activeDraft.key);
        } catch {
          // Keep the draft in this tab when storage is unavailable.
        }
        activeDraft.needsManualCopy = false;
        save.textContent = 'Save to Hypothesis';
      });
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!text.value.trim()) return;
        const draft = activeDraft;
        const value = text.value;
        if (!draft.needsManualCopy) {
          save.disabled = true;
          try {
            await navigator.clipboard.writeText(value);
          } catch {
            if (draftDialog.open && draft === activeDraft) {
              draft.needsManualCopy = true;
              text.focus();
              text.select();
              hint.textContent = 'Copy your selected draft, then continue to Hypothesis.';
              save.textContent = 'Continue to Hypothesis';
            }
            return;
          } finally {
            save.disabled = false;
          }
        }
        if (!draftDialog.open || draft !== activeDraft || text.value !== value) return;
        draftDialog.close();
        const target = draft.paragraph;
        if (!target.isConnected) return;
        const selection = document.getSelection();
        // Focus the selection on the first line so the Annotate menu opens there.
        selection?.setBaseAndExtent(target, target.childNodes.length, target, 1);
        openHypothesis();
      });
    }

    activeDraft = { paragraph, key };
    let text = drafts.get(key);
    if (text === undefined) {
      try {
        text = localStorage.getItem(key);
      } catch {
        // A fresh draft can still be written when storage is unavailable.
      }
    }
    draftDialog.querySelector('textarea').value = text ?? '';
    draftDialog.querySelector('[type="submit"]').textContent = 'Save to Hypothesis';
    draftDialog.querySelector('.paragraph-draft-hint').textContent =
      'Your draft stays in this browser. Save copies it and opens Hypothesis. Choose Annotate, sign in if prompted, then paste and post your comment.';
    draftDialog.showModal();
  }

  const readingParagraphs = '.source-body p, .proof-body p, .passage > .original p, .authored-text p, #chapter .prose p, #chapter .chapter-intro';
  function addCommentButtons(root) {
    const paragraphNumbers = new Map();
    for (const paragraph of root.querySelectorAll(readingParagraphs)) {
      const anchor = paragraph.closest('[id]');
      const number = (paragraphNumbers.get(anchor) ?? 0) + 1;
      paragraphNumbers.set(anchor, number);
      if (!paragraph.textContent.trim() || paragraph.firstElementChild?.matches('.paragraph-comment')) continue;
      const chapterHash = chapter?.contains(paragraph) ? (location.hash || '#geometry') : '';
      const page = location.pathname.replace(/index\.html$/, '');
      const key = 'math-expo:draft:' + JSON.stringify([page, chapterHash, anchor?.id, number]);
      const addComment = document.createElement('button');
      addComment.type = 'button';
      addComment.className = 'paragraph-comment';
      addComment.setAttribute('aria-label', 'Annotate this paragraph');
      addComment.title = 'Annotate this paragraph';
      addComment.addEventListener('click', () => openDraft(paragraph, key));
      paragraph.prepend(addComment);
    }
  }
  addCommentButtons(document);

  if (chapter) {
    new MutationObserver(() => addCommentButtons(chapter)).observe(chapter, { childList: true });
  }
})();
