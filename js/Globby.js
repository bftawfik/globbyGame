//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
var dependants = {};
//--
var game = {
  dimentions:{
    width: 0,
    height: 0,
    center:{x:0, y:0},
    refSize:0
  },
  bgCanvas:undefined,
  bgContext:undefined,
  obstCanvas:undefined,
  obstContext:undefined,
  collCanvas:undefined,
  collContext:undefined,
  avatCanvas:undefined,
  avatContext:undefined,
  colors:{
    c1:"#333",
    c2:"#666",
    c3:"#fff"
  }
};
//--
var setion = {
  score:0,
  topScore:0,
  animating: false,
  setionEnded: false,
  speedIncrease: 0.2,
};
//--
var speedIncrInterval;
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function fillCircle(obj){
  this.beginPath();
  this.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
  this.closePath();
  this.fill();
}
//---------------------------------------------------------------
function strokeCircle(obj){
  this.beginPath();
  this.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
  this.closePath();
  this.stroke();
}
//---------------------------------------------------------------
//---------------------------------------------------------------
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
function updateDimensions(){
  if(getWidth() > getHeight()){
    game.dimentions.refSize = getHeight();
  }else{
    game.dimentions.refSize = getWidth();
  }
  game.dimentions.center.x = game.dimentions.refSize * 0.5;
  game.dimentions.center.y = game.dimentions.refSize * 0.5;
  return game.dimentions.refSize;
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
function updateHtml(){
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
  //--
  resizeCanvas();
  updatePlayBtn();
}
//---------------------------------------------------------------
function addResizeFunction(){
  $( window ).resize(function() {
    resizeCanvas();
    updatePlayBtn();
    setion.setionEnded = true;
  });
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function Dependants(){
  this.init = function(){
    this.ownDependants = [];
    for(var depCount = 0; depCount < arguments.length; depCount++){
      var dependant = {
        path: arguments[depCount],
        loaded: false
      }
      this.ownDependants.push(dependant);
    }
  };
  this.getDependants = function(){
    var tempDependants = [];
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      tempDependants.push(this.ownDependants[depCount].path);
    }
    return tempDependants;
  }
  this.setDependant = function(url){
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      if(url == this.ownDependants[depCount].path){
        this.ownDependants[depCount].loaded = true;
      }
    }
  };
  this.chickAllLoaded = function(){
    var allLoaded = true;
    for(var depCount = 0; depCount < this.ownDependants.length; depCount++){
      if(! this.ownDependants[depCount].loaded){
        return this.ownDependants[depCount].loaded;
      }
    }
    return allLoaded;
  }
};
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function loadDependants(){
  var dependantsList = dependants.getDependants();
  for(var depCount = 0; depCount < dependantsList.length; depCount++){
    $.getScript(dependantsList[depCount], function(){
      dependantIsLoaded(this.url.slice(0,this.url.indexOf(".js")+3));
    });
  }
};
//---------------------------------------------------------------
function dependantIsLoaded(url){
  dependants.setDependant(url);
}
//---------------------------------------------------------------
function chickAllDependantsLoaded(){
  if(! dependants.chickAllLoaded()){
    requestAnimFrame(chickAllDependantsLoaded);
  }else{
    initGame();
  }
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function buildGame(){
  setion.bg = new Background(game.bgCanvas, game.bgContext);
  //--
  setion.avatar = new Avatar(game.avatCanvas, game.avatContext);
  //--
  setion.obstcales = new Obstcales(game.obstCanvas, game.obstContext);
  //--
  setion.collectables = new Collectables(game.collCanvas, game.collContext);
}
//---------------------------------------------------------------
function resetGame(){
  setion.bg.init(game.dimentions.center, game.dimentions.refSize);
  setion.bg.draw(setion.topScore);
  //--
  setion.avatar.init(game.dimentions.center, game.dimentions.refSize, 270, "out");
  setion.avatar.draw();
  //--
  setion.obstcales.init(game.dimentions.center, game.dimentions.refSize, 90);
  //--
  setion.collectables.init(game.dimentions.center, game.dimentions.refSize, 90);
}
//---------------------------------------------------------------
function activatePlayBtn(){
  $('#playBtn').on('click', function(event) {
    event.preventDefault();
    if(setion.animating == false){
      setion.animating = true;
      speedIncrInterval = setInterval(increaseGameSpeed, 10000);
      requestAnimFrame(animateGame);
    }else if(setion.animating == true){
      if(setion.setionEnded == false){
        setion.avatar.switchState();
      }else{
        resetSetion();
      }
    }
    //requestAnimFrame(animateGame);
  });
}
//---------------------------------------------------------------
function increaseGameSpeed(){
  console.log('increaseGameSpeed');
  setion.avatar.increaseSpeed(setion.speedIncrease);
  setion.collectables.increaseSpeed(setion.speedIncrease);
  setion.obstcales.increaseSpeed(setion.speedIncrease);
}
//---------------------------------------------------------------
function animateGame(){
  //--
  setion.avatar.animate();
  setion.collectables.animate();
  setion.obstcales.animate();
  //--
  if(setion.collectables.chickForCollision(setion.avatar.getHitRec())){
    setion.score++;
    setion.bg.updateScore(setion.score);
    // console.log('setion.score');
    // console.log(setion.score);
  }else{
    setion.collectables.chickPassedObst(setion.avatar.getHitRec());
    //requestAnimFrame( animateGame );
  }
  //--
  if(setion.obstcales.chickForCollision(setion.avatar.getHitRec())){
    setion.avatar.clear();
    //console.log('chickForCollision');
    clearInterval(speedIncrInterval);
    console.log('Game is Ended !!');
    setion.setionEnded = true;
  }else{
    setion.obstcales.chickPassedObst(setion.avatar.getHitRec());
    console.log(setion.setionEnded == false);
    if(setion.setionEnded == false){
      requestAnimFrame( animateGame );
    }
  }
  //--
};
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function initGame(){
  //console.log('initGame');
  buildGame();
  resetGame();
  activatePlayBtn();
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function resetSetion(){
  //onsole.log('resetSetion');
  if(setion.topScore < setion.score){
    setion.topScore = setion.score;
  }
  setion.score = 0;
  //console.log(setion.topScore);
  setion.collectables.clearAll();
  setion.obstcales.clearAll();
  resetGame();
  setion.setionEnded = false;
  setion.animating = false;
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
$(function(){
  updateHtml();
  addResizeFunction();
  dependants = new Dependants();
  dependants.init("js/snippets/angleFuncs.js", "js/globby/GlobbyBackground.js", "js/globby/GlobbyAvatar.js", "js/globby/GlobbyObstcales.js", "js/globby/GlobbyCollectables.js");
  loadDependants();
  requestAnimFrame(chickAllDependantsLoaded);
});
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
