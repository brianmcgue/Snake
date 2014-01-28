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
})(this);