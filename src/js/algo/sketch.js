let canvas;
let canvasSize;
let button;
let sel;

let mazeDef = {
    setup_function: setupMaze,
    draw_function: drawMaze,
}
let golDef = {
    setup_function: setupGOL,
    draw_function: drawGOL,
    pressed_function: spawnMouse,
}
let testDef = {
    setup_function: () => console.log("Entering the test"),
    draw_function: () => background(0),
}

let algo_name;
let algorithms;

function setAlgorithm(algo) {
    if (algorithms.has(algo)) {
        algo_name = algo;
        console.log("Chosen algorithm:", algo_name);
        algorithms.get(algo_name).setup_function();
        button.mousePressed(() => setAlgorithm(algo_name));
    } else {
        console.error("Could not find algorithm:", algo_name)
    }
}

function setup() {
    algorithms = new Map();
    algorithms.set("game of life", golDef);
    algorithms.set("maze", mazeDef);
    algorithms.set("some other really long named thing", testDef);
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

    button = createButton('regenerate');
    button.style("font-size", "1.3em");
    button.style("width", "150px");
    button.style("position", "absolute");
    button.style("right", "10px");
    button.style("top", "45px");

    canvas = createCanvas(windowWidth, windowHeight - 175);
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
    canvas = createCanvas(windowWidth, windowHeight - 175);
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
            arr[i][j] = floor(random(2)) * random(255) - 1;
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
        fill(value * 3 % 20 + 235, value * 2 % 50 + 205, value % 75 + 180);
    }
    rect(x, y, resolution - 1, resolution - 1);
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
    } else {
        fill(255);
    }
    rect(x, y, resolution, resolution);
}

function computeNext(col, row) {
    let state = gol[col][row];
    let live = -state;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let x = (col + i + cols) % cols;
            let y = (row + j + rows) % rows;
            live += gol[x][y];
        }
    }
    next[col][row] = state;
    if (state == 0 && live == 3) {
        next[col][row] = 1;
    } else if (state == 1 && (live < 2 || live > 3)) {
        next[col][row] = 0;
    }
}

function drawGOL() {
    background(0);
    forEachSquare(gol, drawSquareGOL);

    forEachSquare(gol, computeNext);

    let temp = gol;
    gol = next;
    next = temp;
}

function spawnMouse() {
    if (mouseIsPressed) {
        console.log("mouse is pressed...");
        let x = floor(mouseX / resolution);
        let y = floor(mouseY / resolution);

        gol[x][y] = 1;
        next[x][y] = 1;
    }
}