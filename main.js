import { drawAllPossibleTiles, drawTile } from "./draw.js";
import {
	CANVAS_SIZE,
	changeGameState,
	DIM,
	getRandomCell,
	getRandomTile,
} from "./utils.js";

// The dimension is the width and height of the board

//faces = [up, right, down, left]
const EMPTY = { src: "img/blank.png", faces: [0, 0, 0, 0] };
const DOWN = { src: "img/down.png", faces: [0, 1, 1, 1] };
const LEFT = { src: "img/left.png", faces: [1, 0, 1, 1] };
const RIGHT = { src: "img/right.png", faces: [1, 1, 1, 0] };
const UP = { src: "img/up.png", faces: [1, 1, 0, 1] };

const TILES_LIST = [DOWN, LEFT, RIGHT, UP];

let board;
// The number of availble tiles
const MAX_TILES = DIM * DIM;
let cells = [];

let avalaibleCells = [];
let pause = false;

const emptyCell = {
	coordinates: { x: undefined, y: undefined },
	possibleTiles: TILES_LIST.slice(),
	// If a tile has been set on this cell or not
	collapsed: false,
	// If a tile can be set on the cell
	inRange: true,
	// When collapsed true this contains the current tile on the cell
	currentTile: null,
};

function setup() {
	document.getElementById("myBtn").addEventListener("click", ()=>{pause=!pause});
	cells = Array.from({ length: DIM }, (e, y) =>
		Array.from({ length: DIM }, (e, x) => {
			const newEmptyCell = Object.assign({}, emptyCell);
			newEmptyCell.coordinates = { x: x, y: y };
			return Object.assign({}, newEmptyCell);
		})
	);

	avalaibleCells = cells.flat();
	// console.log(cells);
	// console.log(avalaibleCells);

	board = createEmptyBoard(CANVAS_SIZE);
	document.body.append(board);
	// drawAllPossibleTiles(cells)

	loop(500);
}

//speed is in millis
function loop(speed) {
	let newCell, newTile;
	let newCells = [];

	const startCell = getRandomCell(avalaibleCells);
	const startTile = getRandomTile(startCell.possibleTiles);
	updateCell(startTile, startCell);
	updateNeighborCells(startCell);
	drawTile(startTile, startCell.coordinates.x, startCell.coordinates.y);

	newCells.push(startCell);

	const interval = setInterval(() => {
		console.log('PAUSE____________________________________',pause);
		if (!pause) {
			drawAllPossibleTiles(cells);
			console.log(
				"-------------------------------------------------------"
			);
			// When all the cells are collapsed we stop the interval
			if (avalaibleCells.length === 0) {
				console.log("Finished");
				clearInterval(interval);
			}
			let neighborCells;
			let possibleNeighborCells;

			// console.log("new cells pile", newCells.slice());
			neighborCells = getNeighbors(newCells[0]);
			console.log("neighbors", neighborCells, "of", newCells[0]);

			possibleNeighborCells = getPossibleNeighborCells(neighborCells);
			console.log(
				"possible neighbors",
				possibleNeighborCells,
				"of",
				newCells[0]
			);

			newCell = getRandomCell(possibleNeighborCells);
			console.log("choosen cell of possible neighbors", newCell);
			try {
				if (newCell) {
					if (newCell.possibleTiles) {
						console.log(
							"available tiles",
							newCell.possibleTiles.slice()
						);
						newTile = getRandomTile(newCell.possibleTiles);
					} else {
						newTile = EMPTY;
					}
					if (newTile === undefined) {
						newTile = EMPTY;
					}
					drawTile(
						newTile,
						newCell.coordinates.x,
						newCell.coordinates.y
					);

					updateCell(newTile, newCell);
					// updateNeighborCells(newCell);

					// console.log("before push", newCells.slice());
					newCells.push(newCell);
					// console.log("after push", newCells.slice());
				} else {
					// console.log("before remove", newCells.slice());
					newCells.shift();
					// console.log("after remove", newCells.slice());

					console.log("no newCell");
				}
			} catch (error) {
				console.log("err loop", error);
				console.log("before remove", newCells.slice());
				newCells.shift();
				console.log("after remove", newCells.slice());

				console.log("no newCell");
			}
		}
	}, speed);
}

function getPossibleNeighborCells(neighborCells) {
	let possibleNeighbors = [];
	for (const neighborCell of neighborCells) {
		// we add null values to keep the order of the array and always know the position of each cell (left, up, right, down)
		try {
			// If the cell is collapsed we insert a null value
			if (!neighborCell.collapsed) {
				possibleNeighbors.push(neighborCell);
			} else {
				possibleNeighbors.push(null);
			}
		} catch (error) {
			// if the cell is the array is null we also push the null value
			possibleNeighbors.push(null);
		}
	}
	return possibleNeighbors;
}

