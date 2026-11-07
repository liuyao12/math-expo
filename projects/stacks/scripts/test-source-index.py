"""Regressions for source boundaries that affect prerequisite completeness."""
import tempfile
import unittest
from pathlib import Path
from stacks_source import index_source
from dependency_plan import plan


class SourceBoundaries(unittest.TestCase):
    def parse(self, text, labels):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)
            (source / 'test.tex').write_text(text)
            tags = {'test-' + label: tag for label, tag in labels.items()}
            return index_source(source, [dict(slug='test', number=1)], tags)

    def test_proof_after_prose_and_second_proof(self):
        _, nodes, _ = self.parse(r'''
\section{Setup}\label{section-setup}
\begin{definition}\label{definition-a}An object.\end{definition}
\begin{lemma}\label{lemma-result}A result.\end{lemma}
An explanation before the proof.
\begin{proof}Use Definition \ref{definition-a}.\end{proof}
\begin{proof}[Another proof]Again use \ref{definition-a}.\end{proof}
\begin{remark}\label{remark-later}See \ref{section-setup}.\end{remark}
''', {'section-setup': '0001', 'definition-a': '0002', 'lemma-result': '0003', 'remark-later': '0004'})
        self.assertEqual(nodes['0003']['uses'], ['0002'])
        self.assertEqual(nodes['0003']['text'].count('\\begin{proof}'), 2)
        self.assertNotIn('remark-later', nodes['0003']['text'])

    def test_unnumbered_definition_and_labelled_items(self):
        sections, nodes, _ = self.parse(r'''
\section{Grading}\label{section-grading}
A graded object is defined here, in prose.
\begin{enumerate}
\item\label{item-one}See \ref{definition-a}.
\begin{enumerate}\item See \ref{definition-b}.\end{enumerate}
\item\label{item-two}See \ref{definition-b}.
\end{enumerate}
\begin{definition}\label{definition-a}First.\end{definition}
\begin{definition}\label{definition-b}Second.\end{definition}
''', {'section-grading': '0001', 'item-one': '0002', 'item-two': '0003', 'definition-a': '0004', 'definition-b': '0005'})
        self.assertEqual(nodes['0002']['uses'], ['0004', '0005'])
        self.assertEqual(nodes['0003']['uses'], ['0005'])
        self.assertNotIn('First.', nodes['0003']['text'])
        self.assertIn('defined here, in prose', nodes['0001']['text'])
        self.assertIn('definition-b', sections['0001']['text'])

    def test_owner_section_does_not_expand_its_context(self):
        sections, nodes, refs = self.parse(r'''
\section{Context}\label{section-context}
An introductory example uses \ref{lemma-unrelated}.
\begin{lemma}\label{lemma-target}Use \ref{lemma-needed}.\end{lemma}
\begin{lemma}\label{lemma-side}Use \ref{lemma-unrelated}.\end{lemma}
\section{Needed}\label{section-needed}
\begin{lemma}\label{lemma-needed}Required fact.\end{lemma}
\section{Unrelated}\label{section-unrelated}
\begin{lemma}\label{lemma-unrelated}Context only.\end{lemma}
''', {'section-context':'0001','lemma-target':'0002','lemma-side':'0003',
      'section-needed':'0004','lemma-needed':'0005','section-unrelated':'0006','lemma-unrelated':'0007'})
        tags = {key: ref['tag'] for key, ref in refs.items()}
        result = plan('0002', nodes, sections, tags, {})
        self.assertEqual(result['required_tags'], ['0002', '0005'])
        self.assertEqual(result['required_sections'], ['0001', '0004'])
        self.assertIn('lemma-side', sections['0001']['text'])

    def test_only_selected_prose_generates_dependencies(self):
        sections, nodes, refs = self.parse(r'''
\section{Prose}\label{section-prose}
A germ is defined using \ref{lemma-needed}.
An extra example uses \ref{lemma-unrelated}.
\section{Target}\label{section-target}
\begin{lemma}\label{lemma-target}Use \ref{section-prose}.\end{lemma}
\section{Needed}\label{section-needed}
\begin{lemma}\label{lemma-needed}Required fact.\end{lemma}
\section{Extra}\label{section-extra}
\begin{lemma}\label{lemma-unrelated}Context only.\end{lemma}
''', {'section-prose':'0001','section-target':'0002','lemma-target':'0003',
      'section-needed':'0004','lemma-needed':'0005','section-extra':'0006','lemma-unrelated':'0007'})
        tags = {key: ref['tag'] for key, ref in refs.items()}
        with self.assertRaisesRegex(ValueError, 'Review the referenced section'):
            plan('0003', nodes, sections, tags, {})
        scope = {'passage_scopes': {'0001': dict(part='fragments',
                 fragments=[{'from':'A germ is defined', 'to':'An extra example'}],
                 reason='The germ definition is required; the example is context.')}}
        result = plan('0003', nodes, sections, tags, scope)
        self.assertEqual(result['required_tags'], ['0001', '0003', '0005'])
        self.assertEqual(result['paths']['0005'], ['0003', '0001'])
        self.assertIn('lemma-unrelated', sections['0001']['text'])

    def test_usage_in_one_target_does_not_hide_later_requirements(self):
        sections, nodes, refs = self.parse(r'''
\section{Shared}\label{section-shared}
\begin{lemma}\label{lemma-shared}See \ref{lemma-extra}.\end{lemma}
\section{Targets}\label{section-targets}
\begin{lemma}\label{lemma-first}Use \ref{lemma-shared}.\end{lemma}
\begin{lemma}\label{lemma-second}Use \ref{lemma-shared}.\end{lemma}
\section{Extra}\label{section-extra}
\begin{lemma}\label{lemma-extra}Needed for the second usage.\end{lemma}
''', {'section-shared':'0001','lemma-shared':'0002','section-targets':'0003',
      'lemma-first':'0004','lemma-second':'0005','section-extra':'0006','lemma-extra':'0007'})
        tags = {key: ref['tag'] for key, ref in refs.items()}
        scope = {'target_excluded_edges': {'0004': {'0002:0007':'Only another assertion uses this fact.'}}}
        self.assertNotIn('0007', plan('0004', nodes, sections, tags, scope)['required_tags'])
        self.assertIn('0007', plan('0005', nodes, sections, tags, scope)['required_tags'])


if __name__ == '__main__':
    unittest.main()
