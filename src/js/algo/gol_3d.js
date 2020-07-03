const gol_3d = (function () {

    let ortho_view = false;
    let mouse_follow = false;

    function updateCubeResolution(input_elem) {
        var label = document.getElementById(`${input_elem.id}-label`);
        label.textContent = `Count ${input_elem.value * 2}`

        setAlgorithm(algo_name);
    }

    function toggleOrtho(elem) {
        ortho_view = !ortho_view;
        if (ortho_view) {
            elem.textContent = "Show Perspective View";
        } else {
            elem.textContent = "Show Orthographic View";
        }
    }

    function toggleMouseFollow(elem) {
        mouse_follow = !mouse_follow;
        if (mouse_follow) {
            elem.textContent = "Disable Mouse Follow";
        } else {
            elem.textContent = "Enable Mouse Follow";
        }
    }

    function GameOfLife(next) {
        this.short_name = 'gol3D';
        this.description = `
        <p>This example converted Conway's Game of Life to 3 Dimensions.</p>
        <p>- Spawn cell if head and  9 >= live neighbors >= 5.</p>
        <p>- Kill cell if living and 9 < live neighbors or live neighbors < 5.</p>
        <p>Red indicates a recent cell death, and green indicates a new cell birth.</p>
        `;
        this.next = next;
        this.webgl;

        this.board;
        this.nextBoard;

        this.spacing;
        this.cube_size;
        this.pages;
        this.target_compute;
        this.target_rate;
        this.shape = "cube";
        this.compute_delay = 0;
        this.frames_since_compute = 0;

        this.makeGOL3D = function () {
            let arr = new Array(cols);
            for (let i = 0; i < cols; i++) {
                arr[i] = new Array(rows);
                for (let j = 0; j < rows; j++) {
                    arr[i][j] = new Array(this.pages);
                    for (let k = 0; k < this.pages; k++) {
                        arr[i][j][k] = floor(random(2));
                    }
                }
            }
            return arr;
        }

        this.setup = function () {
            this.webgl = createGraphics(width, height, WEBGL);
            this.target_rate = 30
            frameRate(this.target_rate);
            noStroke();
            var elem = document.getElementById("cube-count");
            resolution = elem.value * 2;
            var label = document.getElementById(`${elem.id}-label`);
            label.textContent = `Count ${resolution}`
            this.cube_size = 25;
            this.spacing = 5;
            this.target_compute = 20;
            cols = resolution;
            rows = resolution;
            this.pages = resolution;
            this.board = this.makeGOL3D();
            this.nextBoard = this.makeGOL3D();
        }


        this.drawCubeGOL = function (col, row, page) {
            let x = floor(col * (this.cube_size + this.spacing) - (this.cube_size + this.spacing) * resolution / 2);
            let y = floor(row * (this.cube_size + this.spacing) - (this.cube_size + this.spacing) * resolution / 2);
            let z = floor(page * (this.cube_size + this.spacing) - (this.cube_size + this.spacing) * resolution / 2);
            let val = this.board[col][row][page];
            if (val == 0) {
                return;
            }
            this.webgl.push();
            this.webgl.translate(x, y, z);
            if (val == 1) {
                this.webgl.emissiveMaterial(255, 255, 255, 190);
            } else if (val == 2) {
                this.webgl.scale(min(0.3 + 0.8 * this.compute_delay, 1.0));
                this.webgl.emissiveMaterial(50, 220, 130, 220);
            } else if (val == -1) {
                this.webgl.scale(max(0.7 - 0.8 * this.compute_delay, 0.0));
                this.webgl.emissiveMaterial(160, 20, 60, 160);
            }

            if (this.shape == "sphere") {
                this.webgl.sphere(this.cube_size / 2);
            } else {
                this.webgl.box(this.cube_size);
            }
            this.webgl.pop();
        }

        this.computeNext3D = function (col, row, page) {
            let state = max(min(this.board[col][row][page], 1), 0);
            let live = -state;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        let x = (col + i + cols) % cols;
                        let y = (row + j + rows) % rows;
                        let z = (page + k + this.pages) % this.pages;
                        live += max(min(this.board[x][y][z], 1), 0);
                    }
                }
            }
            this.nextBoard[col][row][page] = state;
            if (state == 0 && live < 10 && live > 6) {
                this.nextBoard[col][row][page] = 2;
            } else if (state == 1 && (live <= 5 || live >= 9) && live != 0) {
                this.nextBoard[col][row][page] = -1;
            }
            if (floor(random(20)) >= 19) {
                if (state == 0) {
                    this.nextBoard[col][row][page] = floor(random(2)) * 2;
                } else if (state == 1) {
                    this.nextBoard[col][row][page] = -1;
                }
            }
        }



        this.computeNext3DAlt = function (col, row, page) {
            let state = max(min(this.board[col][row][page], 1), 0);
            let live = 0;
            for (let i = 0; i < 2; i++) {
                let x = (col + i * 2 - 1 + cols) % cols;
                let y = row;
                let z = page;
                live += max(min(this.board[x][y][z], 1), 0);
            }
            for (let j = 0; j < 2; j++) {
                let x = col;
                let y = (row + j * 2 - 1 + rows) % rows;
                let z = page;
                live += max(min(this.board[x][y][z], 1), 0);
            }
            for (let k = 0; k < 2; k++) {
                let x = col;
                let y = row;
                let z = (page + k * 2 - 1 + this.pages) % this.pages;
                live += max(min(this.board[x][y][z], 1), 0);
            }
            this.nextBoard[col][row][page] = state;
            if (state == 0 && live == 3) {
                this.nextBoard[col][row][page] = 2;
            } else if (state == 1 && (live < 2 || live > 3)) {
                this.nextBoard[col][row][page] = -1;
            }
        }



        this.computeNext3DAlt2 = function (col, row, page) {
            let state = max(min(this.board[col][row][page], 1), 0);
            let live = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        let x = (col + i + cols) % cols;
                        let y = (row + j + rows) % rows;
                        let z = (page + k + this.pages) % this.pages;
                        var box_value = max(min(this.board[x][y][z], 1), 0);
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
            this.nextBoard[col][row][page] = state;
            live = ceil(live);
            if (state == 0 && live < 5 && live > 3) {
                this.nextBoard[col][row][page] = 2;
            } else if (state == 1 && (live < 3 || live > 5)) {
                this.nextBoard[col][row][page] = -1;
            }
        }

        this.draw = function () {
            if (ortho_view) {
                this.webgl.ortho(-width / 2, width / 2, height / 2, -height / 2, 1500, -1500);
            } else {
                this.webgl.perspective();
            }
            background(0);
            this.webgl.stroke(120);
            this.webgl.reset();
            if (this.shape == "sphere") {
                this.webgl.noStroke();
            }
            this.webgl.background(0);
            if (mouse_follow) {
                yRotation = mouseX / width * .5 * PI;
                xRotation = .25 * PI;
                this.webgl.rotateY(yRotation);
                this.webgl.rotateX(xRotation);
            } else {
                yRotation = .25 * PI;
                xRotation = .25 * PI;
                this.webgl.rotateY(yRotation);
                this.webgl.rotateX(xRotation);
            }

            this.frames_since_compute += (deltaTime / 1000.0) * this.target_rate;
            if (!paused && this.frames_since_compute > this.target_compute) {
                this.frames_since_compute -= this.target_compute;
                this.frames_since_compute = 0;

                for (let i = 0; i < this.board.length; i++) {
                    for (let j = 0; j < this.board[i].length; j++) {
                        for (let k = 0; k < this.board[i][j].length; k++) {
                            this.computeNext3DAlt2(i, j, k);
                        }
                    }
                }
                let temp = this.board;
                this.board = this.nextBoard;
                this.nextBoard = temp;
            }
            this.compute_delay = sqrt(this.frames_since_compute / this.target_compute);
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    for (let k = 0; k < this.board[i][j].length; k++) {
                        this.drawCubeGOL(i, j, k);
                    }
                }
            }
            image(this.webgl, 0, 0);
        }
    }
    return {
        GameOfLife: GameOfLife,
        updateCubeResolution: updateCubeResolution,
        toggleOrtho: toggleOrtho,
        toggleMouseFollow: toggleMouseFollow,
    };
})();