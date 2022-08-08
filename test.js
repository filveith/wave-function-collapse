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

let t = [1, 2, 3, 4, 5, 6, 7];
const k = t.findIndex(nb => nb === 4);
t.splice(k, 1);
console.log(t);
