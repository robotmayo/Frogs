var fs = require('fs'),
    Path = require('path'),
    xtend = require('xtend');


var Frogs = module.exports = {};

Frogs.names = {};


Frogs.add = function Frogs$add(opts){
    var file = opts || {};
    if(!file.name) throw new Error("Name required!");
    if(!file.fileName) throw new Error("File name is required!");
    if(!file.dirName) file.dirName = __dirname;
    file.fullPath = Path.join(file.dirName, file.name);
    file.stream = fs.createWriteStream(file.fileName, {flags : 'a'});
    this.names[file.name] = file;
    return this;
}

Frogs.log = function Frogs$log(to, msg, meta, bubble){
    var file = this.names[to];
    var args = Array.prototype.slice.call(arguments);
    if(args.length === 3){
        if(meta === true || meta === false){
            bubble = meta;
            meta = {};
        }else{
            bubble = false;
        }
    }
    if(!file) throw new Error("You must add the file" + to + " first!");
    msg = Buffer.isBuffer(msg) ? msg.toString('utf-8') : msg;
    var output = {message : msg, timestamp : (new Date()).toISOString()};
    output = xtend(output, meta || {});
    output = JSON.stringify(output) + '\n';
    file.stream.write(output);
    this._lastMessage = output;
    var self = this;
    if(bubble === true && typeof file.next !== 'undefined'){
        return this._chainLog(file.next, output);
    }
    return this;
}

Frogs.also = function(to){
    if(!this._lastMessage) return;
    var file = this.names[to];
    if(!file) throw new Error("You must add the file" + to + " first!");
    file.stream.write(this._lastMessage);
    return this;
}

Frogs._chainLog = function Frogs$_chainLog(name, out){
    var file = this.names[name];
    file.stream.write(out);
    if(typeof file.next !== 'undefined') {
        return this._chainLog(file.next, out);
    }
    return this;
}

Frogs.chain = function Frogs$chain(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length < 2) throw new Error("Chain must consist of at least two names!");
    var self = this;
    args.reduce(function(pre, cur){
        var fa = pre;
        var fb = self.names[cur];
        if(!fa) throw new Error("You must add the file" + pre.name + " first!");
        if(!fb) throw new Error("You must add the file" + cur + " first!");
        fa.next = fb.name;
        return fb;
    }, this.names[args[0]]);
    return this;
}

module.exports = Frogs;