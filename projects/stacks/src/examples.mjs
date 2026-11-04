export function exampleFor(section,block,index){
  const mapping={
    'definition-locally-ringed-space':'stalks',
    'lemma-isomorphism-locally-ringed':'isomorphisms',
    'lemma-glue-maps':'sheaf-maps',
    'lemma-glue-sheaves':'compatible-sections',
    'lemma-glue-sheaves-structures':'operations',
    'lemma-mapping-property-glue':'uniqueness',
    'lemma-glue':'quotient',
    'lemma-glue-schemes':'scheme',
    'example-affine-space-zero-doubled':'double-origin',
    'example-projective-line':'global-functions'
  };
  if(mapping[block.label])return mapping[block.label];
  if(section.slug==='local-functions')return index===0?'local-functions':'pullback';
  if(section.slug==='gluing-sheaves')return index===0?'sheaf-maps':index>6?'maps':'transitions';
  return 'charts';
}
