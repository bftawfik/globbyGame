//console.log('Avatar');
function Avatar(canvas, context) {
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
      x: this.center.x,
      y: this.center.y,
      width: this.refSize * 0.08,
      height: this.refSize * 0.12,
      fillColor: "#fff"
    };
    this.rec1 = {
      x: this.center.x + (this.rec0.width/2),
      y: this.center.y,
      width: this.rec0.width,
      height: this.rec0.width * 0.5,
      fillColor: "#c85388",
    };
    this.clearRec = {
      x: this.rec0.x,
      y: this.rec0.y,
      width: this.rec0.width,
      height: this.rec0.height
    };
    //--
    this.cir1 = {
      orgX:center.x+this.radius+(this.rec0.width*0.5),
      orgY:center.y,
      x:center.x+this.radius+(this.rec0.width*0.5),
      y:center.y,
      radius: this.rec0.width * 0.5,
      fillColor: "#c85388"
    };
    this.cir2 = {
      orgX:center.x+this.radius+this.rec0.width,
      orgY:center.y,
      x:center.x+this.radius+this.rec0.width,
      y:center.y,
      radius: this.rec0.width * 0.5,
      fillColor: "#c85388"
    };
    this.cir3 = {
      orgX:center.x+this.radius+(this.rec0.height*0.75),
      orgY:center.y+(this.rec0.width * 0.2),
      x:center.x+this.radius+(this.rec0.height*0.75),
      y:center.y+(this.rec0.width * 0.2),
      radius: this.rec0.width * 0.2,
      fillColor: "#fff"
    };
    this.cir4 = {
      orgX:center.x+this.radius+(this.rec0.height*0.75),
      orgY:center.y+(this.rec0.width * 0.2),
      x:center.x+this.radius+(this.rec0.height*0.75),
      y:center.y+(this.rec0.width * 0.2),
      radius: this.rec0.width * 0.1,
      fillColor: "#a6b5dc"
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
    this.cir1.x = this.cir1.orgX;
    this.cir1.y = this.cir1.orgY;
    if(this.state == 'in'){this.rotate(this.selfCenter, this.cir1, 180);};
    this.rotate(this.center, this.cir1, this.degAngle);
    //--
    this.cir2.x = this.cir2.orgX;
    this.cir2.y = this.cir2.orgY;
    if(this.state == 'in'){this.rotate(this.selfCenter, this.cir2, 180);};
    this.rotate(this.center, this.cir2, this.degAngle);
    //--
    this.cir3.x = this.cir3.orgX;
    this.cir3.y = this.cir3.orgY;
    if(this.state == 'in'){this.rotate(this.selfCenter, this.cir3, 180);};
    this.rotate(this.center, this.cir3, this.degAngle);
    //--
    this.cir4.x = this.cir4.orgX;
    this.cir4.y = this.cir4.orgY;
    if(this.state == 'in'){this.rotate(this.selfCenter, this.cir4, 180);};
    this.rotate(this.center, this.cir4, this.degAngle);
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
  //  this.buildBox(this.rec0);
    this.myContext.fillStyle = this.cir1.fillColor;
    this.myContext.fillCircle(this.cir1);
    this.myContext.fillCircle(this.cir2);
    this.buildBox(this.rec1);
    this.myContext.fillStyle = this.cir3.fillColor;
    this.myContext.fillCircle(this.cir3);
    this.myContext.fillStyle = this.cir4.fillColor;
    this.myContext.fillCircle(this.cir4);
	};
  //-------------------------------------------------
  this.clear = function() {
    this.myContext.clearRect(this.clearRec.clearPoint0.x, this.clearRec.clearPoint0.y, this.clearRec.clearPoint0.width, this.clearRec.clearPoint0.height);
	};
  //-------------------------------------------------
  this.switchState = function(){
    this.clear();
    if(this.state == "in"){
      this.state = "out";
      this.radius = this.refSize * this.outRadFact;
      this.selfCenter = {x:this.center.x+this.radius, y:this.center.y};
      this.cir1.orgX += this.refSize * 0.02;
      this.cir2.orgX += this.refSize * 0.02;
      this.cir3.orgX += this.refSize * 0.02;
      this.cir4.orgX += this.refSize * 0.02;
    }else if(this.state == "out"){
      this.state = "in";
      this.radius = this.refSize * this.inRadFact;
      this.selfCenter = {x:this.center.x+this.radius, y:this.center.y};
      this.cir1.orgX -= this.refSize * 0.02;
      this.cir2.orgX -= this.refSize * 0.02;
      this.cir3.orgX -= this.refSize * 0.02;
      this.cir4.orgX -= this.refSize * 0.02;
    }
  }
  //-------------------------------------------------
  this.animate = function(){
    //console.log('animate');
    this.clear();
    this.degAngle = (this.degAngle + this.degAngleSpeed) % 360;
    this.draw();
  }
  //-------------------------------------------------
  this.getHitRec = function(){
    var tempRec = {
      x: this.clearRec.clearPoint0.x+1,
      y: this.clearRec.clearPoint0.y+1,
      width: this.clearRec.clearPoint0.width-1,
      height: this.clearRec.clearPoint0.height-1,
      angle: this.degAngle,
      angleRange: 5,
      radius: this.radius,
    }
    if(this.state == "in"){
      tempRec.angleRange = 6;
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
  this.increaseSpeed = function(number){
    this.degAngleSpeed += number;
  }
  //-------------------------------------------------
}
