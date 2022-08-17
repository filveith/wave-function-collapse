const up = 0,
	right = 1,
	down = 2,
	left = 3;

export function updateCell(tile, cell, avalaibleCells) {
	// console.log("update cell", cell);
	if (cell) {
		cell.possibleTiles = [];
		cell.collapsed = true;
		cell.currentTile = tile;
		avalaibleCells.splice(cell, 1);
	}
}

export function getPossibleNeighborCells(neighborCells) {
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

export function compareLeft(middleCell, neighborCell) {
	if (neighborCell) {
		let newPossibleTiles = [];
		for (let leftTile of neighborCell.possibleTiles) {
			if (leftTile.faces[right] === middleCell.currentTile.faces[left] ?? -1) {
				newPossibleTiles.push(leftTile);
			}
		}
		neighborCell.possibleTiles = newPossibleTiles;
	}
}

export function compareUp(middleCell, neighborCell) {
	if (neighborCell) {
		let newPossibleTiles = [];
		for (let neighborTile of neighborCell.possibleTiles) {
			if (neighborTile.faces[down] === middleCell.currentTile.faces[up] ?? -1) {
				newPossibleTiles.push(neighborTile);
			}
		}
		neighborCell.possibleTiles = newPossibleTiles;
		// console.log("up", neighborCell.possibleTiles.slice());
	}
}

export function compareDown(middleCell, neighborCell) {
	if (neighborCell) {
		let newPossibleTiles = [];
		for (let neighborTile of neighborCell.possibleTiles) {
			if (neighborTile.faces[up] === middleCell.currentTile.faces[down] ?? -1) {
				newPossibleTiles.push(neighborTile);
			}
		}
		neighborCell.possibleTiles = newPossibleTiles;
		// console.log("down", neighborCell.possibleTiles.slice());
	}
}

export function compareRight(middleCell, neighborCell) {
	if (neighborCell) {
		let newPossibleTiles = [];
		for (let neighborTile of neighborCell.possibleTiles) {
			if (
				neighborTile.faces[left] === middleCell.currentTile.faces[right] ?? -1
			) {
				newPossibleTiles.push(neighborTile);
			}
		}
		neighborCell.possibleTiles = newPossibleTiles;
		// console.log("right", neighborCell.possibleTiles.slice());
	}
}
