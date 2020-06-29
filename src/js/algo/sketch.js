let canvas;
let canvasSize;
let sel;
let paused = false;

let golDef = {
    setup_function: setupGOL,
    draw_function: drawGOL,
    pressed_function: spawnMouse,
    short_name: "gol",
    next: "game of life 3D",
}
let gol3DDef = {
    setup_function: setupGOL3D,
    draw_function: drawGOL3D,
    short_name: "gol3D",
    next: "maze",
}
let mazeDef = new HexMaze();

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

function toggleOrtho(elem) {
    ortho_view = !ortho_view;
    if (ortho_view) {
        elem.textContent = "Show Perspective View";
    } else {
        elem.textContent = "Show Orthographic View";
    }
}

function nextAlgorithm() {
    setAlgorithm(algorithms.get(algo_name).next);
}

function setAlgorithm(algo) {
    canvas = createCanvas(windowWidth, windowHeight - 185, P2D);
    canvas.parent("p5");
    canvas.style("display", "block");
    if (paused) {
        togglePause();
    }
    if (algo != algo_name) {
        hide();
    }
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
    algorithms.set("game of life 3D", gol3DDef);
    algorithms.set("maze", mazeDef);

    sel = createSelect();
    for (const key of algorithms.keys()) {
        sel.option(key);
    }
    sel.changed(() => setAlgorithm(sel.value()));
    sel.style("font-size", "1.3em");
    sel.style("width", "250px");
    sel.parent("algo-picker");

    algo_name = "game of life";
    setAlgorithm(algo_name);
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
    setAlgorithm(algo_name);
}

function mousePressed() {
    if (algorithms.has(algo_name) && algorithms.get(algo_name).pressed_function) {
        algorithms.get(algo_name).pressed_function();
    }
}

function forEachSquare(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            func(i, j);
        }
    }
}

function forEachCube(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            for (let k = 0; k < arr[i][j].length; k++) {
                func(i, j, k);
            }
        }
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

    frameRate(30);
    noStroke();

    resolution = max(ceil(sqrt(max(width, height)) / 3), 10);
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    maze = makeMaze(cols, rows);
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
    frameRate(30);
    noStroke();
    resolution = max(ceil(sqrt(max(width, height)) / 3), 10);
    cols = ceil(width / resolution);
    rows = ceil(height / resolution);
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


////////////////////////////////
// functions for game of life 3D

let webgl;

let gol3D;
let next3D;

let spacing;
let cube_size;
let pages;
let target_compute;
let target_rate;
let mouse_follow = true;
let shape = "cube";
let ortho_view = false;
let compute_delay = 0;
let frames_since_compute = 0;

function makeGOL3D() {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = new Array(pages);
            for (let k = 0; k < pages; k++) {
                arr[i][j][k] = floor(random(2));
            }
        }
    }
    return arr;
}

function setupGOL3D() {
    webgl = createGraphics(windowWidth, windowHeight - 185, WEBGL);
    if (ortho_view) {
        webgl.ortho(-width / 2, width / 2, height / 2, -height / 2, 1500, -1500);
        webgl.noStroke();
    }
    target_rate = 30
    frameRate(target_rate);
    noStroke();
    resolution = 12;
    cube_size = 25;
    spacing = 5;
    target_compute = 20;
    cols = resolution;
    rows = resolution;
    pages = resolution;
    gol3D = makeGOL3D();
    next3D = makeGOL3D();
}


function drawCubeGOL(col, row, page) {
    let x = col * (cube_size + spacing) - (cube_size + spacing) * resolution / 2;
    let y = row * (cube_size + spacing) - (cube_size + spacing) * resolution / 2;
    let z = page * (cube_size + spacing) - (cube_size + spacing) * resolution / 2;
    let val = gol3D[col][row][page];
    if (val == 0) {
        return;
    }
    webgl.push();
    webgl.translate(x, y, z);
    if (val == 1) {
        webgl.emissiveMaterial(255, 255, 255, 190);
    } else if (val == 2) {
        webgl.scale(min(0.3 + 0.8 * compute_delay, 1.0));
        webgl.emissiveMaterial(50, 220, 130, 220);
    } else if (val == -1) {
        webgl.scale(max(0.7 - 0.8 * compute_delay, 0.0));
        webgl.emissiveMaterial(160, 20, 60, 160);
    }

    if (shape == "sphere") {
        webgl.sphere(cube_size / 2);
    } else {
        webgl.box(cube_size);
    }
    webgl.pop();
}

