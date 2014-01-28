(function (root) {
  var SG = root.SG = (root.SG || {});
  
  var Board = SG.Board = function (options) {
    this.mouseDirs = [[-1, 0], [ 0, 1], [ 1, 0], [ 0,-1]];
    this.gridSize = 20;
    this.grid = this.makeGrid(this.gridSize);
    this.midpoint = Math.floor(this.gridSize/2);
    this.snake = new SG.Snake({
      dir: 'O',
      board: this,
      segments: [new SG.Coord([this.midpoint, this.midpoint])]
    });
    this.mouse = this.randomMouse();
    this.mouseCounter = true;
    this.mouseDir = [0, 0];
  };
  
  Board.prototype.makeGrid = function (size) {
    return _.times(size, function (i) {
      return _.times(size, function (j) {
        return null;
      });
    });
  };
  
  Board.prototype.move = function () {
    this.snake.move();
    this.moveMouse();
  };
  
  Board.prototype.render = function () {
    var board = this;
    var $renderedDiv = $('<div>').addClass('grid');
    _(this.gridSize).times(function (i) {
      _(board.gridSize).times(function (j) {
        if (SG.Coord.includedIn(board.snake.segments, [i, j])) {
          $renderedDiv.append($('<div>').addClass('segment'));
        } else if (SG.Coord.includedIn([board.mouse], [i, j])){
          $renderedDiv.append($('<div>').addClass('mouse'));
        } else if (SG.Coord.includedIn(board.snake.poops, [i, j])) {
          $renderedDiv.append($('<div>').addClass('poop'));
        } else {
          $renderedDiv.append($('<div>').addClass('blank'));
        } 
      });
    });
    return $renderedDiv;
  };
  
  Board.prototype.moveMouse = function () {
    this.mouseCounter = !this.mouseCounter;
    if (this.mouseCounter) return;
    while (true) {
      if (Math.random() < 0.25) {
        var dir = this.mouseDirs[Math.floor(Math.random() * 4)];
        this.mouseDir = dir;
      }
      var newPos = [(this.mouse.pos[0] + this.mouseDir[0]),
                    (this.mouse.pos[1] + this.mouseDir[1])];
      if (this.newPosIsOk(newPos)) {
        this.mouse.pos = newPos;
        return;
      }
    }
  };
  
  Board.prototype.newPosIsOk = function (newPos) {
    return !SG.Coord.includedIn(this.snake.segments, newPos) &&
      !SG.Coord.includedIn(this.snake.poops, newPos) &&
      newPos[0] < this.gridSize && newPos[0] >= 0 && 
      newPos[1] < this.gridSize && newPos[1] >= 0;
  }
  
  Board.prototype.randomMouse = function(){
    if (this.mouse) delete this.mouse;
    while (true) {
      var randCoord = [Math.floor((Math.random()*this.gridSize)),
                       Math.floor((Math.random()*this.gridSize))];
      if (!SG.Coord.includedIn(this.snake.segments, randCoord) &&
          !SG.Coord.includedIn(this.snake.poops, randCoord)) {
        return new SG.Coord(randCoord);
      }
    }
  };
  
  Board.prototype.lost = function(){
    return this.outOfBounds() || this.snake.ateItself() ||
      this.snake.ateItsPoop();
  };
  
  Board.prototype.outOfBounds = function(){
    var head = this.snake.segments[0].pos;
    if (head[0] >= this.gridSize || head[0] < 0 || 
        head[1] >= this.gridSize || head[1] < 0) {
      return true;
    }
    return false;
  };
  
})(this);
