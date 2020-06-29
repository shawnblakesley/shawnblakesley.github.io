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

function Cell(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

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

    let row_height = this.y * 0.83;
    let offset = 0.5 * (this.y % 2);
    this.top_left = {
        x: (this.x + offset - 1 / 2) * this.width,
        y: (row_height - 1 / 3) * this.height,
    }
    this.top = {
        x: (this.x + offset) * this.width,
        y: (row_height - 1 / 2) * this.height,
    }
    this.top_right = {
        x: (this.x + offset + 1 / 2) * this.width,
        y: this.top_left.y,
    }
    this.bottom_left = {
        x: this.top_left.x,
        y: (row_height + 1 / 3) * this.height,
    }
    this.bottom = {
        x: this.top.x,
        y: (row_height + 1 / 2) * this.height,
    }
    this.bottom_right = {
        x: this.top_right.x,
        y: this.bottom_left.y,
    }

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

    this.draw = function () {
        if (this.visited) {
            // Inside
            strokeWeight(2);
            stroke(this.floor.r, this.floor.g, this.floor.b);
            fill(this.floor.r, this.floor.g, this.floor.b);
            beginShape();
            vertex(this.top_left.x, this.top_left.y);
            vertex(this.top.x, this.top.y);
            vertex(this.top_right.x, this.top_right.y);
            vertex(this.bottom_right.x, this.bottom_right.y);
            vertex(this.bottom.x, this.bottom.y);
            vertex(this.bottom_left.x, this.bottom_left.y);
            endShape();

            // Walls
            stroke(this.color.r, this.color.g, this.color.b);
            beginShape(LINES);
            // top-left to top
            if (this.walls.top_left) {
                vertex(this.top_left.x, this.top_left.y);
                vertex(this.top.x, this.top.y);
            }

            // top to top-right
            if (this.walls.top_right) {
                vertex(this.top.x, this.top.y);
                vertex(this.top_right.x, this.top_right.y);
            }

            // top-right to bottom-right
            if (this.walls.right) {
                vertex(this.top_right.x, this.top_right.y);
                vertex(this.bottom_right.x, this.bottom_right.y);
            }

            // bottom-right to bottom
            if (this.walls.bottom_right) {
                vertex(this.bottom_right.x, this.bottom_right.y);
                vertex(this.bottom.x, this.bottom.y);
            }

            // bottom to bottom-left
            if (this.walls.bottom_left) {
                vertex(this.bottom.x, this.bottom.y);
                vertex(this.bottom_left.x, this.bottom_left.y);
            }

            // bottom-left to top-left
            if (this.walls.left) {
                vertex(this.bottom_left.x, this.bottom_left.y);
                vertex(this.top_left.x, this.top_left.y);
            }
            endShape();
        }
    }
}

function HexMaze(next) {
    this.base_cell_height = 32;
    this.short_name = "maze";
    this.next = next;

    this.cells = new Array();

    this.magic_height_number = 0.83;

    this.setup_function = function () {
        frameRate(60);
        this.cell_height = ceil(this.base_cell_height * sqrt(min(width / 1920, height / 833)));
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
                this.cells[i][j] = new Cell(i, j, this.cell_width, this.cell_height);
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
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j].draw();
            }
        }
        if (current_cell) {
            this.cells[current_cell.x][current_cell.y].visit_next();
        }
    }
}