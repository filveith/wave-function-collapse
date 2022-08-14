
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
