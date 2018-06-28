var gulp = require("gulp"),
  sass = require("gulp-sass"),
  rename = require("gulp-rename"),
  cssmin = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  jshint = require("gulp-jshint"),
  scsslint = require("gulp-sass-lint"),
  cache = require("gulp-cached"),
  prefix = require("gulp-autoprefixer"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  minifyHTML = require("gulp-minify-html"),
  size = require("gulp-size"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  plumber = require("gulp-plumber"),
  notify = require("gulp-notify"),
  injectPartials = require("gulp-inject-partials"),
  useref = require("gulp-useref"),
  replace = require('gulp-replace'),
  dom  = require('gulp-dom'),
  gutil = require('gulp-util');

gulp.task("scss", function() {
  var onError = function(err) {
    notify.onError({
      title: "Gulp",
      subtitle: "Failure!",
      message: "Error: <%= error.message %>",
      sound: "Beep"
    })(err);
    this.emit("end");
  };

  return gulp
    .src("scss/main.scss")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(rename("main.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(reload({ stream: true }))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "dist/"
    }
  });
});

gulp.task("js", function() {
  gulp
    .src("js/*.js")
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest("dist/js"))
    .pipe(reload({ stream: true }));
});

gulp.task("scss-lint", function() {
  gulp
    .src("scss/**/*.scss")
    .pipe(cache("scsslint"))
    .pipe(scsslint());
});

gulp.task("minify-html", ["html-strip"], function() {
  var opts = {
    comments: true,
    spare: true
  };

  gulp
    .src("./dist/*.html")
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest("dist/"))
    .pipe(rename({
      extname: ""
    }))
    .pipe(gulp.dest("./dist"))
    .pipe(reload({ stream: true }));
});

gulp.task("min-js", function() {
  gulp
    .src("dist/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});


gulp.task("min-js-error", function() {
    gulp
      .src("dist/js/*.js")
      .pipe(uglify())
      .on('error', function(err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
      .pipe(gulp.dest("dist/js"));
});


gulp.task("jshint", function() {
  gulp
    .src("js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task("watch", function() {
  gulp.watch("scss/**/*.scss", ["scss-lint", "scss"]);
  gulp.watch("js/*.js", ["jshint", "index", "js"]);
  gulp.watch("./**/*.html", ["index"]);
  gulp.watch("img/**/*", ["imgmin", "videos"]);
});

gulp.task("imgmin", function() {
  return gulp
    .src("img/*")
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
      })
    )
    .pipe(gulp.dest("dist/img"));
});

gulp.task("videos", function() {
  return gulp.src("video/**").pipe(gulp.dest("dist/video"));
});

gulp.task("fonts", function() {
  return gulp.src("fonts/*").pipe(gulp.dest("dist/fonts"));
});


gulp.task("index", function() {
  return gulp
    .src("html/*.html")
    .pipe(
      injectPartials({
        removeTags: true,
        start: "{% include {{path}}",
        end: " %}"
      })
    )
    .pipe(
      useref({
        searchPath: "./"
      })
    )
    .pipe(reload({ stream: true }))
    .pipe(gulp.dest("./dist"));
});


gulp.task("html-strip", function() {
  return gulp
    .src("./dist/*.html")
    .pipe(dom(function(){
        var links = this.querySelectorAll('header.header a, footer.footer a');
        [...links].forEach(function(link) {
          var url = link.getAttribute("href");
          if(url) {
            var newUrl = url.replace('.html', '');
            link.setAttribute('href', newUrl);
          }
        });
        return this;
    }))
    .pipe(gulp.dest("./dist"));
});


gulp.task("default", [
  "browser-sync",
  "imgmin",
  "fonts",
  "videos",
  "index",
  "js",
  "scss",
  "watch"
]);
gulp.task("prod", ["min-js", "minify-html"]);
