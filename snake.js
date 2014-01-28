(function (root) {
  var SG = root.SG = (root.SG || {});
  
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
    if (SG.Coord.includedIn([this.board.mouse], newSegment.pos)) {
      this.board.mouse = this.board.randomMouse();
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