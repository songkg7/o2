# O2

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/songkg7/O2)](https://github.com/songkg7/o2/releases)
[![CI](https://github.com/songkg7/o2/actions/workflows/ci.yml/badge.svg)](https://github.com/songkg7/o2/actions/workflows/node.js.yml)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/songkg7/o2/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/songkg7/o2/tree/main)
[![CodeFactor](https://www.codefactor.io/repository/github/songkg7/o2/badge)](https://www.codefactor.io/repository/github/songkg7/o2)
[![codecov](https://codecov.io/gh/songkg7/o2/branch/main/graph/badge.svg?token=AYQGNW0SWR)](https://codecov.io/gh/songkg7/o2)
[![GitHub license](https://img.shields.io/github/license/songkg7/O2)](https://github.com/songkg7/o2/blob/main/LICENSE)

Write once, convert to multiple platforms.

O2 is a tool that converts your Obsidian Markdown files to other Markdown platforms such as Jekyll.

But, currently, it only supports Jekyll. I will add more platforms in the future.
If you have any suggestions, please let me know.

## Prerequisites

### Structure of your vault

You should have a folder structure like this. (of course, you can change the folder names in settings)

```text
Your vault
├── ready (where the notes you want to convert are placed)
├── backup (where the original notes before converting are placed)
└── attachments (where the attachments are placed)
```

Other Folders will be ignored.

## Usage

If you want to convert your notes, you should move them to the `ready` Folder.

then, Execute the command `O2: convert to Jekyll Chirpy` via obsidian's `cmd + p` shortcut.

if exception occurs, you can see the original note in the `backup` folder.
(I will implement transactional functionally in the future,
so that you can see the original note in the `ready` folder when exception occurs.)

## Supported platforms

- Jekyll Chirpy

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to
change.

## License

This project is published under [MIT](https://choosealicense.com/licenses/mit/) license.
