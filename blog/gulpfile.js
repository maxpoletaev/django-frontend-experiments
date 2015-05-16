var concat = require('gulp-concat')
  , stylus = require('gulp-stylus')
  , django = require('gulp-django');

module.exports = function(project) {
  var app = new django.Application('blog', project);

  var sources = {
    css: ['static/blog/*.styl']
  };

  app.task('css', function() {
    app.src(sources.css)
      .pipe(stylus())
      .pipe(concat('blog.css'))
      .pipe(project.dest('static/build'));
  });

  app.task('watch', function() {
    app.watch(sources.css, ['css']);
  });

  app.task('default', ['css']);
};
