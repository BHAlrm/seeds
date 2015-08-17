/**
 * Created by BHAlrM on 6/13/2015 AD.
 */
var fs = require('fs');
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
        .filter(function(file) {
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

function script(cb) {

    var folders = getFolders(config.src);
    

    folders.forEach(function(folder) {
        var src = path.join(config.src, folder, '/**/*.ts');
        var exSrc = '!' + path.join(config.src, folder, folder + '.d.ts');
        var out = path.join(folder, folder +'.js');
        
        if(config.shim[folder]){
            console.log("glob src = " + [src, exSrc]);
            var scriptFn = function(){
                
                var tsResult = gulp
                    .src([src, exSrc])
                    .pipe(plugins.sourcemaps.init()) // This means sourcemaps will be generated
                    .pipe(plugins.typescript(tsProject));

                var js = tsResult.js
                    .pipe(plugins.angularFilesort())
                    .pipe(plugins.concat(out)) // You can use other plugins that also support gulp-sourcemaps 
                    .pipe(plugins.sourcemaps.write({addComment: false})) // This means sourcemaps will be generated
                    .pipe(gulp.dest(config.temp));

                var d = tsResult.dts
                    .pipe(plugins.concat(out.replace('.js', '.d.ts'))) // You can use other plugins that also support gulp-sourcemaps 
                    .pipe(plugins.sourcemaps.write({addComment: false})) // This means sourcemaps will be generated
                    .pipe(gulp.dest(config.src));
                
                
                return merge(js, d);
            };
            
            var task = 'script-' + folder;
            var templateTask = 'template-' + folder;
            gulp.task(task, scriptFn);
            gulp.task(templateTask, templatecache(folder));
            
            if(folder !== 'app'){
                tasks.push(task);
            }
            templateTasks.push(templateTask);
        }
    });
    console.log("tasks = " + tasks);
    console.log("template = " + templateTasks);
    cb();
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

    return function(){
        console.log("converting " + template + " to template cache");
        return gulp.src(template)
            .pipe(plugins.angularTemplatecache({root: module, module: module}))
            .pipe(gulp.dest(config.temp + '/' + module));
    };
}


function inject() {
    return gulp.src(config.temp + '/index.html')
        .pipe(plugins.inject(gulp.src([config.temp + '/**/*.js', '!' + config.temp + '/libs/**/*.js']).pipe(plugins.angularFilesort()), {relative: true}))
        .pipe(plugins.inject(gulp.src(config.temp + '/**/*.css', {read: false}), {relative: true}))
        .pipe(plugins.inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            ignorePath: config.src,
            addRootSlash: false
        }, {relative: true}))
        .pipe(gulp.dest(config.temp));
}


function injectRef() {
    var injectRefOptions = {
        relative: true,
        starttag: '\/\/\/<reference path="',
        endtag: '"\/>',
        transform: function (filepath, file, i, length) {
            return filepath;
        }
    };

    return gulp
        .src(config.ts.all)
        .pipe(plugins.inject(gulp.src('typing/tsd.d.ts'), injectRefOptions)).pipe(gulp.dest('src/main/www'));
}

function live() {
    var folders = getFolders(config.src);
    folders.forEach(function(folder) {
        if(config.shim[folder]){
            var ts = path.join(config.src, folder, '**/*.ts');
            var exTs= '!' + path.join(config.src, folder, folder + '.d.ts');
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
gulp.task('inject-ref', injectRef);
//gulp.task('script-app', scriptApp);
//gulp.task('script-richstudio', scriptRichStudio);

gulp.task('style', style);
gulp.task('inject', ['copy', 'style'], inject);
gulp.task('inittask', script);
gulp.task('script', ['clear', 'inittask'], function(cb){
    var runs = tasks.concat(templateTasks);
    runs.push('script-app');
    runs.push('inject');
    runs.push(cb);
    plugins.runSequence.apply(this, runs);
});
//log('compiled typescript....');
//plugins.runSequence('script-app', 'script-richstudio', 'inject', cb);

//gulp.task('optimize', ['script', 'copy', 'templatecache'], optimize);

// serve website to localhost

gulp.task('serve', ['script'], function () {
    live();
    serve();
});


