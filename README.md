Frogs
======

#### Super Simple File Logger

    var Frogs = require('frogs')
    Frogs.add({name 'MyAwesomeLog', filename : 'my-awesome.log', dirname : 'some/dir/logs'})
    Frogs.log('Look ma im logging!', {other : 'Some other data here'})

No set up, its that easy! All methods are chainable for some reason.

    Frogs.add({name : 'mylog', filename : 'my.log'})
    .log('mylog', 'A message')

You can have multiple logs:

    Frogs.add({name : 'logA', filename : 'logA.log'})
    .add({name : 'logB', filename : 'logB.log'})
    .log('logA', 'This goes to log A')
    .log('logB', 'This goes to log B')

You can also 'bubble' your logs using .chain and setting the bubble param to true.

    Frogs.add({name : 'logA', filename : 'logA.log'})
    .add({name : 'logB', filename : 'logB.log'})
    .chain('logB', 'logA')
    .log('logB', 'This will log to file B then bubble to fileA', true)


Api
===

Frogs.add()
===========
Frogs.add(file)

Adds a file for logging.

file : Object - Required
    name : String - Required. The name to be used for logging
    fileName : String - Required. The name of the file to write to
    dirName : String - Optional. The name of the dir to write to. Defaults to __dirname

Frogs.log()
===========
Frogs.log(name, msg)

Frogs.log(name, msg, bubble)

Frogs.log(name, msg, data, bubble)

Log a message

name : String - Required - Name of the log to write to
msg : String|Buffer - Optional - Message to write
data : Obj - Optional - Additional data you may want to write
bubble : Boolean - Optional - Bubble this message upwards on its chain(if there is one)

Frogs.also()
============
Frogs.also(name)

Log the last message to specified file. This can never cause a bubble.

name : String - Required - Name of the log to write to.

Frogs.chain()
=============
Frogs.chain(NameA, NameB, ...)

Creates a chain so if a log is called with bubble set to true that messege will automatically be chained upwards to specified logs. The chain is set from right to left. So calling a log with bubble on NameA will log that message to NameB and so on. Frogs does not do any circular checks so be careful when using this.

Names... - Strings - At least 2 required. - Names of the loggers to chain with
