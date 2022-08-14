export const DIM = 10;
export const CANVAS_SIZE = 400;

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

export function getRandomCell(cells) {
	// We remove the null values to only get possible cells
	const filteredCells = cells.filter((cell) => cell);
	const randCell = getRandomInt(filteredCells.length);
	return filteredCells[randCell];
}

export function getRandomTile(tiles) {
	// console.log("get tile", tiles);
	const tileIndex = getRandomInt(tiles.length);
	return tiles[tileIndex];
}

export function createEmptyBoard(size) {
	let emptyBoard = document.createElement("canvas");
	emptyBoard.id = "board";
	emptyBoard.height = size;
	emptyBoard.width = size;
	emptyBoard.style.backgroundColor = "black";
	return emptyBoard;
}