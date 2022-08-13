import { getRandomCell, getRandomTile } from "./utils.js";

// The dimension is the width and height of the board
const DIM = 4;
const CANVAS_SIZE = 400;

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
	loop(500);
}

//speed is in millis
function loop(speed) {
	let newCell, newTile;
	let newCells = [];

	const startCell = getRandomCell(avalaibleCells);
	const startTile = getRandomTile(startCell.possibleTiles);
	console.log("start cell", startCell.possibleTiles);
	updateCell(startTile, startCell);
	// updateNeighborCells(startCell);
	drawImageWithoutBorder(
		startTile,
		startCell.coordinates.x,
		startCell.coordinates.y
	);

	newCells.push(startCell);
	console.log(
		"🚀 ~ file: main.js ~ line 69 ~ loop ~ newCells",
		newCells.slice()
	);

	const interval = setInterval(() => {
		// drawImage(old.currentTile, old.coordinates.x, old.coordinates.y);
		// When all the cells are collapsed we stop the interval
		if (avalaibleCells.length === 0) {
			clearInterval(interval);
		}
		let neighborCells;
		let possibleNeighborCells;

		console.log(newCells.slice());
		neighborCells = getNeighbors(newCells[0]);

		possibleNeighborCells = getPossibleNeighborCells(neighborCells);

		newCell = getRandomCell(possibleNeighborCells);
		try {
			if (newCell) {
				if (newCell.possibleTiles) {
					newCells.push(newCell);
					newTile = getRandomTile(newCell.possibleTiles);

					// try {
					// 	newTile = getRandomTile(newCell.possibleTiles);
					// } catch (error) {
					// 	console.log('err',error);
					// 	newTile = EMPTY;
					// }
					updateCell(newTile, newCell);
					updateNeighborCells(newCell);
					// drawImage(
					// 	newCells[0].currentTile,
					// 	newCells[0].coordinates.x,
					// 	newCells[0].coordinates.y
					// );
					drawImageWithoutBorder(
						newTile,
						newCell.coordinates.x,
						newCell.coordinates.y
					);
				}
			} else {
				console.log("no newCell");
			}
		} catch (error) {
			console.log("err loop", error);
			// try {
			// 	console.log(newCell);
			// 	if (newCell) {
			// 		console.log("setting empty tile");
			// 		updateCell(EMPTY, newCell);
			// 		updateNeighborCells(newCell);
			// 		drawImageWithoutBorder(
			// 			EMPTY,
			// 			newCell.coordinates.x,
			// 			newCell.coordinates.y
			// 		);
			// 		newCells.push(newCell);
			// 	}
			// } catch (error) {
			// 	console.log("no empty", error);
			newCells.shift();
			// }
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
	console.log(cell);
	if (cell) {
		if (cell.possibleTiles) {
			cell.possibleTiles = [];
		}
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
			// console.log(i, tiles);
			// const arg1 = arguments[1] ?? "",
			// 	arg2 = arguments[2] ?? "",
			// 	arg3 = arguments[3] ?? "",
			// 	arg4 = arguments[4] ?? "";
			// const k = cell.possibleTiles.findIndex(
			// 	(cell) =>
			// 		cell === arg1 ||
			// 		cell === arg2 ||
			// 		cell === arg3 ||
			// 		cell === arg4
			// );
			const arg = argument ?? "";
			const k = cell.possibleTiles.findIndex((possibleTile) => possibleTile === arg);
			console.log(k);
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

function drawImage(imgObject, x, y, w, h) {
	const canvas = document.getElementById("board");
	let ctx = canvas.getContext("2d");

	const img = new Image();
	img.src = imgObject.src;
	img.onload = () => {
		ctx.beginPath();
		ctx.strokeStyle = "#f00"; // some color/style
		ctx.lineWidth = 2; // thickness
		ctx.strokeRect(
			(x * CANVAS_SIZE) / DIM + 1,
			(y * CANVAS_SIZE) / DIM + 1,
			CANVAS_SIZE / DIM - 1,
			CANVAS_SIZE / DIM - 1
		);
		ctx.drawImage(
			img,
			(x * CANVAS_SIZE) / DIM,
			(y * CANVAS_SIZE) / DIM,
			w ? w : CANVAS_SIZE / DIM,
			h ? h : CANVAS_SIZE / DIM
		);
	};
}

function drawImageWithoutBorder(imgObject, x, y, w, h) {
	if (imgObject) {
		const canvas = document.getElementById("board");
		let ctx = canvas.getContext("2d");

		const img = new Image();
		img.src = imgObject.src;
		img.onload = () => {
			ctx.beginPath();
			ctx.drawImage(
				img,
				(x * CANVAS_SIZE) / DIM - 1,
				(y * CANVAS_SIZE) / DIM,
				w ? w : CANVAS_SIZE / DIM + 2,
				h ? h : CANVAS_SIZE / DIM + 2
			);
		};
	}
}

setup();
