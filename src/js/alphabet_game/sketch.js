var voice = new p5.Speech(); // speech synthesis object
var currentLetter = "A";
var current;
var data;
const letterRegex = /^[a-zA-Z]$/;
let img;

function preload() {
    data = loadJSON("/data/alphabet_game.json");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    noStroke();
    img = getImage(currentLetter, data[currentLetter]);
    console.log(img);
}

function draw() {
    colorMode(RGB);
    background(0);
    noStroke();
    let from = color(218, 165, 32);
    let to = color(172, 61, 139);
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
    text(current.name.split("_")[0], x + w - 200, y + h - 10);
}

function keyPressed() {
    console.log("tests", key);
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
    let item = items[floor(random(items.length))];
    if (!item.type) {
        item.type = "jpg";
    }
    current = item;
    voice.cancel();
    voice.speak(`${letter}: is for ${item.name.split("_")[0]}`);
    console.log(`Loading... /images/alphabet_game/${item.name.toLowerCase()}.${item.type}`);
    return loadImage(`/images/alphabet_game/${item.name.toLowerCase()}.${item.type}`);
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