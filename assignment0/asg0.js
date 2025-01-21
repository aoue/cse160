// DrawTriangle.js (c) 2012 matsuda

var canvas;
var ctx;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Fill background with black using a black rectangle
  reset();
}

function reset() {
  // wipe and redraw bg
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
}

function drawVector(v, color) {
  // get canvas center coordinates
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + v.elements[0]*20, cy - v.elements[1]*20, 0);
  ctx.stroke();
}

function handleDrawEvent() {
  reset();

  // draw v1
  var x1 = document.getElementById('v1x').value;
  var y1 = document.getElementById('v1y').value;
  var v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, 'red');

  // draw v2
  var x2 = document.getElementById('v2x').value;
  var y2 = document.getElementById('v2y').value;
  var v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, 'rgba(135, 206, 250, 1.0)');
  // drawVector(v2, 'blue'); //can barely see it
}

function handleDrawOperationEvent() {
  reset();

  // draw v1
  var x1 = document.getElementById('v1x').value;
  var y1 = document.getElementById('v1y').value;
  var v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, 'red');

  // draw v2
  var x2 = document.getElementById('v2x').value;
  var y2 = document.getElementById('v2y').value;
  var v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, 'rgba(135, 206, 250, 1.0)');
  // drawVector(v2, 'blue'); //can barely see it

  // depending on selection:
  var op = document.getElementById('operation-select').value;
  var scalar = document.getElementById('scalar').value;

  // add: draw green vector v3 = v1 + v2
  if (op == "add"){
    var v3 = v1;
    v3.add(v2);
    drawVector(v3, 'green');
  }
  // sub: draw green vector v3 = v1 - v2
  else if (op == "sub"){
    var v3 = v1;
    v3.sub(v2);
    drawVector(v3, 'green');
  }
  // div: draw 2 green vectors v3=v1/scalar, v4=v2/scalar
  else if (op == "div"){
    var v3 = v1;
    var v4 = v2;
    v3.div(scalar);
    v4.div(scalar);
    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  // mul: draw 2 green vectors v3=v1*scalar, v4=v2*scalar
  else if (op == "mul"){
    var v3 = v1;
    var v4 = v2;
    v3.mul(scalar);
    v4.mul(scalar);
    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  // magnitude: print result to console
  else if (op == "magnitude"){
    console.log(v1.magnitude());
    console.log(v2.magnitude());
  }
  // normalize: draw normalized v1 and v2 in green
  else if (op == "normalize"){
    var v3 = v1;
    var v4 = v2;
    v3.normalize();
    v4.normalize();
    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  // name
  else if (op == "angle-between"){
    angleBetween(v1, v2);
  }
  // name
  else if (op == "area"){
    areaTriangle(v1, v2);
  }

function angleBetween(v1, v2){
  // uses dot function to compute the angle between v1 and v2
  // and prints the result to the console
  var d = Vector3.dot(v1, v2);
  var m1 = v1.magnitude();
  var m2 = v2.magnitude();
  var angle = Math.acos(d/(m1*m2));

  angle *= 180/Math.PI;
  console.log("Angle: " + angle);
}

function areaTriangle(v1, v2){
  // uses cross function to compute the area of the triangle created by v1 and v2
  // and prints the result to the console
  // var area = Vector3.cross(v1, v2); // (creates a new vector)
  // console.log(area.magnitude() / 2);

  var a = Vector3.cross(v1, v2);
  console.log(a.magnitude()/2);
}

  // next part to work on is: (9)
}