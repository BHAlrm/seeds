/**
 * Created by BHAlrM on 8/5/2015 AD.
 */
    
var express = require('express');
var logger = require('morgan');

var app = express();

// log requests
app.use(logger('dev'));
app.use(express.static('.tmp'));

app.listen(9000, function () {
    console.log('Express server listening on port ' + 9000);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});