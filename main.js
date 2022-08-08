import { getRandomInt } from "./utils.js";

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
	loop(1000);
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
	drawImage(startTile, startCell.coordinates.x, startCell.coordinates.y);

	newCells.push(startCell);

	const interval = setInterval(() => {
		// When all the cells are collapsed we stop the interval
		if (avalaibleCells.length === 0) {
			clearInterval(interval);
		}
		let neighborCells;
		let possibleNeighborCells;

		neighborCells = getNeighbors(newCells[0]);
		possibleNeighborCells = getPossibleNeighborCells(neighborCells);

		newCell = getRandomCell(possibleNeighborCells);
		try {
			newTile = getRandomTile(newCell.possibleTiles);
			updateCell(newTile, newCell);
			// updateNeighborCells(newCell);
			drawImage(newTile, newCell.coordinates.x, newCell.coordinates.y);
			newCells.push(newCell);
		} catch (error) {
			console.log("err loop", error);
			newCells.shift();
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
	cell.possibleTiles = [];
	cell.collapsed = true;
	cell.currentTile = tile;
	avalaibleCells.splice(cell, 1);
}

function updateNeighborCells(cell) {
	const neighbors = getNeighbors(cell);
	const nonCollapsedNeighbors = getPossibleNeighborCells(neighbors);
	const currentCellTile = cell.currentTile;
	const posLeft = 0,
		posUp = 1,
		posDown = 2,
		posRight = 3;

	// pb is because we only take into account one neighbor and not all the neighbors
	// so if we have a tile facing left and another tile facing up the possible tiles will be Down,Up,Right even though they should be Down only
	// maybe do something with concat

	// solution could be to remove the cells that are not right

	let indexTileToRemove;
	let newPossibleTiles;

	const currentTileSwitchLeft = (cell) => {
		switch (currentCellTile) {
			case LEFT:
				// cell.possibleTiles = [DOWN, UP, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				console.log("TILE INDEX", indexTileToRemove);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case UP:
				// cell.possibleTiles = [DOWN, UP, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case RIGHT:
				// cell.possibleTiles = [DOWN, UP, LEFT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case DOWN:
				// cell.possibleTiles = [DOWN, UP, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			default:
				break;
		}
	};

	const currentTileSwitchUp = (cell) => {
		switch (currentCellTile) {
			case LEFT:
				// cell.possibleTiles = [DOWN, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === UP
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case UP:
				// cell.possibleTiles = [DOWN, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === UP
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case RIGHT:
				// cell.possibleTiles = [DOWN, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === UP
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case DOWN:
				// cell.possibleTiles = [UP];
				newPossibleTiles = cell.possibleTiles;
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === DOWN
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				cell.possibleTiles = newPossibleTiles;
				break;
			default:
				break;
		}
	};

	const currentTileSwitchRight = (cell) => {
		switch (currentCellTile) {
			case LEFT:
				// cell.possibleTiles = [DOWN, UP, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case UP:
				// cell.possibleTiles = [DOWN, UP, LEFT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case RIGHT:
				// cell.possibleTiles = [DOWN, UP, LEFT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			case DOWN:
				// cell.possibleTiles = [DOWN, UP, LEFT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				break;
			default:
				break;
		}
	};

	const currentTileSwitchDown = (cell) => {
		console.log(
			"-------------------",
			cell.possibleTiles.length,
			cell.possibleTiles[0],
			cell.possibleTiles[1],
			cell.possibleTiles[2],
			cell.possibleTiles[3]
		);
		switch (currentCellTile) {
			case LEFT:
				// cell.possibleTiles = [UP, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === DOWN
				);
				if (indexTileToRemove !== -1) {
					console.log(cell.possibleTiles[indexTileToRemove]);
					console.log("removed");
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				console.log(
					"-------------------",
					cell.possibleTiles.length,
					cell.possibleTiles[0],
					cell.possibleTiles[1],
					cell.possibleTiles[2],
					cell.possibleTiles[3]
				);

				break;
			case UP:
				// cell.possibleTiles = [DOWN];
				newPossibleTiles = cell.possibleTiles;
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === UP
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === LEFT
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === RIGHT
				);
				if (indexTileToRemove !== -1)
					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
				cell.possibleTiles = newPossibleTiles;
				console.log(
					"-------------------",
					cell.possibleTiles.length,
					cell.possibleTiles[0],
					cell.possibleTiles[1],
					cell.possibleTiles[2],
					cell.possibleTiles[3]
				);

				break;
			case RIGHT:
				// cell.possibleTiles = [UP, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === DOWN
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");
					console.log(cell.possibleTiles[indexTileToRemove]);

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				console.log(
					"-------------------",
					cell.possibleTiles.length,
					cell.possibleTiles[0],
					cell.possibleTiles[1],
					cell.possibleTiles[2],
					cell.possibleTiles[3]
				);

				break;
			case DOWN:
				// cell.possibleTiles = [UP, LEFT, RIGHT];
				indexTileToRemove = cell.possibleTiles.findIndex(
					(tile) => tile === DOWN
				);
				if (indexTileToRemove !== -1) {
					console.log("removed");
					console.log(cell.possibleTiles[indexTileToRemove]);

					newPossibleTiles = cell.possibleTiles.splice(
						indexTileToRemove - 1,
						1
					);
					cell.possibleTiles = newPossibleTiles;
				}
				console.log(
					"-------------------",
					cell.possibleTiles.length,
					cell.possibleTiles[0],
					cell.possibleTiles[1],
					cell.possibleTiles[2],
					cell.possibleTiles[3]
				);

				break;
			default:
				break;
		}
	};

	const t = nonCollapsedNeighbors.splice(0);
	console.log("before possibleTiles update", t);
	let index = 0;
	for (let neighborCell of t) {
		console.log(neighborCell);
		console.log(index);
		// If the neightbor is on the left, up, right, down of the current cell
		if (neighborCell) {
			switch (index) {
				case posLeft:
					currentTileSwitchLeft(neighborCell);
					break;
				case posUp:
					currentTileSwitchUp(neighborCell);
					break;
				case posRight:
					currentTileSwitchRight(neighborCell);
					break;
				case posDown:
					currentTileSwitchDown(neighborCell);
					break;
				default:
					break;
			}
		}
		console.log("After tiles update", cell.possibleTiles);
		index++;
	}
	const tf = nonCollapsedNeighbors.splice(0);
	console.log("after possibleTiles update", t);
}

function getRandomCell(cells) {
	// We remove the null values to only get possible cells
	const filteredCells = cells.filter((cell) => cell);
	const randCell = getRandomInt(filteredCells.length);
	return filteredCells[randCell];
}

function getRandomTile(tiles) {
	// console.log("get tile", tiles);
	const tileIndex = getRandomInt(tiles.length);
	return tiles[tileIndex];
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
		ctx.drawImage(
			img,
			(x * CANVAS_SIZE) / DIM,
			(y * CANVAS_SIZE) / DIM,
			w ? w : CANVAS_SIZE / DIM,
			h ? h : CANVAS_SIZE / DIM
		);
	};
}

setup();
