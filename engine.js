// Every new comment that I made will be marked with a title comment with my name

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;
var intervalID = 0;
var keyframes = [];
var audioRun;
var keyframeTheta = [];
var keyframeInstance = [];
var colors = [];

var SOUNDLOCATIONS = [
  "./Sounds/gallop.mp3",
  "./Sounds/gallop2.wav",
  "./Sounds/idle.wav",
];

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

/* COMMENT BY FAIZ */
// Part ID
var TORSO_ID = 0;
var NECK_ID = 1;
var HEAD_ID = 2;
var HEAD1_ID = 2;
var HEAD2_ID = 11;
var LEFT_FRONT_LEG_ID = 3;
var LEFT_FRONT_FOOT_ID = 4;
var RIGHT_FRONT_LEG_ID = 5;
var RIGHT_FRONT_FOOT_ID = 6;
var LEFT_BACK_LEG_ID = 7;
var LEFT_BACK_FOOT_ID = 8;
var RIGHT_BACK_LEG_ID = 9;
var RIGHT_BACK_FOOT_ID = 10;
//
var TAIL_ID = 12;
var EAR_LEFT_ID = 13;
var EAR_RIGHT_ID = 14;
var hhInc = 3;

var GLOBAL_ANGLE_ID = TAIL_ID + hhInc;
var GLOBAL_X_COORDINATE = TAIL_ID + hhInc + 1;
var GLOBAL_Y_COORDINATE = TAIL_ID + hhInc + 2;

/* COMMENT BY FAIZ */
// Sizes for each part
var torsoHeight = 8.0;
var torsoWidth = 3.0;
var upperArmHeight = 5.0;
var lowerArmHeight = 2.0;
var upperArmWidth = 1.3;
var lowerArmWidth = 0.8;
var upperLegWidth = 1.3;
var lowerLegWidth = 0.8;
var lowerLegHeight = 2.0;
var upperLegHeight = 5.0;
var headHeight = 3.5;
var headWidth = 1.5;
var neckHeight = 4.0;
var neckWidth = 2.0;
var tailHeight = 6.0;
var tailWidth = 1.0;
var earHeight = 1.5;
var earWidth = 1.5;

var numNodes = 15;
var numAngles = 15;

var frameOn = 0;

/* COMMENT BY FAIZ */
// Angle used for rotation/translation
var theta = [
  90 /* torso rotation*/,
  110 /* neck*/,
  90 /* head*/,
  70 /* left front leg */,
  10 /* left front foot */,
  80 /* right front leg */,
  10 /* right front foot */,
  120 /* left back leg */,
  -40 /* left back foot */,
  140 /* right back leg */,
  -30 /* right back foot */,
  0 /* head 2 id */,
  -100 /* tail */,
  0 /* ear left */,
  0 /* ear right */,
  -25 /* global angle */,
  0 /* global x */,
  0 /* global y */,
  ,
];

// var globalAngle = 270;
var knownLastIndex = 1;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++)
  figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

/* COMMENT BY FAIZ */
// Determine each part's color
var vertexColors = [
  // vec4(0.6, 0.32, 0.17, 1), // Brown
  // vec4(0.7, 0.3, 0.0, 1.0), // Brown dark
  // vec4(0.5, 0.3, 0.1, 1.0), // Brown light
  // vec4(0.5, 0.25, 0.14, 1.0), // Brown more lighten
  vec4(0.9, 0.25, 0.6, 1.0), // Pink
  vec4(0.8, 0.18, 0.45, 1.0), // Pink dark
  vec4(0.93, 0.81, 0.89, 1.0), // Pink light
  vec4(0.98, 0.9, 0.93, 1.0), // Pink lighter
];

//-------------------------------------------
function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}
//--------------------------------------------

/* COMMENT BY FAIZ */
// Create node used for rendering
function createNode(transform, render, sibling, child) {
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  };
  return node;
}

