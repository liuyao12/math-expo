"""Check published contents and exclusion of private filesystem metadata."""
from pathlib import Path
import os
import runpy
import tarfile
import tempfile

package = runpy.run_path(str(Path(__file__).with_name('package-pages.py')))['package']


def rejected(site, archive):
    try:
        package(site, archive)
    except ValueError:
        return
    raise AssertionError('An invalid publication artifact was accepted')


with tempfile.TemporaryDirectory(prefix='math-expo-package-') as directory:
    root = Path(directory)
    site = root / 'site'
    site.mkdir()
    (site / 'assets').mkdir()
    (site / 'empty').mkdir()
    contents = {'index.html': b'<html>Math Expo</html>', 'assets/style.css': b'body{}', '.nojekyll': b''}
    for name, value in contents.items():
        (site / name).write_bytes(value)
    if hasattr(os, 'setxattr'):
        try:
            os.setxattr(site / 'index.html', 'user.math_expo_private', b'private-filesystem-marker')
        except OSError:
            pass
    first, second = root / 'first.tar', root / 'second.tar'
    package(site, first)
    os.utime(site / 'index.html', (1234567890, 1234567890))
    package(site, second)
    assert first.read_bytes() == second.read_bytes(), 'Host timestamps changed the publication'
    assert b'private-filesystem-marker' not in first.read_bytes()
    with tarfile.open(first) as archive:
        assert {entry.name for entry in archive} == {'.', './assets', './empty', *('./' + name for name in contents)}
        for entry in archive:
            assert entry.isfile() or entry.isdir()
            assert (entry.uid, entry.gid, entry.mtime, entry.uname, entry.gname) == (0, 0, 0, '', '')
            assert not entry.pax_headers
            if entry.isfile():
                assert archive.extractfile(entry).read() == contents[entry.name.removeprefix('./')]
    (site / 'link').symlink_to('index.html')
    rejected(site, second)
    (site / 'link').unlink()
    os.link(site / 'index.html', site / 'hard-link')
    rejected(site, second)
    (site / 'hard-link').unlink()
    (site / '.DS_Store').write_bytes(b'platform metadata')
    rejected(site, second)
    rejected(site, site / 'nested.tar')

print('Validated publication contents, hidden files, deterministic archives, metadata removal, and rejection of links and platform files.')
