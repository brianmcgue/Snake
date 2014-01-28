(function (root) {
  var SG = root.SG = (root.SG || {});
  
  var Coord = SG.Coord = function (pos) {
    this.pos = pos;
  };
  
  Coord.prototype.plus = function (dir) {
    var newCoord = [(this.pos[0] + dir[0]), (this.pos[1] + dir[1])];
    return new SG.Coord(newCoord);
  };
  
  Coord.includedIn = function (coords, target) {
    if (!coords.length) return false;
    for (var i = 0; i < coords.length; i++){
      if (coords[i].pos[0] === target[0] && coords[i].pos[1] === target[1]) {
        return true;
      }
    }
    return false;    
  };
  
  var Snake = SG.Snake = function (options) {
    this.board = options.board;
    this.dir = options.dir;
    this.dirMappings = {
      "O": [ 0, 0],
      "N": [-1, 0],
      "E": [ 0, 1],
      "S": [ 1, 0],
      "W": [ 0,-1]
    };
    this.segments = options.segments;
    this.isGonnaPoop = false;
    this.poops = [];
  };
  
  Snake.prototype.ateItself = function () {
    var headPos = this.segments[0].pos;
    return SG.Coord.includedIn(this.segments.slice(1), headPos);
  };
  
  Snake.prototype.ateItsPoop = function () {
    var headPos = this.segments[0].pos;
    return SG.Coord.includedIn(this.poops, headPos);
  };
  
  Snake.prototype.move = function () {
    var newPos = this.dirMappings[this.dir];
    var newSegment = this.segments[0].plus(newPos);
    this.segments.unshift(newSegment);
    if (SG.Coord.includedIn([this.board.apple], newSegment.pos)) {
      this.board.apple = this.board.randomApple();
      if (!(this.segments.length % 4)) this.isGonnaPoop = true;
    } else {
      var tail = this.segments.pop();
      if (this.isGonnaPoop) {
        this.poops.push(new SG.Coord(tail.pos));
        this.isGonnaPoop = false;
      }
    }
  };
  
  Snake.prototype.turn = function (newDir) {
    var oppositeDirs = {
      "N": "S",
      "S": "N",
      "W": "E",
      "E": "W"
    }
    if (this.dir !== oppositeDirs[newDir]) this.dir = newDir;
  };
})(this);