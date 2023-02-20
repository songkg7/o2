# O2

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/songkg7/O2)]()
[![CI](https://github.com/songkg7/o2/actions/workflows/node.js.yml/badge.svg)](https://github.com/songkg7/o2/actions/workflows/node.js.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/songkg7/o2/badge)](https://www.codefactor.io/repository/github/songkg7/o2)
[![GitHub license](https://img.shields.io/github/license/songkg7/O2)](https://github.com/songkg7/o2/blob/main/LICENSE)

Write once, convert to multiple platforms.

O2 is a tool that converts your Obsidian markdown files to other markdown platforms such as Jekyll. 

But, currently, it only supports Jekyll. I will add more platforms in the future.
If you have any suggestions, please let me know.

## Prerequisites

### Directory structure of your vault

You should have a directory structure like this. (you can change the directory names)

```
Your vault
├── ready (when ready to publish, move your files to this directory)
├── published (when publish your files, they will be moved to this directory)
├── backlog (if the file is not ready or throw exception during convert process, it will be moved to this directory)
└── resources (your resources should be placed here)
```

Other directories will be ignored.

## Usage

If you want to convert your files, you should move them to the `ready` directory.

then, Execute the command `O2: converting` via obsidian's `cmd + p` shortcut.

### Limitations

- resource file name must not contain spaces
- backlog feature is not implemented yet

## Supported platforms

### Jekyll

- Chirpy

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is published under [MIT](https://choosealicense.com/licenses/mit/) license.
