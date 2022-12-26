import { readFileSync } from "fs";
console.log("hello world");

// This script will place an imaginary person on the unfolded cube and follow the instructions to follow the path
// Before making a step however, the person will send a discoverer to see if the tile is reachable, this will be useful because we may step on empty tiles and wrap around on a '#'
// This method is far from optimal since we could just calculate the index at which we should wrap around and avoid many computations

let Cube = readFileSync("Day22.txt", "utf-8").split("\r\n\r\n");
let instructions = Cube[1].match(/\d+|(L|R)/g);
Cube = Cube[0].split("\r\n"); // The unfolded cube

let C = 0;
for (let i = 0; i < Cube.length; i++)
  if (Cube[i].length > C) C = Cube[i].length;
let L = Cube.length;
Cube = Cube.map((line) =>
  line.length === C ? line : line + new Array(C + 1 - line.length).join(" ")
);

let Dir = "E";
const Turn = (dir) => {
  switch (dir) {
    case "L":
      switch (Dir) {
        case "N":
          Dir = "W";
          break;
        case "S":
          Dir = "E";
          break;
        case "E":
          Dir = "N";
          break;
        case "W":
          Dir = "S";
          break;
      }
      break;

    case "R":
      switch (Dir) {
        case "N":
          Dir = "E";
          break;
        case "S":
          Dir = "W";
          break;
        case "E":
          Dir = "S";
          break;
        case "W":
          Dir = "N";
          break;
      }
      break;
  }
};

// We will retrieve the index of the leftmost available position in the first row and store it into x
let x;
for (let i = 0; i < C; i++) {
  if (![" ", "#"].includes(Cube[0][i])) {
    x = i;
    break;
  }
}
let Pos = [0, x]; // Initial position
// According to the current direction (which is stored inside Dir) we will send a discoverer, called disco
// The discoverer will go in this direction and attempt to make the required amount of steps. It will stop either if he succeds or stumbles upon a solid wall
// The discoverer can reach '.' tiles but also ' ' tiles which aren't part of the cube
// We will only update our actual position in the path if the discoverer is in a reachable tile (a '.' tile)
const Step = (amount) => {
  // Steps actually made
  let steps = 0;
  let disco = Pos.slice(0);
  switch (Dir) {
    case "E":
      while (steps < amount) {
        if (Cube[disco[0]][(disco[1] + 1) % C] === "#") break;
        disco = [disco[0], (disco[1] + 1) % C];
        if (Cube[disco[0]][disco[1]] === ".") {
          Pos = disco.slice(0);
          steps++;
        }
      }
      break;
    case "W":
      while (steps < amount) {
        if (Cube[disco[0]][(C + disco[1] - 1) % C] === "#") break;
        disco = [disco[0], (C + disco[1] - 1) % C];
        if (Cube[disco[0]][disco[1]] === ".") {
          Pos = disco.slice(0);
          steps++;
        }
      }
      break;
    case "S":
      while (steps < amount) {
        if (Cube[(disco[0] + 1) % L][disco[1]] === "#") break;
        disco = [(disco[0] + 1) % L, disco[1]];
        if (Cube[disco[0]][disco[1]] === ".") {
          Pos = disco.slice(0);
          steps++;
        }
      }
      break;
    case "N":
      while (steps < amount) {
        if (Cube[(L + disco[0] - 1) % L][disco[1]] === "#") break;
        disco = [(L + disco[0] - 1) % L, disco[1]];
        if (Cube[disco[0]][disco[1]] === ".") {
          Pos = disco.slice(0);
          steps++;
        }
      }
      break;
  }
  disco = Pos;
};

// Let's now turn and step according to the instructions
for (let i = 0; i < instructions.length; i++) {
  if (instructions[i] === "L") Turn("L");
  else if (instructions[i] === "R") Turn("R");
  else Step(Number(instructions[i]));
}

switch (Dir) {
  case "N":
    Dir = 3;
    break;
  case "W":
    Dir = 2;
    break;
  case "S":
    Dir = 1;
    break;
}

// Prints the requested value
console.log(1000 * (1 + Pos[0]) + 4 * (1 + Pos[1]) + Dir);
