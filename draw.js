import { CANVAS_SIZE, DIM } from "./utils.js";

export function drawAllPossibleTiles(board) {
    let i = 0
	for (let column of board) {
		for (let cell of column) {
            for (let tileNb in cell.possibleTiles) {
                const x = cell.coordinates.x + tileNb * 25 + i * (CANVAS_SIZE/4);
				draw(
                    cell.possibleTiles[tileNb],
					x,
					cell.coordinates.y,
					CANVAS_SIZE / DIM / 4,
					CANVAS_SIZE / DIM / 4
				);
			}
            i++
		}
        i=0
	}
}

function draw(imgObject, x, y, w, h) {
	// console.log("DRAW", imgObject);
	if (imgObject) {
		const canvas = document.getElementById("board");
		let ctx = canvas.getContext("2d");

		const img = new Image();
		img.src = imgObject.src;
		img.onload = () => {
			ctx.beginPath();
			ctx.drawImage(img, x, (y * CANVAS_SIZE) / DIM, w, h);
		};
	}
}

// export function drawImage(imgObject, x, y, w, h) {
// 	const canvas = document.getElementById("board");
// 	let ctx = canvas.getContext("2d");

// 	const img = new Image();
// 	img.src = imgObject.src;
// 	img.onload = () => {
// 		ctx.beginPath();
// 		ctx.strokeStyle = "#f00"; // some color/style
// 		ctx.lineWidth = 2; // thickness
// 		ctx.strokeRect(
// 			(x * CANVAS_SIZE) / DIM + 1,
// 			(y * CANVAS_SIZE) / DIM + 1,
// 			CANVAS_SIZE / DIM - 1,
// 			CANVAS_SIZE / DIM - 1
// 		);
// 		ctx.drawImage(
// 			img,
// 			(x * CANVAS_SIZE) / DIM,
// 			(y * CANVAS_SIZE) / DIM,
// 			w ? w : CANVAS_SIZE / DIM,
// 			h ? h : CANVAS_SIZE / DIM
// 		);
// 	};
// }

export function drawTile(imgObject, x, y, w, h) {
	console.log("DRAW", imgObject);
	if (imgObject) {
		const canvas = document.getElementById("board");
		let ctx = canvas.getContext("2d");

		const img = new Image();
		img.src = imgObject.src;
		img.onload = () => {
			ctx.beginPath();
			ctx.drawImage(
				img,
				(x * CANVAS_SIZE) / DIM,
				(y * CANVAS_SIZE) / DIM,
				w ? w : CANVAS_SIZE / DIM,
				h ? h : CANVAS_SIZE / DIM
			);
		};
	}
}
