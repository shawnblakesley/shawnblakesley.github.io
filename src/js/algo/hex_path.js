const hex_path = (function () {
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    let current_cell = {
        x: 0,
        y: 0,
    };


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function Cell(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.weight = floor(pow(random(1.5), 3)) + 1;

        this.isSource = false;
        this.isDestination = false;
        this.visited = false;
        this.distance = Infinity;
        this.isChecked = false;
        this.pathVisited = false;
        this.show = false;
        this.scaleValue = 0;

        this.color = color(0);
        this.floor = color(64, 128, 255);

        this.visiting_list = [];

        this.previous = undefined;

        this.top_left = {
            x: -this.width / 2,
            y: -this.height / 3,
        }
        this.top = {
            x: 0,
            y: -this.height / 2,
        }
        this.top_right = {
            x: this.width / 2,
            y: this.top_left.y,
        }
        this.bottom_left = {
            x: this.top_left.x,
            y: this.height / 3,
        }
        this.bottom = {
            x: this.top.x,
            y: this.height / 2,
        }
        this.bottom_right = {
            x: this.top_right.x,
            y: this.bottom_left.y,
        }
        this.center = {
            x: (this.x + this.y % 2 * 1 / 2) * this.width,
            y: (this.y * 0.83) * this.height,
        }

        this.setSource = function () {
            this.isSource = true;
            this.floor = color(64, 255, 172);
            this.distance = 0;
            this.show = true;
            this.weight = 0;
            this.pathVisited = true;
        }

        this.setDestination = function () {
            this.isDestination = true;
            this.floor = color(255, 255, 172);
            this.scaleValue = 1;
            this.show = true;
            this.weight = 0;
        }

        this.setup = function (cells) {
            let x = this.x;
            let y = this.y;
            let offset = y % 2;
            this.visited = false;
            this.previous = undefined;
            if (!this.neighbors) {
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
            }
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
            this.color = color(237, 34, 93);
            this.color = color(255);
            this.visited = true;
        }

        this.visit_next = function () {
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
            push();
            translate(this.center.x, this.center.y);
            push();
            // Inside
            noStroke();
            fill(30);
            beginShape();
            vertex(this.top_left.x, this.top_left.y);
            vertex(this.top.x, this.top.y);
            vertex(this.top_right.x, this.top_right.y);
            vertex(this.bottom_right.x, this.bottom_right.y);
            vertex(this.bottom.x, this.bottom.y);
            vertex(this.bottom_left.x, this.bottom_left.y);
            endShape();
            if (this.show) {
                scale(this.scaleValue);
                if (this.scaleValue < 1) {
                    this.scaleValue = min(pow(this.scaleValue + deltaTime / 1000, .7), 1);
                }
                fill(this.floor);
                beginShape();
                vertex(this.top_left.x, this.top_left.y);
                vertex(this.top.x, this.top.y);
                vertex(this.top_right.x, this.top_right.y);
                vertex(this.bottom_right.x, this.bottom_right.y);
                vertex(this.bottom.x, this.bottom.y);
                vertex(this.bottom_left.x, this.bottom_left.y);
                endShape();
            }
            pop();

            let blankWallColor = color(30); //lerpColor(color(30), this.floor, this.scaleValue);
            // Walls
            beginShape(LINES);
            // top-left to top
            if (this.walls.top_left) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.top_left.x, this.top_left.y);
            vertex(this.top.x, this.top.y);

            // top to top-right
            if (this.walls.top_right) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.top.x, this.top.y);
            vertex(this.top_right.x, this.top_right.y);


            // top-right to bottom-right
            if (this.walls.right) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.top_right.x, this.top_right.y);
            vertex(this.bottom_right.x, this.bottom_right.y);


            // bottom-right to bottom
            if (this.walls.bottom_right) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.bottom_right.x, this.bottom_right.y);
            vertex(this.bottom.x, this.bottom.y);


            // bottom to bottom-left
            if (this.walls.bottom_left) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.bottom.x, this.bottom.y);
            vertex(this.bottom_left.x, this.bottom_left.y);


            // bottom-left to top-left
            if (this.walls.left) {
                stroke(this.color);
                strokeWeight(3);
            } else {
                stroke(blankWallColor);
                strokeWeight(2);
            }
            vertex(this.bottom_left.x, this.bottom_left.y);
            vertex(this.top_left.x, this.top_left.y);

            endShape();
            strokeWeight(2);
            stroke(0);
            fill(255);
            text(this.weight, 0, 0);
            pop();
        }
    }

    function HexPath(next, passes = 3) {
        this.base_cell_height = 60;
        this.short_name = "path";
        this.next = next;
        this.description = `
            <p>A pathfinding algorithm to navigate through a hex maze.</p>
        `

        this.visit_count = 0;
        this.max_visit_cycles = passes;

        this.cells = new Array();

        this.magic_height_number = 0.83;

        this.pathfind = async function () {
            while (true) {
                await sleep(10);
                this.cells[floor(random(this.cells.length))][floor(random(this.cells[0].length))].show = true;
            }
        }

        this.setup = function () {
            frameRate(60);
            textAlign(CENTER, CENTER);
            textSize(16);
            this.visit_count = 0;
            this.cell_height = ceil(this.base_cell_height * sqrt(min(width / 1920, height / 833)));
            this.cell_width = sqrt(3 / 2) * this.cell_height;
            this.cols = floor(width / this.cell_width - 1);
            this.rows = floor(height / (this.cell_height * this.magic_height_number) - 1);
            this.cells = new Array(this.cols);
            for (var i = 0; i < this.cols; i++) {
                this.cells[i] = new Array(this.rows);
                for (var j = 0; j < this.rows; j++) {
                    this.cells[i][j] = new Cell(i, j, this.cell_width, this.cell_height);
                }
            }
            this.new_cycle();
            while (this.visit_count <= this.max_visit_cycles) {
                this.new_cycle();
                while (current_cell) {
                    this.cells[current_cell.x][current_cell.y].visit_next();
                }
            }

            this.cells[floor(random(this.cells.length))][floor(random(this.cells[0].length))].setSource();
            let dest = this.cells[floor(random(this.cells.length))][floor(random(this.cells[0].length))];
            while (dest.isSource) {
                dest = this.cells[floor(random(this.cells.length))][floor(random(this.cells[0].length))]
            }
            dest.setDestination();
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[0].length; j++) {
                    this.cells[i][j].visited = false;
                }
            }
            this.pathfind();
        }

        this.new_cycle = function () {
            this.visit_count += 1;
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    this.cells[i][j].setup(this.cells);
                }
            }
            current_cell = {
                x: floor(random(this.cols)),
                y: floor(random(this.rows)),
            };
            this.cells[current_cell.x][current_cell.y].visit("none");
        }

        this.draw = function () {
            translate(ceil(this.cell_width * .75), ceil(this.cell_height * .75));
            background(0);
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    this.cells[i][j].draw();
                }
            }
            if (current_cell) {
                this.cells[current_cell.x][current_cell.y].visit_next();
            } else if (this.visit_count < this.max_visit_cycles) {
                this.new_cycle();
            }
        }
    }

    return {
        HexPath: HexPath,
    }
})();