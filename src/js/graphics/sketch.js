let selected = "teapot";
let modelMap;
let currentShader;
let state;
var canvas;
var easycam;
var primarySelector = document.getElementById("toon-primary");
var secondarySelector = document.getElementById("toon-secondary");
var shineSelector = document.getElementById("toon-shine");
var sizeSelector = document.getElementById("toon-size");
var borderSelector = document.getElementById("toon-border");

function preload() {
    // Load model with normalize parameter set to true
    modelMap = {
        "teapot": loadModel('/data/teapot.obj', true),
        "bunny": loadModel('/data/bunny.obj', true),
        "suzanne": loadModel('/data/suzanne.obj', true)
    }
    currentShader = loadShader('/shaders/toon.vert', '/shaders/toon.frag');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 185, WEBGL);
    canvas.parent("p5");
    easycam = createEasyCam();
    easycam.setRotation(Dw.Rotation.create({
        angles_xyz: [PI, PI, 0]
    }), 0);
    easycam.state_reset = easycam.state.copy();
    sel = createSelect();
    sel.option('teapot');
    sel.option('suzanne');
    sel.option('bunny');
    sel.changed(() => {
        selected = sel.value();
        easycam.reset(1000);
    });
    sel.parent("toon-model-select");
    noStroke();

    shader(currentShader);
    updateUniforms();
}

function draw() {
    background(0);

    shader(currentShader);
    updateUniforms();
    let dirX = (mouseX / width - 0.5) * 2;
    let dirY = (mouseY / height - 0.5) * 2;
    directionalLight(255, 204, 204, dirX, dirY, -1);
    ambientMaterial(255, 205, 255);

    push();
    scale(2);
    rotateX(sin(frameCount / 50.0) / 1.5);
    rotateY(cos(frameCount / 100.0) / 1.5);
    model(modelMap[selected]);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 185);
    resizeEasyCam();
}

function asColorArray(colorCode) {
    var colors = [];
    for (let i = 0; i < 3; i++) {
        colors.push(parseInt(colorCode.slice(2 * i + 1, 2 * i + 3), 16) / 255.0);
    }
    return colors;
}

function updateUniforms() {
    currentShader.setUniform('uShine', shineSelector.value);
    currentShader.setUniform('uCheckerSize', sizeSelector.value);
    currentShader.setUniform('uBorder', borderSelector.value);
    currentShader.setUniform('uPrimaryColor', asColorArray(primarySelector.value));
    currentShader.setUniform('uSecondaryColor', asColorArray(secondarySelector.value));
}

function reset() {
    shineSelector.value = 0.5;
    sizeSelector.value = 10.0;
    borderSelector.value = 0.5;
    primarySelector.value = "#ff0000";
    secondarySelector.value = "#ffAA00";
}