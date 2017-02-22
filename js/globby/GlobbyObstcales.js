//console.log('Obstcales');
function Obstcale(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  //-------------------------------------------------
  this.init = function(center, refSize, angle, state) {
    this.refSize = refSize;
    this.state = state;
    this.degAngle = angle;
    this.degAngleSpeed = 1;
    this.inRadFact = 0.35;
    this.outRadFact = 0.37;
    this.radius = this.refSize * this.outRadFact;
    if(this.state == 'in'){
      this.radius = this.refSize * this.inRadFact;
    }
    this.center = {x:center.x, y:center.y};
    this.selfCenter = {x:this.center.x+this.radius, y:this.center.y};
    //--
    this.rec0 = {
      x: this.center.x+(this.refSize * -0.025),
      y: this.center.y,
      width: this.refSize * 0.08,
      height: this.refSize * 0.1,
      fillColor: "#eee"
    };
    this.rec1 = {
      x: this.rec0.x,
      y: this.center.y,
      width: this.rec0.width * 0.5,
      height: this.rec0.height,
      fillColor: "#000",
    }
    this.clearRec = {
      x: this.rec0.x,
      y: this.rec0.y,
      width: this.rec0.width,
      height: this.rec0.height
    };
	}
  //-------------------------------------------------
  this.calculateAll = function() {
    this.toPoints({x:this.rec0.x, y:this.rec0.y}, this.rec0, this.radius);
    if(this.state == 'in'){this.rotateBox(this.selfCenter, this.rec0, 180);};
    this.rotateBox(this.center, this.rec0, this.degAngle);
    //--
    this.toPoints({x:this.rec1.x, y:this.rec1.y}, this.rec1, this.radius);
    if(this.state == 'in'){this.rotateBox(this.selfCenter, this.rec1, 180);};
    this.rotateBox(this.center, this.rec1, this.degAngle);
    //--
    this.toPoints({x:this.rec0.x, y:this.rec0.y}, this.clearRec, this.radius);
    if(this.state == 'in'){this.rotateBox(this.selfCenter, this.clearRec, 180);};
    this.rotateBox(this.center, this.clearRec, this.degAngle);
    var tempX = Math.min(this.clearRec.point0.x, this.clearRec.point1.x, this.clearRec.point2.x, this.clearRec.point3.x);
    var tempY = Math.min(this.clearRec.point0.y, this.clearRec.point1.y, this.clearRec.point2.y, this.clearRec.point3.y);
    this.clearRec.clearPoint0 = {x:tempX-1, y:tempY-1};
    var tempX = Math.max(this.clearRec.point0.x, this.clearRec.point1.x, this.clearRec.point2.x, this.clearRec.point3.x);
    var tempY = Math.max(this.clearRec.point0.y, this.clearRec.point1.y, this.clearRec.point2.y, this.clearRec.point3.y);
    this.clearRec.clearPoint0.width = (tempX - this.clearRec.clearPoint0.x)+1;
    this.clearRec.clearPoint0.height = (tempY - this.clearRec.clearPoint0.y)+1;
  }
  //-------------------------------------------------
	this.draw = function() {
    this.calculateAll();
    this.myContext.fillStyle = this.rec0.fillColor;
    this.buildBox(this.rec0);
    this.myContext.fillStyle = this.rec1.fillColor;
    this.buildBox(this.rec1);
    //this.clear();
	};
  //-------------------------------------------------
  this.clear = function() {
    this.myContext.fillStyle = "#ff0";
    this.myContext.clearRect(this.clearRec.clearPoint0.x, this.clearRec.clearPoint0.y, this.clearRec.clearPoint0.width, this.clearRec.clearPoint0.height);
	};
  //-------------------------------------------------
  this.toPoints = function(center, box, radius, basePoints = false){
    box.point0 = {x:center.x+radius, y:center.y+(box.width * 0.5)};
    box.point1 = {x:center.x+radius, y:center.y+(box.width * -0.5)};
    box.point2 = {x:center.x+box.height+radius, y:center.y+(box.width *-0.5)};
    box.point3 = {x:center.x+box.height+radius, y:center.y+(box.width *0.5)};
    if(basePoints){
      box.basePoint0={x:center.x+radius, y:center.y};
      box.basePoint1={x:center.x+radius+box.height, y:center.y};
    }
  }
  //-------------------------------------------------
  this.rotateBox = function(center, box, angle) {
    for (var point in box) {
      if (box.hasOwnProperty(point)) {
        if (box[point].hasOwnProperty('x')) {
          this.rotate(center, box[point], angle);
        }
      }
    }
  }
  //-------------------------------------------------
  this.rotate = function(center, point, angle) {
    var radians = (Math.PI / 180) * angle, cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (point.x - center.x)) - (sin * (point.y - center.y)) + center.x,
    ny = (cos * (point.y - center.y)) + (sin * (point.x - center.x)) + center.y;
    point.x = nx;
    point.y = ny;
  }
  //-------------------------------------------------
  this.buildBox = function(box){
    this.myContext.strokeStyle = "#333";
    this.myContext.beginPath();
    this.myContext.moveTo(box.point0.x, box.point0.y);
    this.myContext.lineTo(box.point1.x, box.point1.y);
    this.myContext.lineTo(box.point2.x, box.point2.y);
    this.myContext.lineTo(box.point3.x, box.point3.y);
    this.myContext.closePath();
    this.myContext.fill();
  }
  //-------------------------------------------------
  this.getHitRec = function(){
    this.toPoints({x:this.rec1.x, y:this.rec1.y}, this.rec1, this.radius);
    if(this.state == 'in'){this.rotateBox(this.selfCenter, this.rec1, 180);};
    this.rotateBox(this.center, this.rec1, this.degAngle);
    var tempX = Math.min(this.rec1.point0.x, this.rec1.point1.x, this.rec1.point2.x, this.rec1.point3.x);
    var tempY = Math.min(this.rec1.point0.y, this.rec1.point1.y, this.rec1.point2.y, this.rec1.point3.y);
    //--
    var tempRec = {
      x:tempX,
      y:tempY,
      angle: this.degAngle,
      angleRange: 3,
      radius: this.radius
    };
    if(this.state == "in"){
      tempRec.angleRange = 4;
    }
    //--
    var tempX = Math.max(this.rec1.point0.x, this.rec1.point1.x, this.rec1.point2.x, this.rec1.point3.x);
    var tempY = Math.max(this.rec1.point0.y, this.rec1.point1.y, this.rec1.point2.y, this.rec1.point3.y);
    //--
    tempRec.width = tempX - tempRec.x;
    tempRec.height = tempY - tempRec.y;
    return tempRec;
  }
  //-------------------------------------------------
  this.increaseSpeed = function(number){
    this.degAngleSpeed += number;
  }
  //-------------------------------------------------
}
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
function Obstcales(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  //-------------------------------------------------
  this.init = function(center, refSize, angle) {
    this.refSize = refSize;
    this.degAngle = angle;
    this.degAngleSpeed = 1;
    this.center = {x:center.x, y:center.y};
    //--
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
  //-------------------------------------------------
  this.createObst = function(){
    var obst = new Obstcale(this.myCanvas, this.myContext);
    this.randomDegAngle = this.degAngle + 10 - Math.floor(Math.random() * 20);
    if(Math.floor(Math.random() * 2) == 0){
      this.randomDirection = "in";
    }else{
      this.randomDirection = "out";
    }
    obst.init(this.center, this.refSize, this.randomDegAngle , this.randomDirection);
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
  //-------------------------------------------------
  this.clearAll = function(){
    this.allObstcales = undefined;
    this.myContext.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }
  //-------------------------------------------------
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
  //-------------------------------------------------
  this.chickAngleRange = function(a1, ar1, a2, ar2){
    if((a1-ar1) <= (a2+ar2) && (a2-ar2) <= (a1+ar1)){
      return true;
    }
    return false;
  }
  //-------------------------------------------------
  this.chickPassedObst = function(obj) {
    var avatarDim = obj;
    var obstDim = {};
    for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
      if(this.allObstcales[obstCount] != undefined){
        obstDim = this.allObstcales[obstCount].getHitRec();
        var chickIn = this.chickAngleRange(avatarDim.angle, avatarDim.angleRange, obstDim.angle, obstDim.angleRange);
        if(chickIn){
          //console.log('chickIn');
          var obst = this.allObstcales[obstCount];
          this.allObstcales[obstCount] = undefined;
          obst.clear();
        }
      }
    }
  }

  //-------------------------------------------------
  this.chickForCollision = function(obj){
    //console.log('chickForCollision');
    var avatarDim = obj;
    var obstDim = {};
    for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
      if(this.allObstcales[obstCount] != undefined){
        obstDim = this.allObstcales[obstCount].getHitRec();
        if(avatarDim.radius == obstDim.radius){
          var chickIn = this.chickAngleRange(avatarDim.angle, avatarDim.angleRange, obstDim.angle, obstDim.angleRange);
          if(chickIn){
            var obst = this.allObstcales[obstCount];
            this.allObstcales[obstCount] = undefined;
            obst.clear();
            return true;
          }
        }
      }
    }
  }
  //-------------------------------------------------
  this.increaseSpeed = function(number){
    for(var obstCount = 0; obstCount < this.allObstcales.length; obstCount++){
      if(this.allObstcales[obstCount] != undefined){
        var obst = this.allObstcales[obstCount];
        obst.increaseSpeed(number);
      }
    }
  }
  //-------------------------------------------------
}
