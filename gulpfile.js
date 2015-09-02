/**
 * Created by BHAlrM on 6/13/2015 AD.
 */
var fs = require('fs');
var argv = require('yargs').argv;
var path = require('path');
var config = require('./gulp/gulp.config.js')();
var utils = require('./gulp/gulp.utils.js')();
var glob = require("glob");
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: true});
var tsProject = plugins.typescript.createProject('tsconfig.json', {sortOutput: true});
var merge = require('merge-stream');
var bowerFiles = require('main-bower-files');
var _ = require('lodash');
var async = require('async');

var tasks = [];
var templateTasks = [];
/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                plugins.util.log(plugins.util.colors.blue(msg[item]));
            }
        }
    } else {
        plugins.util.log(plugins.util.colors.blue(msg));
    }
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.app + ')/');
    //log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function typescriptEvent(file) {
    log('Compiled ' + file);
}

function serve() {
    var nodemonOptions = {
        script: config.server,
        delayTime: 1,
        env: {
            'PORT': config.serverPort,
            'NODE_ENV': 'dev'
        },
        watch: [config.serverDir]
    };

    plugins.nodemon(nodemonOptions)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);

            setTimeout(function () {
                utils.reloadBrowserSync();
            }, 1000);
        })
        .on('start', function () {
            log('*** nodemon started');
            utils.startBrowserSync(config.tmp, config.serverPort);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function script() {

    var folders = getFolders(config.src);


    folders.forEach(function (folder) {
        var src = path.join(config.src, folder, '/**/*.ts');
        var exSrc = '!' + path.join(config.src, 'app', folder + '.d.ts');
        var jsOut = path.join(folder, folder + '.js');
        var dOut = path.join(folder + '.d.ts');

        if (config.shim[folder]) {
            console.log("glob src = " + [src, exSrc]);

            var jsFn = function (tsResult) {
                return tsResult.js
                    .pipe(plugins.angularFilesort())
                    .pipe(plugins.concat(jsOut)) // You can use other plugins that also support gulp-sourcemaps 
                    .pipe(plugins.sourcemaps.write({addComment: false})) // This means sourcemaps will be generated
                    .pipe(gulp.dest(config.temp));
            };

            var dFn = function (tsResult) {
                return tsResult.dts
                    .pipe(plugins.concat(dOut))
                    .pipe(plugins.sourcemaps.write({addComment: false})) // This means sourcemaps will be generated
                    .pipe(gulp.dest(config.typescript.declarations.app));
            };

            var scriptFn = function () {

                var tsResult = gulp
                    .src([src, exSrc])
                    .pipe(plugins.sourcemaps.init()) // This means sourcemaps will be generated
                    .pipe(plugins.typescript(tsProject));
                var js = jsFn(tsResult);
                var d = dFn(tsResult);

                return merge(d, js);
            };

            var task = 'script-' + folder;
            var templateTask = 'template-' + folder;
            if (folder !== 'app') {
                tasks.push(task);
            }

            gulp.task(task, scriptFn);
            gulp.task(templateTask, templatecache(folder));
            templateTasks.push(templateTask);
        }
    });
    console.log("tasks = " + tasks);
    console.log("template = " + templateTasks);
}


function scriptApp() {
    return script(config.app.ts, config.app.temp.js);
}

function scriptRichStudio() {
    return script(config.richstudio.ts, config.richstudio.temp.js, true);
}

function copyLibs() {
    return gulp.src(bowerFiles(), {base: config.src}).pipe(gulp.dest(config.temp));
}

function copyAssets() {
    return gulp.src(config.app.assets).pipe(gulp.dest(config.app.temp.assets));
}

function copyIndexHtml() {
    return gulp.src(config.app.template)
        .pipe(gulp.dest(config.temp));
}

function clear() {
    return gulp.src('.tmp', {read: false})
        .pipe(plugins.clean());
}

function templatecache(module) {
    var template = path.join(config.src, module + '/**/*.template.html');

    return function () {
        console.log("converting " + template + " to template cache");
        return gulp.src(template)
            .pipe(plugins.angularTemplatecache({root: module, module: module}))
            .pipe(gulp.dest(config.temp + '/' + module));
    };
}


function inject() {
    return gulp.src(config.temp + '/index.html')
        .pipe(plugins.inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            ignorePath: config.src,
            addRootSlash: false
        }, {relative: true}))
        .pipe(plugins.inject(gulp.src([config.temp + '/**/*.js', '!' + config.temp + '/libs/**/*.js']).pipe(plugins.angularFilesort()), {relative: true}))
        .pipe(plugins.inject(gulp.src([config.temp + '/app/assets/css/main.css'], {read: false}), {relative: true}))
        .pipe(gulp.dest(config.temp));
}


function injectLibsReference() {

    return gulp
        .src(config.typescript.modules)
        .pipe(plugins.inject(gulp.src(config.typescript.declarations.libs), config.injection.typesciptLibsOptions)).pipe(gulp.dest(config.src));
}


function injectDepsReference() {
    var out = path.join(config.src, 'app');

    return gulp
        .src(config.app.module)
        .pipe(plugins.inject(gulp.src(config.app.deps), config.injection.typesciptReferenceOptions)).pipe(gulp.dest(out));
}


function live() {
    var folders = getFolders(config.src);
    folders.forEach(function (folder) {
        if (config.shim[folder]) {
            var ts = path.join(config.src, folder, '**/*.ts');
            var exTs = '!' + path.join(config.src, '**/*.d.ts');
            var targetTs = [ts, exTs];
            var targetTemplate = path.join(config.src, folder, '**/*.template.html');
            var scriptTask = 'script-' + folder;
            var templateTask = 'template-' + folder;
            
            gulp.watch(targetTs, [scriptTask]).on('change', changeEvent);
            gulp.watch(targetTemplate, [templateTask]).on('change', changeEvent);
        }
    });
    
    gulp.watch(config.app.less, style).on('change', changeEvent);
}

function style() {
    var LessPluginCleanCSS = require('less-plugin-clean-css'),
        LessPluginAutoPrefix = require('less-plugin-autoprefix'),
        cleancss = new LessPluginCleanCSS({advanced: true}),
        autoprefix = new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

    return gulp.src(config.app.less)
        .pipe(plugins.less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(gulp.dest(config.app.temp.css));
}
/////////////////////////////// task //////////////////////////////
gulp.task('default', ['help']);
gulp.task('help', plugins.taskListing);
gulp.task('clear', clear);

// compile and prepare script
gulp.task('templatecache', templatecache);

gulp.task('copy-index', copyIndexHtml);
gulp.task('copy-libs', copyLibs);
gulp.task('copy-assets', copyAssets);
gulp.task('copy', ['copy-index', 'copy-libs', 'copy-assets']);

gulp.task('style', style);
gulp.task('injectLibs', injectLibsReference);
gulp.task('injectDeps', injectDepsReference);
gulp.task('inject', ['copy', 'style'], inject);
gulp.task('inittask', ['injectLibs'], script);
gulp.task('script', ['clear', 'inittask'], function (cb) {
    var allTask = tasks.concat(templateTasks);
    allTask.push('injectDeps');
    allTask.push('script-app');
    allTask.push('inject');
    allTask.push(cb);
    plugins.sequence.apply(this, allTask);
});

// serve website to localhost

gulp.task('serve', ['script'], function () {
    live();
    serve();
});


