import './vendor/katex/katex.min.js';
import {macros} from './math-config.js';

const publicGroup = '__world__';
const compact = text => text.replace(/\s+/g, ' ').trim();

async function publicAnnotations(uri) {
  const url = new URL('https://api.hypothes.is/api/search');
  url.search = new URLSearchParams({uri, group: publicGroup, limit: '200', sort: 'updated', order: 'asc'});
  const rows = [];
  while (true) {
    url.searchParams.set('offset', String(rows.length));
    const response = await fetch(url, {credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store'});
    if (!response.ok) throw Error('Hypothesis search failed: ' + response.status);
    const page = await response.json();
    if (!Array.isArray(page.rows)) throw Error('Invalid Hypothesis search response');
    rows.push(...page.rows);
    if (!page.rows.length || rows.length >= page.total) return rows.filter(row =>
      row.group === publicGroup && row.permissions?.read?.includes('group:' + publicGroup) &&
      typeof row.text === 'string' && row.text.trim() && !row.references?.length
    );
  }
}

// Index the reading once for quote matching and keep offsets tied to source nodes.
function indexReading(main) {
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const segments = [];
  let text = '';
  for (let node; (node = walker.nextNode());) {
    if (node.parentElement.closest('script, style, [hidden]')) continue;
    let piece = node.data.replace(/\s+/g, ' ');
    if (text.endsWith(' ') && piece.startsWith(' ')) piece = piece.slice(1);
    if (!piece) continue;
    segments.push({offset: text.length, element: node.parentElement});
    text += piece;
  }
  function elementAt(offset) {
    let left = 0, right = segments.length;
    while (left < right) {
      const middle = (left + right) >>> 1;
      if (segments[middle].offset <= offset) left = middle + 1;
      else right = middle;
    }
    return segments[left - 1]?.element;
  }
  return {text, elementAt};
}

function commentBlock(element) {
  let block = element?.closest('.comment-span');
  while (block && !block.classList.contains('comment-anchor')) {
    block = block.previousElementSibling;
    while (block?.matches('.source-anchor:empty')) block = block.previousElementSibling;
    if (!block?.classList.contains('comment-span')) return null;
  }
  return block;
}

function matchQuote(index, quote) {
  const exact = typeof quote.exact === 'string' ? compact(quote.exact) : '';
  if (!exact) return null;
  const prefix = typeof quote.prefix === 'string' ? quote.prefix.slice(-64).replace(/\s+/g, ' ') : '';
  const suffix = typeof quote.suffix === 'string' ? quote.suffix.slice(0, 64).replace(/\s+/g, ' ') : '';
  const candidates = new Map();
  const contextLength = (context, edge, fromEnd) => {
    for (let size = context.length; size > 0; size--) {
      if (fromEnd ? edge.endsWith(context.slice(-size)) : edge.startsWith(context.slice(0, size))) return size;
    }
    return 0;
  };
  for (let offset = index.text.indexOf(exact); offset >= 0; offset = index.text.indexOf(exact, offset + exact.length)) {
    const block = commentBlock(index.elementAt(offset));
    if (!block) continue;
    const end = offset + exact.length;
    const score = contextLength(prefix, index.text.slice(Math.max(0, offset - prefix.length), offset), true) +
      contextLength(suffix, index.text.slice(end, end + suffix.length), false);
    candidates.set(block, Math.max(score, candidates.get(block) ?? 0));
  }
  const ranked = [...candidates].sort((a, b) => b[1] - a[1]);
  return ranked.length && (ranked.length === 1 || ranked[0][1] > ranked[1][1]) ? ranked[0][0] : null;
}

// Hypothesis's structural selector also disambiguates repeated quotes.
function matchRange(main, selector, quote) {
  const {startContainer, endContainer, startOffset, endOffset} = selector;
  const path = /^(?:\/[a-z][a-z0-9-]*(?:\[[1-9]\d*\])?)+$/i;
  if (!path.test(startContainer) || !path.test(endContainer)) return null;
  const resolve = value => document.evaluate('.' + value, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
  const start = resolve(startContainer), end = resolve(endContainer);
  if (!main.contains(start) || !main.contains(end)) return null;
  function boundary(element, offset) {
    if (!Number.isSafeInteger(offset) || offset < 0) return null;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      if (offset <= node.length) return [node, offset];
      offset -= node.length;
    }
    return null;
  }
  const from = boundary(start, startOffset), to = boundary(end, endOffset);
  if (!from || !to) return null;
  const range = document.createRange();
  range.setStart(...from);
  range.setEnd(...to);
  const exact = compact(quote.exact);
  const actual = compact(range.toString());
  // In-page typesetting can change the middle of a quote between loads.
  const agrees = actual === exact || exact.length >= 48 &&
    actual.startsWith(exact.slice(0, 24)) && actual.endsWith(exact.slice(-24));
  return agrees ? commentBlock(from[0].parentElement) : null;
}

function appendText(element, text) {
  // Render only text and the supported math delimiters. KaTeX runs with trust off.
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g);
  for (const [index, part] of parts.entries()) {
    if (!part || index % 2 === 0) {
      element.append(part);
      continue;
    }
    const delimiters = part.startsWith('$$') || part.startsWith('\\') ? 2 : 1;
    const math = document.createElement('span');
    try {
      globalThis.katex.render(part.slice(delimiters, -delimiters), math, {
        macros: {...macros}, trust: false, maxExpand: 500, maxSize: 10,
        displayMode: part.startsWith('\\[') || part.startsWith('$$') && part.includes('\n'),
        throwOnError: true, strict: 'ignore',
      });
      element.append(math);
    } catch {
      element.append(part);
    }
  }
}

function commentCard(row, key) {
  const card = document.createElement('details');
  card.className = 'example-disclosure hypothesis-comment';
  card.dataset.exampleCard = 'hypothesis-' + row.id;
  card.dataset.exampleGroup = key;
  card.innerHTML = '<summary><span class="disclosure-chevron" aria-hidden="true"></span><span class="example-title">Comment</span><span class="note-author"></span></summary><div class="example-body" tabindex="0" role="region"></div>';
  const author = row.user_info?.display_name || (typeof row.user === 'string' ? row.user.match(/^acct:([^@]+)/)?.[1] : '') || 'Hypothesis';
  card.querySelector('.note-author').textContent = author;
  const body = card.querySelector('.example-body');
  body.setAttribute('aria-label', 'Comment by ' + author);
  let list;
  for (const paragraph of row.text.trim().split(/\r?\n\s*\r?\n/)) {
    list = null;
    const lines = paragraph.split(/\r?\n/);
    for (const [i, line] of lines.entries()) {
      const bullet = line.match(/^\s*[-*]\s+(.*)$/);
      if (bullet) {
        if (!list) {
          list = document.createElement('ul');
          body.append(list);
        }
        const item = document.createElement('li');
        appendText(item, bullet[1]);
        list.append(item);
      } else {
        list = null;
        const prose = body.lastElementChild;
        if (i && prose?.matches('p')) appendText(prose, '\n' + line);
        else {
          const p = document.createElement('p');
          appendText(p, line);
          body.append(p);
        }
      }
    }
  }
  const link = document.createElement('a');
  link.className = 'hypothesis-comment-link';
  link.href = 'https://hypothes.is/a/' + encodeURIComponent(row.id);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'View on Hypothesis';
  body.append(link);
  return card;
}

export async function loadHypothesisNotes(main) {
  const uri = new URL(location.pathname.replace(/index\.html$/, ''), location.origin).href;
  const rows = await publicAnnotations(uri);
  if (!rows.length) return [];
  const index = indexReading(main);
  return rows.flatMap(row => {
    if (typeof row.id !== 'string' || !/^[\w-]+$/.test(row.id)) return [];
    for (const target of row.target ?? []) {
      const quote = target.selector?.find(selector => selector.type === 'TextQuoteSelector');
      if (typeof quote?.exact !== 'string' || !quote.exact.trim()) continue;
      const range = target.selector.find(selector => selector.type === 'RangeSelector');
      const block = (range && matchRange(main, range, quote)) || matchQuote(index, quote);
      if (block) return [{id: row.id, block, card: key => commentCard(row, key)}];
    }
    return [];
  });
}
