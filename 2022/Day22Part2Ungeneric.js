import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
console.log("hello world");

// This script is not generic as the user must inform how the cube should be folded (lines 35 to 66)
// We start by folding the side which contains the starting position
// By "folding" I mean setting each tile of the side inside a map as a array of 3 coordinates (height, row, column) and the value of the tile (either a '.' or a '#')
// The first side is at height=0 and has (i,j) coordinates going from 0 to (side length - 1)
// The other sides however are displaced by one, meaning they either have a (i,j) coordinate of -1 or set as (side length)
// Finally the top side of the cube is at height (side length  + 1)

// From there we use a process similar to Part 1 except we customized some function to fit the 3-dimensional aspect of the problem
// The script prints the ending position and direction as 3D coordinates and the user has to fidure out what row and column they correspond to

let input = readFileSync("Day22.txt", "utf-8").split("\r\n\r\n");
let instructions = input[1].match(/\d+|(L|R)/g);
input = input[0].split("\r\n");

let C = 0;
for (let i = 0; i < input.length; i++)
  if (input[i].length > C) C = input[i].length;
const L = input.length;
input = input.map((line) =>
  line.length === C ? line : line + new Array(C + 1 - line.length).join(" ")
);

// Side Length
const SL = Math.sqrt((L * C) / 12);

// We start by mapping the first side which will be the bottom side of our cube
let x = SL;
let Pos = [0, x];

let Cube = new Map();
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(JSON.stringify([0, i, j]), input[Pos[0] + i][Pos[1] + j]);
  }
}

// ################### Folding the last 5 sides of the cube ###################
// Only for my input
Pos = [0, x + SL];
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(JSON.stringify([j + 1, i, SL]), input[Pos[0] + i][Pos[1] + j]);
  }
}
Pos = [0 + SL, x];
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(JSON.stringify([i + 1, SL, j]), input[Pos[0] + i][Pos[1] + j]);
  }
}
Pos = [0 + 2 * SL, x];
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(
      JSON.stringify([SL + 1, SL - 1 - i, j]),
      input[Pos[0] + i][Pos[1] + j]
    );
  }
}
Pos = [0 + 2 * SL, x - SL];
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(
      JSON.stringify([j + 1, SL - 1 - i, -1]),
      input[Pos[0] + i][Pos[1] + j]
    );
  }
}
Pos = [0 + 3 * SL, x - SL];
for (let i = 0; i < SL; i++) {
  for (let j = 0; j < SL; j++) {
    Cube.set(JSON.stringify([j + 1, -1, i]), input[Pos[0] + i][Pos[1] + j]);
  }
}
// ################### End of the fold ###################

// Initial direction
let Dir = [0, 0, 1];

// Given a point, tells in what kind of side it is by telling the constant dimension of the side : h for the height, i for the row or j for the column)
const ConstDim = (pos) => {
  if (
    !(
      Cube.has(JSON.stringify(ArrSum(pos, [1, 0, 0]))) |
      Cube.has(JSON.stringify(ArrSum(pos, [-1, 0, 0])))
    )
  ) {
    return "h";
  }
  if (
    !(
      Cube.has(JSON.stringify(ArrSum(pos, [0, 1, 0]))) |
      Cube.has(JSON.stringify(ArrSum(pos, [0, -1, 0])))
    )
  ) {
    return "i";
  }
  if (
    !(
      Cube.has(JSON.stringify(ArrSum(pos, [0, 0, 1]))) |
      Cube.has(JSON.stringify(ArrSum(pos, [0, 0, -1])))
    )
  ) {
    return "j";
  }
};

// Returns the opposite of a vector
const Oppos = (arr) => arr.map((e) => (e === 0 ? e : -e));

// The following functions change the current direction
// We start by finding on which kind of side we are on (on what coordinate is the side constant (h, i or j)
const TurnLeft = () => {
  let side = ConstDim(Pos);
  switch (side) {
    case "h":
      Dir = [0, -Dir[2], Dir[1]];
      if (Pos[0] === SL + 1) Dir = Oppos(Dir);
      break;

    case "i":
      Dir = [Dir[2], 0, -Dir[0]];
      if (Pos[1] === SL) Dir = Oppos(Dir);
      break;

    case "j":
      Dir = [-Dir[1], Dir[0], 0];
      if (Pos[2] === SL) Dir = Oppos(Dir);
      break;
  }
};
const TurnRight = () => {
  TurnLeft();
  TurnLeft();
  TurnLeft();
};
const Turn = (dir) => {
  dir === "L" ? TurnLeft() : TurnRight();
};

// Custom-made wrapping function, finds where we are supposed to wrap to, returns false is there is a wall or updates the position and direction
const Wrap = () => {
  let newDir = Dir.slice(0);
  let newPos = ArrSum(Dir, Pos);
  if (
    (newPos[0] === 0) | (newPos[0] === SL + 1) &&
    !((Pos[0] === 0) | (Pos[0] === SL + 1))
  ) {
    if (Pos[2] === -1) newDir = [0, 0, 1];
    else if (Pos[2] === SL) newDir = [0, 0, -1];
    else if (Pos[1] === -1) newDir = [0, 1, 0];
    else if (Pos[1] === SL) newDir = [0, -1, 0];

    newPos = ArrSum(newPos, newDir);
  } else if (
    (newPos[1] === -1) | (newPos[1] === SL) &&
    !((Pos[1] === -1) | (Pos[1] === SL))
  ) {
    if (Pos[0] === 0) newDir = [1, 0, 0];
    else if (Pos[0] === SL + 1) newDir = [-1, 0, 0];
    else if (Pos[2] === -1) newDir = [0, 0, 1];
    else if (Pos[2] === SL) newDir = [0, 0, -1];

    newPos = ArrSum(newPos, newDir);
  } else if (
    (newPos[2] === -1) | (newPos[2] === SL) &&
    !((Pos[2] === -1) | (Pos[2] === SL))
  ) {
    if (Pos[0] === 0) newDir = [1, 0, 0];
    else if (Pos[0] === SL + 1) newDir = [-1, 0, 0];
    else if (Pos[1] === -1) newDir = [0, 1, 0];
    else if (Pos[1] === SL) newDir = [0, -1, 0];

    newPos = ArrSum(newPos, newDir);
  }
  // Check if we won't wrap into a wall
  if (Cube.get(JSON.stringify(newPos)) !== "#") {
    Pos = newPos;
    Dir = newDir;
  } else return false;
  return true;
};

// Finds the position where we would go in a straight line.
// If it is part of the cube, either go there if possible or stop if there is a wall
// If the position is not part of the cube it means we should wrap, we do so if possible or stop if there is a wall
const Step = (amount) => {
  for (let i = 0; i < amount; i++) {
    let newPosString = JSON.stringify(ArrSum(Dir, Pos));
    if (Cube.has(newPosString)) {
      if (Cube.get(newPosString) !== "#") Pos = ArrSum(Pos, Dir);
      else break;
    } else if (!Wrap()) {
      break;
    }
  }
};

// Retrieve the starting position (it may not be [0,0,0] in case this tile is a wall)
for (let i = 0; i < SL; i++) {
  if (Cube.get(JSON.stringify([0, 0, i])) !== "#") {
    x = i;
    break;
  }
}
Pos = [0, 0, x]; // Starting position
for (let i = 0; i < instructions.length; i++) {
  if (instructions[i] === "L") Turn("L");
  else if (instructions[i] === "R") Turn("R");
  else Step(Number(instructions[i]));
}

console.log("Final position : ", Pos);
console.log("Final direction : ", Dir);
