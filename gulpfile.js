
/**
 * Load webpack config
 */
const webpackDev = require('./config/webconfig.dev');
const webpackProd = require('./config/webconfig.prod');
const webpackTest = require('./config/webconfig.test');

const gulp = require('gulp');

/**
 *  Browser history fallback that runs with the browser sync feature
 */ 
const historyApiFallback = require('connect-history-api-fallback');

/**
 * Browser Sync will run a localhost web server as well as instantly refreshing or injecting any javascript or 
 * scss styles into your webpage
 */
const browserSync = require('browser-sync');


/**
 *  Gulp concat will concatenate multiple files into one
 */
const concat = require('gulp-concat');


/**
 * Gulp-Sass provides a compiler to your SCSS files within Gulp
 */
const sass = require('gulp-sass');


/**
 * Handlebars for .hbs template compiling
 */
 const handlebars = require('gulp-compile-handlebars');


/**
 * Gulp-Uglify will minify your Gulp Stream
 */
const uglify = require('gulp-uglify');


/**
 * When this feature is used, it will remove any debug code you still have in your code [ex. console.log(myVar), 
 * won't be in the compiled code]
 */
const stripDebug = require('gulp-strip-debug');


/**
 * Along with Babel, webpack is used here to compile ES2015 code into standard Javascript
 */
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

/**
 * Add prefixers to css properties
 */
 const autoprefixer = require('gulp-autoprefixer');

/**
 * Plugin to rename files
 */
const rename = require('gulp-rename');

/**
 * Path normalisation plugin
 */
const path = require('path');

/**
 * SCSS sourcemaps
 */
const sourcemaps = require('gulp-sourcemaps');


/**
 *  ---- TASKS ----
 */

/**
 * CSS / SCSS
 */
gulp.task('sass', function () {



    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browserlist: ['last 3 versions'],
			cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.reload({ stream: true }));

});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
});



/**
 * Javascript
 */ 
gulp.task('scripts', function () {

    let outputScripts = gulp.src(['src/js/app.js'])
                            .pipe(concat('app.js'))
                            .pipe(webpackStream(webpackDev))
                            .pipe(gulp.dest("public/js/"))
    return outputScripts;
});

gulp.task('scripts:watch', function () {
    gulp.watch(['src/js/**/*.js'], gulp.series('scripts'));
});



/**
 * Handlebars
 */

gulp.task('templates', function () {
	const templateData = {
			siteTitle: "Miguel Moreira - Creative Developer"
		},
		options = {
			ignorePartials: true,
            batch: [`src/html-partials/`],
            helpers : {
                eq : function(a, b) {
                    return a == b
                }
            }
		};

	return gulp.src('src/*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function(path){
            path.extname = '.html';
        }))
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('templates:watch', function(){

    gulp.watch(['src/**/*.hbs'], gulp.series('templates'));

}); 

/**
 * Browser sync
 */
gulp.task('browser-sync', function () {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server: {
            baseDir: 'public/'
        },
        middleware: [historyApiFallback()],
        ghostMode: false
    });
});




gulp.task('build',  gulp.series(['sass', 'scripts', 'templates']));
gulp.task('watch',  gulp.series(['sass', 'sass:watch', 'scripts', 'scripts:watch']));
gulp.task('default', gulp.parallel('browser-sync', 'sass', 'sass:watch', 'scripts', 'scripts:watch', 'templates', 'templates:watch'));