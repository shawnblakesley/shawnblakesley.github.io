let canvas;
let canvasSize;
let sel;
let paused = false;

let mazeDef = {
    setup_function: setupMaze,
    draw_function: drawMaze,
    short_name: "maze",
}
let golDef = {
    setup_function: setupGOL,
    draw_function: drawGOL,
    pressed_function: spawnMouse,
    short_name: "gol",
}
let testDef = {
    setup_function: () => console.log("Entering the test"),
    draw_function: () => background(0),
    short_name: "test",
}

let algo_name;
let algorithms;

function regenerate() {
    setAlgorithm(algo_name);
}

function togglePause() {
    paused = !paused;
    for (const elem of document.getElementsByClassName("sample-pause")) {
        if (paused) {
            elem.textContent = "Resume";
        } else {
            elem.textContent = "Pause";
        }
    }
}

function setAlgorithm(algo) {
    if (paused) {
        togglePause();
    }
    hide();
    if (algorithms.has(algo)) {
        algo_name = algo;
        algorithms.get(algo_name).setup_function();
    } else {
        console.error("Could not find algorithm:", algo_name)
    }
}

function autoClose(evt) {
    let elem = document.getElementById(`${algorithms.get(algo_name).short_name}-description`);
    if (!elem.contains(evt.target) && elem.classList.contains("show")) {
        hide();
    }
}

function show() {
    hide();
    let id = `${algorithms.get(algo_name).short_name}-description`
    let elem = document.getElementById(id);
    elem.classList.add("show"); // TODO: make just show

    setTimeout(() => window.addEventListener('click', autoClose), 200);
}

function hide() {
    window.removeEventListener('click', autoClose, false);
    if (algo_name) {
        elem = document.getElementById(`${algorithms.get(algo_name).short_name}-description`);
        elem.classList.remove("show");
    }
}


function setup() {
    algorithms = new Map();
    algorithms.set("game of life", golDef);
    algorithms.set("maze", mazeDef);
    algorithms.set("some other really long named thing", testDef);

    sel = createSelect();
    for (const key of algorithms.keys()) {
        console.log(key);
        sel.option(key);
    }
    sel.changed(() => setAlgorithm(sel.value()));
    sel.style("font-size", "1.3em");
    sel.style("width", "250px");
    sel.parent("algo-picker");

    canvas = createCanvas(windowWidth, windowHeight - 185);
    canvas.parent("p5");
    setAlgorithm("game of life");
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
    canvas = createCanvas(windowWidth, windowHeight - 185);
    canvas.parent("p5");
    setAlgorithm(algo_name);
}

function mousePressed() {
    if (algorithms.has(algo_name) && algorithms.get(algo_name).pressed_function) {
        algorithms.get(algo_name).pressed_function();
    }
}


/////////////////////
// functions for maze

let maze;
let cols;
let rows;
let resolution;
let inp;

function makeMaze(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = floor(random(2)) * random(2097152) - 1;
        }
    }
    return arr;
}

function setupMaze() {
    // TODO: make controls for each algorithm
    if (inp) {
        inp.remove();
    }
    // inp = createInput('Input here');
    // inp.parent("p5");

    frameRate(10);
    noStroke();

    resolution = 20;
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    maze = makeMaze(cols, rows);
}

function forEachSquare(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            func(i, j);
        }
    }
}

function drawSquareMaze(col, row) {
    let x = col * resolution;
    let y = row * resolution;
    let value = maze[col][row];
    if (maze[col][row] == -1) {
        fill(50);
    } else {
        fill(value / 16384 + 64, value % 16384 / 128 + 64, value % 128 + 64);
    }
    rect(x, y, resolution, resolution);
}

function drawMaze() {
    background(0);
    forEachSquare(maze, drawSquareMaze);
}


/////////////////////////////
// functions for game of life

let gol;
let next;

function makeGOL(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = floor(random(2));
        }
    }
    return arr;
}

function setupGOL() {
    canvas.mouseMoved(spawnMouse);
    frameRate(10);
    noStroke();
    resolution = 15;
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    gol = makeGOL(cols, rows);
    next = makeGOL(cols, rows);
}

function drawSquareGOL(col, row) {
    let x = col * resolution;
    let y = row * resolution;
    if (gol[col][row] == 1) {
        fill(50, 20, 30);
    } else if (gol[col][row] == 2) {
        fill(50, 220, 130);
    } else if (gol[col][row] == -1) {
        fill(160, 20, 60);
    } else {
        fill(255);
    }
    rect(x, y, resolution, resolution);
}

function computeNext(col, row) {
    let state = max(min(gol[col][row], 1), 0);
    let live = -state;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let x = (col + i + cols) % cols;
            let y = (row + j + rows) % rows;
            live += max(min(gol[x][y], 1), 0);
        }
    }
    next[col][row] = state;
    if (state == 0 && live == 3) {
        next[col][row] = 2;
    } else if (state == 1 && (live < 2 || live > 3)) {
        next[col][row] = -1;
    }
}

function drawGOL() {
    background(0);
    forEachSquare(gol, drawSquareGOL);

    if (!paused) {
        forEachSquare(gol, computeNext);
        let temp = gol;
        gol = next;
        next = temp;
    }
}

function spawnMouse() {
    if (mouseIsPressed) {
        let x = floor(mouseX / resolution);
        let y = floor(mouseY / resolution);

        gol[x][y] = 1;
        next[x][y] = 1;
    }
}