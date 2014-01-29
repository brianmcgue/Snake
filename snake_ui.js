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
    this.scores = this.getCookie();
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
        view.started = true;
        view.board.snake.turn(dir);
      }
    });
  };
  
  View.prototype.getCookie = function () {
    var scoreStr = $.cookie('scores');
    scores = [];
    _(scoreStr.split(",")).each(function (score) {
      scores.push(parseInt(score));
    });
    return scores || [0,0,0,0,0];
  };
  
  View.prototype.renderLoss = function () {
    this.renderScores();
    delete this.board;
    this.started = false;
    clearInterval(this.interval);
    this.start();
  };
  
  View.prototype.renderScores = function () {
    this.scores.push(this.board.score);
    this.scores = this.scores.sort(function (a,b) {
      return b-a;
    }).slice(0,5);
    $('.score').html('');
    _(this.scores).each(function (score) {
      $('.score').append(score + "<br>");      
    });
    this.setCookie(this.scores);
  };
  
  View.prototype.setCookie = function (scores) {
    var scoreStr = scores.join(",");
    $.cookie('scores', scoreStr, { expires: 365 });
  };

  View.prototype.start = function () {
    this.board = new SG.Board();
    this.installKeyHandlers();
    this.interval = setInterval(this.step.bind(this), 120);
  };
  
  View.prototype.step = function () {
    if (this.running && this.started) this.board.move();
    if (this.board.lost()) {
      this.renderLoss();
    } else {
      this.draw(); 
    }
  };
})(this);