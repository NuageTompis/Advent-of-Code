import { readFileSync } from "fs";
import { ArrSum, Equals } from "./modules/UT.js";
console.log("hello world");
console.log("Computing ...");
const start = Date.now();

// Similar to Part 1 this script update the position of each elf until we go through a round that doesn't move any elf
// This results in a fairly long computation (around 3m30s for my puzzle input)

let input = readFileSync("Day23.txt", "utf-8").trim().split("\r\n");

let Elves = new Array(0);
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] === "#") Elves.push(JSON.stringify([i, j]));
  }
}
let updatedElves = new Array(0);

const DeepCopy = (arr) => {
  let newArr = new Array(0);
  for (let i = 0; i < arr.length; i++) {
    newArr.push(typeof arr[i] === "number" ? arr[i] : DeepCopy(arr[i]));
  }
  return newArr;
};

// Extended Neighbord, Direct Neighbors
let DN = new Map();
DN.set("N", [[-1, 0]]);
DN.set("S", [[1, 0]]);
DN.set("W", [[0, -1]]);
DN.set("E", [[0, 1]]);
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

// Extended extended neighbors
const EEN = [[-1, 0]]
  .concat(EN.get("W"))
  .concat(EN.get("E"))
  .concat([[1, 0]]);

const dirs = new Map();
dirs.set("N", 0);
dirs.set("S", 1);
dirs.set("W", 2);
dirs.set("E", 3);

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
  let indexesToPutBack = new Array(0);
  for (let i = 0; i < updatedElves.length - 1; i++) {
    if (updatedElves.slice(i + 1).includes(updatedElves[i])) {
      indexesToPutBack.push(i);
      indexesToPutBack.push(
        updatedElves.slice(i + 1).indexOf(updatedElves[i]) + i + 1
      );
    }
  }
  for (let k = 0; k < indexesToPutBack.length; k++) {
    updatedElves[indexesToPutBack[k]] = Elves[indexesToPutBack[k]];
  }
};

const UpdatePos = (elf, dir) => {
  // If there are no neighbors, do nothing
  if (!LookAround(elf)) {
    updatedElves.push(JSON.stringify(elf));
    return;
  }

  let newStringPos;
  let added = false;
  for (let i = 0; i < 4; i++) {
    newStringPos = JSON.stringify(ArrSum(elf, DN.get(dir)[0]));
    // If there are no neightbors in the area
    if (!Look(elf, dir)) {
      updatedElves.push(newStringPos);
      added = true;
      break;
    }

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

  if (!added) {
    updatedElves.push(JSON.stringify(elf));
  }
};

const Dirs = ["N", "S", "W", "E"];
let rounds = 0;
while (true) {
  for (let e = 0; e < Elves.length; e++) {
    UpdatePos(JSON.parse(Elves[e]), Dirs[rounds % 4]);
  }
  CorrectPositions();

  if (Equals(Elves, updatedElves)) {
    console.log(rounds + 1);
    break;
  }
  Elves = updatedElves.slice(0);
  updatedElves = [];
  rounds++;
}

console.log("Script took : ", (Date.now() - start) / 1000, " s");
