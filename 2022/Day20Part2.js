import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

// This script follow a similar behaviour as Part 1, except we can no longer simplify the elements into their number after we moved one
// We just keep the numbers inside their array and at the end we need to find the index of the array [0]

let input = readFileSync("Day20.txt", "utf-8").trim().split("\r\n");
input = input.map(Number);
const L = input.length;

// Initialization
const key = 811589153;
input = input.map((n) => key * n);

const ConstInput = input.map((el) => [el]);
let MovingInput = ConstInput.slice(0);

const Move = (element, index) => {
  let reducedEl = element[0] % (L - 1);
  MovingInput.splice(index, 1);
  MovingInput.splice((index + reducedEl + (L - 1)) % (L - 1), 0, element);
};

// Actual code
for (let mix = 1; mix <= 10; mix++) {
  for (let i = 0; i < L; i++) {
    let index = MovingInput.indexOf(ConstInput[i]);
    Move(ConstInput[i], index);
  }
}

let index_0;
for (let i = 0; i < L; i++) {
  if (MovingInput[i][0] === 0) {
    index_0 = i;
    break;
  }
}
let coordinates = new Array(0);
for (let i = 1; i <= 3; i++) {
  coordinates.push(MovingInput[(index_0 + i * 1000) % L][0]);
}
console.log(coordinates.reduce(Sum));
