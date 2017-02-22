function Collectable(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  //-------------------------------------------------
  this.init = function(center, refSize, angle, state) {
    //console.log('init');
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
    this.cir1 = {
      orgX:center.x+this.radius+(this.refSize * 0.015),
      orgY:center.y,
      x:center.x+this.radius+(this.refSize * 0.015),
      y:center.y,
      radius:this.refSize * 0.015,
      fillColor: "#e7ba69"
    };
    //--
    this.clearRec = {
      x: this.center.x,
      y: this.center.y,
      width: this.refSize * 0.03,
      height: this.refSize * 0.03,
    };
    //--
	}
  //-------------------------------------------------
  this.calculateAll = function() {
    this.cir1.x = this.cir1.orgX;
    this.cir1.y = this.cir1.orgY;
    if(this.state == 'in'){this.rotate(this.selfCenter, this.cir1, 180);};
    this.rotate(this.center, this.cir1, this.degAngle);
    //--
    this.toPoints(this.center, this.clearRec, this.radius);
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
    this.myContext.fillStyle = this.cir1.fillColor;
    //this.buildBox(this.clearRec);
    this.myContext.fillCircle(this.cir1);
	};
  //-------------------------------------------------
  this.clear = function() {
    console.log('clear');
    this.myContext.clearRect(this.clearRec.clearPoint0.x, this.clearRec.clearPoint0.y, this.clearRec.clearPoint0.width, this.clearRec.clearPoint0.height);
	};
  //-------------------------------------------------
  this.getHitRec = function(){
    var tempRec = {
      x: this.clearRec.clearPoint0.x+1,
      y: this.clearRec.clearPoint0.y+1,
      width: this.clearRec.clearPoint0.width-1,
      height: this.clearRec.clearPoint0.height-1,
      angle: this.degAngle,
      angleRange: 2,
      radius: this.radius,
    }
    if(this.state == "in"){
      tempRec.angleRange = 3;
    }
    return tempRec;
  }
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
function Collectables(canvas, context) {
  this.myCanvas = canvas;
  this.myContext = context;
  //-------------------------------------------------
  this.init = function(center, refSize, angle) {
    this.refSize = refSize;
    this.degAngle = angle;
    this.degAngleSpeed = 1;
    this.center = {x:center.x, y:center.y};
    //--
    if(this.allCollectables == undefined){
      this.allCollectables = [];
    }else{
      for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
        var coll = this.allObstcales[collCount];
        if(coll != undefined){
          coll.draw();
        }
      }
    }
  }
  //-------------------------------------------------
  this.createCollect = function(){
    var coll = new Collectable(this.myCanvas, this.myContext);
    this.randomDegAngle = this.degAngle + 10 - Math.floor(Math.random() * 20);
    if(Math.floor(Math.random() * 2) == 0){
      this.randomDirection = "in";
    }else{
      this.randomDirection = "out";
    }
    coll.init(this.center, game.dimentions.refSize ,this.randomDegAngle , this.randomDirection);
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
  //-------------------------------------------------
  this.clearAll = function(){
    this.allCollectables = undefined;
    this.myContext.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    //coll.clear();
  }
  //-------------------------------------------------
  this.animate = function(){
    if(this.counter == undefined){
      this.counter = 0;
    }else{
      this.counter++;
    }
    this.counter = this.counter % 120;
    if(this.counter == 30){
      this.createCollect();
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
    //console.log('chickPassedObst');
    var avatarDim = obj;
    var collDim = {};
    for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
      if(this.allCollectables[collCount] != undefined){
        collDim = this.allCollectables[collCount].getHitRec();
        var chickIn = this.chickAngleRange(avatarDim.angle, avatarDim.angleRange, collDim.angle, collDim.angleRange);
        if(chickIn){
          //console.log('chickIn--0');
          var coll = this.allCollectables[collCount];
          this.allCollectables[collCount] = undefined;
          //console.log(coll);
          coll.clear();
        }
      }
    }
  }
  //-------------------------------------------------
  this.chickForCollision = function(obj){
    //console.log('chickForCollision');
    var avatarDim = obj;
    var collDim = {};
    for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
      if(this.allCollectables[collCount] != undefined){
        collDim = this.allCollectables[collCount].getHitRec();
        if(avatarDim.radius == collDim.radius){
          var chickIn = this.chickAngleRange(avatarDim.angle, avatarDim.angleRange, collDim.angle, collDim.angleRange);
          if(chickIn){
            var coll = this.allCollectables[collCount];
            this.allCollectables[collCount] = undefined;
            coll.clear();
            return true;
          }
        }
      }
    }
  }
  //-------------------------------------------------
  this.increaseSpeed = function(number){
    for(var collCount = 0; collCount < this.allCollectables.length; collCount++){
      if(this.allCollectables[collCount] != undefined){
        var coll = this.allCollectables[collCount];
        coll.increaseSpeed(number);
      }
    }
  }
  //-------------------------------------------------
}
