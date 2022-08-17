import {
	compareDown,
	compareLeft,
	compareRight,
	compareUp,
	getPossibleNeighborCells,
	updateCell,
} from "./cell.js";
import { drawTile } from "./draw.js";
import {
	CANVAS_SIZE,
	createEmptyBoard,
	createTileSelector,
	currentDim,
	DIM,
	getRandomCell,
	getRandomTile,
	setCurrentDim,
	setSize,
} from "./utils.js";

// The dimension is the width and height of the board

//faces = [up, right, down, left]
export const EMPTY = { src: "img/blank.png", faces: [0, 0, 0, 0] };
const DOWN = { src: "img/down.png", faces: [0, 1, 1, 1] };
const LEFT = { src: "img/left.png", faces: [1, 0, 1, 1] };
const RIGHT = { src: "img/right.png", faces: [1, 1, 1, 0] };
const UP = { src: "img/up.png", faces: [1, 1, 0, 1] };

const DOWN_END = { src: "img/down_end.png", faces: [1, 0, 0, 0] };
const LEFT_END = { src: "img/left_end.png", faces: [0, 0, 0, 1] };
const RIGHT_END = { src: "img/right_end.png", faces: [0, 1, 0, 0] };
const UP_END = { src: "img/up_end.png", faces: [0, 0, 1, 0] };

const CORNER_DOWN_RIGHT = {
	src: "img/corner_down_right.png",
	faces: [0, 1, 1, 0],
};
const CORNER_DOWN_LEFT = {
	src: "img/corner_down_left.png",
	faces: [0, 0, 1, 1],
};
const CORNER_UP_RIGHT = { src: "img/corner_up_right.png", faces: [1, 1, 0, 0] };
const CORNER_UP_LEFT = { src: "img/corner_up_left.png", faces: [1, 0, 0, 1] };

const HORIZONTAL = { src: "img/horizontal.png", faces: [0, 1, 0, 1] };
const VERTICAL = { src: "img/vertical.png", faces: [1, 0, 1, 0] };

const POSSIBLE_TILES = [
	DOWN,
	LEFT,
	RIGHT,
	UP,
	HORIZONTAL,
	VERTICAL,
	DOWN_END,
	LEFT_END,
	UP_END,
	RIGHT_END,
	CORNER_DOWN_RIGHT,
	CORNER_DOWN_LEFT,
	CORNER_UP_LEFT,
	CORNER_UP_RIGHT,
];
// The tiles that are used in the image
const TILE_LIST = [
	DOWN,
	LEFT,
	RIGHT,
	UP,
	HORIZONTAL,
	VERTICAL,
	DOWN_END,
	LEFT_END,
	UP_END,
	RIGHT_END,
	CORNER_DOWN_RIGHT,
	CORNER_DOWN_LEFT,
	CORNER_UP_LEFT,
	CORNER_UP_RIGHT,
];

let board;
let cells = [];
let newCells = [];

let avalaibleCells = [];

let pause = false;
let speed = 500; // speed is in ms

let interval;

window.onload = () => {
	const tileSelector = createTileSelector(POSSIBLE_TILES);
	document.getElementById('tileSelectorDiv').append(tileSelector);

	for (let tile of POSSIBLE_TILES) {
		document
			.getElementById(tile.src.replace("img/", "").replace(".png", ""))
			.addEventListener("click", setTileList);
	}

	document.getElementById("speedRange").setAttribute("value", speed);
	document.getElementById("speedInput").setAttribute("value", speed);

	document.getElementById("pauseButton").addEventListener("click", () => {
		pause = !pause;
	});
	document.getElementById("generateBtn").addEventListener("click", () => {
		clearInterval(interval);
		try {
			document.getElementById("board").remove();
		} catch (error) {
			console.log(error);
		}
		setup();
		interval = setInterval(loop, speed);
	});
	document.getElementById('sizeSelector').addEventListener("change", setSize)
	document.getElementById("speedRange").addEventListener("change", setSpeed);
	document.getElementById("speedInput").addEventListener("input", setSpeed);
};

