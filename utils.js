export function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

/**
 * Sleep method for JS (because JS doesn't has a default sleep method)
 *
 * @param {*} milliseconds
 */
export function sleep(milliseconds) {
	//add a sleep() function in ms  ex: sleep(5000) = sleep 5s
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
