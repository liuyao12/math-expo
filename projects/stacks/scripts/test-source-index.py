"""Regressions for source boundaries that affect prerequisite completeness."""
import tempfile
import unittest
from pathlib import Path
from stacks_source import index_source


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


if __name__ == '__main__':
    unittest.main()
