module.exports = function () {
    var serverDir = 'src/main/server';
    var src = 'src/main/www';

    var config = {
        /**
         * App settings
         */
        temp: '.tmp',
        src: src,

        shim: {
            app: {deps: ['angular']},
            'app.richstudio': {deps: ['app']}
        },

        app: {
            temp: {
                js: 'app/app.js',
                css: '.tmp/app/assets/css',
                index: 'index.html',
                libs: 'libs/**/*.js',
                assets: '.tmp/app/assets'
            },
            ts: src + '/app/**/*.ts',
            module: src + '/app/app.module.ts',
            components: src + '/libs/app.components',
            deps: [src + '/.d/*.d.ts', '!' + src + '/.d/app.d.ts'],
            libs: src + '/libs/**/*.js',
            less: src + '/assets/less/main.less',
            assets: [src + '/assets/**/*', '!' + src + '/assets/less/**/*'],
            template: src + '/index.html'
        },

        /**
         * Richstudio settings
         */
        richstudio: {
            src: 'src/main/www/app.richstudio/',
            temp: {
                js: 'app.richstudio/richstudio.js',
                libs: '.tmp/libs/**/*.js'
            },
            ts: [src + '/app.richstudio/**/*.ts', '!' + src + '/app.richstudio/**/*.d.ts'],
            template: src + '/app.richstudio/**/*.template.html'
        },

        /**
         * Typescirpt settings
         */
        typescript: {
            declarations: {
                app: src + '/.d',
                libs: ['typing/tsd.d.ts']
            },
            modules: src + '/*/*.module.ts'
        },


        /**
         * Injection settings
         */

        injection: {
            typesciptReferenceOptions: {
                relative: true,
                starttag: '\/* inject:reference:{{ext}} *\/',
                endtag: '\/* endinject *\/',
                transform: function (filepath) {
                    return '///<reference path="' + filepath + '"/>';
                }
            },

            typesciptLibsOptions: {
                relative: true,
                starttag: '\/* inject:libs:{{ext}} *\/',
                endtag: '\/* endinject *\/',
                transform: function (filepath) {
                    return '///<reference path="' + filepath + '"/>';
                }
            }
        },

        /**
         * Node settings
         */
        serverDir: serverDir,
        serverPort: 9000,
        server: serverDir + '/app.js'

    };


    return config;

}
;