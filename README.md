# itermcolors-converter

[![devDependency Status](https://david-dm.org/kevin-smets/itermcolors-converter/dev-status.svg)](https://david-dm.org/kevin-smets/itermcolors-converter#info=devDependencies)

Converts iTerm2 color schemes to variables for:

- JSON
- Sass / Scss
- Stylus
- Less

## Install dependencies

```
npm i
```

## Download and convert

```
npm run create
```

The resulting files are stored in `./dist`

## Command line parameters

### --functional

Creates the dist files with functional variable names. E.g. `ansi-0-color` maps to `black-normal`