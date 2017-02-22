//console.log('Background');
function Background(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  //-------------------------------------------------
  this.init = function(center, refSize) {
    this.center = {x:center.x, y:center.y};
    this.refSize = refSize;
    this.cir0 = {x: center.x, y: center.y, radius: this.refSize * 0.45};
    this.cir1 = {x: center.x, y: center.y, radius: this.refSize * 0.36};
    this.cir2 = {x: center.x, y: center.y, radius: this.refSize * 0.2};
    this.score = {
      number: 0,
      font: 'Impact',
      size: this.refSize * 0.120,
      center:{x: center.x, y: center.y * 1.1,}
    };
    this.topScore = {
      number: 0,
      font: 'Impact',
      size: this.refSize * 0.02,
      center:{x: 15, y: 25,}
    };
    this.borderWidth = this.refSize * 0.02;
	}
  //-------------------------------------------------
	this.draw = function(topScore) {
    this.myContext.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    this.myContext.strokeStyle = game.colors.c1;
    this.myContext.lineWidth = this.borderWidth;
    this.myContext.strokeCircle(this.cir1);
    this.myContext.fillStyle = game.colors.c1;
    this.myContext.fillCircle(this.cir2);
    //--
    this.topScore.number = topScore;
    this.myContext.font = this.topScore.size+"px "+ this.topScore.font;
    this.myContext.textAlign = 'left';
    this.myContext.fillStyle = '#333';
    //--
    this.myContext.fillText("Your Top Score = "+ this.topScore.number ,this.topScore.center.x, this.topScore.center.y);
    //--
    this.updateScore(this.score.number);
	};
  //-------------------------------------------------
  this.updateScore = function(score) {
    //--
    this.score.number = score;
    //--
    this.myContext.fillStyle = game.colors.c1;
    this.myContext.fillCircle(this.cir2);
    //--
    if(this.score.number > 999999){
      this.score.size = this.score.size * 0.6;
      this.score.center.y = this.center.y * 1.06;
    }
    this.myContext.font = this.score.size+"px "+ this.score.font;
    this.myContext.textAlign = 'center';
    this.myContext.fillStyle = '#fff';
    //--
    this.myContext.fillText(this.score.number ,this.score.center.x, this.score.center.y);
    //--
	};
  //-------------------------------------------------
}
