var fs = require('fs'),
    Path = require('path'),
    xtend = require('xtend');


var Frogs = module.exports = function(opts){
    this.logs = {};
    this.opts = xtend({}, opts || {});
    if(this.opts.global){
        this.add(this.opts.global);
    }
};

Frogs.prototype.add = function(opts){
    if(!opts.name) throw new Error("Name required for log!");
    if(!opts.stream){
        if(!opts.filename) throw new Error("File name is requred");
        opts.dirname = opts.dirname || process.cwd();
        opts.fullPath = Path.join(opts.dirname, opts.filename);
        opts.stream = fs.createWriteStream(opts.fullPath, {flags : 'a'});
    }
    this.logs[opts.name] = opts;
    if(opts.useNameAsLog){
        if(this[opts.name]) throw new Error('This name ' + opts.name + 'is already in use.');
        this[opts.name] = function(msg, meta, bubble){
            return this.log(opts.name, msg, meta, bubble);
        }
    }
    return this;
}

Frogs.prototype.log = function Frogs$log(to, msg, meta, bubble){
    var output = '';
    var logObj = this.logs[to];
    var timestamp = logObj.timestamp || this.opts.timestamp;
    if(!logObj) {
        throw new Error("You must add the log before you can write to it!")
    }
    var format = logObj.format || this.opts.format;
    if(format) {
        output = format(msg, meta);
        if(timestamp) output += timestamp();
        else output += (new Date()).toISOString();
    }else{
        var temp = {message : msg};
        if(timestamp){
            temp.timestamp = timestamp();
        }else{
            temp.timestamp = (new Date()).toISOString();
        }
        output = xtend(temp, meta || {});
        output = JSON.stringify(output);
    }
    output += '\n';
    logObj.stream.write(output);
    if( (bubble === true || logObj.bubble === true) && file.next){
        return this._chainlog(logObj.next, output);
    }
    return logObj.stream;
}

Frogs.prototype.format = function(format, msg, meta){
    var tokens = {

    }
}

Frogs.prototype._chainLog = function(name, out){
    var file = this.logs[name];
    file.stream.write(out);
    if(typeof file.next !== 'undefined') {
        return this._chainLog(file.next, out);
    }
    return file.stream;
}

Frogs.prototype.chain = function(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length < 2) throw new Error("Chain must consist of at least two names!");
    var self = this;
    args.reduce(function(pre, cur){
        var fa = pre;
        var fb = self.logs[cur];
        if(!fa) throw new Error("You must add the file" + pre.name + " first!");
        if(!fb) throw new Error("You must add the file" + cur + " first!");
        fa.next = fb.name;
        return fb;
    }, this.logs[args[0]]);
    return this;
}

module.exports = Frogs;