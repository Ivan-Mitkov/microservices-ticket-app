module.exports = {
  //file change detections problem with next.js
  //tell webpack to pull code every 300 ms instead to watch for changes
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    REACT_APP_STRIPE_PUB_KEY:
      "pk_test_51HajPfLKqKY72FXroAhIwTf3CHtWZhrGLri7AG1OI3ikPiB1HlGeSDbZwmYXri22T4GKySTV1G87yL6dKM287i5k00132u5TBD",
  },
};
