function Cell() {
    this.top_left = true;
    this.top_right = true;
    this.right = true;
    this.bottom_right = true;
    this.bottom_left = true;
    this.left = true;

    this.color = {
        r: 237,
        g: 34,
        b: 93,
    };
}

function HexMaze() {
    this.cell_height = 20;
    this.short_name = "maze";
    this.next = "game of life";

    this.cells = new Array();

    this.magic_height_number = 0.83;

    this.setup_function = function () {
        console.log("Totally setting up a maze");
        this.cell_width = sqrt(3 / 2) * this.cell_height;
        console.log(this.cell_width);
        this.cols = floor(width / this.cell_width - 1);
        this.rows = floor(height / (this.cell_height * this.magic_height_number) - 1);
        console.log("rows:", this.rows, "cols:", this.cols);
        this.cells = new Array(this.cols);
        for (var i = 0; i < this.cols; i++) {
            this.cells[i] = new Array(this.rows);
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j] = new Cell();
            }
        }
        console.log("rows:", this.rows, "cols:", this.cols, "cells:", this.cells);
    }

    this.draw_function = function () {
        translate(this.cell_width, this.cell_height);
        background(0);
        for (var j = 0; j < this.rows; j++) {
            let row_height = j * this.magic_height_number;
            let offset = 0.5 * (j % 2);
            for (var i = 0; i < this.cols; i++) {
                var cell = this.cells[i][j];
                strokeWeight(1);
                stroke(cell.color.r, cell.color.g, cell.color.b);

                var top_left = {
                    x: (i + offset - 1 / 2) * this.cell_width,
                    y: (row_height + 1 / 3) * this.cell_height,
                }
                var top = {
                    x: (i + offset) * this.cell_width,
                    y: (row_height + 1 / 2) * this.cell_height,
                }
                var top_right = {
                    x: (i + offset + 1 / 2) * this.cell_width,
                    y: top_left.y,
                }
                var bottom_left = {
                    x: top_left.x,
                    y: (row_height - 1 / 3) * this.cell_height,
                }
                var bottom = {
                    x: top.x,
                    y: (row_height - 1 / 2) * this.cell_height,
                }
                var bottom_right = {
                    x: top_right.x,
                    y: bottom_left.y,
                }

                // Walls
                beginShape(LINES);
                // top-left to top
                vertex(top_left.x, top_left.y);
                vertex(top.x, top.y);

                // // top to top-right
                vertex(top.x, top.y);
                vertex(top_right.x, top_right.y);

                // // top-right to bottom-right
                vertex(top_right.x, top_right.y);
                vertex(bottom_right.x, bottom_right.y);

                // // bottom-right to bottom
                vertex(bottom_right.x, bottom_right.y);
                vertex(bottom.x, bottom.y);

                // // bottom to bottom-left
                vertex(bottom.x, bottom.y);
                vertex(bottom_left.x, bottom_left.y);

                // bottom-left to top-left
                vertex(bottom_left.x, bottom_left.y);
                vertex(top_left.x, top_left.y);
                endShape();

                // Inside
                // fill(255);
                // beginShape();
                // vertex(top_left.x, top_left.y);
                // vertex(top.x, top.y);
                // vertex(top_right.x, top_right.y);
                // vertex(bottom_right.x, bottom_right.y);
                // vertex(bottom.x, bottom.y);
                // vertex(bottom_left.x, bottom_left.y);
                // endShape();
            }
        }
    }
}