function computeNext3D(col, row, page) {
    let state = max(min(gol3D[col][row][page], 1), 0);
    let live = -state;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                let x = (col + i + cols) % cols;
                let y = (row + j + rows) % rows;
                let z = (page + k + pages) % pages;
                live += max(min(gol3D[x][y][z], 1), 0);
            }
        }
    }
    next3D[col][row][page] = state;
    if (state == 0 && live < 10 && live > 6) {
        next3D[col][row][page] = 2;
    } else if (state == 1 && (live <= 5 || live >= 9) && live != 0) {
        next3D[col][row][page] = -1;
    }
    if (floor(random(20)) >= 19) {
        if (state == 0) {
            next3D[col][row][page] = floor(random(2)) * 2;
        } else if (state == 1) {
            next3D[col][row][page] = -1;
        }
    }
}



function computeNext3DAlt(col, row, page) {
    let state = max(min(gol3D[col][row][page], 1), 0);
    let live = 0;
    for (let i = 0; i < 2; i++) {
        let x = (col + i * 2 - 1 + cols) % cols;
        let y = row;
        let z = page;
        live += max(min(gol3D[x][y][z], 1), 0);
    }
    for (let j = 0; j < 2; j++) {
        let x = col;
        let y = (row + j * 2 - 1 + rows) % rows;
        let z = page;
        live += max(min(gol3D[x][y][z], 1), 0);
    }
    for (let k = 0; k < 2; k++) {
        let x = col;
        let y = row;
        let z = (page + k * 2 - 1 + pages) % pages;
        live += max(min(gol3D[x][y][z], 1), 0);
    }
    next3D[col][row][page] = state;
    if (state == 0 && live == 3) {
        next3D[col][row][page] = 2;
    } else if (state == 1 && (live < 2 || live > 3)) {
        next3D[col][row][page] = -1;
    }
}



function computeNext3DAlt2(col, row, page) {
    let state = max(min(gol3D[col][row][page], 1), 0);
    let live = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                let x = (col + i + cols) % cols;
                let y = (row + j + rows) % rows;
                let z = (page + k + pages) % pages;
                var box_value = max(min(gol3D[x][y][z], 1), 0);
                if (x == col && y == row && z == page) {
                    continue;
                }
                if (x != col) {
                    box_value /= 2.0;
                }
                if (y != row) {
                    box_value /= 2.0;
                }
                if (z != page) {
                    box_value /= 2.0;
                }
                live += box_value * 2;
            }
        }
    }
    next3D[col][row][page] = state;
    live = ceil(live);
    if (state == 0 && live < 5 && live > 3) {
        next3D[col][row][page] = 2;
    } else if (state == 1 && (live < 3 || live > 5)) {
        next3D[col][row][page] = -1;
    }
}

function drawGOL3D() {
    background(0);
    webgl.reset();
    if (shape == "sphere") {
        webgl.noStroke();
    }
    webgl.background(0);
    if (ortho_view) {
        webgl.rotateX(PI / 16);
        webgl.rotateY(-PI / 8);
    } else if (mouse_follow) {
        yRotation = mouseX / windowWidth * 2 * PI;
        xRotation = mouseY / windowHeight * 2 * PI;
        webgl.rotateY(yRotation);
        webgl.rotateX(xRotation);
    }

    frames_since_compute += (deltaTime / 1000.0) * target_rate;
    if (!paused && frames_since_compute > target_compute) {
        frames_since_compute -= target_compute;
        frames_since_compute = 0;
        forEachCube(gol3D, computeNext3DAlt2);
        let temp = gol3D;
        gol3D = next3D;
        next3D = temp;
    }
    compute_delay = sqrt(frames_since_compute / target_compute);
    forEachCube(gol3D, drawCubeGOL);
    image(webgl, 0, 0);
}