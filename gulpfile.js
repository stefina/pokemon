var gulp = require('gulp');
var gls = require('gulp-live-server');
 
gulp.task('serve', function() {
    //1. run your script as a server 
    var server = gls.new('app.js');
    server.start();

    gulp.watch(['public/styles/*.styl', 'app/views/**/*.jade', 'app/controllers/*.js', 'app/models/*.js'], server.notify);
    gulp.watch('app.js', server.start); //restart my server 
});

gulp.task('default', function() {
  // place code for your default task here
});