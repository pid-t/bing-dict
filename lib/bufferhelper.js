var BufferHelper = function() {
  this.buffers = [];
  this.size = 0;
  this._status = 'changed';
};

BufferHelper.prototype = {
  constructor: BufferHelper,
  concat: function() {
    for(var i = 0, l = arguments.length; i < l; i++) {
      this._concat(arguments[i]); 
    }
  },
  _concat: function(buffer){
    this.buffers.push(buffer);
    this.size = this.size + buffer.length;
    this._status = 'changed';
    return this;
  },
  _toBuffer: function() {
    var data = null;
    var buffers = this.buffers || [];
    switch(buffers.length) {
      case 0:
        data = new Buffer(0);
        break;
      case 1:
        data = buffers[0];
        break;
      default:
        data = new Buffer(this.size);
        for(var i = 0, pos = 0, l = buffers.length; i < l; i++) {
          var buffer = buffers[i];
          buffer.copy(data, pos);
          pos += buffer.length;
        }
        break;
    }
    this._status = 'computed';
    this.buffer = data;
    return data;
  },
  toBuffer: function() {
    return this._status === 'computed' ? this.buffer : this._toBuffer();
  },
  toString: function(){
    return Buffer.prototype.toString.apply(this.toBuffer(), arguments);
  }
};

module.exports = BufferHelper;
