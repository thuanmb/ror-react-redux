/* eslint-disable no-console, global-require */

const fs = require('fs');
const del = require('del');
const ejs = require('ejs');
const webpack = require('webpack');

const tasks = new Map();

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.getLabel(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

//
// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => del(['my-project/public/assets/*', '!my-project/public/assets/.git'], { dot: true }));

//
// Build website and launch it in a browser for testing (default)
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  let startBrowserSync = true;
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  return run('clean').then(() => new Promise(resolve => {
    const bs = require('browser-sync').create();
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
    });
    compiler.plugin('done', stats => {
      // Generate index.html page
      const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
      const template = fs.readFileSync('./my-project/public/index.ejs', 'utf8');
      const render = ejs.compile(template, { filename: './my-project/public/index.ejs' });
      const output = render({ debug: true, bundle: `/assets/${bundle}` });
      fs.writeFileSync('./my-project/public/index.html', output, 'utf8');

      if (startBrowserSync) {
        startBrowserSync = false;
        bs.init({
          port: process.env.PORT || 3000,
          ui: false,
          server: {
            baseDir: './my-project/public',
            middleware: [
              webpackDevMiddleware,
              require('webpack-hot-middleware')(compiler),
              require('connect-history-api-fallback')(),
            ],
          },
        }, resolve);
      }
    });
  }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
