(function (root){
  var SG = root.SG = ( root.SG || {} );
  
  var View = SG.View = function (el) {
    this.$el = $(el);
    this.keyMapping = {
      32: 'paused',
      37: 'W',
      38: 'N',
      39: 'E',
      40: 'S'
    };
    this.running = true;
  };
  
  View.prototype.draw = function () {
    this.$el.html(this.board.render());
  };
  
  View.prototype.installKeyHandlers = function () {
    var view = this;
    $(window).on("keydown", function (event) {
      var dir = view.keyMapping[event.which];
      
      if (dir === 'paused') {
        view.running = !view.running;
      } else if (dir && view.running) {
        view.board.snake.turn(dir);
      }
    });
  };
  
  View.prototype.renderLoss = function () {
    // alert game is over without using alert
    delete this.board;
    clearInterval(this.interval);
    this.start();
  };

  View.prototype.start = function () {
    this.board = new SG.Board();
    this.installKeyHandlers();
    this.interval = setInterval(this.step.bind(this), 120);
  };
  
  View.prototype.step = function () {
    if (this.running) this.board.snake.move();
    if (this.board.lost()) {
      this.renderLoss();
    } else {
      this.draw(); 
    }
  };
})(this);