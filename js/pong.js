//------------------------------------
//------------------------------------
//------------------------------------
var pongCanvas;
var pongContext;
var refSize;
var pongWindow = new Object();
var pongGame = new Object();
var timeCount;
//------------------------------------
//------------------------------------
//------------------------------------
function pongInit(){
  //console.log('pongInit');
  pongGame.score = 0;
  pongCanvas = $('#pong')[0];
  pongContext = pongCanvas.getContext('2d');
  pongContext.fillCircle = fillCircle;
  pongContext.clearAll = clearAll;
  pongWindow.left = $("#pong").offset().left;
  pongWindow.top = $("#pong").offset().top;
  pongWindow.color0 = "#333";
  pongWindow.color1 = "#222";
  pongWindow.color2 = "#339";
  pongWindow.color3 = "#66c";
  pongWindow.color4 = "#99f";
  pongWindow.fontStyle = "Arial";
  pongWindow.textAlign = "center";
  pongWindow.refreshDur = 100;
  pongWindow.ball = {x:0, y:0, raduse:10, speedX:10, speedY:10};
  pongWindow.paddle = {x:200,y:200, width:75, height:10};

  $(document).mousemove(onMouseMove2);
}
//------------------------------------
function clearAll(){
  pongContext.clearRect(0,0,pongCanvas.width,pongCanvas.height);
}
//------------------------------------
function fillCircle(x,y,raduse){
  this.beginPath();
  this.arc(x, y, raduse, 0, Math.PI*2);
  this.closePath();
  this.fill();
}
//------------------------------------
function resizeCanvas(){
  //console.log("resizeCanvas");
  if(pongCanvas != undefined){
    pongCanvas.width  = getDeviceDimensions().widthWithoutScrollbar;
    pongCanvas.height  = getDeviceDimensions().heightWithScrollbar;
    if(pongCanvas.width > pongCanvas.height){
      refSize = pongCanvas.height;
    }else{
      refSize = pongCanvas.width;
    }
  }
}
//------------------------------------
function addResizeFunction(){
  $( window ).resize(function() {
    resizeCanvas();
  });
}
//------------------------------------
function drawPong(myCanvas, myContext){
  //console.log("drawClock");
  if(myContext != undefined){
    myContext.fillStyle = pongWindow.color0;
    myContext.strokeStyle = pongWindow.color1;
    myContext.lineWidth = refSize * 0.01;
    myContext.font = Math.floor(refSize /18) +"px " + pongWindow.fontStyle;
    myContext.textAlign = pongWindow.textAlign;
    //----------------------------------------------------
    myContext.clearAll();
    myContext.fillCircle(pongWindow.ball.x, pongWindow.ball.y, pongWindow.ball.raduse);
    pongWindow.ball.x += pongWindow.ball.speedX;
    pongWindow.ball.y += pongWindow.ball.speedY;
    myContext.fillRect(pongWindow.paddle.x, pongWindow.paddle.y , pongWindow.paddle.width, pongWindow.paddle.height);
    myContext.fillText(pongGame.score, 10, 50);
  }
}
//--------------------------------------------------------
function degToRad(deg, toUp=true){
  if(toUp){
    return ((deg-90)/180) * Math.PI;
  }
  return (deg/180) * Math.PI;
}
function onMouseMove2(evt) {
  console.log(evt.pageX);
  if (evt.pageX > 0 && evt.pageX < (pongCanvas.width - pongWindow.paddle.width)) {
    pongWindow.paddle.x = evt.pageX;
  }else if (evt.pageX <= 0){
    pongWindow.paddle.x = 0;
  }else if (evt.pageX < (pongCanvas.width - pongWindow.paddle.width)){
    pongWindow.paddle.x = pongCanvas.width - pongWindow.paddle.width;
  }
}
//------------------------------------
//------------------------------------
//------------------------------------

//------------------------------------
//------------------------------------
//------------------------------------

//------------------------------------
//------------------------------------
//------------------------------------

//------------------------------------
//------------------------------------
//------------------------------------
$(document).ready(function(){
  pongInit();
  resizeCanvas();
  addResizeFunction();
  timeCount = setInterval(drawPong, pongWindow.refreshDur, pongCanvas, pongContext);
});
//------------------------------------
//------------------------------------
//------------------------------------

var game;
var paddlex;
var xAxis = 0;
var yAxis = 0;
var moveLeft = 1;
var moveDown = 3;

var ballSize = 10;
var ballSpeed = 10;

var paddleHeight = 11;
var paddleWidth = 75;
var color = "black"

var canvasMinX;
var canvasMaxX;
var score = 0;
var interval = setInterval(draw, 10);

function init_mouse() {
  canvasMinX = $("#canvas").offset().left;
  canvasMaxX = canvasMinX + 400;
}

function onMouseMove(evt) {
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddlex = evt.pageX - canvasMinX;
  }
}

$(document).mousemove(onMouseMove);

function init() {
  var canvas = document.getElementById('canvas');
  game = canvas.getContext('2d');
}

function init_paddle() {
  paddlex = 400 / 2;
}

function rectangle(xAxis, yAxis, width, height) {
  game.fillRect(xAxis, yAxis, width, height)
}

function circle(x,y,r) {
  game.beginPath();
  game.arc(x, y, r, 0, Math.PI*2, true);
  game.closePath();
  game.fill();
}

function clear() {
  game.clearRect(0, 0, 400, 300);
}

function draw() {
  console.log('draw');
  clear()
  circle(xAxis,yAxis,ballSize)
  rectangle(paddlex, 300-paddleHeight, paddleWidth, paddleHeight);

  if (xAxis + moveLeft > 400 || xAxis + moveLeft < 0)
    moveLeft = -moveLeft;
  if (yAxis + moveDown < 0)
    moveDown = -moveDown;
  else if (yAxis + moveDown > 300) {
    if (xAxis > paddlex && xAxis < paddlex + paddleWidth) {
      moveDown = -moveDown;
      score++
    }
    else {
      clearInterval(interval);
    }
  }

  xAxis += moveLeft;
  yAxis += moveDown;

  game.font = "48px serif";
  game.fillStyle = color;
  game.fillText(score, 10, 50);
}

init();
init_paddle();
init_mouse();