function setup() {
	setCurrentDim(DIM)
	const emptyCell = {
		coordinates: { x: undefined, y: undefined },
		possibleTiles: TILE_LIST.slice(),
		// If a tile has been set on this cell or not
		collapsed: false,
		// If a tile can be set on the cell
		inRange: true,
		// When collapsed true this contains the current tile on the cell
		currentTile: null,
	};


	cells = Array.from({ length: currentDim }, (e, y) =>
		Array.from({ length: currentDim }, (e, x) => {
			const newEmptyCell = Object.assign({}, emptyCell);
			newEmptyCell.coordinates = { x: x, y: y };
			return Object.assign({}, newEmptyCell);
		})
	);

	avalaibleCells = cells.flat();
	newCells = [];
	board = createEmptyBoard(CANVAS_SIZE+currentDim, CANVAS_SIZE+currentDim);
	document.getElementById('boardDiv').append(board);

	const startCell = getRandomCell(avalaibleCells);
	const startTile = getRandomTile(startCell.possibleTiles);
	updateCell(startTile, startCell, avalaibleCells);
	updateNeighborCells(startCell);
	drawTile(startTile, startCell.coordinates.x, startCell.coordinates.y);

	newCells.push(startCell);
}

function loop() {
	let newCell, newTile;

	if (!pause) {
		// When all the cells are collapsed we stop the interval
		if (avalaibleCells.length === 0) {
			console.log("Finished");
			clearInterval(interval);
		}

		let neighborCells;
		let possibleNeighborCells;

		try {
			// console.log("new cells pile", newCells.slice());
			// console.log(newCells[0]);
			neighborCells = getNeighbors(newCells[0], cells);

			possibleNeighborCells = getPossibleNeighborCells(neighborCells);

			newCell = getRandomCell(possibleNeighborCells);
			if (newCell) {
				if (newCell.possibleTiles) {
					newTile = getRandomTile(newCell.possibleTiles);
				} else {
					newTile = EMPTY;
				}
				if (newTile === undefined) {
					newTile = EMPTY;
				}
				drawTile(newTile, newCell.coordinates.x, newCell.coordinates.y);

				updateCell(newTile, newCell, avalaibleCells);
				updateNeighborCells(newCell);

				newCells.push(newCell);
			} else {
				newCells.shift();
			}
		} catch (error) {
			console.log("err loop", error);
			newCells.shift();
		}
		// pause = true;
		// drawAllPossibleTiles(cells);
	}
}

function getNeighbors(fromCell, cells) {
	// console.log(fromCell);
	const cellX = fromCell.coordinates.x;
	const cellY = fromCell.coordinates.y;
	let neighborCells = [];
	for (let x = cellX - 1; x <= cellX + 1; x++) {
		for (let y = cellY - 1; y <= cellY + 1; y++) {
			try {
				if (y >= 0 && x >= 0 && y <= currentDim - 1 && x <= currentDim - 1) {
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

function setSpeed() {
	speed = this.value;
	clearInterval(interval);
	interval = setInterval(loop, speed);
	// document.getElementById("speedRange").setAttribute("value", speed);
	// document.getElementById("speedInput").setAttribute("value", speed);
}

function setTileList() {
	const tileName = "img/" + this.id + ".png"
	console.log(this.id);
	const tile = POSSIBLE_TILES.filter((tile) => tile.src === tileName)
	const index = TILE_LIST.indexOf(tile[0])
	console.log(tile);
	console.log(index);
	if (index === -1) {
		TILE_LIST.splice(0,0,tile[0])
	} else {
		TILE_LIST.splice(index, 1);
	}
	console.log(TILE_LIST);
}

function updateNeighborCells(cell) {
	const neighbors = getNeighbors(cell, cells);
	// we only want to update the non collapsed neighbor cells because the collapsed cells don't need to be updated
	const neighborToUpdate = getPossibleNeighborCells(neighbors);
	const left = 0,
		up = 1,
		down = 2,
		right = 3;

	// console.log("__________________updateNeighborCells___________________");
	// console.log("currentCellTile", currentCellTile);
	// console.log('neighbors',neighborToUpdate);
	// console.log('middleCell',cell);
	if (cell) {
		compareLeft(cell, neighborToUpdate[left]);
		compareRight(cell, neighborToUpdate[right]);
		compareUp(cell, neighborToUpdate[up]);
		compareDown(cell, neighborToUpdate[down]);
	}
}

setup();
interval = setInterval(loop, speed);
