export let DIM = 10;
export let currentDim = DIM;
export const CANVAS_SIZE =
	document.documentElement.clientHeight -
	(document.documentElement.clientHeight / 100) * 20;

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

export function setSize() {
	DIM = this.value;
}

export function setCurrentDim(dim) {
	currentDim = dim;
}

export function setTileList() {
	const tileName = "img/" + this.id + ".png"
	const tile = POSSIBLE_TILES.filter((tile) => tile.src === tileName)
	const index = TILE_LIST.indexOf(tile[0])
	if (index === -1) {
		TILE_LIST.splice(0,0,tile[0])
	} else {
		TILE_LIST.splice(index, 1);
	}
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

export function createTileSelector(possibleTiles) {
	let tileSelector = document.createElement("form");
	tileSelector.id = "tileSelectorForm";
	tileSelector.style = "height:20%;";
	for (let possibleTile of possibleTiles) {
		const tileName = possibleTile.src
			.replace("img/", "")
			.replace(".png", "");

		let input = document.createElement("input");
		input.type = "checkbox";
		input.id = tileName;
		input.setAttribute("checked", true);

		let label = document.createElement("label");
		label.for = tileName;

		let img = document.createElement("img");
		img.src = possibleTile.src;
		img.style = "width:8vh; height:8vh";

		label.appendChild(img);

		const br = document.createElement("br");

		tileSelector.appendChild(input);
		tileSelector.appendChild(label);
		tileSelector.appendChild(br);
	}
	return tileSelector;
}
