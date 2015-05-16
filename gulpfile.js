var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , concat = require('gulp-concat')
  , django = require('gulp-util-django');

var apps = [
  'blog'
];

var project = new django.Project(gulp, apps, __dirname);
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

project.task('watch', ['css', 'js'], function() {
  project.watch(sources.app.css, ['css']);
  project.watch(sources.app.js, ['js']);
});

project.task('default', ['css', 'js']);
