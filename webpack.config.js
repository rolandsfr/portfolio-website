const path = require("path");

module.exports = function (mode) {
  return {
    mode,
    output: {
      filename: "./main.js",
      path: path.resolve(
        __dirname,
        mode.dev ? "app/src/scripts/js" : "./app/dist/js"
      ),
    },
    module: {
      rules: [{ test: /\.css$/, use: "css-loader" }],
    },
  };
};
