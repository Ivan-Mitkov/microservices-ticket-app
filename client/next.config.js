module.exports = {
  //file change detections problem with next.js
  //tell webpack to pull code every 300 ms instead to watch for changes
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
