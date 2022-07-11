import gulp from "gulp";
import less from "gulp-less";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import babel from "gulp-babel";
import del from "del";
import concat from "gulp-concat";
import browserSync from "browser-sync";
import pug from "gulp-pug";
import { join } from "path";

browserSync.create();

const path = {
  styles: {
    src: "src/styles/styles.less",
    dest: "dest/styles",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dest/js",
  },
  html: {
    src: "src/html/index.pug",
    dest: "dest",
  },
};

function clean() {
  return del(["dest"]);
}

function html() {
  return gulp.src(path.html.src).pipe(pug()).pipe(gulp.dest(path.html.dest));
}

function styles() {
  return gulp
    .src(path.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.styles.dest));
}

function js() {
  return gulp
    .src(
      ["app.js", "common.js", "index.js"].map((script) =>
        join("src/js", script)
      )
    )
    .pipe(concat("index.js"))
    .pipe(babel())
    .pipe(gulp.dest(path.scripts.dest));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dest",
    },
  });

  gulp.watch(path.scripts.src, js);
  gulp.watch(path.styles.src, styles);
  gulp.watch(path.html.src, html);
  gulp.watch("dist/**/*").on("change", browserSync.reload);
}

const build = gulp.series(clean, gulp.parallel(js, styles, html));
const serveWatch = gulp.series(clean, gulp.parallel(js, styles, html), serve);

export { serveWatch as serve };
export default build;
