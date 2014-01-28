(function (root) {
  var SG = root.SG = (root.SG || {});
  
  var Board = SG.Board = function (options) {
    this.gridSize = 20;
    this.midpoint = Math.floor(this.gridSize/2);
    this.grid = this.makeGrid(this.gridSize);
    this.snake = new SG.Snake({
      dir: 'O',
      board: this,
      segments: [new SG.Coord([this.midpoint, this.midpoint])]
    });
    this.apple = this.randomApple();
  };
  
  Board.prototype.makeGrid = function (size) {
    return _.times(size, function (i) {
      return _.times(size, function (j) {
        return null;
      });
    });
  };
  
  Board.prototype.render = function () {
    var board = this;
    var $renderedDiv = $('<div>').addClass('grid');
    _(this.gridSize).times(function (i) {
      _(board.gridSize).times(function (j) {
        if (SG.Coord.includedIn(board.snake.segments, [i, j])) {
          $renderedDiv.append($('<div>').addClass('segment'));
        } else if (SG.Coord.includedIn([board.apple], [i, j])){
          $renderedDiv.append($('<div>').addClass('apple'));
        } else if (SG.Coord.includedIn(board.snake.poops, [i, j])) {
          $renderedDiv.append($('<div>').addClass('poop'));
        } else {
          $renderedDiv.append($('<div>').addClass('blank'));
        } 
      });
    });
    return $renderedDiv;
  };
  
  Board.prototype.randomApple = function(){
    if (this.apple) delete this.apple;
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
        head[1] >= this.gridSize || head[1] < 0 ) {
      return true;
    }
    return false;
  };
  
})(this);