/* COMMENT BY FAIZ */
// Initialization matrix for transformation for each part
// Init nodes per part will be called upon updating angles by slider
function initNodes(Id) {
  var m = mat4();

  switch (Id) {
    case TORSO_ID:
      m = rotate(theta[GLOBAL_ANGLE_ID], 0, 0, 1);
      m = mult(m, rotate(theta[TORSO_ID], 0, 1, 0));
      figure[TORSO_ID] = createNode(m, torso, null, NECK_ID);
      break;

    case NECK_ID:
      m = translate(0.0, torsoHeight - neckHeight + 3.5, 0.0);
      m = mult(m, rotate(theta[NECK_ID], 1, 0, 0));
      m = mult(m, rotate(theta[HEAD2_ID], 0, 1, 0));
      m = mult(m, translate(0.0, -1 * neckHeight, 0.0));
      figure[NECK_ID] = createNode(m, neck, LEFT_FRONT_LEG_ID, HEAD_ID);
      break;

    case HEAD_ID:
    case HEAD1_ID:
    case HEAD2_ID:
      m = translate(0.0, 0.2 * headHeight, 0.0);
      m = mult(m, rotate(theta[HEAD1_ID], 1, 0, 0));
      //  m = mult(m, rotate(theta[HEAD2_ID], 0, 1, 0));
      m = mult(m, translate(0.0, -0.8 * headHeight, 0.0));
      //figure[HEAD_ID] = createNode(m, head, LEFT_FRONT_LEG_ID, null);
      figure[HEAD_ID] = createNode(m, head, EAR_LEFT_ID, null);
      break;

    case EAR_LEFT_ID:
      m = translate(-(torsoWidth / 3 + upperArmWidth), 0.1 * earHeight, 0);
      m = mult(m, rotate(theta[EAR_LEFT_ID], 1, 0, 0));
      figure[EAR_LEFT_ID] = createNode(m, earLeft, EAR_RIGHT_ID, null);
      break;

    case EAR_RIGHT_ID:
      m = translate(torsoWidth / 3 + upperArmWidth, 0.1 * earHeight, 0);
      m = mult(m, rotate(theta[EAR_RIGHT_ID], 1, 0, 0));
      figure[EAR_RIGHT_ID] = createNode(m, earRight, null, null);
      break;

    case LEFT_FRONT_LEG_ID:
      m = translate(-(torsoWidth / 3 + upperArmWidth), 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_FRONT_LEG_ID], 1, 0, 0));
      figure[LEFT_FRONT_LEG_ID] = createNode(
        m,
        leftUpperArm,
        RIGHT_FRONT_LEG_ID,
        LEFT_FRONT_FOOT_ID
      );
      break;

    case RIGHT_FRONT_LEG_ID:
      m = translate(torsoWidth / 3 + upperArmWidth, 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_FRONT_LEG_ID], 1, 0, 0));
      figure[RIGHT_FRONT_LEG_ID] = createNode(
        m,
        rightUpperArm,
        LEFT_BACK_LEG_ID,
        RIGHT_FRONT_FOOT_ID
      );
      break;

    case LEFT_BACK_LEG_ID:
      m = translate(
        -(torsoWidth / 3 + upperLegWidth),
        0.1 * upperLegHeight,
        0.0
      );
      m = mult(m, rotate(theta[LEFT_BACK_LEG_ID], 1, 0, 0));
      figure[LEFT_BACK_LEG_ID] = createNode(
        m,
        leftUpperLeg,
        RIGHT_BACK_LEG_ID,
        LEFT_BACK_FOOT_ID
      );
      break;

    case RIGHT_BACK_LEG_ID:
      m = translate(torsoWidth / 3 + upperLegWidth, 0.1 * upperLegHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_BACK_LEG_ID], 1, 0, 0));
      figure[RIGHT_BACK_LEG_ID] = createNode(
        m,
        rightUpperLeg,
        TAIL_ID,
        RIGHT_BACK_FOOT_ID
      );
      break;

    case TAIL_ID:
      m = translate(0.0, 0.1 * tailHeight, 0);
      m = mult(m, rotate(theta[TAIL_ID], 1, 0, 0));
      figure[TAIL_ID] = createNode(m, tail, null, null);
      break;

    case LEFT_FRONT_FOOT_ID:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_FRONT_FOOT_ID], 1, 0, 0));
      figure[LEFT_FRONT_FOOT_ID] = createNode(m, leftLowerArm, null, null);
      break;

    case RIGHT_FRONT_FOOT_ID:
      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_FRONT_FOOT_ID], 1, 0, 0));
      figure[RIGHT_FRONT_FOOT_ID] = createNode(m, rightLowerArm, null, null);
      break;

    case LEFT_BACK_FOOT_ID:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_BACK_FOOT_ID], 1, 0, 0));
      figure[LEFT_BACK_FOOT_ID] = createNode(m, leftLowerLeg, null, null);
      break;

    case RIGHT_BACK_FOOT_ID:
      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_BACK_FOOT_ID], 1, 0, 0));
      figure[RIGHT_BACK_FOOT_ID] = createNode(m, rightLowerLeg, null, null);
      break;
  }
}

