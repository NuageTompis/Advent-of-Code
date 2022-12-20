import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

// We will start by generating the initial grid
// To do so we retrieve the boundaries of the map and we create an array of arrays called grid that embodies the grid
// Then we let a unit of sand fall until one reached the bottom of the grid. The function 'Fall' simply checks if there is something blocking below the sand
// If there is nothing then the sand falls and we check on the new position, otherwise it stops or slides on the sides according to the rules

let input = readFileSync("Day14.txt", "utf-8").trim().split("\r\n");
input = input.map((line) =>
  line.split(" -> ").map((straightLine) => straightLine.split(",").map(Number))
);

// Getting the boundaries of the map
const C = input.reduce((ac, cur) => {
  for (let i = 0; i < cur.length; i++) {
    if (cur[i][0] > ac[1]) {
      ac[1] = cur[i][0];
    }
    if (cur[i][0] < ac[0]) {
      ac[0] = cur[i][0];
    }
  }
  return ac;
}, Array(Infinity, 0));
const L = input.reduce((ac, cur) => {
  for (let i = 0; i < cur.length; i++) {
    if (cur[i][1] > ac[1]) {
      ac[1] = cur[i][1];
    }
    if (cur[i][1] < ac[0]) {
      ac[0] = cur[i][1];
    }
  }
  return ac;
}, Array(Infinity, 0));
//

let grid = Array(L[1] + 4);
for (let i = 0; i < grid.length; i++) {
  grid[i] = Array(C[1] + 4)
    .join(" ")
    .split("");
}

// Given a series of line (which corresponds to a single line in the input puzzle), draws these lines in the grid by placing '#'
const Draw = (line) => {
  let l = line.length;
  let posFrom, posTo;
  posFrom = line[0];
  for (let i = 0; i < l - 1; i++) {
    posTo = line[i + 1];
    let [colFrom, colTo] = [
      Math.min(posFrom[0], posTo[0]),
      Math.max(posFrom[0], posTo[0]),
    ];
    let [lineFrom, lineTo] = [
      Math.min(posFrom[1], posTo[1]),
      Math.max(posFrom[1], posTo[1]),
    ];

    for (let j = colFrom; j <= colTo; j++) {
      for (let i = lineFrom; i <= lineTo; i++) {
        grid[i][j] = "#";
      }
    }

    posFrom = posTo;
  }
};

// Draws the initial grid
for (let i = 0; i < input.length; i++) {
  Draw(input[i]);
}

// Let a unit of sand fall, should return true if we exceeded the vertical boundaries
const Fall = () => {
  let pos = Array(0, 500);
  while (pos[0] < L[1]) {
    if (grid[pos[0] + 1][pos[1]] === " ") {
      pos[0] = pos[0] + 1;
    } else if (grid[pos[0] + 1][pos[1] - 1] === " ") {
      pos[0] = pos[0] + 1;
      pos[1] = pos[1] - 1;
    } else if (grid[pos[0] + 1][pos[1] + 1] === " ") {
      pos[0] = pos[0] + 1;
      pos[1] = pos[1] + 1;
    } else if (Array("#", "O").includes(grid[pos[0] + 1][pos[1]])) {
      grid[pos[0]][pos[1]] = "O";
      return false;
    }
  }

  // Should return true if we fell into the void
  return true;
};

let k = 0;
while (!Fall()) {
  k++;
}
console.log(k);
