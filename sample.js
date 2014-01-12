
var assert = require('assert')
var util = require('util')

var regressions = require('./regressions')

function __assert(){
  var args = Array.prototype.slice.call(arguments)
  if(!args[0]){
    args.shift()
    throw new Error('assert error '+util.format(args))
  }
}

function uid(){
  var uid = 0
  return function __uid(){
    return uid++
  }
}

var __uid = uid()

function __rand(m,M){
  return Math.floor(Math.random()*(M-m+1))+m
}

function __eql(a1,a2){
  __assert(a1.length === a2.length,'a1.length === a2.length at (%j,%j)',a1.length,a2.length)
  for(var i = 0;i<a1.length;i++){
    if(a1[i]!==a2[i]){
      __assert(false, 'a1 === a2, %j, %j', a1,a2)
    }
  }
}

var ot = require('./')


var Text = ot.Text, transpose = ot.transpose


function generate_text(len){
  var r = []
  while(0 < len--){
    r.push(__uid())
  }
  return r
}


function generate_op(text){
  var s = __rand(0,text.length)
  var e = __rand(s,text.length)
  var t = generate_text(__rand(0,text.length))
  return [s,e,t]
}

function _do2(_t0,_oc,_os){
  console.log('================')
  
  var tc = new Text(_t0)
  var ts = tc.clone()

  var c0 = tc.op.apply(tc, _oc)
  var s0 = ts.op.apply(ts, _os)

  console.log('tc',tc)
  console.log('c0',c0)
  console.log('s0',s0)

  tc.apply(c0)
  ts.apply(s0)

  console.log('tc.apply(c0)',tc)
  console.log('ts.apply(s0)',ts)

  var _ = transpose(c0,s0), c1=_[0], s1=_[1]

  console.log('c1',c1)
  console.log('s1',s1)

  tc.apply(s1)
  ts.apply(c1)

  console.log('tc.apply(s1)',tc)
  console.log('ts.apply(c1)',ts)

  __eql(tc.value, ts.value)
  
}


function _do1(N){

  for(var i=0;i<N;i++){
    var _t0 = generate_text(10)
    var _oc = generate_op(_t0)
    var _os = generate_op(_t0)

    console.log('new test',[_t0,_oc,_os])

    _do2(_t0,_oc,_os)
  }

}

function _do(){
  _do2([['When', 'I', 'go', 'to', 'school','.'],
        [1,3,['Mum','never','goes']],
        [5,5,[',','mum', 'should', 'not', 'cry']]])
}


function _do_regressions(){
  regressions.forEach(function(r){
    console.log('regression', r)
    var t = r[0], c = r[1], s = r[2]
    _do2(t,c,s)
  })
}

_do_regressions()

_do1(100000)


