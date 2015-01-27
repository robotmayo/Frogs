Frogs v1.0.4
======

#### Super Simple File Logger

var Frogs = require('Frogs');
var Logger = new Frogs();
Logger.add({
    name : info,
    filename : 'myinfo.log',
    useNameAsLog : true
})

Logger.info('Look ma im logging!', {some : 'extra data'});
