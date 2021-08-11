const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssmin = require("gulp-cssmin");
const terser = require("gulp-terser");

const gulpTypescript = require("gulp-typescript");
const tsProject = gulpTypescript.createProject("./app/tsconfig.json");

const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const webpack = require("webpack-stream");
const path = require("path");
const flatten = require("gulp-flatten");
const htmlmin = require("gulp-htmlmin");
var del = require("del");
const webpackConfig = require("./webpack.config.js");

var argv = require("yargs").argv;
const mode = argv;

// SASS Task
const css = () => {
  return src(["app/src/sass/**/*.scss"])
    .pipe(flatten())
    .pipe(sass())
    .pipe(cssmin())
    .pipe(dest(mode.dev ? "app/src/css" : "app/dist/css"));
};

const cssLibs = () => {
  return src(["app/src/sass/libs/*.scss", "app/src/sass/libs/*.css"])
    .pipe(flatten())
    .pipe(sass())
    .pipe(cssmin())
    .pipe(dest(mode.dev ? "app/src/css/libs" : "app/dist/css/libs"));
};

// copy and minify html
const html = () => {
  return src("app/src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("app/dist"));
};

// Js task
const js = () => {
  return src("app/src/scripts/ts/**/*.ts")
    .pipe(gulpTypescript({}))
    .pipe(tsProject())
    .pipe(dest(mode.dev ? "app/src/scripts/js" : "./app/dist/scripts/js"))
    .pipe(webpack(webpackConfig("development")))
    .pipe(dest(mode.dev ? "app/src/scripts/js" : "./app/dist/scripts/js"));
};

const netlifyFunctions = () => {
  return src("app/src/.netlify/**/*.ts").pipe(dest("app/dist/.netlify/"));
};

// Hot reloading task with BrowserSync
const browsersyncServe = (cb) => {
  browserSync.init({
    server: {
      baseDir: "./app/src",
    },
  });
  cb();
};

const cleanDist = () => {
  return new Promise((resolve, reject) => {
    del.sync(["app/dist"]);
    resolve();
  });
};

const browsersyncReload = (cb) => {
  browserSync.reload();
  cb();
};

const copyAssets = () => {
  return src("app/src/assets/**/*.*").pipe(dest("app/dist/assets"));
};

const copyLibs = () => {
  return src("app/src/scripts/libs/**/*.js").pipe(
    dest("app/dist/scripts/libs")
  );
};

const copyLibsWithTs = () => {
  return src("app/src/js/libs/**/*.ts").pipe(dest("app/dist/libs"));
};

// reset sec
const resetSrc = () => {
  return new Promise((resolve, reject) => {
    del(["app/src/css/", "app/src/scripts/js/"]);
    resolve();
  });
};

const watchTask = () => {
  watch("app/src/*.html", browsersyncReload);
  watch(["app/src/**/*.ts"], series(js, browsersyncReload));
  watch(["app/src/**/*.scss"], series(css, browsersyncReload));
  watch("app/src/assets/**", series(browsersyncReload));
};

const ts = () => {
  return tsProject.src().pipe(tsProject()).js.pipe(dest("dist"));
};

// default task
exports.default = series(
  resetSrc,
  css,
  cssLibs,
  js,
  browsersyncServe,
  watchTask
);

exports.build = series(
  cleanDist,
  netlifyFunctions,
  html,
  css,
  cssLibs,
  js,
  copyLibs,
  copyAssets
);
