import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

// To solve we problem, I chose to put the numbers in a array and in order to identify them I made an array out of each of them
// (for instance, the number 3 will become [3] and the number -1 will become [-1])
// If a second 3 appears we will differenciate if from the first by creating a new array

// These values will be stored inside ConstInput
// We will duplicate them inside MovingValues
// At each step, we will get the next element of ConstInput and find its position inside MovingInput
// From there, we will move this element in MovingInput
// To simplify the ending calculations, we don't put back the element in MovingArray but its value (the number that the element contains)

let input = readFileSync("Day20.txt", "utf-8").trim().split("\r\n").map(Number);
const L = input.length;

const ConstInput = input.map((el) => [el]);
let MovingInput = ConstInput.slice(0);

// Moves the element in MovingInput according to the rules
const Move = (element, index) => {
  // To simplify things up
  let reducedEl = element % (L - 1);

  // We remove the element, find where it is supposed to be and insert it
  MovingInput.splice(index, 1);
  MovingInput.splice((index + reducedEl + (L - 1)) % (L - 1), 0, element);
};

// Actual code
for (let i = 0; i < L; i++) {
  let index = MovingInput.indexOf(ConstInput[i]);
  Move(ConstInput[i][0], index);
}

// We find the coordinates and print their sum
const index_0 = MovingInput.indexOf(0);
let coordinates = new Array(0);
for (let i = 1; i <= 3; i++) {
  coordinates.push(MovingInput[(index_0 + i * 1000) % L]);
}
console.log(coordinates.reduce(Sum));
