

exports.Text = Text

var u = require('./util')

var __assert = u.__assert
var __eql = u.__eql
var __uid = u.uid()

var Op = require('./op').Op


function Text(tokens){
  this._rev = __uid()
  this.value = tokens
}

Text.prototype = {
  clone: function(){
    var tc = new Text(this.value)
    tc._rev = this._rev
    return tc
  },
  op: function(s,e,v){
    return new Op({
      r:[this._rev, __uid()],
      o:{s:s, e:e, v: this.value.slice(s,e)},
      n:{s:s, e: s+v.length, v:v}
    })
  },
  apply: function(op){
    __assert(op.r[0] === this._rev, "op.r[0] === this._rev, %j", op.r[0], this._rev)
    var ov = this.value.slice(op.o.s,op.o.e)
    __eql(ov,op.o.v)
    var v = this.value
    this.value = [].concat(v.slice(0,op.o.s), op.n.v, v.slice(op.o.e))
    this._rev = op.r[1]
    return this
  }
}

exports.__uid = __uid
