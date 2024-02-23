# O2

[![CI](https://github.com/songkg7/o2/actions/workflows/ci.yml/badge.svg)](https://github.com/songkg7/o2/actions/workflows/node.js.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/songkg7/o2/badge)](https://www.codefactor.io/repository/github/songkg7/o2)
[![codecov](https://codecov.io/gh/songkg7/o2/branch/main/graph/badge.svg?token=AYQGNW0SWR)](https://codecov.io/gh/songkg7/o2)
[![Obsidian downloads](https://img.shields.io/badge/dynamic/json?logo=Obsidian&color=%238b6cef&label=downloads&query=o2.downloads&url=https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json)][community-plugin]

[community-plugin]: https://obsidian.md/plugins?id=o2

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

## How to use

If you want to convert your notes, you should move them to the `ready` Folder.

then, Execute the command `O2: convert to Jekyll Chirpy` via obsidian's `cmd + p` shortcut.

if exception occurs, you can see the original note in the `backup` folder.

## Supported platforms

### Jekyll Chirpy

#### Settings

```text
your jekyll project (ex: /Users/user1/Documents/GitHub/user1.github.io)
├── _posts (where the converted notes are placed)
└── assets
    └── img
        └── yyyy-MM-dd-title (where the attachments are placed. yyyy-MM-dd is replaced by the date of converting)
```

- jekyllPath is the path of your jekyll project (ex: /Users/user1/Documents/GitHub/user1.github.io).
- Attachments will be copied by the date under the `assets/img/<yyyy-MM-dd>` folder.
- Auto create folders: If enabled, the plugin will automatically create the necessary folders if they do not exist. You can toggle this setting in the plugin settings tab.

#### Syntax

| Feature              | Obsidian (AS-IS)                | Jekyll Chirpy (TO-BE)                                                                  | Description                                        |
|----------------------|---------------------------------|----------------------------------------------------------------------------------------|----------------------------------------------------|
| Wiki link            | [[What is Obsidian?]]           | What is Obsidian?                                                                      |
| Image                | ![[NewJeans.png]]               | `![image](/assets/img/<yyyy-MM-dd>-<title>/NewJeans.png)`                              | `yyyy-MM-dd` is replaced by the date of converting |
| Resize image (width) | ![[NewJeans.png&#124;100]]      | `![image](/assets/img/<yyyy-MM-dd>-<title>/NewJeans.png){: width="100" }`              |
| Resize image (w & h) | ![[NewJeans.png&#124;100x200]]  | `![image](/assets/img/<yyyy-MM-dd>-<title>/NewJeans.png){: width="100" height="200" }` |
| Embeds               | ![[Obsidian#This is Obsidian!]] | Obsidian                                                                               |
| Comments             | %% This is a comment %%         | `<!-- This is a comment -->`                                                           |
| Footnotes            | [^1]                            | `[^fn-nth-1]`                                                                          | Currently, only supports the simple syntax         |
| Curly braces         | {{ content }}                   | `{% raw %}{{ content }}{% endraw %}`                                                   | Optional                                           |

Grammars not in the table are ignored. If there is a syntax you would like to convert, please let me know in an
issue.

## Plugins that work well together

- [imgur](https://github.com/gavvvr/obsidian-imgur-plugin): Recommanded
- [Update frontmatter time on edit](https://github.com/beaussan/update-time-on-edit-obsidian)

## Contributing

Pull requests are always welcome! For major changes, please open an issue(or discussion) first to discuss what you would like to
change.

For the detailed information about building and developing O2,
please visit [Obsidian Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin).

## Articles

- [O2 plugin 개발하기](https://songkg7.github.io/posts/develop-obsidian-plugin/)
- [Obsidian 플러그인 오픈소스 기여하기](https://l2hyunn.github.io/posts/Obsidian-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%98%A4%ED%94%88%EC%86%8C%EC%8A%A4-%EA%B8%B0%EC%97%AC%ED%95%98%EA%B8%B0/)

Welcome to write articles about O2!

## License

This project is published under [MIT](https://choosealicense.com/licenses/mit/) license.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V8KX38Q)

