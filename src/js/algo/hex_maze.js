function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var current_cell = {
    x: 0,
    y: 0,
};

function Cell(x, y) {
    this.x = x;
    this.y = y;

    this.visited = false;

    this.color = {
        r: 0,
        g: 0,
        b: 0
    };

    this.floor = {
        r: 0,
        g: 0,
        b: 0
    };

    this.visiting_list = [];

    this.previous = undefined;

    this.fill_neighbors = function (cells) {
        let x = this.x;
        let y = this.y;
        let offset = y % 2;
        this.neighbors = {
            top_left: x - 1 + offset >= 0 && y - 1 >= 0 ? cells[x - 1 + offset][y - 1] : null,
            top_right: x + offset < cells.length && y - 1 >= 0 ? cells[x + offset][y - 1] : null,
            right: x + 1 < cells.length ? cells[x + 1][y] : null,
            bottom_right: x + offset < cells.length && y + 1 < cells[0].length ? cells[x + offset][y + 1] : null,
            bottom_left: x - 1 + offset >= 0 && y + 1 < cells[0].length ? cells[x - 1 + offset][y + 1] : null,
            left: x - 1 >= 0 ? cells[x - 1][y] : null,
        };
        this.walls = {
            top_left: true,
            top_right: true,
            right: true,
            bottom_right: true,
            bottom_left: true,
            left: true,
        };
        if (this.neighbors.top_left != null) {
            this.visiting_list.push([this.neighbors.top_left, "top_left"]);
        }
        if (this.neighbors.top_right != null) {
            this.visiting_list.push([this.neighbors.top_right, "top_right"]);
        }
        if (this.neighbors.right != null) {
            this.visiting_list.push([this.neighbors.right, "right"]);
        }
        if (this.neighbors.bottom_right != null) {
            this.visiting_list.push([this.neighbors.bottom_right, "bottom_right"]);
        }
        if (this.neighbors.bottom_left != null) {
            this.visiting_list.push([this.neighbors.bottom_left, "bottom_left"]);
        }
        if (this.neighbors.left != null) {
            this.visiting_list.push([this.neighbors.left, "left"]);
        }
        this.visiting_list = shuffle(this.visiting_list);
    }

    this.strip_wall = function (side) {
        this.walls[side] = false;
    }

    this.visit = function (relative_location) {
        if (relative_location == "top_left") {
            this.previous = "bottom_right";
        } else if (relative_location == "top_right") {
            this.previous = "bottom_left";
        } else if (relative_location == "right") {
            this.previous = "left";
        } else if (relative_location == "bottom_right") {
            this.previous = "top_left";
        } else if (relative_location == "bottom_left") {
            this.previous = "top_right";
        } else if (relative_location == "left") {
            this.previous = "right";
        }
        if (this.previous) {
            this.strip_wall(this.previous);
        }
        current_cell = {
            x: this.x,
            y: this.y,
        };
        this.color = {
            r: 237,
            g: 34,
            b: 93,
        };
        this.visited = true;
        this.floor = {
            r: 100,
            g: 205,
            b: 160,
        }
    }

    this.visit_next = function () {
        this.floor = {
            r: 255,
            g: 255,
            b: 255,
        }
        if (this.visiting_list.length > 0) {
            let neighbor = this.visiting_list.pop();
            if (!neighbor[0].visited) {
                this.strip_wall(neighbor[1]);
                neighbor[0].visit(neighbor[1]);
            } else {
                this.visit_next();
            }
        } else if (this.previous) {
            this.neighbors[this.previous].visit("none");
        } else {
            current_cell = undefined;
        }
    }
}

function HexMaze(next) {
    this.cell_height = 40;
    this.short_name = "maze";
    this.next = next;

    this.cells = new Array();

    this.magic_height_number = 0.83;

    this.setup_function = function () {
        frameRate(30);
        this.cell_width = sqrt(3 / 2) * this.cell_height;
        this.cols = floor(width / this.cell_width - 1);
        this.rows = floor(height / (this.cell_height * this.magic_height_number) - 1);
        current_cell = {
            x: floor(random(this.cols)),
            y: floor(random(this.rows)),
        };
        this.cells = new Array(this.cols);
        for (var i = 0; i < this.cols; i++) {
            this.cells[i] = new Array(this.rows);
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j].fill_neighbors(this.cells);
            }
        }
        this.cells[current_cell.x][current_cell.y].visit("none");
        // // NOTE: use this to quick-generate. TODO: make this into a clickable function.
        // while (current_cell) {
        //     this.cells[current_cell.x][current_cell.y].visit_next();
        // }
    }

    this.draw_function = function () {
        translate(this.cell_width, this.cell_height);
        background(0);
        for (var j = 0; j < this.rows; j++) {
            let row_height = j * this.magic_height_number;
            let offset = 0.5 * (j % 2);
            for (var i = 0; i < this.cols; i++) {
                var cell = this.cells[i][j];

                var top_left = {
                    x: (i + offset - 1 / 2) * this.cell_width,
                    y: (row_height - 1 / 3) * this.cell_height,
                }
                var top = {
                    x: (i + offset) * this.cell_width,
                    y: (row_height - 1 / 2) * this.cell_height,
                }
                var top_right = {
                    x: (i + offset + 1 / 2) * this.cell_width,
                    y: top_left.y,
                }
                var bottom_left = {
                    x: top_left.x,
                    y: (row_height + 1 / 3) * this.cell_height,
                }
                var bottom = {
                    x: top.x,
                    y: (row_height + 1 / 2) * this.cell_height,
                }
                var bottom_right = {
                    x: top_right.x,
                    y: bottom_left.y,
                }

                // Inside
                strokeWeight(2);
                stroke(cell.floor.r, cell.floor.g, cell.floor.b);
                fill(cell.floor.r, cell.floor.g, cell.floor.b);
                beginShape();
                vertex(top_left.x, top_left.y);
                vertex(top.x, top.y);
                vertex(top_right.x, top_right.y);
                vertex(bottom_right.x, bottom_right.y);
                vertex(bottom.x, bottom.y);
                vertex(bottom_left.x, bottom_left.y);
                endShape();

                // Walls
                stroke(cell.color.r, cell.color.g, cell.color.b);
                beginShape(LINES);
                // top-left to top
                if (cell.walls.top_left) {
                    vertex(top_left.x, top_left.y);
                    vertex(top.x, top.y);
                }

                // top to top-right
                if (cell.walls.top_right) {
                    vertex(top.x, top.y);
                    vertex(top_right.x, top_right.y);
                }

                // top-right to bottom-right
                if (cell.walls.right) {
                    vertex(top_right.x, top_right.y);
                    vertex(bottom_right.x, bottom_right.y);
                }

                // bottom-right to bottom
                if (cell.walls.bottom_right) {
                    vertex(bottom_right.x, bottom_right.y);
                    vertex(bottom.x, bottom.y);
                }

                // bottom to bottom-left
                if (cell.walls.bottom_left) {
                    vertex(bottom.x, bottom.y);
                    vertex(bottom_left.x, bottom_left.y);
                }

                // bottom-left to top-left
                if (cell.walls.left) {
                    vertex(bottom_left.x, bottom_left.y);
                    vertex(top_left.x, top_left.y);
                }
                endShape();
            }
        }
        if (current_cell) {
            this.cells[current_cell.x][current_cell.y].visit_next();
        }
    }
}