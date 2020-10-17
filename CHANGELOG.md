# Changelog

## v0.6.0 - v0.6.1

- Used remarkable to parser markdown.
- Build logic changed.
  - collect data.
  - render to html.
  - generate html files.
  - copy assets.
- Hash function changed to use sha1.
- Async support removed.
- Build speed increased.
- Plugins logic changed.
- Commands changed.
  - serve: serve already built files.
  - develop: built, serve and watch.
  - create: create new project.
- starter template verification before creating new project.

## v0.5.3

- ulka-parser -> 0.3.1
- await the content generate.

## v0.5.2

- globalInfo is exported from index file.
- Better name for functions

## v0.5.1

- Support relative images in markdown.
- Support ulka syntax in markdown.
- Use relative image path for generating hash.
- Bug fixes.

## v0.5.0

- Source class added
  - UlkaSource
  - MdSource
- Removed `$importUlka`
- Added new function `$import`
  - Returns base64 from images.
  - Returns transformed html from ulka and markdown
- [name].ulka.[ext] files are ignored and aren't copied to build directory.
- Complete build on file change (live-server)
- Plugins can modify the arguements provided.
- pagesPath is made optional.
- Jest codecoverage setup and added more tests.
- Refactored code.

## v0.4.2

- Removed remarkable from project. Now ulka uses unifiedjs ecosystem to parse markdown to html.
- Refactored code.
- Support for remark and rehype plugins.

## v0.4.1

- Made plugin more flexible. Plugins now accepts
  - string (package name)
  - function
  - Object with key of resolve and options.
- Build speed increased
- Added mimeTypes for `xml`
- Migrated to typescript
- Upgraded ulka-parser

## v0.4.0

- Implemented plugin system.
- Preparse, postParse, parseFrontMatter supoprt removed.
- Contents folder now accepts both object and array
- Refactored code.

## v0.3.9

- Option to provide default port
- Create command to generate ulka project (deprecated `npx create-ulka-app`)
  ```
  npx ulka create project_name
  ```
- Content files data made available to templates.

## v0.3.8

- Open browser on serving.
- Better logs.

## v0.3.7

- Whole project isn't built when static files changes.
- Error logging improved

## v0.3.6

- Set default base for ulka-parser to cwd.
- Better logs.

## v0.3.3 - v0.3.5

- Generate available port to serve files if asked is already in use
- Update ulka-parse (promises support)
- Relative path supported (Removed absolute path support) in `$importUlka`, `$assets` and in `url` (css).

## v0.2.7 - v0.3.2

- `url(path)` in css transformed to the path in `__assets__` folder.
- Change `.ucss` to `.css`
- Write `ulka` syntax inside `.ucss` file
- Fix `link` value in `contentFiles`

## v0.2.3 - v0.2.6

- Don't reload whole browser for css change. Reload css only.
- Use buildPath from configs intead of static path
- Use `fs.promises` instead of `fs/promises`
- Serving before building fixed.

## v0.2.2

- Server created from scratch to serve build files
- Live reload on change

## v0.2.1

- Import ulka from another file using `$importUlka`
- List of contents generated available in pages `.ulka` files.

## v0.2.0

- Image support in markdown
- Ulka syntax support in markdown

## v0.1.1

- import assets from ulka files

```html
<link rel="stylesheet" href="{% assets('/src/.../style.css') %}" />
```

- Assets are placed in one folder `__assets__` and name is generated using crypto module.

## v0.1.0

### First release

```
npx ulka build
```
