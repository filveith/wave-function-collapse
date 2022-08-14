// const letters = [
// 	{
// 		letter: "a",
// 	},
// 	{
// 		letter: "b",
// 	},
// 	{
// 		letter: "c",
// 	},
// ];

// const x = 2
// const y = 0
// const avalaibleCells= [
//   {
//       "x": 0,
//       "y": 0
//   },
//   {
//       "x": 0,
//       "y": 1
//   },
//   {
//       "x": 0,
//       "y": 2
//   },
//   {
//       "x": 0,
//       "y": 3
//   },
//   {
//       "x": 1,
//       "y": 0
//   },
//   {
//       "x": 1,
//       "y": 1
//   },
//   {
//       "x": 1,
//       "y": 2
//   },
//   {
//       "x": 1,
//       "y": 3
//   },
//   {
//       "x": 2,
//       "y": 0
//   },
//   {
//       "x": 2,
//       "y": 1
//   },
//   {
//       "x": 2,
//       "y": 2
//   },
//   {
//       "x": 2,
//       "y": 3
//   },
//   {
//       "x": 3,
//       "y": 0
//   },
//   {
//       "x": 3,
//       "y": 1
//   },
//   {
//       "x": 3,
//       "y": 2
//   },
//   {
//       "x": 3,
//       "y": 3
//   }
// ]

// const index = letters.findIndex((element) => {
// 	if (element.letter === "b") {
// 		return true;
// 	}
// });

// const indexCell = avalaibleCells.findIndex((cell) => {
// 	if (cell.x === x && cell.y === y) {
// 		return true;
// 	}
// });

// let updatedCell = avalaibleCells.find(findCell,{x,y});

// function findCell(cell) {
// 	return cell.x === this.x && cell.y === this.y;
// }

// // console.log(updatedCell);
// console.log(indexCell);
// // console.log(index);

const EMPTY = { src: "img/blank.png", faces: [0, 0, 0, 0] };
const DOWN = { src: "img/down.png", faces: [0, 1, 1, 1] };
const LEFT = { src: "img/left.png", faces: [1, 0, 1, 1] };
const RIGHT = { src: "img/right.png", faces: [1, 1, 1, 0] };
const UP = { src: "img/up.png", faces: [1, 1, 0, 1] };

const TILES_LIST = [DOWN, LEFT, RIGHT, UP];
let tiles = TILES_LIST.slice();
// let t = TILES_LIST.slice();
// const k = t.findIndex((cell) => cell === LEFT);
// t.splice(k, 1);
// console.log(k);
// console.log(t);
// console.log(tiles);
removeTileFromPossibleTiles(tiles, RIGHT, LEFT, UP);
function removeTileFromPossibleTiles(tiles) {
	// How to use overload ?
	for (let i = 0; i < arguments.length; i++) {
		console.log(i, tiles);
		const k = tiles.findIndex(
			(cell) =>
				cell === arguments[1] ||
				cell === arguments[2] ||
				cell === arguments[3] ||
				cell === arguments[4]
		);
		console.log(k);
		if (k !== -1) {
			tiles.splice(k, 1);
		}
		console.log(tiles);
	}
}
