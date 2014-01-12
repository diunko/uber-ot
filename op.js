
module.exports.Op = Op

function Range(r0){
  if(r0){
    this.s = r0.s
    this.e = r0.e
    this.v = r0.v
  } else {
    this.s = 0
    this.e = 0
    this.v = null
  }
  this.l = this.e - this.s
}


function Op(op0){
  this.r = [op0.r[0], op0.r[1]]
  this.o = new Range(op0.o)
  this.n = new Range(op0.n)
}

Op.nop = {}