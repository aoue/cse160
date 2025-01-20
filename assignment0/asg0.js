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
  draw_bg();
}

function draw_bg() {
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
  // wipe
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // redo background
  draw_bg();

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

  // next part to work on is: (5)

}