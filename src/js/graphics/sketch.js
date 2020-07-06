let selected = "teapot";
let modelMap;
let shaderMap;
let currentShader;
let state;
let canvas;
let easycam;
const primarySelector = document.getElementById("primary");
const secondarySelector = document.getElementById("secondary");
const shineSelector = document.getElementById("shine");
const sizeSelector = document.getElementById("size");
const borderSelector = document.getElementById("border");

function preload() {
    // Load model with normalize parameter set to true
    modelMap = {
        "teapot": loadModel('/data/teapot.obj', true),
        "bunny": loadModel('/data/bunny.obj', true),
        "suzanne": loadModel('/data/suzanne.obj', true)
    }
    shaderMap = {
        "toon": loadShader('/shaders/toon.vert', '/shaders/toon.frag'),
        "procedural_toon": loadShader('/shaders/procedural_toon.vert', '/shaders/procedural_toon.frag'),
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 185, WEBGL);
    canvas.parent("p5");
    easycam = createEasyCam();
    easycam.setRotation(Dw.Rotation.create({
        angles_xyz: [PI, PI, 0]
    }), 0);
    easycam.state_reset = easycam.state.copy();
    let shaderSelect = createSelect();
    shaderSelect.option('procedural_toon');
    shaderSelect.option('toon');
    shaderSelect.changed(() => {
        currentShader = shaderMap[shaderSelect.value()];
        easycam.reset(1000);
    });
    shaderSelect.parent("shader-select");
    currentShader = shaderMap[shaderSelect.value()];
    let modelSelect = createSelect();
    modelSelect.option('teapot');
    modelSelect.option('suzanne');
    modelSelect.option('bunny');
    modelSelect.changed(() => {
        selected = modelSelect.value();
        easycam.reset(1000);
    });
    modelSelect.parent("model-select");
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