//faces = [up, right, down, left]
const EMPTY = { src: "img/blank.png", faces: [0, 0, 0, 0] };
const DOWN = { src: "img/down.png", faces: [0, 1, 1, 1] };
const LEFT = { src: "img/left.png", faces: [1, 0, 1, 1] };
const RIGHT = { src: "img/right.png", faces: [1, 1, 1, 0] };
const UP = { src: "img/up.png", faces: [1, 1, 0, 1] };
const HORIZONTAL = { src: "img/horizontal.png", faces: [0, 1, 0, 1] };
const VERTICAL = { src: "img/vertical.png", faces: [1, 0, 1, 0] };

const TILES_LIST = [DOWN, LEFT, RIGHT, UP, HORIZONTAL, VERTICAL];
let tiles = TILES_LIST.slice();

// console.log(tiles);

const middleTile = LEFT;

const leftCell = tiles.slice();
const upCell = tiles.slice();
const downCell = tiles.slice();
const rightCell = tiles.slice();

const up = 0;
const right = 1;
const down = 2;
const left = 3;

function compareLeft(middleTile, leftCell) {
	let possibleTiles = [];
	for (let leftTile of leftCell) {
		if (leftTile.faces[right] === middleTile.faces[left]) {
			possibleTiles.push(leftTile);
		}
	}
	console.log("left", possibleTiles);
}

function compareUp(middleTile, neighborCell) {
	let possibleTiles = [];
	for (let neighborTile of neighborCell) {
		if (neighborTile.faces[down] === middleTile.faces[up]) {
			possibleTiles.push(neighborTile);
		}
	}
	console.log("up", possibleTiles);
}

function compareDown(middleTile, neighborCell) {
	let possibleTiles = [];
	for (let neighborTile of neighborCell) {
		if (neighborTile.faces[up] === middleTile.faces[down]) {
			possibleTiles.push(neighborTile);
		}
	}
	console.log("down", possibleTiles);
}

function compareRight(middleTile, neighborCell) {
	let possibleTiles = [];
	for (let neighborTile of neighborCell) {
		if (neighborTile.faces[left] === middleTile.faces[right]) {
			possibleTiles.push(neighborTile);
		}
	}
	console.log("right", possibleTiles);
}

compareLeft(middleTile, leftCell);
compareRight(middleTile, rightCell);
compareUp(middleTile, upCell);
compareDown(middleTile, downCell);



/**
 * It removes the tiles from the array that are passed as arguments.
 * @param tiles
 */
 function removeTileFromPossibleTiles(cell) {
	if (cell) {
		cell.possibleTiles = cell.possibleTiles.slice();
		// console.log([cell].slice());
		// console.log("before", cell.possibleTiles.slice());
		// console.log(arguments);
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
				// console.log("removed tiles", removedPossibleTiles);
				// console.log("after", cell.possibleTiles.slice());
			}
		}
	}
}