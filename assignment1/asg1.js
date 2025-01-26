// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`


// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedSegments = 20.0;
let g_selectedType = POINT;
let g_rescale = 1.0;

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];  // The array to store the color of a point
var g_shapesList = [];

// [Continue on part 9]
// https://www.youtube.com/watch?v=PhhVgAGzr6w&list=PLbyTU_tFIkcMK5FiV6btXxHQAy15p0j7X&index=17

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function addActionsForHtmlUI(){
  document.getElementById('scream').onclick = function() { theScream(); renderAllShapes(); }
  
  document.getElementById('clear').onclick = function() { g_shapesList = []; renderAllShapes(); }
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; }
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; }
  document.getElementById('mirror').onclick = function() { mirrorAllShapes(); renderAllShapes(); }

  document.getElementById('point').onclick = function() { g_selectedType = POINT; }
  document.getElementById('triangle').onclick = function() { g_selectedType = TRIANGLE; }
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE; }

  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;})
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;})
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;})
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;})
  document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value;})
}

function main() {
  // Setup
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if (ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // theScream();
  // renderAllShapes();
}

function click(ev) {
  // Get player click coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // // Store the coordinates to g_points array
  // g_points.push([x, y]);
  // // Store the colour to g_points array
  // g_colors.push(g_selectedColor.slice()); 
  // // Store the size to g_points array
  // g_sizes.push(g_selectedSize); 

  // let g_point_inst = new Point();
  let newShape;
  if (g_selectedType == POINT){
    newShape = new Point();
  }
  else if (g_selectedType == TRIANGLE){
    newShape = new Triangle();
  }
  else if (g_selectedType == CIRCLE){
    newShape = new Circle();
    newShape.segments = g_selectedSegments;
  }
  newShape.position = [x,y];
  newShape.color = g_selectedColor.slice();
  newShape.size = g_selectedSize;
  g_shapesList.push(newShape);

  // Draws every point stored in g_points/g_colors
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function mirrorAllShapes(){
  // Basically, for every shape, add its mirror image
  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  var len = g_shapesList.length;
  for (i = 0; i < len; i++){
    g_shapesList[i].position[0] *= -1;
    // g_shapesList[i].position[1] *= -1;
  }
}

// Palette
const blueColor = [30.0/255.0, 80.0/255.0, 170.0/255.0, 1.0];
const faceColor = [205.0/255.0, 212.0/255.0, 152.0/255.0, 1.0];
const eyeColor = [141.0/255.0, 148.0/255.0, 92.0/255.0, 1.0];
// position_template = [0.0, 0.0,   0.0, 0.0,   0.0, 0.0];
function theScream(){
  // This function creates triangles that somewhat resemble 'The Scream.'

  // Head
  var leftDome = new AbsTriangle();
  leftDome.position = [8.0, 12.0,   0.0, 16.0,   0.0, 12.0];
  leftDome.color = faceColor;
  g_shapesList.push(leftDome);
  var rightDome = new AbsTriangle();
  rightDome.position = [-8.0, 12.0,   0.0, 16.0,   0.0, 12.0];
  rightDome.color = faceColor;
  g_shapesList.push(rightDome);
  var leftFace = new AbsTriangle();
  leftFace.position = [8.0, 12.0,   0.0, 0.0,   0.0, 12.0];
  leftFace.color = faceColor;
  g_shapesList.push(leftFace);
  var rightFace = new AbsTriangle();
  rightFace.position = [-8.0, 12.0,   0.0, 0.0,   0.0, 12.0];
  rightFace.color = faceColor;
  g_shapesList.push(rightFace);
  var leftCheek = new AbsTriangle();
  leftCheek.position = [-5.0, 8.0,   0.0, 0.0,   -5.0, 0.0];
  leftCheek.color = faceColor;
  g_shapesList.push(leftCheek);
  var rightCheek = new AbsTriangle();
  rightCheek.position = [5.0, 8.0,   0.0, 0.0,   5.0, 0.0];
  rightCheek.color = faceColor;
  g_shapesList.push(rightCheek);

  // Eyes
  var leftEyeTop = new AbsTriangle();
  leftEyeTop.position = [-3.0, 11.0,   -4.0, 10.0,   -1.0, 10.0];
  leftEyeTop.color = eyeColor;
  g_shapesList.push(leftEyeTop);
  var leftEyeBottom = new AbsTriangle();
  leftEyeBottom.position = [-2.0, 9.0,   -4.0, 10.0,   -1.0, 10.0];
  leftEyeBottom.color = eyeColor;
  g_shapesList.push(leftEyeBottom);
  var rightEyeTop = new AbsTriangle();
  rightEyeTop.position = [3.0, 11.0,   4.0, 10.0,   2.0, 10.0];
  rightEyeTop.color = eyeColor;
  g_shapesList.push(rightEyeTop);
  var rightEyeBottom = new AbsTriangle();
  rightEyeBottom.position = [3.0, 9.0,   4.0, 10.0,   2.0, 10.0];
  rightEyeBottom.color = eyeColor;
  g_shapesList.push(rightEyeBottom);

  // Nose
  var leftNostril = new AbsTriangle();
  leftNostril.position = [-1.0, 8.0,   -2.0, 7.0,   -1.0, 7.0];
  leftNostril.color = eyeColor;
  g_shapesList.push(leftNostril);
  var rightNostril = new AbsTriangle();
  rightNostril.position = [1.0, 8.0,   2.0, 7.0,   1.0, 7.0];
  rightNostril.color = eyeColor;
  g_shapesList.push(rightNostril);
  
  // Mouth
  var leftMouth = new AbsTriangle();
  leftMouth.position = [-1.0, 5.0,   1.0, 5.0,   1.0, 1.0];
  leftMouth.color = eyeColor;
  g_shapesList.push(leftMouth);
  var rightMouth = new AbsTriangle();
  rightMouth.position = [-1.0, 5.0,   -2.0, 1.0,   1.0, 1.0];
  rightMouth.color = eyeColor;
  g_shapesList.push(rightMouth);
  var extraMouth = new AbsTriangle();
  extraMouth.position = [-2.0, 1.0,   0.0, 0.0,   1.0, 1.0];
  extraMouth.color = eyeColor;
  g_shapesList.push(extraMouth);

  // Torso
  var rightTorso = new AbsTriangle();
  rightTorso.position = [-4.0, 0.0,   4.0, 0.0,   2.0, -24.0];
  rightTorso.color = blueColor;
  g_shapesList.push(rightTorso);
  var leftTorso = new AbsTriangle();
  leftTorso.position = [-4.0, 0.0,   -6.0, -26.0,   2.0, -24.0];
  leftTorso.color = blueColor;
  g_shapesList.push(leftTorso);

  // Left Arm
  var leftShoulder = new AbsTriangle();
  leftShoulder.position = [-4.0, 0.0,   -4.0, -4.0,   -10.0, -4.0];
  leftShoulder.color = blueColor;
  g_shapesList.push(leftShoulder);
  var leftForearm = new AbsTriangle();
  leftForearm.position = [-10.0, -4.0,   -6.0, -4.0,   -8.0, -11.0];
  leftForearm.color = blueColor;
  g_shapesList.push(leftForearm);
  var leftMorearm = new AbsTriangle();
  leftMorearm.position = [-7.0, 7.0,   -6.0, -4.0,   -9.0, 7.0];
  leftMorearm.color = faceColor;
  g_shapesList.push(leftMorearm);
  var leftHand = new AbsTriangle();
  leftHand.position = [-7.0, 7.0,   -11.0, 11.0,   -10.0, 7.0];
  leftHand.color = faceColor;
  g_shapesList.push(leftHand);

  // Right Arm
  var rightShoulder = new AbsTriangle();
  rightShoulder.position = [4.0, 0.0,   3.0, -3.0,   11.0, -4.0];
  rightShoulder.color = blueColor;
  g_shapesList.push(rightShoulder);
  var rightForearm = new AbsTriangle();
  rightForearm.position = [7.0, -4.0,   8.0, -9.0,   11.0, -4.0];
  rightForearm.color = blueColor;
  g_shapesList.push(rightForearm);
  var rightMorearm = new AbsTriangle();
  rightMorearm.position = [10.0, -6.0,   6.0, 4.0,   8.0, 6.0];
  rightMorearm.color = faceColor;
  g_shapesList.push(rightMorearm);
  var rightHand = new AbsTriangle();
  rightHand.position = [9.0, 10.0,   6.0, 4.0,   8.0, 6.0];
  rightHand.color = faceColor;
  g_shapesList.push(rightHand);

  // Normalize coordinates
  var normalize_value = 18.0;
  var len = g_shapesList.length;
  for (i = 0; i < len; i++){
    var pos_len = g_shapesList[i].position.length;
    for (j = 0; j < pos_len; j++){
      g_shapesList[i].position[j] /= normalize_value;
    }
  }

}