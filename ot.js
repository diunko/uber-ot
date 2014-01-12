
exports.transpose = transpose

var u = require('./util')

var __assert = u.__assert
var __eql = u.__eql

var Op = require('./op').Op
var __uid = require('./text').__uid

// var op = {
//   r:['r0','r1'],
//   o:{s:0,e:0,l:0,v:[]},
//   n:{s:0,e:3,l:2,v:['a','few','words']}}

// var d = {
//   r:['r0','rN'],
//   ops:[op1, op2, op3]
// }

// transpose(C,S) -> [C1,S1]


function transpose(C,S){
  __assert(S.r[0] === C.r[0],"S.r[0] === C.r[0]")
  if(S.o.s < C.o.s){
    if(S.o.e <= C.o.s){
      return transpose_S1(C,S)}
    else if(C.o.s < S.o.e){
      if(S.o.e < C.o.e){
        return transpose_S2(C,S)}
      else if(C.o.e <= S.o.e){
        return transpose_S3(C,S)}
      else {
        __assert(0, 'invalid ops ordering1',C,S)}}
    else {
      __assert(0, 'invalid comparison1 of', C.o.s, S.o.e)}}
  else if(S.o.s === C.o.s){
    if(S.o.e <= C.o.e){
      return transpose_SC(C,S)}
    else if(C.o.e < S.o.e){
      return transpose_CS(C,S)}
    else{
      __assert(0, 'invalid comparison== of', C.o.e, S.o.e)}}
  else if(C.o.s < S.o.s){
    if(C.o.e <= S.o.s){
      return transpose_C1(C,S)}
    else if(S.o.s < C.o.e){
      if(C.o.e < S.o.e){
        return transpose_C2(C,S)}
      else if(S.o.e <= C.o.e){
        return transpose_C3(C,S)}
      else{
        __assert(0, 'invalid ops ordering2',C,S)}}
    else{
      __assert(0, 'invalid comparison2 of', C.o.e, S.o.s)}}
  else{
    __assert(0, 'invalid comparison3 of', C.o.s, S.o.s)}
}


function transpose_S1(C,S){
  console.log('transpose_S1')
  var d = S.n.l-S.o.l
  var r1 = __uid()
  var S1 = new Op({
    r:[C.r[1],r1],
    o:S.o,
    n:S.n})
  var C1 = new Op({
    r:[S.r[1],r1],
    o:{s:C.o.s+d,e:C.o.e+d, v:C.o.v},
    n:{s:C.o.s+d,e:C.n.e+d, v:C.n.v}})
  return [C1,S1]
}

function transpose_S2(C,S){
  console.log('transpose_S2')
  var r1 = __uid()

  var S1 = new Op({
    r:[C.r[1],r1],
    o:{s:S.o.s, e: C.o.s, v:S.o.v.slice(0,C.o.s - S.o.s)},
    n:{s:S.o.s, e: S.o.s, v:S.n.v}
  })

  // var S1 = new Op({
  //   r:[C.r[1],r1],
  //   o:{s:S.o.s, e: C.o.s, v:S.o.v.slice(0,S.o.l-(S.o.e-C.o.s))},
  //   n:{s:S.o.s, e: S.o.s+S.n.l, v: S.n.v}
  // })

  var C1 = new Op({
    r:[S.r[1],r1],
    o:{s:S.n.e, e: S.n.e+(C.o.e-S.o.e), v: C.o.v.slice(S.o.e-C.o.s)},
    n:{s:S.n.e, e: S.n.e+C.n.l, v:C.n.v}
  })
  
  // var C1 = new Op({
  //   r:[S.r[1],r1],
  //   o:{s:S.n.e, e: S.n.e+C.o.l-(S.o.e-C.o.s), v: C.o.v.slice(S.n.e - C.o.s)},
  //   n:{s:S.n.e, e: S.n.e+C.n.l, v: C.n.v}
  // })

  return [C1,S1]
}

function transpose_S3(C,S){
  console.log('transpose_S3')
  var r1 = __uid()
  var dc = C.n.l - C.o.l
  var vs = [].concat(S.o.v.slice(0,C.o.s-S.o.s),
                  C.n.v,
                  S.o.v.slice(C.o.e-S.o.s))
  var S1 = new Op({
    r:[C.r[1],r1],
    o:S.o,
    o:{s:S.o.s,e:S.o.e+dc,v:vs},
    n:S.n
  })
  var C1 = new Op({
    r:[S.r[1],r1],
    o:{s:0,e:0,v:[]},
    n:{s:0,e:0,v:[]}
  })
  return [C1,S1]
}

function transpose_SC(C,S){
  console.log('transpose_SC')
  __assert(C.o.s === S.o.s, 'C.o.s === S.o.s')
  var r1 = __uid()
  var Sd = S.n.l-S.o.l

  var S1 = new Op({
    r:[C.r[1],r1],
    o:{s:S.o.s, e: C.o.s, v:S.o.v.slice(0,S.o.l-(S.o.e-C.o.s))},
    n:{s:S.o.s, e: S.o.s+S.n.l, v: S.n.v}
  })
  
  var C1 = new Op({
    r:[S.r[1],r1],
    o:{s:S.n.e, e: S.n.e+(C.o.e-S.o.e), v: C.o.v.slice(S.o.e - C.o.s)},
    n:{s:S.n.e, e: S.n.e+C.n.l, v: C.n.v }
  })
  return [C1,S1]
}

function transpose_CS(C,S){
  console.log('transpose_CS')
  var sc = transpose_SC(S,C)
  return [sc[1], sc[0]]
}
function transpose_C1(C,S){
  console.log('transpose_C1')
  var sc = transpose_S1(S,C)
  return [sc[1],sc[0]]
}
function transpose_C2(C,S){
  console.log('transpose_C2')
  var sc = transpose_S2(S,C)
  return    [sc[1],sc[0]]
}
function transpose_C3(C,S){
  console.log('transpose_C3')
  var sc = transpose_S3(S,C)
  return    [sc[1],sc[0]]
}

