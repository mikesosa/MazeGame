let allDivs = document.getElementsByClassName("cell");
let current;
let next;
var stack = [];

class Cell {
    constructor(i, j) {
        this.rowNumber = i;
        this.columnNumber = j;
        this.walls = [true, true, true, true];
        this.visited = false;
    }
}

var base = {
    // Initilize the grid with one element so I can start pshing from 1
    grid: [],
    numColumns: "",
    numRows: "",
    sizeOfCell: 35,
    removeBorder: "",
    get numOfCells() {
        return (this.numColumns * this.numRows);
    }
}

var controller = {
    init: () => {
        view.init();
        console.log(base.numColumns);
        console.log(base.numRows);
        console.log(base.numOfCells);
    },
    reset: () => {
        location.reload();
    },
    buildMaze: (cellNumber) => {
        current = cellNumber;
        base.grid[current].visited = true;
        allDivs[current].classList.add('visited');
        var times = 0;
        function draw() {
            base.grid[current].visited = true;
             allDivs[current].classList.remove('currentCell');
            allDivs[current].classList.add('visited');
            // This will return an unvisited neighbor number
            next = controller.checkNeighbors(base.grid[current]);
            if (next) {
                // Pushing current to stack for backtrack algorithm
                stack.push(current);
                // Painting out the
                allDivs[next].classList.add('currentCell');
                // Deletign borders
                view.removeBorders();
                // The current becomes the next
                current = next;
            } else {
                // If undefined take one of the stack
                current = stack.pop();
                allDivs[current].classList.add('currentCell');
            }
            // view.unpaintCurrentCell();

            // Delay for a better UX
            if (stack.length > 0) {
                setTimeout(draw, 50);
            } else {
                console.log("Done!");
            }
        }
        draw();
        console.log("Building...");
    },
    checkNeighbors: (cell) => {
            var neighbors = [];
            var neighborTop = controller.index(cell.columnNumber, cell.rowNumber - 1);
            var neighborRight = controller.index(cell.columnNumber + 1, cell.rowNumber);
            var neighborBottom = controller.index(cell.columnNumber, cell.rowNumber + 1);
            var neighborLeft = controller.index(cell.columnNumber -1, cell.rowNumber);

            if (neighborTop && !base.grid[neighborTop].visited) {
                neighbors.push(neighborTop);
            }
            if (neighborRight  && !base.grid[neighborRight].visited) {
                neighbors.push(neighborRight);
            }
            if (neighborBottom  && !base.grid[neighborBottom].visited) {
                neighbors.push(neighborBottom);
            }
            if (neighborLeft  && !base.grid[neighborLeft].visited) {
                neighbors.push(neighborLeft);
            }

            if (neighbors.length > 0) {
                var randomNumber = Math.floor(Math.random(0) * neighbors.length);
                if (neighbors[randomNumber] === neighborTop) {
                    base.removeBorder = "bb";
                } else if (neighbors[randomNumber] === neighborRight) {
                    base.removeBorder = "bl";
                } else if (neighbors[randomNumber] === neighborBottom) {
                    base.removeBorder = "bt";
                } else if (neighbors[randomNumber] === neighborLeft) {
                    base.removeBorder = "br";
                }
                return neighbors[randomNumber];
            } else {
                return undefined;
            }
    },
    index: (i, j) => {
        // Edge cases
        if (i < 0 || j < 0 || i > (base.numColumns - 1) || j > (base.numRows - 1)) {
            return false;
        }
        // Complicated algorithm that I found
        return (i + j * base.numColumns);
    }
}

var view = {
    init: () => {
        view.createGrid(base.sizeOfCell);
        // document.getElementById('buildButton').addEventListener('click', controller.buildMaze(105));
        document.getElementById('buildButton').onclick = function () {

            // let value = document.getElementById('firstCell').value;
            controller.buildMaze(0);
        };
        document.getElementById('resetButton').onclick = function () {
            controller.reset();
        };
    },
    createGrid: (size) => {
        var ratioW = Math.floor($('.maze-container').width()/size),
            ratioH = Math.floor($('.maze-container').height()/size);

        var parent = $('<div />', {
            class: 'grid',
            width: ratioW  * size,
            height: ratioH  * size
        }).addClass('grid').prependTo('.maze-container');

        for (var i = 0; i < ratioH; i++) {
            for(var j = 0; j < ratioW; j++){
                // Creating the cell obejcts
                var cell = new Cell(i, j);
                base.grid.push(cell);
                // Drawign the cell
                $('<div />', {
                    class: `cell ${i}-${j} bt br bb bl`,
                    width: size - 1,
                    height: size - 1
                }).appendTo(parent);
                base.numColumns = j + 1;
            }
            base.numRows = i + 1;
        }
    },
    removeBorders: () => {
        if (base.removeBorder === "bt") {
            allDivs[current].classList.remove("bb");
        } else if (base.removeBorder === "br") {
            allDivs[current].classList.remove("bl");
        } else if (base.removeBorder === "bb") {
            allDivs[current].classList.remove("bt");
        } else if (base.removeBorder === "bl") {
            allDivs[current].classList.remove("br");
        }
        allDivs[next].classList.remove(base.removeBorder);
    }
}

controller.init();
