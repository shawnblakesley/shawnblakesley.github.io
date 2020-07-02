var selected;

function preload() {}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 185);
    canvas.parent("p5");
    sel = createSelect();
    sel.option('tcp demo');
    sel.option('udp demo');
    sel.changed(() => {
        selected = sel.value();
    });
    sel.parent("demo-select");
}

function draw() {
    background(0);
    fill(255);
    textSize(width / 50);
    textAlign(CENTER, CENTER);
    text("PLACEHOLDER\nNetworking coming soon!", width / 2, height / 2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 185);
}

function Packet(id) {
    this.id = id;
    this.x = width / 2;
    this.y = height / 2;

    this.draw = function () {
        circle(this.x, this.y, 20);
    }
}