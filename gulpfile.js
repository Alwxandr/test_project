var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    cleanCSS = require('gulp-clean-css');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        //notify: false // Отключаем уведомления
    });
});
gulp.task('scripts-lib', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('scripts-min', function() {
    return gulp.src('app/js/common.js')
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('code', function() {
    return gulp.src('*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function() {
    return gulp.src('app/css/main.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css

});

gulp.task('minify-css', () => {
    return gulp.src('app/css/*.css')
        .pipe(autoprefixer('last 10 versions', '1%', 'ie 9'))
        .pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(rename('bundel.min.css'))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({ stream: true }));
});

 gulp.task('watch', function() {
     gulp.watch('*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
     gulp.watch('app/css/*.css', gulp.parallel('minify-css'));
     gulp.watch(['app/js/*.js', 'app/libs/**/*.js'], gulp.parallel('scripts-min')); // Наблюдение за  JS файлом
 });

// gulp.task('build', ['sass', 'scripts'], function() {
//
//     var buildCss = gulp.src([ // Переносим CSS стили в продакшен
//         'app/css/main.css',
//         'app/css/libs.min.css'
//     ])
//         .pipe(gulp.dest('dist/css'))
//
//     var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
//         .pipe(gulp.dest('dist/fonts'))
//
//     var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
//         .pipe(gulp.dest('dist/js'))
//
//     var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
//         .pipe(gulp.dest('dist'));
//
// });
gulp.task('default', gulp.parallel( 'minify-css','scripts-lib','scripts-min','browser-sync','watch'));