"""Package the built website without host ownership, timestamps, or xattrs."""
from pathlib import Path
import argparse
import stat
import tarfile


def package(site, destination):
    site = Path(site).resolve()
    destination = Path(destination).resolve()
    if not site.is_dir() or destination.is_relative_to(site):
        raise ValueError('Use a site directory and an archive outside that directory')
    entries = [site, *sorted(site.rglob('*'))]
    for path in entries:
        attributes = path.lstat()
        if not (stat.S_ISDIR(attributes.st_mode) or stat.S_ISREG(attributes.st_mode)):
            raise ValueError('Site artifacts must contain only regular files and directories')
        if stat.S_ISREG(attributes.st_mode) and attributes.st_nlink != 1:
            raise ValueError('Hard links are not supported in site artifacts')
        if path.name == '.DS_Store' or path.name.startswith('._'):
            raise ValueError('Remove platform metadata from the website directory')
    with tarfile.open(destination, 'w', format=tarfile.PAX_FORMAT) as archive:
        for path in entries:
            relative = path.relative_to(site)
            info = tarfile.TarInfo('.' if path == site else './' + relative.as_posix())
            info.uid = info.gid = info.mtime = 0
            info.uname = info.gname = ''
            if path.is_dir():
                info.type, info.mode = tarfile.DIRTYPE, 0o755
                archive.addfile(info)
            else:
                info.type, info.mode = tarfile.REGTYPE, 0o644
                info.size = path.stat().st_size
                with path.open('rb') as content:
                    archive.addfile(info, content)
    return len(entries)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('site')
    parser.add_argument('archive')
    args = parser.parse_args()
    print(f'Packaged {package(args.site, args.archive)} website entries without host metadata.')
