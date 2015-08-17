module.exports = function () {
    var serverDir = 'src/main/server';
    var src = 'src/main/www';

    var config = {
        /**
         * App settings
         */
        temp: '.tmp',
        src: src,
        
        shim:{
            app: {deps: ['angular', 'richstudio']},
            richstudio : {deps: ['angular', 'richstudio']}
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
            libs: src + '/libs/**/*.js',
            less: src + '/assets/less/main.less',
            assets: [src + '/assets/**/*', '!' + src + '/assets/less/**/*'],
            template: src + '/index.html'
        },

        /**
         * Richstudio settings
         */
        richstudio: {
            src: 'src/main/www/richstudio/',
            temp: {
                js: 'richstudio/richstudio.js',
                libs: '.tmp/libs/**/*.js'
            },
            ts: [src + '/richstudio/**/*.ts', '!' + src + '/richstudio/**/*.d.ts'],
            template: src + '/richstudio/**/*.template.html'
        },

        /**
         * Typescirpt settings
         */
        typescript: {
            declarations: 'typing'
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