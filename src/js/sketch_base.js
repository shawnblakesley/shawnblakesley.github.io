let canvas;
let canvasSize;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 225);
    canvas.parent("p5");
}

function draw() {
    background(0);
}

function windowResized() {
    canvas.resize(windowWidth, windowHeight - 225);
}