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
	possibleTiles: [TILES_LIST.slice()],
	// If a tile has been set on this cell or not
	collapsed: false,
	// If a tile can be set on the cell
	inRange: true,
	// When collapsed true this should contain the current tile on the cell
	currentTile: null,
};

function setup() {
	cells = Array.from({ length: DIM }, (e) =>
		Array.from({ length: DIM }, (e) => Object.assign({}, emptyCell))
	);

	for (let x = 0; x < DIM; x++) {
		for (let y = 0; y < DIM; y++) {
			avalaibleCells = [...avalaibleCells, { x: x, y: y }];
		}
	}

	// console.log(cells);
	// console.log(avalaibleCells);

	board = createEmptyBoard(CANVAS_SIZE);
	document.body.append(board);
	loop();
}

//speed is in millis
function loop(speed) {
	// choose a random cell on the board

	// Set a random tile next to an existing tile

	// FOR LATER : Make sure that the new tile fits with the current tiles
	// for (let i = 0; i < 15; i++) {
		setInterval(() => {
			const startCell = getRandomCell();
			const startTile = getRandomTile();
			// console.log("x", startCell.x, "y", startCell.y);
			updateCell(startCell.x, startCell.y, startTile);
			// console.log(cells);
			drawImage(startTile, startCell.x, startCell.y);
		},500)
	// }

	// let i = 0;
	// while (i < MAX_TILES) {
	// 	const nbImg = getRandomInt(TILES_LIST.length);
	// 	drawImage(
	// 		TILES_LIST[nbImg].src,
	// 		(CANVAS_SIZE / DIM) * i,
	// 		(CANVAS_SIZE / DIM) * i
	// 	);
	// 	i++;
	// }
}

function updateCell(x, y, tile) {
	const cell = cells[y][x];
	cell.possibleTiles = [];
	cell.collapsed = true;
	cell.currentTile = tile;

	let updatedCell = avalaibleCells.findIndex((cell) => {
		if (cell.x === x && cell.y === y) {
			return true;
		}
	});
	avalaibleCells.splice(updatedCell, 1);

	// Update the possibleTiles attributes of all the neighbors

}

function getRandomCell() {
	const randCell = getRandomInt(avalaibleCells.length);
	return avalaibleCells[randCell];
}

function getRandomTile() {
	const tileIndex = getRandomInt(TILES_LIST.length);
	return TILES_LIST[tileIndex];
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
