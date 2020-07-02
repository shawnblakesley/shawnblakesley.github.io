var voice = new p5.Speech(); // speech synthesis object
var currentLetter = "A";
var current;
var data;
const letterRegex = /^[a-zA-Z]$/;
let img;
let visitTracker = new Array(26);

function preload() {
    data = loadJSON("/data/alphabet_game.json");
}

function setup() {

    canvas = createCanvas(windowWidth, windowHeight);
    noStroke();
    img = getImage(currentLetter, data[currentLetter]);
}

function draw() {
    colorMode(RGB);
    background(0);
    noStroke();
    let from = color(218, 165, 32 + 50 * sin(frameCount / 50));
    let to = color(172, 61, 139 + 50 * cos(frameCount / 100));
    for (let i = 0; i < 200; i++) {
        let inter = lerpColor(from, to, i / 200);
        fill(inter);
        rect(floor(i / 200 * width), 0, ceil(width / 200), height);
    }
    fill(255);
    text(currentLetter, width / 2, height / 2);
    let screenRatio = width / height;
    let ratio = img.width / img.height;
    let w;
    let h;
    if (ratio > screenRatio) {
        w = width - 100;
        h = img.height * (width - 100) / img.width;
    } else {
        w = img.width * (height - 100) / img.height;
        h = height - 100;
    }
    let x = (width - w) / 2,
        y = (height - h) / 2;
    image(img, x, y, w, h);
    stroke(0);
    strokeWeight(4);
    textSize(60);
    fill(128, 128, 255);
    text(`${currentLetter} is for...`, x + 10, y + 70);
    text(sanitizeName(current.name), x + w - 200, y + h - 10);
}

function keyPressed() {
    if (letterRegex.test(key)) {
        loadLetter(key);
    }
}

function loadLetter(letter) {
    currentLetter = letter.toUpperCase();
    var items = data[currentLetter];
    img = getImage(currentLetter, items);
}

function getImage(letter, items) {
    let index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
    if (!visitTracker[index]) {
        visitTracker[index] = new Array(items.length);
        visitTracker[index].fill(0);
    }
    let minVal = Math.min(...visitTracker[index]);
    let itemIndex = visitTracker[index].indexOf(minVal);
    visitTracker[index][itemIndex] += 1;

    let item = items[itemIndex];
    if (!item.type) {
        item.type = "jpg";
    }
    current = item;
    voice.cancel();
    voice.speak(`${letter}: is for ${sanitizeName(item.name)}`);
    return loadImage(`/images/alphabet_game/${item.name.toLowerCase()}.${item.type}`);
}

function sanitizeName(name) {
    let regex = /_[0-9]$/;
    return name.replace(regex, "").replace("_", " ");
}

function windowResized() {
    canvas = createCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    let letter = "A";
    if (currentLetter !== 'Z') {
        letter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
    }
    loadLetter(letter);
}