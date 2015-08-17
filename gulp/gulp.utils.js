/**
 * Created by BHAlrM on 8/6/2015 AD.
 */

var browserSync = require('browser-sync');

module.exports = function () {
    var utils = {
        startBrowserSync: startBrowserSync,
        reloadBrowserSync:reloadBrowserSync
    };
    
    return utils;
};

function startBrowserSync(syncDir, serverPort){
    if (browserSync.active) {
        return;
    }
    
    var options = {
        proxy: 'localhost:' + serverPort,
        port: 3000,
        files: [syncDir + '/**/*.*'],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'browser-sync',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}

function reloadBrowserSync(){
    browserSync.notify('reloading now ...');
    browserSync.reload({stream: false});
}