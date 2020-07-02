var voice = new p5.Speech();
const numberRegex = /^[0-9]$/;
var currentNumber = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    noStroke();
    textFont('monospace');
}

function draw() {
    colorMode(RGB);
    background(0);
    stroke(0);
    fill(255);
    textSize(100);
    let sum = `${currentNumber * 2}`
    text(`${currentNumber}`.padStart(sum.length + 2, " "), 0, height - 210);
    text("+" + ` ${currentNumber}`.padStart(sum.length + 1, " "), 0, height - 110);
    text(`= ${sum}`, 0, height - 10);
    // text(`${currentNumber} + ${currentNumber} = ${currentNumber * 2}`, 0, height - 10);
}

function keyPressed() {
    if (numberRegex.test(key)) {
        newNumber(key);
    }
}

function newNumber(number) {
    voice.cancel();
    voice.speak(`${number} + ${number} = ${number * 2}`);
    console.log(`number = ${number}`)
    currentNumber = int(number);
}

function windowResized() {
    canvas = createCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    newNumber(int(currentNumber) + 1);
}