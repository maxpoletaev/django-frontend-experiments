var concat = require('gulp-concat')
  , stylus = require('gulp-stylus')
  , django = require('gulp-util-django');

var sources = {
  css: ['./static/blog/*.styl']
};

module.exports = function(project, gulp) {
  var app = new django.Application('blog', project);

  app.task('css', function() {
    app.src(sources.css)
      .pipe(stylus())
      .pipe(concat('styles.css'))
      .pipe(app.dest('static/blog/build'));
  });

  app.task('default', ['css']);
};
