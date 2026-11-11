export function createLeanSchemeGraph({sectionForTag, references}, reading, trace) {
  const byTag = new Map(Object.values(references).map(ref => [ref.tag, ref]));
  const selected = new Set(reading.sections.map(section => section.tag));
  const nodes = {};
  const locations = new Map();
  const groups = new Map();
  const labels = {definitions: {}, namedResults: {}, itemTerms: {}};
  for (const [tag, node] of Object.entries(trace.nodes)) {
    const section = sectionForTag.get(tag);
    if (!section || !byTag.has(tag)) {
      throw Error('Missing Stacks source location for Lean graph node ' + tag);
    }
    nodes[tag] = {title: node.title, uses: Object.keys(node.uses)};
    if (selected.has(section.tag)) locations.set(tag, {slug: reading.slug, readingTitle: reading.readingTitle, section});
    if (!selected.has(section.tag)) continue;
    if (!groups.has(section.tag)) groups.set(section.tag, []);
    groups.get(section.tag).push(tag);
    labels.definitions[tag] = node.title;
    labels.namedResults[tag] = node.title;
    labels.itemTerms[tag] = node.title;
  }
  for (const [tag, members] of groups) {
    const itemsOnly = members.every(member => ['item', 'equation'].includes(byTag.get(member).kind));
    if ((members.length < 2 && !itemsOnly) || nodes[tag]) continue;
    const section = sectionForTag.get(tag);
    nodes[tag] = {title: section.title, frameOnly: true, uses: []};
    locations.set(tag, {slug: reading.slug, readingTitle: reading.readingTitle, section});
  }
  return {
    nodes, locations, labels, rootTag: trace.target,
    passages: Object.keys(trace.nodes).length,
    sections: groups.size
  };
}
