# iterm2-colors-converter

[![devDependency Status](https://david-dm.org/kevin-smets/iterm2-colors-converter/dev-status.svg)](https://david-dm.org/kevin-smets/iterm2-colors-converter#info=devDependencies)

Converts iTerm2 color schemes to variables for:

- JSON
- Sass / Scss
- Stylus
- Less

The resulting files can be found over at [kevin-smets/iterm2colors](https://github.com/kevin-smets/iterm2-colors)

## Build it yourself

### Install dependencies

```
npm i
```

### Download and convert

```
npm run create
```

The resulting files are stored in `./dist`

### Command line parameters

#### --functional

Creates the dist files with functional variable names. E.g. `ansi-0-color` maps to `black-normal`.