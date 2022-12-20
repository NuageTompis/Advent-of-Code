import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

// This script is highly similar as Part 1 except instead of stopping if a unit of sand falls below the floor, we add stick it where it is so that next units of sand may stop on top of it
// We stop when a unit of sand reaches all the way up to position (500,0)

let input = readFileSync("Day14.txt", "utf-8").trim().split("\r\n");
input = input.map((line) =>
  line.split(" -> ").map((straightLine) => straightLine.split(",").map(Number))
);

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

let grid = Array(L[1] + 200);
for (let i = 0; i < grid.length; i++) {
  grid[i] = Array(C[1] + 200)
    .join(" ")
    .split("");
}

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

for (let i = 0; i < input.length; i++) {
  Draw(input[i]);
}

const Fall = () => {
  let pos = Array(0, 500);
  while (pos[0] < L[1] + 1) {
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
      return grid[0][500] === "O";
    }
  }
  grid[pos[0]][pos[1]] = "O";
  return false;
};

let k = 0;
while (!Fall()) {
  k++;
}

console.log(k + 1);
