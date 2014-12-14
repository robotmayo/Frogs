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

Frogs.add(o)