import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
console.log("hello world");
console.log("Computing...");
const start = Date.now();

// This script will look at each cube. From each of them, it will spawn an imaginary snake from each of its side.
// The snakes will look in every direction by spawning children.
// If a child manages to reach the exterior of the droplet (if one if its coordinates exceeds the boundaries) then it frees itself and tells us that the side leads to the exterior, so we increment the area by one.
// Otherwise, if the snakes hits an existing cube or another snake, it dies
// This method leads to a time-consuming solution of the problem
// I tried to improved it in the script Day18Part2Better.js

let input = readFileSync("Day18.txt", "utf-8").trim().split("\r\n");
input = input.map((cube) => cube.split(",").map(Number));
const stringifiedInput = input.map((cube) => JSON.stringify(cube));

let area = 0;

// Get boundaries
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
//

let Reached = new Array(0);
// Will recursively expand in every direction like a snake, killing the snake if it reached a positiion that has either been reached or that contains a cube
// Will return true if the snake managed to escape
const Search = (origin) => {
  Reached.push(JSON.stringify(origin));
  // If we can escape
  if (
    (origin[0] + 1 > Boundaries.get("x")[1]) |
    (origin[0] - 1 < Boundaries.get("x")[0]) |
    (origin[1] + 1 > Boundaries.get("y")[1]) |
    (origin[1] - 1 < Boundaries.get("y")[0]) |
    (origin[2] + 1 > Boundaries.get("z")[1]) |
    (origin[2] - 1 < Boundaries.get("z")[0])
  ) {
    return true;
  }
  // Otherwise we search in every direction
  return (
    (Reached.includes(JSON.stringify(ArrSum(origin, [1, 0, 0]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [1, 0, 0])))
      ? false
      : Search(ArrSum(origin, [1, 0, 0]))) |
    (Reached.includes(JSON.stringify(ArrSum(origin, [-1, 0, 0]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [-1, 0, 0])))
      ? false
      : Search(ArrSum(origin, [-1, 0, 0]))) |
    (Reached.includes(JSON.stringify(ArrSum(origin, [0, 1, 0]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [0, 1, 0])))
      ? false
      : Search(ArrSum(origin, [0, 1, 0]))) |
    (Reached.includes(JSON.stringify(ArrSum(origin, [0, -1, 0]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [0, -1, 0])))
      ? false
      : Search(ArrSum(origin, [0, -1, 0]))) |
    (Reached.includes(JSON.stringify(ArrSum(origin, [0, 0, 1]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [0, 0, 1])))
      ? false
      : Search(ArrSum(origin, [0, 0, 1]))) |
    (Reached.includes(JSON.stringify(ArrSum(origin, [0, 0, -1]))) |
    stringifiedInput.includes(JSON.stringify(ArrSum(origin, [0, 0, -1])))
      ? false
      : Search(ArrSum(origin, [0, 0, -1])))
  );
};

// We search into every direction from each cube
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
