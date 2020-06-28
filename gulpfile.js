const gulp = require("gulp");

const sass = require("gulp-sass");

const sourcemaps = require('gulp-sourcemaps');

const autoprefixer = require('gulp-autoprefixer'); // automatyczne dodawanie prefiksów

const browserSync = require('browser-sync').create(); 

const notifier = require('node-notifier'); // odnosi sie do okienka z informacją o błędzie w kodzie


sass.compiler = require('node-sass'); //moze byc nowsza wersja


function mySassError(err) {
    // console.log(err.toString())
    console.log(err.messageFormatted);

    notifier.notify({
        title: 'Błąd kompilacji SASS',
        message: err.messageFormatted
      });
}

function server(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
        // notify: false
    });

    cb();
}


function css() {
    return gulp.src('./scss/main.scss') // rozpocznij komplilacje od main css
    .pipe(sourcemaps.init()) // odnosi sie do sourcemap
    .pipe(sass({
        outputStyle: "expanded" //nested, expanded, compact - dobre, compressed, kompilacja
    }).on('error', mySassError)) // zamiana na css, odniesienie do błędu w kodzie
    .pipe(autoprefixer({})) //  odniesienie do prefiksów
    .pipe(sourcemaps.write(".")) // odnosi się do sourcemap, kropka tworzy nowy plik
    .pipe(gulp.dest('./css')) // stworz w css albo go stworz
    .pipe(browserSync.stream()) //nasłuchiwanie automatyczne po wpisaniu gulp
}

function watch() {
    gulp.watch('./scss/**/*.scss', gulp.series(css)) // wszystkie katalogi, po przecinku otworz zadania
    gulp.watch("./*.html").on('change', browserSync.reload); // . -w głównym katalogu
}

exports.css = css;
exports.default = gulp.series(css, server, watch); // - zadania startuja po kolei, parallel() - wszystkie na raz; nasłuchiwanie plików


