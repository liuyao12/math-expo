// Endpoint pairs transcribed from Euler's Plate VIII, not inferred from the example route.
export const sevenBridges=[
 {id:'a',ends:['A','B']},{id:'b',ends:['A','B']},
 {id:'c',ends:['A','C']},{id:'d',ends:['A','C']},
 {id:'e',ends:['A','D']},{id:'f',ends:['B','D']},{id:'g',ends:['C','D']},
];
export const fifteenBridges=[
 {id:'a',ends:['E','F']},{id:'b',ends:['B','F']},{id:'c',ends:['B','F']},
 {id:'d',ends:['A','F']},{id:'e',ends:['A','F']},{id:'f',ends:['C','F']},
 {id:'g',ends:['A','C']},{id:'h',ends:['A','C']},{id:'i',ends:['C','D']},
 {id:'k',ends:['A','D']},{id:'l',ends:['D','E']},{id:'m',ends:['A','E']},
 {id:'n',ends:['A','E']},{id:'o',ends:['B','E']},{id:'p',ends:['A','B']},
];
export const printedRoute={regions:['E','F','B','F','A','F','C','A','C','D','A','E','A','B','E','D'],bridges:['a','b','c','d','e','f','g','h','i','k','m','n','p','o','l']};
export function incidenceCounts(bridges){const counts={};for(const {ends} of bridges)for(const r of ends)counts[r]=(counts[r]??0)+1;return counts;}
