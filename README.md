# npm-scripts

Run your npm scripts more efficiently

[![NPM](https://nodei.co/npm/npm-scripts.png?downloads=true&stars=true)](https://nodei.co/npm/npm-scripts/)

## Usage

```
npm install -g npm-scripts
```

Now in a project directory, where you have your `package.json`, run `ns`:

```
$ ns
? Select a package.json script command to run, e.g. npm run [command]. (Use arrow keys)
❯ start
  install
  test
  test-debug
  nightwatch
  sauce
  static
(Move up and down to reveal more choices)
```

_The above is just example output._

You can also use `ns [command]` as a shortcut. So something like this:

```
ns install
ns build
ns start
```

This also works with the beginning of the command like `ns i` for `ns install`.

For available options, use `ns -h`.
