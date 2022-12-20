import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
console.log("hello world");
console.log("Computing...");
const start = Date.now();

// This script follows the method explained in the heading of the script Day18Part2Better.js

let input = readFileSync("Day18.txt", "utf-8").trim().split("\r\n");
input = input.map((cube) => cube.split(",").map(Number));
const stringifiedInput = input.map((cube) => JSON.stringify(cube));

let area = 0;

let Boundaries = new Map();
const Convertor = ["x", "y", "z"];
Boundaries.set("x", [Infinity, 0]);
Boundaries.set("y", [Infinity, 0]);
Boundaries.set("z", [Infinity, 0]);
input.map((cube) => {
  cube.map((coor, ind) => {
    if (coor < Boundaries.get(Convertor[ind])[0]) {
      Boundaries.set(Convertor[ind], [coor, Boundaries.get(Convertor[ind])[1]]);
    }
    if (coor > Boundaries.get(Convertor[ind])[1]) {
      Boundaries.set(Convertor[ind], [Boundaries.get(Convertor[ind])[0], coor]);
    }
  });
});

let FreeingCubes = new Array(0);
let DyingCubes = new Array(0);
let Reached = new Array(0);
const Search = (origin) => {
  Reached.push(JSON.stringify(origin));
  // If the snake can escape
  if (
    (origin[0] + 1 > Boundaries.get("x")[1]) |
    (origin[0] - 1 < Boundaries.get("x")[0]) |
    (origin[1] + 1 > Boundaries.get("y")[1]) |
    (origin[1] - 1 < Boundaries.get("y")[0]) |
    (origin[2] + 1 > Boundaries.get("z")[1]) |
    (origin[2] - 1 < Boundaries.get("z")[0])
  ) {
    FreeingCubes.push(JSON.stringify(origin));
    return true;
  }
  if (FreeingCubes.includes(JSON.stringify(origin))) return true;

  // If the snake is doomed
  if (DyingCubes.includes(JSON.stringify(origin))) return false;

  // Else, we start searching
  // Direction 1
  let pos = ArrSum(origin, [1, 0, 0]);
  let stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // Direction 2
  pos = ArrSum(origin, [-1, 0, 0]);
  stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // Direction 3
  pos = ArrSum(origin, [0, 1, 0]);
  stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // Direction 4
  pos = ArrSum(origin, [0, -1, 0]);
  stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // Direction 5
  pos = ArrSum(origin, [0, 0, 1]);
  stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // Direction 6
  pos = ArrSum(origin, [0, 0, -1]);
  stringPos = JSON.stringify(pos);
  if (!(Reached.includes(stringPos) | stringifiedInput.includes(stringPos))) {
    if (Search(pos)) {
      FreeingCubes.push(JSON.stringify(origin));
      return true;
    }
  }
  // The snake cannot escape from anywhere :(
  DyingCubes.push(JSON.stringify(origin));
  return false;
};

input.map((cube) => {
  let neighbour;
  // x axis
  Reached = new Array(0);
  neighbour = ArrSum(cube, [1, 0, 0]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
  Reached = new Array(0);
  neighbour = ArrSum(cube, [-1, 0, 0]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
  // y axis
  Reached = new Array(0);
  neighbour = ArrSum(cube, [0, 1, 0]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
  Reached = new Array(0);
  neighbour = ArrSum(cube, [0, -1, 0]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
  // z axis
  Reached = new Array(0);
  neighbour = ArrSum(cube, [0, 0, 1]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
  Reached = new Array(0);
  neighbour = ArrSum(cube, [0, 0, -1]);
  if (
    !stringifiedInput.includes(JSON.stringify(neighbour)) &&
    Search(neighbour)
  )
    area++;
});

console.log("Script took " + (Date.now() - start) / 1000 + " s");
console.log(area);