function getNeighbors(fromCell) {
	const cellX = fromCell.coordinates.x;
	const cellY = fromCell.coordinates.y;
	let neighborCells = [];
	for (let x = cellX - 1; x <= cellX + 1; x++) {
		for (let y = cellY - 1; y <= cellY + 1; y++) {
			try {
				if (y >= 0 && x >= 0 && y <= 3 && x <= 3) {
					neighborCells.push(cells[y][x]);
				} else {
					neighborCells.push(null);
				}
			} catch (error) {}
		}
	}
	// We only need the top, right, bottom, left cell. So we remove the neighbors corner cells
	// we don't remove the null values because we need to alwasy have 4 cells in the array to know the postion of each cell (neighbor array[left, up, right, down])
	neighborCells = neighborCells.filter((cell, index) => index % 2 === 1);
	return neighborCells;
}

function updateCell(tile, cell) {
	console.log("update cell", cell);
	if (cell) {
		cell.possibleTiles = [];
		cell.collapsed = true;
		cell.currentTile = tile;
		avalaibleCells.splice(cell, 1);
	}
}

function updateNeighborCells(cell) {
	/**
	 * TODO :
	 *
	 * get all the non collapsed neighbors
	 * get the tile of the current cell
	 *
	 * take each neighborCell[x]
	 * remove the tiles that don't match the context
	 *
	 *
	 */
	const neighbors = getNeighbors(cell);
	// we only want to update the non collapsed neighbor cells because the collapsed cells don't need to be updated
	const neighborToUpdate = getPossibleNeighborCells(neighbors);
	const currentCellTile = cell.currentTile;
	const left = 0,
		up = 1,
		down = 2,
		right = 3;

	// pb is because we only take into account one neighbor and not all the neighbors
	// so if we have a tile facing left and another tile facing up the possible tiles will be Down,Up,Right even though they should be Down only
	// maybe do something with concat

	// solution could be to remove the cells that are not right

	// when adding a new cell we update the one next to it
	// update --> remove the tiles that don't fit into the current context (ONLY REMOVE)
	if (currentCellTile) {
		switch (currentCellTile) {
			case LEFT:
				removeTileFromPossibleTiles(neighborToUpdate[left], LEFT);
				removeTileFromPossibleTiles(neighborToUpdate[up], UP);
				removeTileFromPossibleTiles(neighborToUpdate[down], DOWN);
				removeTileFromPossibleTiles(neighborToUpdate[right], LEFT);
				break;
			case UP:
				removeTileFromPossibleTiles(neighborToUpdate[left], LEFT);
				removeTileFromPossibleTiles(neighborToUpdate[up], UP);
				removeTileFromPossibleTiles(
					neighborToUpdate[down],
					UP,
					LEFT,
					RIGHT
				);
				removeTileFromPossibleTiles(neighborToUpdate[right], RIGHT);
				break;
			case DOWN:
				removeTileFromPossibleTiles(neighborToUpdate[left], LEFT);
				removeTileFromPossibleTiles(
					neighborToUpdate[up],
					DOWN,
					LEFT,
					RIGHT
				);
				removeTileFromPossibleTiles(neighborToUpdate[down], DOWN);
				removeTileFromPossibleTiles(neighborToUpdate[right], RIGHT);
				break;
			case RIGHT:
				removeTileFromPossibleTiles(neighborToUpdate[left], RIGHT);
				removeTileFromPossibleTiles(neighborToUpdate[up], UP);
				removeTileFromPossibleTiles(neighborToUpdate[down], DOWN);
				removeTileFromPossibleTiles(neighborToUpdate[right], RIGHT);
				break;
			case EMPTY:
				removeTileFromPossibleTiles(
					neighborToUpdate[left],
					UP,
					DOWN,
					RIGHT
				);
				removeTileFromPossibleTiles(
					neighborToUpdate[up],
					DOWN,
					LEFT,
					RIGHT
				);
				removeTileFromPossibleTiles(
					neighborToUpdate[down],
					UP,
					LEFT,
					RIGHT
				);
				removeTileFromPossibleTiles(
					neighborToUpdate[right],
					UP,
					DOWN,
					LEFT
				);
				break;
			default:
				console.log("NO CASE ????");
				break;
		}
	}
}

/**
 * It removes the tiles from the array that are passed as arguments.
 * @param tiles
 */
function removeTileFromPossibleTiles(cell) {
	if (cell) {
		// console.log([cell].slice());
		console.log("before", cell.possibleTiles.slice());
		console.log(arguments);
		// arguments is always the cell to remove the tiles from and the tiles to remove
		// we loop over the cell because it will always be -1 in find index
		for (let argument of arguments) {
			const arg = argument ?? "";
			const k = cell.possibleTiles.findIndex(
				(possibleTile) => possibleTile === arg
			);
			// console.log(k);
			if (k !== -1) {
				const removedPossibleTiles = cell.possibleTiles.splice(k, 1);
				console.log("removed tiles", removedPossibleTiles);
				console.log("after", cell.possibleTiles.slice());
			}
		}
	}
}

function createEmptyBoard(size) {
	let emptyBoard = document.createElement("canvas");
	emptyBoard.id = "board";
	emptyBoard.height = size;
	emptyBoard.width = size;
	emptyBoard.style.backgroundColor = "black";
	return emptyBoard;
}

setup();
