var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.GRID_ROWS = 4;
        this.GRID_COL = 4;
        this.grid = Array.from({ length: this.GRID_ROWS }, function () {
            return Array.from({ length: _this.GRID_COL }, function () {
                return Math.random() > 0.85 ? 2 : 0;
            });
        });
    }
    Game.prototype.moveElementsRight = function (array) {
        var zeroes = array.filter(function (x) { return x === 0; });
        var nonZeroes = array.filter(function (x) { return x !== 0; });
        return zeroes.concat(nonZeroes);
    };
    Game.prototype.getNthColumn = function (n) {
        return this.grid.map(function (row) { return row[n]; });
    };
    Game.prototype.mergeRow = function (array) {
        var arr = [];
        for (var i = array.length - 1; i >= 0; i--) {
            if (array[i] == array[i - 1]) {
                arr.push(array[i] * 2);
                arr.push(0);
                i--;
            }
            else {
                arr.push(array[i]);
            }
        }
        return arr.reverse();
    };
    Game.prototype.randoma = function (array) {
        var _this = this;
        return array.map(function (row) {
            return _this.makeNextMove(row);
        });
    };
    Game.prototype.randomaL = function (array) {
        var _this = this;
        return array.map(function (row) {
            return _this.makeNextMove(row.reverse());
        });
    };
    Game.prototype.makeNextMove = function (array) {
        var arr = __spreadArray([], array, true);
        arr = this.moveElementsRight(arr);
        arr = this.mergeRow(arr);
        arr = this.moveElementsRight(arr);
        return arr;
    };
    Game.prototype.reverse = function (array) {
        return __spreadArray([], array, true).reverse();
    };
    Game.prototype.transpose = function (array) {
        return array[0].map(function (_, i) { return array.map(function (r) { return r[i]; }); });
    };
    Game.prototype.rotateClock = function (array) {
        return this.transpose(this.reverse(array));
    };
    Game.prototype.rotateCounter = function (array) {
        return this.reverse(this.transpose(array));
    };
    Game.prototype.makeNextBoard = function (dir) {
        switch (dir) {
            case Direction.Down:
                this.grid = this.rotateClock(this.randoma(this.rotateCounter(this.grid)));
                break;
            case Direction.Up:
                this.grid = this.rotateCounter(this.randoma(this.rotateClock(this.grid)));
                break;
            case Direction.Left:
                this.grid = this.randomaL(this.grid).map(function (row) {
                    return row.reverse();
                });
                break;
            case Direction.Right:
                this.grid = this.randoma(this.grid);
                break;
        }
    };
    Game.prototype.addNewElements = function () {
        var freeOpt = this.getEmptyCells();
        var number = freeOpt.length > 0 ? Math.floor(Math.random() * (freeOpt.length - 1)) : -1;
        if (number >= 0) {
            var choice = freeOpt[number];
            var newNumber = Math.random() > 0.9 ? 4 : 2;
            this.grid[choice[0]][choice[1]] = newNumber;
        }
    };
    Game.prototype.isGridFull = function () {
        return this.grid.flat().every(function (curr) { return curr != 0; });
    };
    Game.prototype.isGameover = function () {
        if (this.isGridFull()) {
            for (var i = 0; i < this.GRID_ROWS; i++) {
                for (var j = 0; j < this.GRID_COL; j++) {
                    if (this.hasEqualNeighboar(i, j)) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };
    Game.prototype.hasEqualNeighboar = function (i, j) {
        var _a, _b;
        var neighCord = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        var currCellVal = this.grid[i][j];
        for (var _i = 0, neighCord_1 = neighCord; _i < neighCord_1.length; _i++) {
            var _c = neighCord_1[_i], x = _c[0], y = _c[1];
            if (((_b = (_a = this.grid) === null || _a === void 0 ? void 0 : _a[i + x]) === null || _b === void 0 ? void 0 : _b[j + y]) != undefined && currCellVal == this.grid[x + i][y + j]) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.getEmptyCells = function () {
        var freeOpt = [];
        for (var i = 0; i < this.GRID_ROWS; i++) {
            for (var j = 0; j < this.GRID_COL; j++) {
                if (this.grid[i][j] == 0) {
                    freeOpt.push([i, j]);
                }
            }
        }
        return freeOpt;
    };
    return Game;
}());
var game = new Game;
var nextMove = function (e) {
    switch (e.code) {
        case "ArrowUp":
            game.makeNextBoard(Direction.Up);
            break;
        case "ArrowDown":
            game.makeNextBoard(Direction.Down);
            break;
        case "ArrowLeft":
            game.makeNextBoard(Direction.Left);
            break;
        case "ArrowRight":
            game.makeNextBoard(Direction.Right);
            break;
        default:
            throw new Error("gejs");
    }
    renderBoard();
};
var renderBoard = function () {
    game.addNewElements();
    var div = document.querySelector(".game-grid");
    div.innerHTML = "";
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var child = document.createElement("div");
            if (game.grid[i][j] > 0) {
                child.innerText = String(game.grid[i][j]);
                child.classList.add("color");
                switch (game.grid[i][j]) {
                    case 4:
                        child.classList.add("c4");
                        break;
                    case 8:
                        child.classList.add("c8");
                        break;
                    case 16:
                        child.classList.add("c16");
                        break;
                    case 32:
                        child.classList.add("c32");
                        break;
                    case 64:
                        child.classList.add("c64");
                        break;
                    case 128:
                        child.classList.add("c128");
                        break;
                    case 256:
                        child.classList.add("c256");
                        break;
                    case 512:
                        child.classList.add("c512");
                        break;
                    case 1024:
                        child.classList.add("c1024");
                        break;
                    case 2048:
                        child.classList.add("c2048");
                        break;
                    default:
                        child.classList.add("c0");
                        break;
                }
            }
            else {
                child.classList.add("start");
            }
            div.appendChild(child);
        }
    }
    if (game.isGameover()) {
        console.log("Game Over");
    }
};
renderBoard();
window.addEventListener("keydown", function (e) { nextMove(e); });
