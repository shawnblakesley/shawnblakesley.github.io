let selected = "teapot";
let modelMap;
let currentShader;
let state;
var canvas;
var easycam;

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
    sel.position(10, 10);
    sel.option('teapot');
    sel.option('suzanne');
    sel.option('bunny');
    sel.changed(() => {
        selected = sel.value();
        easycam.reset(1000);
    });
    noStroke();

    shader(currentShader);
    currentShader.setUniform('uShine', 0.5);
    currentShader.setUniform('uCheckerSize', 10.0);
    currentShader.setUniform('uBorder', 0.5);
    currentShader.setUniform('uPrimaryColor', [1.0, 0.0, 0.0]);
    currentShader.setUniform('uSecondaryColor', [1.0, 0.65, 0.0]);
}

function draw() {
    background(0);

    shader(currentShader);
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