var django = require('gulp-django-utils')
  , stylus = require('gulp-stylus')
  , concat = require('gulp-concat');

var apps = [
  'blog'
];

var project = new django.Project(apps);
project.discoverApps();

var sources = {
  app: {
    js: ['./static/scripts/*.js'],
    css: ['./static/styles/*.styl']
  }
};

project.task('css', function() {
  project.src(sources.app.css)
    .pipe(stylus())
    .pipe(concat('bundle.css'))
    .pipe(project.dest('./static/build'));
});

project.task('js', function() {
  project.src(sources.app.js)
    .pipe(concat('bundle.js'))
    .pipe(project.dest('./static/build'));
});

project.task('watch', function() {
  project.watch(sources.app.css, ['css']);
  project.watch(sources.app.js, ['js']);
});

project.task('default', ['css', 'js']);
