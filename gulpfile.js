const gulp = require('gulp');

function build(){
    return new Promise((resolve,reject) =>{
        gulp.src(['./public/**'])
        .pipe(gulp.dest('./docs/'))
        .on('end',function(){
            console.log('gulp finished');
            resolve();
        })
    }).catch(err => {
        console.log(err);
    })
}

gulp.task('build', build);