# O2

[![CodeFactor](https://www.codefactor.io/repository/github/songkg7/o2/badge)](https://www.codefactor.io/repository/github/songkg7/o2)

Write once, convert to multiple platforms.

O2 is a tool that converts your Obsidian markdown files to other markdown platforms such as Jekyll. 

but, currently, it only supports Jekyll. I will add more platforms in the future.
If you have any suggestions, please let me know.

## Prerequisites

### Directory structure of your vault

you should have a directory structure like this. (you can change the directory names)

```
Your vault
├── ready (when you are ready to publish, move your files to this directory)
├── published (when you publish your files, they will be moved to this directory)
├── backlog (if the file is not ready, it will be moved to this directory)
└── resources (your resources should be placed here)
```

other directories will be ignored.

## Usage

if you want to convert your files, you should move them to the `ready` directory. then, run the following command `cmd + p` in Obsidian.

```
converting
```

## Supported platforms

### Jekyll

- chirpy

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
