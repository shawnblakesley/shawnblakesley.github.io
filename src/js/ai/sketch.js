let canvas;
let canvasSize;
let sel;

let testDef = {
    setup_function: () => console.log("Entering the test"),
    draw_function: drawPlaceholder,
}

let algo_name;
let algorithms;

function setAlgorithm(algo) {
    if (algorithms.has(algo)) {
        algo_name = algo;
        console.log("Chosen algorithm:", algo_name);
        algorithms.get(algo_name).setup_function();
    } else {
        console.error("Could not find algorithm:", algo_name)
    }
}

function setup() {
    algorithms = new Map();
    algorithms.set("placeholder", testDef);
    console.log(algorithms);

    sel = createSelect();
    // sel.position(10, 75);
    for (const key of algorithms.keys()) {
        console.log(key);
        sel.option(key);
    }
    sel.changed(() => setAlgorithm(sel.value()));
    sel.style("font-size", "1.3em");
    sel.style("width", "150px");
    sel.style("position", "absolute");
    sel.style("right", "10px");
    sel.style("top", "75px");

    canvas = createCanvas(windowWidth, windowHeight - 175);
    canvas.parent("p5");
    setAlgorithm("placeholder");
}

function draw() {
    if (algorithms.has(algo_name)) {
        algorithms.get(algo_name).draw_function();
    } else {
        background(0);
        fill(255);
        textSize(width / 50);
        textAlign(CENTER, CENTER);
        text("Could not load algorithm:\n" + algo_name, width / 2, height / 2);
    }
}

function windowResized() {
    canvas = createCanvas(windowWidth, windowHeight - 175);
    canvas.parent("p5");
    setAlgorithm(algo_name);
}

function mousePressed() {
    if (algorithms.has(algo_name) && algorithms.get(algo_name).pressed_function) {
        algorithms.get(algo_name).pressed_function();
    }
}

function drawPlaceholder() {
    background(0);
    fill(255);
    textSize(width / 50);
    textAlign(CENTER, CENTER);
    text("PLACEHOLDER\nAI coming soon!", width / 2, height / 2);
}