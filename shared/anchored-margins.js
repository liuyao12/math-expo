(() => {
  'use strict';

  // Entries are in text order, with tops measured in the same viewport.
  function sectionSpans(entries) {
    const bottoms = new Map();
    return entries.map((entry, index) => {
      const { section, top } = entry;
      if (!bottoms.has(section)) bottoms.set(section, section.getBoundingClientRect().bottom);
      const next = entries[index + 1];
      const bottom = next?.section === section
        ? Math.min(bottoms.get(section), next.top)
        : bottoms.get(section);
      return { ...entry, height: Math.max(0, bottom - top) };
    });
  }

  function mount({ root, items, media, scroller, header }) {
    if (!items.length) return () => {};
    const desktop = matchMedia('screen and ' + media);
    const entries = items.map(({ anchor, section, content }) => {
      const slot = document.createElement('div');
      const band = document.createElement('div');
      const card = document.createElement('div');
      slot.className = 'anchored-margin-slot';
      band.className = 'anchored-margin-band';
      card.className = 'anchored-margin-card';
      content.before(slot);
      slot.append(band);
      band.append(card);
      card.append(content);
      return { anchor, section, content, slot, band, card };
    });

    let frame = 0;
    function layout() {
      frame = 0;
      root.classList.toggle('anchored-margins', desktop.matches);
      if (!desktop.matches) {
        for (const { card } of entries) card.removeAttribute('tabindex');
        return;
      }
      const inset = (header?.getBoundingClientRect().height ?? 0) + 12;
      const viewport = scroller?.clientHeight ?? innerHeight;
      const padding = scroller ? parseFloat(getComputedStyle(scroller).paddingTop) : 0;
      const measured = entries.map(entry => ({
        ...entry,
        top: entry.anchor.getBoundingClientRect().top,
        slotTop: entry.slot.getBoundingClientRect().top,
      }));
      root.style.setProperty('--anchored-margin-inset', inset + 'px');
      root.style.setProperty('--anchored-margin-viewport', Math.max(0, viewport - padding - inset - 12) + 'px');
      for (const { band, top, slotTop, height } of sectionSpans(measured)) {
        band.style.setProperty('--anchored-margin-offset', top - slotTop + 'px');
        band.style.setProperty('--anchored-margin-span', height + 'px');
      }
      for (const { card } of entries) {
        if (card.scrollHeight > card.clientHeight) card.tabIndex = 0;
        else card.removeAttribute('tabindex');
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(layout); };
    const observer = new ResizeObserver(schedule);
    const sections = new Set(entries.map(({ section }) => section));
    for (const element of [root, ...sections, header, scroller].filter(Boolean)) observer.observe(element);
    for (const { content } of entries) observer.observe(content);
    desktop.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    layout();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      desktop.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      root.classList.remove('anchored-margins');
      for (const { slot, content } of entries) slot.replaceWith(content);
    };
  }

  window.MathExpoMargins = { sectionSpans, mount };
})();
