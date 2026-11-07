// Shared by the offline renderer and viewport typesetting.
export const macros={
 '\\Spec':'\\operatorname{Spec}', '\\CH':'\\operatorname{CH}',
 '\\Mor':'\\operatorname{Mor}', '\\Sh':'\\mathit{Sh}', '\\Sch':'\\mathit{Sch}',
 '\\SheafHom':'\\mathop{\\mathcal{H}\\!\\mathit{om}}\\nolimits',
 '\\SheafExt':'\\mathop{\\mathcal{E}\\!\\mathit{xt}}\\nolimits',
 '\\QCoh':'\\mathit{QCoh}', '\\NL':'\\mathop{N\\!L}\\nolimits',
 ...Object.fromEntries(['Hom','Ob','colim','Ker','Coker','Coim','Im','Ext','Pic'].map(name=>['\\'+name,'\\operatorname{'+name+'}']))
};
