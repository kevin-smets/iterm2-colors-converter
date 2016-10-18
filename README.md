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
yarn install
```

### Download and convert

```
yarn run all
```

Or you can run them separately:

```
yarn run abstract
```

or

```
yarn run functional
```

The resulting files are stored in `./dist`

### Command line parameters

#### Abstract? Functional?

"Abstract" generates the variable names as they are defined in iTerm2. E.g. `ansi-0-color`.

"Functional" maps the abstract names to a more functional name: e.g. `ansi-0-color` maps to `black-normal`.