import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
console.log("hello world");
const start = Date.now();

// This script will as the problem suggests iterate 10 rounds of elf movements
// We will store the position of each elf inside the array Elves
// We will divide each round into 2 steps :
// First move each elf in the first direction where there were no elf previously (there may be collisions since we check the previous positions)
// At the end of this step the positions will be stored inside the array updatedElves
// Then replace the elf that collided with the function CorrectPositions

let input = readFileSync("Day23.txt", "utf-8").trim().split("\r\n");

let Elves = new Array(0);
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] === "#") Elves.push(JSON.stringify([i, j]));
  }
}
let updatedElves = new Array(0);

// Direct Neighbors : the closest neighbor in every direction
let DN = new Map();
DN.set("N", [[-1, 0]]);
DN.set("S", [[1, 0]]);
DN.set("W", [[0, -1]]);
DN.set("E", [[0, 1]]);
// Extended Neighbors : for every direction, the 3 closest neighbors
let EN = new Map(DN);
EN.set(
  "N",
  EN.get("N").concat([
    [-1, -1],
    [-1, 1],
  ])
);
EN.set(
  "E",
  EN.get("E").concat([
    [-1, 1],
    [1, 1],
  ])
);
EN.set(
  "S",
  EN.get("S").concat([
    [1, 1],
    [1, -1],
  ])
);
EN.set(
  "W",
  EN.get("W").concat([
    [1, -1],
    [-1, -1],
  ])
);
// Extended extended neighbors : the 8 surrounding neighbors
const EEN = [[-1, 0]]
  .concat(EN.get("W"))
  .concat(EN.get("E"))
  .concat([[1, 0]]);

// Returns true if there is already an elf in the area
const Look = (from, dir) => {
  return EN.get(dir).reduce(
    (ac, cur) =>
      ac ? true : Elves.includes(JSON.stringify(ArrSum(from, cur))),
    false
  );
};

// Returns true of there is an elf among the 8 neighbors
const LookAround = (from) => {
  return EEN.reduce(
    (ac, cur) =>
      ac ? true : Elves.includes(JSON.stringify(ArrSum(from, cur))),
    false
  );
};

const CorrectPositions = () => {
  // Array storing the indexes of elves to put back
  let dnxs = new Array(0);
  for (let i = 0; i < updatedElves.length - 1; i++) {
    if (updatedElves.slice(i + 1).includes(updatedElves[i])) {
      dnxs.push(i);
      dnxs.push(updatedElves.slice(i + 1).indexOf(updatedElves[i]) + 1 + i);
    }
  }
  for (let k = 0; k < dnxs.length; k++) {
    updatedElves[dnxs[k]] = Elves[dnxs[k]];
  }
};

const UpdatePos = (elf, dir) => {
  // If there are no neighbors, do not move
  if (!LookAround(elf)) {
    updatedElves.push(JSON.stringify(elf));
    return;
  }

  let newStringPos;
  let added = false;
  // We will check in the 4 directions of there is a neighbor
  for (let i = 0; i < 4; i++) {
    newStringPos = JSON.stringify(ArrSum(elf, DN.get(dir)[0]));
    // If there are no neightbors in the area, move there
    if (!Look(elf, dir)) {
      updatedElves.push(newStringPos);
      added = true;
      break;
    }

    // Update direction
    switch (dir) {
      case "N":
        dir = "S";
        break;
      case "S":
        dir = "W";
        break;
      case "E":
        dir = "N";
        break;
      case "W":
        dir = "E";
        break;
    }
  }
  // If we checked in every direction and couldn't move, stay there
  if (!added) updatedElves.push(JSON.stringify(elf));
};

const Dirs = ["N", "S", "W", "E"];
// Let's now move the elves during 10 rounds
for (let i = 0; i < 10; i++) {
  // Move every elf even if there may be collisions
  for (let e = 0; e < Elves.length; e++) {
    UpdatePos(JSON.parse(Elves[e]), Dirs[i % 4]);
  }
  // Correct the collisions
  CorrectPositions();
  Elves = updatedElves.slice(0);
  updatedElves = [];
}

// Let's now retrieve the boundaries and print the area
let Boundaries = [
  [Infinity, 0],
  [Infinity, 0],
];
let elf;
for (let e = 0; e < Elves.length; e++) {
  elf = JSON.parse(Elves[e]);
  if (elf[0] < Boundaries[0][0]) Boundaries[0][0] = elf[0];
  if (elf[1] < Boundaries[1][0]) Boundaries[1][0] = elf[1];
  if (elf[0] > Boundaries[0][1]) Boundaries[0][1] = elf[0];
  if (elf[1] > Boundaries[1][1]) Boundaries[1][1] = elf[1];
}
let answer =
  (Boundaries[0][1] - Boundaries[0][0] + 1) *
    (Boundaries[1][1] - Boundaries[1][0] + 1) -
  Elves.length;
console.log("Script took : ", Date.now() - start, " ms");
console.log(answer);
