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
import rev from 'gulp-rev';
import path from 'path';

// front end server related
import connect from 'gulp-connect';

// view/html/templating related
import htmlmin from 'gulp-htmlmin';
import stringify from 'stringify';
import handlebars from 'gulp-compile-handlebars';
import fs from 'fs';

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
import helpers from './app/client/conf/helpers.conf';

//
// Internals
// -----------------------------------------------------------------------
const internals = {
    web: web,
    paths: paths,
    hbs: {
        helpers: helpers
    }
};
const { hbs } = internals;

hbs.options = {
    ignorePartials: true,
    batch: [internals.paths.dev.hbs.partials],
    helpers: internals.hbs.helpers
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
        transform: [stringify, vueify]
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
            // .pipe(rev())
            .pipe(uglify({ mangle: {reserved: ['vue']} }))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(rename({
                dirname: buildDir(file),
                extname: '.min.js'
            }))
            .pipe(gulp.dest(internals.paths.dist.scripts))
            // .pipe(rev.manifest({
            //     base: `${ internals.paths.project.root }/`,
            //     merge: true // merge with the existing manifest if one exists
            // }))
            // .pipe(gulp.dest(`${ internals.paths.project.root }/`))
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
        // .pipe(rev())
        .pipe(gulp.dest(internals.paths.dist.styles))
        // .pipe(rev.manifest({
        //     base: `${ internals.paths.project.root }/thispath`,
        //     merge: true // merge with the existing manifest if one exists
        // }))
        // .pipe(gulp.dest(`${ internals.paths.project.root }/thispath`))
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
    internals.web.rev = (argv.production) ? JSON.parse(fs.readFileSync(`${ internals.paths.dist.root }/assets/rev-manifest.json`, 'utf8')) : internals.web.site.assets;

    return gulp.src([`${ internals.paths.dev.hbs.root }/**/*.hbs`, `!${ internals.paths.dev.hbs.partials }/**/*.hbs`])
        .pipe(handlebars(internals.web, hbs.options))
        .pipe(rename((filepath) => {
            filepath.extname = '.html';
        }))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(internals.paths.dist.root))
        .pipe(connect.reload());
});

//
// Process revision over the assets
// -----------------------------------------------------------------------
gulp.task('rev', () => {
    // src/dest paths have to be relative to project path, dunno why can't use internals.paths
    return gulp.src(['dist/assets/scripts/app.min.js', 'dist/assets/css/styles.min.css'], {base: path.join(process.cwd(), 'dist/assets')})
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/assets'));
});

//
// Watch changes
// -----------------------------------------------------------------------
gulp.task('watch', () => {

    gulp.watch([`${ internals.paths.dev.root }/**/*.hbs`], ['templates']);
    gulp.watch([`${ internals.paths.dev.styles }/**/*.scss`], ['sass']);
    gulp.watch([`${ internals.paths.dev.images }/**/*`], ['images']);

    gulp.watch([`${ internals.paths.dist.scripts }/app.min.js`, `${ internals.paths.dist.styles }/styles.min.css`], ['rev']);
    if (argv.production) {
        // need to run templates if rev manifest has changed this needs to happen only when production
        gulp.watch([`${ internals.paths.dist.root }/assets/rev-manifest.json`], ['templates']);
    }
});

//
// Default Task
// -----------------------------------------------------------------------
gulp.task('default', ['connect', 'scripts', 'sass', 'rev', 'images', 'fonts', 'templates', 'watch']);
