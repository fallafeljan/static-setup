# Jan's Static Setup

This is a simple setup for building websites that emit static assets, i.e., a
SPA using [React](https://facebook.github.io/react/), built with
[Webpack](https://webpack.js.org/). Several configurations are provided
(`webpack.config.js`, `.babelrc`, …), and dependencies are added via
`yarn add …` without a lockfile.

For setup, perform the following steps:

1. Get the files of this repo, preferably without the `.git` folder:
  `git archive --format=tar --remote=<repository URL> HEAD | tar xf -`
2. Perform installation: `./install.js`

After setting up, the following commands are at your hands:

* `yarn start` Spawn a local development server
* `yarn run build` Build all static assets into (see `public/`)
