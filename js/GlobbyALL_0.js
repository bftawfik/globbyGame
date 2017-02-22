var game = {dimentions:{width: 0, height: 0, refSize:0}, bgCanvas:undefined, bgContext:undefined, obstCanvas:undefined, obstContext:undefined, collCanvas:undefined, collContext:undefined, avatCanvas:undefined, avatContext:undefined, colors:{c1:"#333", c2:"#666", c3:"#fff"}};
var setion = {score:0, animating: false};
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function init(){
  game.bgCanvas = $('#gameBg')[0];
  game.bgContext = game.bgCanvas.getContext('2d');
  game.bgContext.fillCircle = fillCircle;
  game.bgContext.strokeCircle = strokeCircle;
  game.obstCanvas = $('#gameObst')[0];
  game.obstContext =  game.obstCanvas.getContext('2d');
  game.obstContext.fillCircle = fillCircle;
  game.obstContext.strokeCircle = strokeCircle;
  game.collCanvas = $('#gameColl')[0];
  game.collContext = game.collCanvas.getContext('2d');
  game.collContext.fillCircle = fillCircle;
  game.collContext.strokeCircle = strokeCircle;
  game.avatCanvas = $('#gameAvat')[0];
  game.avatContext = game.avatCanvas.getContext('2d');
  game.avatContext.fillCircle = fillCircle;
  game.avatContext.strokeCircle = strokeCircle;
}
//---------------------------------------------------------------
function updateDimensions(){
  if(getWidth() > getHeight()){
    game.dimentions.refSize = getHeight();
  }else{
    game.dimentions.refSize = getWidth();
  }
  return game.dimentions.refSize;
}
//---------------------------------------------------------------
function getWidth(){
  game.dimentions.width = $("body").prop("clientWidth");
  return game.dimentions.width;
}
//---------------------------------------------------------------
function getHeight(){
  if(window.innerHeight > 0){
    game.dimentions.height = window.innerHeight;
  }else{
    game.dimentions.height = screen.height;
  }
  return game.dimentions.height;
}
//---------------------------------------------------------------
function resizeCanvas(){
  updateDimensions();
  if(game.bgCanvas != undefined){
    game.bgCanvas.width = game.dimentions.refSize;
    game.bgCanvas.height = game.dimentions.refSize;
  }
  if(game.obstCanvas != undefined){
    game.obstCanvas.width = game.dimentions.refSize;
    game.obstCanvas.height = game.dimentions.refSize;
  }
  if(game.collCanvas != undefined){
    game.collCanvas.width = game.dimentions.refSize;
    game.collCanvas.height = game.dimentions.refSize;
  }
  if(game.avatCanvas != undefined){
    game.avatCanvas.width = game.dimentions.refSize;
    game.avatCanvas.height = game.dimentions.refSize;
  }
}
//---------------------------------------------------------------
function addResizeFunction(){
  $( window ).resize(function() {
    resizeCanvas();
    updatePlayBtn();
    build();
  });
}
//---------------------------------------------------------------
function Background(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize) {
    this.cir0 = {x: refSize * 0.5, y: refSize * 0.5, radius: refSize * 0.45};
    this.cir1 = {x: refSize * 0.5, y: refSize * 0.5, radius: refSize * 0.36};
    this.cir2 = {x: refSize * 0.5, y: refSize * 0.5, radius: refSize * 0.2};
    this.borderWidth = refSize * 0.02;
	}
	this.draw = function() {
    this.myContext.strokeStyle = game.colors.c1;
    this.myContext.lineWidth = this.borderWidth;
    this.myContext.strokeCircle(this.cir1.x, this.cir1.y , this.cir1.radius);
    this.myContext.fillStyle = game.colors.c1;
    this.myContext.fillCircle(this.cir2.x, this.cir2.y , this.cir2.radius);
	};
}
//---------------------------------------------------------------
function Avatar(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize, angle, state) {
    this.refSize = refSize;
    this.state = state;
    this.degAngle = angle;
    this.radAngle = degToRad(this.degAngle);
    this.radAngleIn = degToRad(this.degAngle + 180);
    this.degAngleSpeed = 1;
    this.inRadFact = 0.35;
    this.outRadFact = 0.37;
    //--
    this.rec0 = {
      x: this.refSize * -0.04,
      y: 0,
      width: this.refSize * 0.08,
      height: this.refSize * -0.12,
      fillColor: "#fff"
    };
    this.rec1 = {x: this.rec0.x, y: this.rec0.width * -0.5, width: this.rec0.width, height: this.rec0.width * -0.5, fillColor: "#00f",};
    this.clearRec = {
      x: this.rec0.x-1,
      y: this.rec0.y+1,
      width: this.rec0.width+2,
      height: this.rec0.height-2
    };
    //--
    this.cir0 = {x: this.refSize * 0.5, y: this.refSize * 0.5, radius: this.refSize * this.inRadFact};
    this.cir1 = {x: this.rec0.x - (this.rec0.width * -0.5), y: this.rec0.width * -0.5, radius: this.rec0.width * 0.5, fillColor: "#00f"};
    this.cir2 = {x: this.rec0.x - (this.rec0.width * -0.5), y: this.rec0.width * -1, radius: this.rec0.width * 0.5, fillColor: "#00f"};
    this.cir3 = {x: this.rec0.x - (this.rec0.width * -0.5), y: this.rec0.width * -1, radius: this.rec0.width * 0.2, fillColor: "#fff", };
    this.cir4 = {x: this.rec0.x - (this.rec0.width * -0.5), y: this.rec0.width * -1, radius: this.rec0.width * 0.15, fillColor: "#ff0", };
    //this.cir4 = {radius: refSize * 0.01, fillColor: "#00f"};
    if(this.state == "out"){
      this.cir0.radius = this.refSize * this.outRadFact;
    }
    this.centerX = this.cir0.x + (Math.sin(this.radAngle) * this.cir0.radius);
    this.centerY = this.cir0.y + (Math.cos(this.radAngle) * this.cir0.radius);
	}
	this.draw = function() {
    this.myContext.fillStyle = this.cir1.fillColor;
    this.myContext.translate(this.centerX, this.centerY);
    if(this.state == "in"){
      this.myContext.rotate(Math.PI - this.radAngleIn);
    }else if(this.state == "out"){
      this.myContext.rotate(Math.PI - this.radAngle);
    }
    this.myContext.fillCircle(this.cir1.x, this.cir1.y, this.cir1.radius);
    this.myContext.fillCircle(this.cir2.x, this.cir2.y, this.cir1.radius);
    this.myContext.fillRect(this.rec1.x, this.rec1.y, this.rec1.width, this.rec1.height);
    this.myContext.fillStyle = this.cir3.fillColor;
    this.myContext.fillCircle(this.cir3.x, this.cir3.y, this.cir3.radius);
    this.myContext.fillStyle = this.cir4.fillColor;
    this.myContext.fillCircle(this.cir4.x, this.cir4.y, this.cir4.radius);
    if(this.state == "in"){
      this.myContext.rotate((Math.PI - this.radAngleIn) * -1);
    }else if(this.state == "out"){
      this.myContext.rotate((Math.PI - this.radAngle) * -1);
    }
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.clear = function() {
    this.myContext.translate(this.centerX, this.centerY);
    if(this.state == "in"){
      this.myContext.rotate(Math.PI - this.radAngleIn);
    }else if(this.state == "out"){
      this.myContext.rotate(Math.PI - this.radAngle);
    }
    this.myContext.clearRect(this.clearRec.x, this.clearRec.y, this.clearRec.width, this.clearRec.height);
    if(this.state == "in"){
      this.myContext.rotate((Math.PI - this.radAngleIn) * -1);
    }else if(this.state == "out"){
      this.myContext.rotate((Math.PI - this.radAngle) * -1);
    }
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.switchState = function(){
    this.clear();
    if(this.state == "in"){
      this.state = "out";
      this.cir0.radius = this.refSize * this.outRadFact;
    }else if(this.state == "out"){
      this.state = "in";
      this.cir0.radius = this.refSize * this.inRadFact;
    }
  }
  this.animate = function(){
    //console.log('animate');
    this.clear();
    this.degAngle = (this.degAngle + this.degAngleSpeed) % 360;
    this.radAngle = degToRad(this.degAngle);
    this.radAngleIn = degToRad(this.degAngle + 180);
    this.centerX = this.cir0.x + (Math.sin(this.radAngle) * this.cir0.radius);
    this.centerY = this.cir0.y + (Math.cos(this.radAngle) * this.cir0.radius);
    this.draw();
  }
  this.getDegAngle = function() {
    return this.degAngle;
  }
  this.getClearRec = function(){
    var tempRec = {
      x: this.clearRec.x,
      y: this.clearRec.y,
      width: this.clearRec.width,
      height: this.clearRec.height,
      angle: this.degAngle,
      radius: this.cir0.radius,
    }
    return tempRec;
  }
}
//---------------------------------------------------------------
function Obstcale(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize, angle, state) {
    this.state = state;
    this.degAngle = angle;
    this.radAngle = degToRad(this.degAngle);
    this.cir0 = {x: refSize * 0.5, y: refSize * 0.5, radius: refSize * 0.270};
    if(this.state == "out"){
      this.cir0.radius = refSize * 0.347;
    }
    this.centerX = this.cir0.x + (Math.sin(this.radAngle) * this.cir0.radius);
    this.centerY = this.cir0.y + (Math.cos(this.radAngle) * this.cir0.radius);
    this.rec0 = {
      width: refSize * 0.08,
      height: refSize * 0.1,
      fillColor: "#eee",
    }
    this.rec1 = {
      width: refSize * 0.04,
      height: refSize * 0.1,
      fillColor: "#000",
    }
	}
	this.draw = function() {
    this.myContext.fillStyle = this.rec0.fillColor;
    this.myContext.translate(this.centerX, this.centerY);
    this.myContext.rotate(this.radAngle * -1);
    //if(this.state == "in"){
      this.myContext.fillRect(this.rec0.width/-2, 0, this.rec0.width, this.rec0.height);
      this.myContext.fillStyle = this.rec1.fillColor;
      this.myContext.fillRect(this.rec1.width/-2, 0, this.rec1.width, this.rec1.height);
    this.myContext.rotate(this.radAngle);
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.clear = function() {
    this.myContext.translate(this.centerX, this.centerY);
    this.myContext.rotate(this.radAngle * -1);
    if(this.state == "in"){
      this.myContext.clearRect((this.rec0.width/-2) -1, -1, (this.rec0.width) +2, (this.rec0.height) +2);
    }else if(this.state == "out"){
      this.myContext.clearRect((this.rec0.width/-2) -1, -1, this.rec0.width+2, this.rec0.height+2);
    }
    this.myContext.rotate(this.radAngle);
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.getDegAngle = function() {
    return this.degAngle;
  }
}
//---------------------------------------------------------------
function Obstcales(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize, startAngle){
    this.degAngle = startAngle;
    this.degAngleSpeed = 1;
    this.refSize = refSize;
    if(this.allObstcales == undefined){
      this.allObstcales = [];
    }else{
      for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
        var obst = this.allObstcales[obstCount];
        if(obst != undefined){
          obst.draw();
        }
      }
    }
  }
  this.createObst = function(){
    var obst = new Obstcale(this.myCanvas, this.myContext);
    this.randomDegAngle = this.degAngle + 20 - Math.floor(Math.random() * 40);
    if(Math.floor(Math.random() * 2) == 0){
      this.randomDirection = "in";
    }else{
      this.randomDirection = "out";
    }
    obst.init(game.dimentions.refSize ,this.randomDegAngle , this.randomDirection);
    obst.draw();
    var noEmptyPlace = true;
    for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
      if(this.allObstcales[obstCount] == undefined){
        this.allObstcales[obstCount] = obst;
        noEmptyPlace = false;
      }
    }
    if(noEmptyPlace){
      this.allObstcales.push(obst);
    }
  }
  this.clearAll = function(){
    obst.clear();
  }
  this.animate = function(){
    if(this.counter == undefined){
      this.counter = 0;
    }else{
      this.counter++;
    }
    this.counter = this.counter % 60;
    if(this.counter == 0){
      this.createObst();
    }
    this.degAngle = (this.degAngle + this.degAngleSpeed) % 360;
  }
  this.chickPassedObst = function(avatDegAngle) {
    for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
      //console.log(avatDegAngle + "                " + this.allObstcales[obstCount].getDegAngle());
      if(this.allObstcales[obstCount] != undefined){
        if(this.allObstcales[obstCount].getDegAngle() == avatDegAngle){
          //console.log("found One !!");
          var obst = this.allObstcales[obstCount];
          this.allObstcales[obstCount] = undefined;
          obst.clear();
        }
      }
    }
  }
  this.chickForCollision = function(){
    // if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
    // 		object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) {
    // // The objects are touching
    // }
  }
}
//---------------------------------------------------------------
function Collectable(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize, angle, state) {
    this.state = state;
    this.degAngle = angle;
    this.radAngle = degToRad(this.degAngle);
    this.cir0 = {x: refSize * 0.5, y: refSize * 0.5, radius: refSize * 0.34};
    this.cir1 = {radius: refSize * 0.01, fillColor: "#00f"};
    if(this.state == "out"){
      this.cir0.radius = refSize * 0.38;
    }
    this.centerX = this.cir0.x + (Math.sin(this.radAngle) * this.cir0.radius);
    this.centerY = this.cir0.y + (Math.cos(this.radAngle) * this.cir0.radius);
	}
	this.draw = function() {
    this.myContext.fillStyle = this.cir1.fillColor;
    this.myContext.translate(this.centerX, this.centerY);
    this.myContext.fillCircle(0, 0, this.cir1.radius);
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.clear = function() {
    this.myContext.translate(this.centerX, this.centerY);
    this.myContext.clearRect((this.cir1.radius+1) * -1, (this.cir1.radius+1) * -1, (this.cir1.radius * 2) +2, (this.cir1.radius * 2) +2);
    this.myContext.translate(this.centerX * -1, this.centerY * -1);
	};
  this.getDegAngle = function() {
    return this.degAngle;
  }
}
//---------------------------------------------------------------
function Collectables(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  this.init = function(refSize, startAngle){
    this.degAngle = startAngle;
    this.degAngleSpeed = 1;
    this.refSize = refSize;
    this.allCollectables = [];
  }
  this.createCollect = function(){
    var coll = new Collectable(this.myCanvas, this.myContext);
    this.randomDegAngle = this.degAngle + 20 - Math.floor(Math.random() * 40);
    if(Math.floor(Math.random() * 2) == 0){
      this.randomDirection = "in";
    }else{
      this.randomDirection = "out";
    }
    coll.init(game.dimentions.refSize ,this.randomDegAngle , this.randomDirection);
    coll.draw();
    var noEmptyPlace = true;
    for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
      if(this.allCollectables[collCount] == undefined){
        this.allCollectables[collCount] = coll;
        noEmptyPlace = false;
      }
    }
    if(noEmptyPlace){
      this.allCollectables.push(coll);
    }
  }
  this.clearAll = function(){
    //obst.clear();
  }
  this.animate = function(){
    if(this.counter == undefined){
      this.counter = 0;
    }else{
      this.counter++;
    }
    this.counter = this.counter % 120;
    if(this.counter == 119){
      this.createCollect();
    }
    this.degAngle = (this.degAngle + this.degAngleSpeed) % 360;
  }
  this.chickPassedColl = function(avatDegAngle) {
    for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
      if(this.allCollectables[collCount] != undefined){
        if(this.allCollectables[collCount].getDegAngle() == avatDegAngle){
          //console.log("found One !!");

          var coll = this.allCollectables[collCount];
          this.allCollectables[collCount] = undefined;
          coll.clear();
        }
      }
    }
  }
}
//---------------------------------------------------------------
function fillCircle(x,y,radius){
  this.beginPath();
  this.arc(x, y, radius, 0, Math.PI*2);
  this.closePath();
  this.fill();
}
//---------------------------------------------------------------
function strokeCircle(x,y,radius){
  this.beginPath();
  this.arc(x, y, radius, 0, Math.PI*2);
  this.closePath();
  this.stroke();
}
//---------------------------------------------------------------
function degToRad(deg){
  return (deg/180) * Math.PI;
}
//---------------------------------------------------------------
function build(){
  setion.bg = new Background(game.bgCanvas, game.bgContext);
  setion.bg.init(game.dimentions.refSize);
  setion.bg.draw();
  //--
  setion.avatar = new Avatar(game.avatCanvas, game.avatContext);
  setion.avatar.init(game.dimentions.refSize, 180, "out");
  setion.avatar.draw();
  //--
  setion.obstcales = new Obstcales(game.obstCanvas, game.obstContext);
  setion.obstcales.init(game.dimentions.refSize, 90);
  //--
  setion.collectables = new Collectables(game.collCanvas, game.collContext);
  setion.collectables.init(game.dimentions.refSize, 30);
  //--
}
//---------------------------------------------------------------
function updatePlayBtn(){
  var leftArea = {};
  if(getWidth() > getHeight()){
    leftArea.width = getWidth() - getHeight();
    leftArea.height = getHeight();
    leftArea.x = getHeight();
    leftArea.y = 0;
  }else{
    leftArea.width = getWidth();
    leftArea.height = getHeight() - getWidth();
    leftArea.x = 0;
    leftArea.y = getWidth();
  }
  if(leftArea.width > leftArea.height){
    leftArea.refSize = leftArea.height;
  }else{
    leftArea.refSize = leftArea.width;
  }
  var playBtnArea = {};
  playBtnArea.width = leftArea.refSize *  0.6;
  playBtnArea.height = leftArea.refSize *  0.6;
  playBtnArea.x = leftArea.x + ((leftArea.width - playBtnArea.width)/2);
  playBtnArea.y = leftArea.y + ((leftArea.height - playBtnArea.height)/2);
  playBtnArea.borderRadius = playBtnArea.width / 2;
  $('#playBtn').css({
    'width': playBtnArea.width,
    'height': playBtnArea.height,
    'left': playBtnArea.x,
    'top': playBtnArea.y,
    'border-radius': playBtnArea.borderRadius,
  });
}
//---------------------------------------------------------------
function activatePlayBtn(){
  $('#playBtn').on('click', function(event) {
    event.preventDefault();
    if(setion.animating == false){
      setion.animating = true;
      requestAnimFrame(animate);
    }else if(setion.animating == true){
      setion.avatar.switchState();
    }
  });
}
//---------------------------------------------------------------
function animate(){
  //console.log('animate');
  setion.avatar.animate();
  setion.obstcales.animate();
  setion.obstcales.chickPassedObst(setion.avatar.getDegAngle());
  setion.collectables.animate();
  setion.collectables.chickPassedColl(setion.avatar.getDegAngle());
  requestAnimFrame( animate );
};
//---------------------------------------------------------------
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
//---------------------------------------------------------------
$(function(){
  init();
  resizeCanvas();
  addResizeFunction();
  build();
  updatePlayBtn();
  activatePlayBtn();
});
