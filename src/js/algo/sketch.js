let canvas;
let canvasSize;
let paused = false;

let pathDef = new hex_path.HexPath("game of life");
let golDef = new gol.Gol("game of life 3D");
let gol3DDef = new gol_3d.GameOfLife("hex maze generator");
let mazeDef = new hex_maze.HexMaze("game of life"); //"pathfinder");

let algo_name;
let algorithms;

function regenerate() {
    setAlgorithm(algo_name);
}

function togglePause(elem) {
    paused = !paused;
    if (paused) {
        elem.textContent = "Resume";
    } else {
        elem.textContent = "Pause";
    }
}

function nextAlgorithm() {
    setAlgorithm(algorithms.get(algo_name).next);
}

function setAlgorithm(algo) {
    canvas = createCanvas(windowWidth, windowHeight - 185, P2D);
    canvas.parent("p5");
    canvas.style("display", "block");
    var description = document.getElementById("sample-description");
    if (paused) {
        togglePause();
    }
    if (algo != algo_name) {
        hide();
    }
    if (algorithms.has(algo)) {
        algo_name = algo;
        show();
        var algo_ref = algorithms.get(algo_name)
        description.innerHTML = algo_ref.description;
        algo_ref.setup();
    } else {
        console.error("Could not find algorithm:", algo_name)
    }
}

function show() {
    let id = `${algorithms.get(algo_name).short_name}-controls`
    let elem = document.getElementById(id);
    elem.style.display = "block";
}

function hide() {
    if (algo_name) {
        let elem = document.getElementById(`${algorithms.get(algo_name).short_name}-controls`);
        elem.style.display = "none";
    }
}


function setup() {
    algorithms = new Map();
    algorithms.set("game of life", golDef);
    algorithms.set("game of life 3D", gol3DDef);
    algorithms.set("hex maze generator", mazeDef);
    algorithms.set("pathfinder", pathDef);

    algo_name = "hex maze generator";
    setAlgorithm(algo_name);
}

function draw() {
    if (algorithms.has(algo_name)) {
        algorithms.get(algo_name).draw();
    } else {
        background(0);
        fill(255);
        textSize(width / 50);
        textAlign(CENTER, CENTER);
        text("Could not load algorithm:\n" + algo_name, width / 2, height / 2);
    }
}

function windowResized() {
    setAlgorithm(algo_name);
}

function mousePressed() {
    if (algorithms.has(algo_name) && algorithms.get(algo_name).pressed) {
        algorithms.get(algo_name).pressed();
    }
}