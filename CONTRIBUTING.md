# Contributing to Ulka

Ulka is an open source project, and contributions of any kind are welcome and appreciated. We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Issues

If you encounter a bug, please file a bug report. If you have a feature to request, please open a feature request. If you would like to work on an issue or feature, there is no need to request permission. Please add tests to any new features.

## Pull Requests

In order to create a pull request for `ulka`, follow the GitHub instructions for [Creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.

## Folder Structure

Description of the project files and directories.

```
📦ulka
 ┣ 📂@types
 ┃ ┗ 📜better-opn.d.ts
 ┣ 📂src
 ┃ ┣ 📂bin
 ┃ ┃ ┣ 📜build.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜serve.ts
 ┃ ┣ 📂data
 ┃ ┃ ┣ 📜configs.ts
 ┃ ┃ ┣ 📜mime-types.ts
 ┃ ┃ ┗ 📜plugins.ts
 ┃ ┣ 📂fs
 ┃ ┃ ┣ 📜all-files.ts
 ┃ ┃ ┣ 📜copy-assets.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜mkdir.ts
 ┃ ┃ ┗ 📜rmdir.ts
 ┃ ┣ 📂generate
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂source
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜md-source.ts
 ┃ ┃ ┗ 📜ulka-source.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📂cli-utils
 ┃ ┃ ┃ ┣ 📜create-project.ts
 ┃ ┃ ┃ ┣ 📜create-server.ts
 ┃ ┃ ┃ ┗ 📜line-print.ts
 ┃ ┃ ┣ 📂ulka-source-utils
 ┃ ┃ ┃ ┣ 📜$assets.ts
 ┃ ┃ ┃ ┗ 📜$import.ts
 ┃ ┃ ┣ 📜absolute-path.ts
 ┃ ┃ ┣ 📜generate-file-name.ts
 ┃ ┃ ┗ 📜unified-processor.ts
 ┃ ┣ 📜globalInfo.ts
 ┃ ┗ 📜index.ts
 ┣ 📂tests
 ┃  ┗ (...tests)
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.json
 ┣ 📜.gitignore
 ┣ 📜.npmignore
 ┣ 📜.prettierignore
 ┣ 📜.prettierrc
 ┣ 📜CHANGELOG.md
 ┣ 📜CONTRIBUTING.md
 ┣ 📜CODE_OF_CONDUCT.md
 ┣ 📜LICENSE
 ┣ 📜README.md
 ┣ 📜jest.config.js
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](./LICENSE).
