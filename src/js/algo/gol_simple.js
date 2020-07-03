const gol = (function () {
    function Gol(next_algo) {
        this.short_name = "gol";
        this.description = `
            <p> This example follows the basic rules from Conway's Game of Life.</p>
            <p> - If a dead cell is neighboring exactly 3 living cells it will come back to life.</p>
            <p> - If a living cell is neighboring less that 2 or greater than 3 live cells it will die.</p>
            <p>Red <span style="color: rgb(160, 20, 60);font-size: 1.5em;">&#9632;</span> indicates a recent cell death, and green <span style="color: rgb(50, 220, 130);font-size: 1.5em;">&#9632;</span> indicates a new cell birth.</p>
        `;
        this.next = next_algo;

        let board;
        let next;
        let cols;
        let rows;
        let resolution;

        function makeBoard(cols, rows) {
            let arr = new Array(cols);
            for (let i = 0; i < cols; i++) {
                arr[i] = new Array(rows);
                for (let j = 0; j < rows; j++) {
                    arr[i][j] = floor(random(2));
                }
            }
            return arr;
        }

        this.setup = function () {
            canvas.mouseMoved(spawnMouse);
            frameRate(30);
            noStroke();
            resolution = max(ceil(sqrt(max(width, height)) / 3), 10);
            cols = ceil(width / resolution);
            rows = ceil(height / resolution);
            board = makeBoard(cols, rows);
            next = makeBoard(cols, rows);
        }

        function drawSquareGOL(col, row) {
            let x = col * resolution;
            let y = row * resolution;
            if (board[col][row] == 1) {
                fill(50, 20, 30);
            } else if (board[col][row] == 2) {
                fill(50, 220, 130);
            } else if (board[col][row] == -1) {
                fill(160, 20, 60);
            } else {
                fill(255);
            }
            rect(x, y, resolution, resolution);
        }

        function computeNext(col, row) {
            let state = max(min(board[col][row], 1), 0);
            let live = -state;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let x = (col + i + cols) % cols;
                    let y = (row + j + rows) % rows;
                    live += max(min(board[x][y], 1), 0);
                }
            }
            next[col][row] = state;
            if (state == 0 && live == 3) {
                next[col][row] = 2;
            } else if (state == 1 && (live < 2 || live > 3)) {
                next[col][row] = -1;
            }
        }

        this.draw = function () {
            background(0);
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    drawSquareGOL(i, j);
                }
            }

            if (!paused) {
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        computeNext(i, j);
                    }
                }
                let temp = board;
                board = next;
                next = temp;
            }
        }

        function spawnMouse() {
            if (mouseIsPressed) {
                let x = floor(mouseX / resolution);
                let y = floor(mouseY / resolution);

                board[x][y] = 1;
                next[x][y] = 1;
            }
        }
    }
    return {
        Gol: Gol,
    }
})();