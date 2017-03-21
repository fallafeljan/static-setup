#!/usr/bin/env node

/* eslint-disable no-console */
var {spawnSync} = require('child_process');
var {readFileSync, writeFileSync} = require('fs');

const packages = [
  'webpack',
  'webpack-dev-server',
  'babel-core',
  'babel-eslint',
  'babel-polyfill',
  'babel-preset-es2015',
  'babel-preset-stage-0',
  'babel-loader',
  'eslint',
  'css-loader',
  'style-loader',
  'html-loader',
  'file-loader',
  'url-loader',
  'html-webpack-plugin',
  'extract-text-webpack-plugin',
  'script-ext-html-webpack-plugin'
];

let moduleConfig

function exit(statusCode = 1) {
  console.log();
  process.exit(statusCode);
}

function loadConfig(configPath) {
  const stringConfig = readFileSync(configPath, 'utf-8');
  const parsedConfig = JSON.parse(stringConfig);

  return parsedConfig;
}

try {
  moduleConfig = loadConfig('./package.json');
} catch (err) {
  console.log('🔥  No `package.json` found, creating...');

  const {status} = spawnSync('yarn', ['init'], {
    stdio: 'inherit'
  });

  if (status !== 0) {
    console.log();
    exit(1);
  } else {
    moduleConfig = loadConfig('./package.json');
  }
}

const existingScripts = moduleConfig.scripts || {};

const scripts = {
  'build': 'rm -rf public/*; NODE_ENV=production webpack --progress',
  'lint': 'eslint --ignore-path .gitignore .',
  'dev': 'webpack-dev-server --progress'
};

const injectedModuleConfig = Object.assign({}, moduleConfig, {
  scripts: Object.assign({}, existingScripts, scripts)
});

writeFileSync(
  './package.json',
  JSON.stringify(injectedModuleConfig, null, 2)
);

console.log(
  '💉  Wrote scripts.\n' +
  '📦  Installing packages...'
);

const {status} = spawnSync('yarn', ['add', '--dev'].concat(packages), {
  stdio: 'inherit',
})

if (status !== 0) {
  exit();
}

console.log('🙅  Fixing `.gitignore`...');

const ignoreList = readFileSync('./.gitignore', 'utf-8');
const fixedList = ignoreList.substring(0, ignoreList.indexOf('#') - 1);
writeFileSync('./.gitignore', fixedList);

console.log('⛰  Done.');
