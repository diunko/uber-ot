
var assert = require('assert')
var util = require('util')

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
  return Math.floor(Math.random()*(M-m+1))
}

function __eql(a1,a2){
  __assert(a1.length === a2.length,'a1.length === a2.length at (%j,%j)',a1.length,a2.length)
  for(var i = 0;i<a1.length;i++){
    if(a1[i]!==a2[i]){
      __assert(false, 'a1 === a2, %j, %j', a1,a2)
    }
  }
}


exports.__eql = __eql
exports.__rand = __rand
exports.uid = uid
exports.__assert = __assert

