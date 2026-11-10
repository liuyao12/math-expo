(() => {
  const button = document.getElementById('open-hypothesis');
  const status = document.getElementById('hypothesis-status');
  if (!button || !status) return;

  function openHypothesis() {
    const ready = () => {
      button.hidden = true;
      formatButton.hidden = !selectedParagraph;
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
  const formatButton = document.createElement('button');
  formatButton.id = 'format-hypothesis-comment';
  formatButton.type = 'button';
  formatButton.className = 'reader-login';
  formatButton.textContent = 'LaTeX';
  formatButton.title = 'Format a comment with LaTeX shortcuts';
  formatButton.hidden = true;
  button.after(formatButton);
  let selectedParagraph;
  let pendingAnnotation;
  let draftDialog;
  let activeDraft;

  const mathShortcuts = new Map(Object.entries({
    a: '\\alpha', b: '\\beta', g: '\\gamma', d: '\\delta', e: '\\epsilon',
    th: '\\theta', l: '\\lambda', s: '\\sigma', f: '\\phi', w: '\\omega',
    NN: '\\mathbb{N}', ZZ: '\\mathbb{Z}', QQ: '\\mathbb{Q}',
    RR: '\\mathbb{R}', CC: '\\mathbb{C}',
  }));

  function formatComment(text) {
    const markup = /(`+)[\s\S]*?\1|\$\$([\s\S]*?)\$\$|\$([^$\r\n]+)\$|\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]|\\./g;
    return text.replace(markup, (match, code, doubleDollar, singleDollar, inline, display) => {
      const math = doubleDollar ?? singleDollar ?? inline ?? display;
      if (code || math === undefined) return match;
      const expanded = math.replace(/\\([a-zA-Z]+|[^a-zA-Z])/g, (command, name) => mathShortcuts.get(name) ?? command);
      return '$$' + expanded + '$$';
    });
  }

  function annotateParagraph(paragraph, start, end, key, previousKeys) {
    selectedParagraph = { paragraph, key, previousKeys };
    const selection = document.getSelection();
    if (!selection) return;
    // Focus the selection on the first line so the Annotate menu opens there.
    selection.setBaseAndExtent(end, end.childNodes.length, start, start === paragraph ? 1 : 0);
    openHypothesis();

    clearTimeout(pendingAnnotation);
    const deadline = performance.now() + 8000;
    function startAnnotation() {
      if (!paragraph.isConnected || selection.isCollapsed || selection.focusNode !== start) return;
      const adder = document.querySelector('hypothesis-adder')?.shadowRoot;
      const annotate = adder?.querySelector('button[aria-label^="Annotate"]');
      if (annotate?.getClientRects().length) {
        annotate.click();
      } else if (performance.now() < deadline) {
        pendingAnnotation = setTimeout(startAnnotation, 100);
      }
    }
    pendingAnnotation = setTimeout(startAnnotation, 180);
  }

  formatButton.addEventListener('click', () => {
    if (selectedParagraph?.paragraph.isConnected) openDraft(selectedParagraph);
  });

  function readDraft(key) {
    try {
      return drafts.get(key) ?? localStorage.getItem(key);
    } catch {
      return drafts.get(key);
    }
  }

  function openDraft(draft) {
    if (!draftDialog) {
      draftDialog = document.createElement('dialog');
      draftDialog.className = 'paragraph-draft';
      draftDialog.setAttribute('aria-labelledby', 'paragraph-draft-title');
      draftDialog.innerHTML = `
        <form>
          <h2 id="paragraph-draft-title">Format a comment</h2>
          <label for="paragraph-draft-text">Your comment</label>
          <textarea id="paragraph-draft-text" rows="6" required></textarea>
          <p class="paragraph-draft-hint" aria-live="polite"></p>
          <div class="paragraph-draft-actions">
            <button type="button">Close</button>
            <button type="submit">Copy formatted comment</button>
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
          if (text.value || activeDraft.previousKeys.length) localStorage.setItem(activeDraft.key, text.value);
          else localStorage.removeItem(activeDraft.key);
        } catch {
          // Keep the draft in this tab when storage is unavailable.
        }
      });
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!text.value.trim()) return;
        const key = activeDraft.key;
        const value = text.value;
        const formatted = formatComment(value);
        save.disabled = true;
        try {
          await navigator.clipboard.writeText(formatted);
        } catch {
          if (draftDialog.open && key === activeDraft.key && text.value === value) {
            text.value = formatted;
            text.focus();
            text.select();
            hint.textContent = 'Copy the selected text and paste it into Hypothesis.';
          }
          return;
        } finally {
          save.disabled = false;
        }
        if (draftDialog.open && key === activeDraft.key && text.value === value) {
          hint.textContent = 'Copied. Paste the formatted comment into Hypothesis.';
        }
      });
    }

    activeDraft = draft;
    const text = readDraft(draft.key) ?? draft.previousKeys.map(readDraft).filter(Boolean).join('\n\n');
    draftDialog.querySelector('textarea').value = text;
    draftDialog.querySelector('.paragraph-draft-hint').textContent =
      'Use * or - for bullets and $…$ for math. Shortcuts include \\a, \\b, \\g, \\NN, and \\RR. Copy the formatted text to paste into Hypothesis.';
    draftDialog.showModal();
  }

  const readingText = ':is(.source-body, .proof-body, .passage > .original, .authored-text, #chapter .prose)';
  const readingParagraphs = readingText + ' p, #chapter .chapter-intro';
  const statementBodies = '.passage:not(.prose) > .source-body, #chapter .prose .definition';
  const lists = 'ol, ul';
  function addCommentButtons(root) {
    const paragraphNumbers = new Map();
    const draftKeys = new Map();
    const page = location.pathname.replace(/index\.html$/, '');
    const chapterHash = chapter ? (location.hash || '#geometry') : '';
    for (const paragraph of root.querySelectorAll(readingParagraphs)) {
      const anchor = paragraph.closest('[id]');
      const number = (paragraphNumbers.get(anchor) ?? 0) + 1;
      paragraphNumbers.set(anchor, number);
      draftKeys.set(paragraph, 'math-expo:draft:' + JSON.stringify([page, chapterHash, anchor?.id, number]));
    }

    const continuations = new Set();
    const blocks = root.querySelectorAll(readingParagraphs + ', ' + statementBodies + ', ' + readingText + ' :is(ol, ul)');
    for (const [index, block] of blocks.entries()) {
      const enclosingStatement = block.closest(statementBodies);
      if ((enclosingStatement && enclosingStatement !== block) ||
          block.parentElement.closest(lists) || continuations.has(block) || !block.textContent.trim()) continue;

      let end = block;
      const following = [];
      if (block.matches('p, ol, ul')) {
        const introducesItems = /[.:;!?]\s*$/.test(block.textContent);
        let next = end.nextElementSibling;
        while (next && (next.matches(lists) || (introducesItems && next.matches('p') && /^\s*(?:\d+[.)]|\(\d+\))\s/.test(next.textContent)))) {
          end = next;
          continuations.add(end);
          following.push(end);
          next = end.nextElementSibling;
        }
      }

      // Put the control on the first line, including lists whose first item has no p.
      let lead = block.matches('p') ? block : block.querySelector('p, li') || block;
      if (lead.matches('li') && lead.firstElementChild?.matches('p')) lead = lead.firstElementChild;
      if (lead.firstElementChild?.matches('.paragraph-comment')) continue;
      const paragraphs = [block, ...following].flatMap(part => part.matches('p') ? [part] : [...part.querySelectorAll('p')]);
      const oldKeys = paragraphs.map(paragraph => draftKeys.get(paragraph)).filter(Boolean);
      const previousKeys = oldKeys.length > 1 ? oldKeys : [];
      const key = previousKeys.length ? previousKeys[0] + ':group' :
        oldKeys[0] ?? 'math-expo:draft:' + JSON.stringify([page, chapterHash, 'block', index]);
      const addComment = document.createElement('button');
      addComment.type = 'button';
      addComment.className = 'paragraph-comment';
      const label = block.matches(statementBodies) ? 'Annotate this block' : block.matches(lists) ? 'Annotate this list' : 'Annotate this paragraph';
      addComment.setAttribute('aria-label', label);
      addComment.title = label;
      addComment.addEventListener('click', () => annotateParagraph(lead, block, end, key, previousKeys));
      lead.prepend(addComment);
      if (block !== lead) block.classList.add('comment-block');
      for (const continuation of following) {
        continuation.addEventListener('pointerenter', () => addComment.classList.add('is-hovered'));
        continuation.addEventListener('pointerleave', () => addComment.classList.remove('is-hovered'));
      }
    }
  }
  addCommentButtons(document);

  if (chapter) {
    new MutationObserver(() => addCommentButtons(chapter)).observe(chapter, { childList: true });
  }
})();