/* COMMENT BY FAIZ */
// Rendering done by traversing each part in a tree data structure style
function traverse(Id) {
  if (Id == null) return;

  stack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
  figure[Id].render();
  if (figure[Id].child != null) traverse(figure[Id].child);
  modelViewMatrix = stack.pop();
  if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

/* COMMENT BY FAIZ */
// Rendering function for each part
function torso() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * torsoHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(torsoWidth, torsoHeight, torsoWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(headWidth, headHeight, headWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function neck() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(neckWidth, neckHeight, neckWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function tail() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.7 * tailHeight, 0));
  instanceMatrix = mult(
    instanceMatrix,
    scale4(tailWidth, tailHeight, tailWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function earLeft() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.4 * earHeight, 0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function earRight() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.4 * earHeight, 0));
  instanceMatrix = mult(instanceMatrix, scale4(earWidth, earHeight, earWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperArm() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerArm() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperArm() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperArmWidth, upperArmHeight, upperArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerArm() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerArmHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * upperLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(upperLegWidth, upperLegHeight, upperLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerLeg() {
  instanceMatrix = mult(
    modelViewMatrix,
    translate(0.0, 0.5 * lowerLegHeight, 0.0)
  );
  instanceMatrix = mult(
    instanceMatrix,
    scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth)
  );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
/* COMMENT BY FAIZ */
// End of rendering function

function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  pointsArray.push(vertices[b]);
  pointsArray.push(vertices[c]);
  pointsArray.push(vertices[d]);
}

function cube() {
  quad(1, 0, 3, 2);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
  quad(2, 3, 7, 6);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
  quad(3, 0, 4, 7);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  quad(6, 5, 1, 2);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  quad(4, 5, 6, 7);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  quad(5, 4, 0, 1);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[3]);
}

window.onload = function init() {
  audioRun = new Audio(SOUNDLOCATIONS[0]);
  audioRun.loop = true;

  // document.getElementById("saveLoader").onchange = function () {
  //   keyframeTheta = [];
  //   var file = this.files[0];
  //   var reader = new FileReader();
  //   reader.onload = function (progressEvent) {
  //     // By parts
  //     var parts = this.result.split("|");
  //     for (var i = 1; i < parseInt(parts[0]) + 1; i++) {
  //       var allValues = parts[i].split(",");
  //       var someTheta = [];
  //       for (var f = 0; f < allValues.length + 10; f++) {
  //         console.log(allValues[f]);
  //         someTheta[f] = parseFloat(allValues[f]);
  //       }

  //       console.log(someTheta[0]);
  //       keyframeTheta.push(someTheta.slice());
  //     }
  //   };
  //   reader.readAsText(file);
  //   toastr["success"]("Animation loaded successfully. Hit Run", "Animation");
  // };

  $("#save_all").click(function () {
    if (keyframeTheta.length == 0) {
      keyframeTheta = keyframeInstance.slice();
    }
    // Save in this format..
    var text = keyframeTheta.length + "|";
    for (var i = 0; i < keyframeTheta.length; i++)
      text += keyframeTheta[i] + "|";

    var filename = "saved_animation";
    console.log("Saving");
    var blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
    this.href = URL.createObjectURL(blob);
    this.download = filename;
  });

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  instanceMatrix = mat4();
  // This should be proportional with the real canvas...
  projectionMatrix = ortho(-40.0, 40.0, -23.0, 23.0, -40.0, 40.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelViewMatrix)
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  cube();
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  // var textCordLoc = gl.getAttribLocation(program, "vTextCord");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  // gl.vertexAttribPointer(textCordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  // gl.enableVertexAttribArray(textCordLoc);
  // setTexcoords(gl);
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  /* COMMENT BY FAIZ */
  // Listener for each slider
  document.getElementById("slider0").onchange = function () {
    theta[TORSO_ID] = event.srcElement.value;
    initNodes(TORSO_ID);
  };
  document.getElementById("slider1").onchange = function () {
    theta[HEAD1_ID] = event.srcElement.value;
    initNodes(HEAD1_ID);
  };

  document.getElementById("slider2").onchange = function (e) {
    console.log(e);
    theta[LEFT_FRONT_LEG_ID] = event.srcElement.value;
    initNodes(LEFT_FRONT_LEG_ID);
  };
  document.getElementById("slider3").onchange = function () {
    theta[LEFT_FRONT_FOOT_ID] = event.srcElement.value;
    initNodes(LEFT_FRONT_FOOT_ID);
  };

  document.getElementById("slider4").onchange = function () {
    theta[RIGHT_FRONT_LEG_ID] = event.srcElement.value;
    initNodes(RIGHT_FRONT_LEG_ID);
  };
  document.getElementById("slider5").onchange = function () {
    theta[RIGHT_FRONT_FOOT_ID] = event.srcElement.value;
    initNodes(RIGHT_FRONT_FOOT_ID);
  };
  document.getElementById("slider6").onchange = function () {
    theta[LEFT_BACK_LEG_ID] = event.srcElement.value;
    initNodes(LEFT_BACK_LEG_ID);
  };
  document.getElementById("slider7").onchange = function () {
    theta[LEFT_BACK_FOOT_ID] = event.srcElement.value;
    initNodes(LEFT_BACK_FOOT_ID);
  };
  document.getElementById("slider8").onchange = function () {
    theta[RIGHT_BACK_LEG_ID] = event.srcElement.value;
    initNodes(RIGHT_BACK_LEG_ID);
  };
  document.getElementById("slider9").onchange = function () {
    theta[RIGHT_BACK_FOOT_ID] = event.srcElement.value;
    initNodes(RIGHT_BACK_FOOT_ID);
  };

  document.getElementById("slider10").onchange = function () {
    theta[HEAD2_ID] = event.srcElement.value;
    initNodes(NECK_ID);
  };

  document.getElementById("slider14").onchange = function () {
    theta[NECK_ID] = event.srcElement.value;
    initNodes(NECK_ID);
  };

  document.getElementById("slider11").onchange = function () {
    theta[GLOBAL_ANGLE_ID] = event.srcElement.value;
    initNodes(TORSO_ID);
  };

  document.getElementById("slider12").onchange = function () {
    theta[GLOBAL_X_COORDINATE] = event.srcElement.value - 400;
    gl.viewport(
      0 + theta[GLOBAL_X_COORDINATE],
      0 + theta[GLOBAL_Y_COORDINATE],
      canvas.width,
      canvas.height
    );
    initNodes(TORSO_ID);
  };

  document.getElementById("slider13").onchange = function () {
    theta[GLOBAL_Y_COORDINATE] = event.srcElement.value - 400;
    gl.viewport(
      0 + theta[GLOBAL_X_COORDINATE],
      0 + theta[GLOBAL_Y_COORDINATE],
      canvas.width,
      canvas.height
    );
    initNodes(TORSO_ID);
  };

  document.getElementById("sliderTail").onchange = function () {
    theta[TAIL_ID] = event.srcElement.value;
    initNodes(TAIL_ID);
  };

  /* COMMENT BY FAIZ */
  // Node initialization, skip 11 since it doesn't refer to the object part
  for (i = 0; i < numNodes; i++) {
    if (i == 11) continue;
    initNodes(i);
  }

  render();
};

var render = function () {
  gl.clear(gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(0, 0, 0, 0);
  traverse(TORSO_ID);
  requestAnimFrame(render);
};

function initAll() {
  initNodes(TORSO_ID);
  initNodes(HEAD1_ID);
  initNodes(NECK_ID);
  initNodes(LEFT_FRONT_LEG_ID);
  initNodes(LEFT_FRONT_FOOT_ID);
  initNodes(RIGHT_FRONT_LEG_ID);
  initNodes(RIGHT_FRONT_FOOT_ID);
  initNodes(LEFT_BACK_LEG_ID);
  initNodes(LEFT_BACK_FOOT_ID);
  initNodes(RIGHT_BACK_LEG_ID);
  initNodes(RIGHT_BACK_FOOT_ID);
  initNodes(HEAD2_ID);
}

var consMult = 0;
var progShower = null;
var progVis = null;

// Play animation. Get all frames, play it one by one, and update animation percentage
function playAnimationOptimized() {
  console.log("Playing..");
  if (keyframeTheta.length == 0) {
    if (intervalID == 0) {
      keyframeTheta = keyframeInstance.slice();
      playAnimationOptimized();
      return;
    }
    console.log("Clearing");
    clearInterval(intervalID);
    intervalID = 0;
    var audio = new Audio(SOUNDLOCATIONS[2]);
    audio.play();
    audioRun.pause();
    return;
  }

  var lastThetas = keyframeTheta.shift();
  theta = lastThetas.slice();
  initAll();
  gl.viewport(
    0 + theta[GLOBAL_X_COORDINATE],
    0 + theta[GLOBAL_Y_COORDINATE],
    canvas.width,
    canvas.height
  );
  if (intervalID == 0) {
    audioRun.play();
    progVis = document.getElementById("animationPercent");
    progShower = progVis.children[0];

    if (keyframeTheta.length == 0) {
      keyframeTheta = keyframeInstance.slice();
    } else {
      console.log("Saving this keyframes for another play");
      keyframeInstance = keyframeTheta.slice();
    }
    frameOn = 1;
    consMult = 100 / keyframeTheta.length;
    intervalID = setInterval(playAnimationOptimized, 40);
  }
  var perc = Math.round(consMult * (frameOn - 1));
  progVis.setAttribute("aria-valuenow", perc + "");
  progVis.setAttribute("style", "width:" + perc + "%");
  progShower.textContent = perc + "%";
  frameOn++;
}

// This method gets the difference between two frames and creates a smooth transition
function getDiffAndAdd(fraCount, frameFinal) {
  var lastFrame = keyframeTheta.pop();
  keyframeTheta.push(lastFrame);
  for (var i = 1; i < fraCount; i++) {
    var newTheta = theta.slice();
    for (var f = 0; f < frameFinal.length; f++) {
      var someDiff = parseFloat(frameFinal[f]) - parseFloat(lastFrame[f]);
      newTheta[f] = parseFloat(lastFrame[f]) + (someDiff / fraCount) * i;
    }
    keyframeTheta.push(newTheta);
  }
}

// Save the frame. Get frame location and if its more than it should be, get diff, partition it to several frames.
function saveFrame() {
  var indexer = document.getElementById("indexCount");
  var lastIndex = parseInt(indexer.value);
  // Means that we have to add extra frames
  if (lastIndex > knownLastIndex + 1) {
    var transitionFrameCount = lastIndex - knownLastIndex;
    getDiffAndAdd(transitionFrameCount, theta.slice());
  } else {
    keyframeTheta.push(theta.slice());
    console.log("Frame Saved!", theta.slice());
  }
  knownLastIndex = lastIndex;
  indexer.value = lastIndex + 11;
  indexer.min = lastIndex + 11;
  toastr["success"](
    "Keyframe with given parameters are successfully set",
    "Keyframe"
  );
}
