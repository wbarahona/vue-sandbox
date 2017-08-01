//
// Gulpfile.js
// Recipe by Willmer Barahona
// -----------------------------------------------------------------------
// task related
import gulp from 'gulp';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import { argv } from 'yargs';
import prettyTime from 'pretty-hrtime';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';

// front end server related
import connect from 'gulp-connect';

// view/html/templating related
import htmlmin from 'gulp-htmlmin';

// scripts and lint related
import eslint from 'gulp-eslint';
import browserify from 'browserify';
import watchify from 'watchify';
import glob from 'glob';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import babelify from 'babelify';
import vueify from 'vueify';

// Styles related
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import combinemq from 'gulp-combine-mq';

// Image related
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

// application configurations
import paths from './app/client/conf/paths.conf';
import web from './app/client/conf/web.conf';

//
// Internals
// -----------------------------------------------------------------------
const internals         = {
    web: web,
    paths: paths
};

//
// Notify when task has done
// -----------------------------------------------------------------------
gulp.on('task_stop', (e) => {

    const quiet = (argv.quiet) ? true : false;

    if (!quiet) {

        const time = prettyTime(e.hrDuration);

        gulp.src('').pipe(notify({
            title: `Finished: ${ e.task.toUpperCase() }`,
            message: `after ${ time }`
        }));
    }
});

//
// Connect task
// -----------------------------------------------------------------------
gulp.task('connect', () => {

    connect.server({
        root: internals.paths.dist.root,
        port: 8000,
        livereload: true
    });
});

//
// Swallow Error
// -----------------------------------------------------------------------
const swallowError = (error) => {
    console.log(error.toString());
    this.emit('end');
};

//
// Process scripts
// -----------------------------------------------------------------------
const buildDir = (entry) => {

    const newstring = entry.replace(internals.paths.dev.scripts, '');
    const lastOccurrenceIndex = newstring.lastIndexOf('/');
    const dir = newstring.slice(0, lastOccurrenceIndex + 1);

    return dir;
};

const bundleScript = (file) => {

    const opts = Object.assign({}, watchify.args, {
        debug: true,
        entries: file,
        transform: vueify
    });
    const lint = (src) => {
        return gulp.src(src)
            .pipe(eslint({ useEslintrc: true }))
            .pipe(eslint.format());
    };
    let brw = browserify(opts);
    const rebundle = () => {

        return brw.bundle()
            .on('error', gutil.log.bind(gutil, '>>> Bundling error!'))
            .pipe(source(file))
            .pipe(buffer())
            .pipe(uglify({ mangle: {reserved: ['vue']} }))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(rename({
                dirname: buildDir(file),
                extname: '.min.js'
            }))
            .pipe(gulp.dest(internals.paths.dist.scripts))
            .pipe(notify({
                title: 'Finished: BUNDLING',
                message: `${ file }`
            }))
            .pipe(connect.reload());
    };

    brw.transform([babelify.configure({
        global: true,
        compact: false
    })]);
    brw = watchify(brw);
    brw.on('update', (id) => {
        lint(id);
        rebundle();
    });

    return rebundle();
};

gulp.task('scripts', () => {

    glob(`${ internals.paths.dev.scripts }/**/*.js`,
        {'ignore': [
            `${ internals.paths.dev.scripts }/modules/**/*`,
            `${ internals.paths.dev.scripts }/libs/**/*`
        ]},
        (err, files) => {

            console.log(files);

            if(err) {swallowError(err);}

            files.map((entry) => {
                bundleScript(entry);
            });
        });
});

//
// Process Styles
// -----------------------------------------------------------------------
gulp.task('sass', () => {

    const sassOptions = {
        errLogToConsole: true
    };

    return gulp.src([`${ internals.paths.dev.styles }/styles.scss`])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(combinemq())
        .pipe(cssnano({
            autoprefixer: { browsers: ['last 3 version'], add: true }
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest(internals.paths.dist.styles))
        .pipe(connect.reload());
});

//
// Process images
// -----------------------------------------------------------------------
gulp.task('images', () => {

    return gulp.src(`${ internals.paths.dev.images }/**/*`)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(internals.paths.dist.images))
        .pipe(connect.reload());
});

//
// Process font files
// -----------------------------------------------------------------------
gulp.task('fonts', () => {

    return gulp.src(`${ internals.paths.dev.fonts }/**/*`)
        .pipe(gulp.dest(internals.paths.dist.fonts))
        .pipe(connect.reload());
});

//
// Process templates
// -----------------------------------------------------------------------
gulp.task('templates', () => {

    return gulp.src(`${ internals.paths.dev.root }/**/*.html`)
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(internals.paths.dist.root))
        .pipe(connect.reload());
});

//
// Watch changes
// -----------------------------------------------------------------------
gulp.task('watch', () => {

    gulp.watch([`${ internals.paths.dev.root }/**/*.html`], ['templates']);
    gulp.watch([`${ internals.paths.dev.styles }/**/*.scss`], ['sass']);
    gulp.watch([`${ internals.paths.dev.images }/**/*`], ['images']);
});

//
// Default Task
// -----------------------------------------------------------------------
gulp.task('default', ['connect', 'templates', 'sass', 'images', 'fonts', 'scripts', 'watch']);
