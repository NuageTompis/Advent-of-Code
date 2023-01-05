import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
import { Day17 } from "./modules/Day17.js";
console.log("hello world");
let start = Date.now();

// See the README for Day 17 for further explanations

let rocks = 0; // The overall amount of rocks placed
let ind = 0; // ind%input.length gives the instruction index
const total = 10 ** 12;

let Equilibriums = new Array(0);
let StringEquilibriums = new Array(0);
let initialIndexOfAlphaEquilibrium;

let input = readFileSync("Day17.txt", "utf-8").trim();

const Names = ["-", "+", "L", "|", "▄"];
class Rock {
  constructor(j, leftPos) {
    this.name = Names[j];
    this.pos = Rocks[j].shape.map((point) => ArrSum(point, leftPos));
  }
}

const width = 7;
let tower = new Array(0);
let topTower = new Array(0);
let floorHeight = 0;
let HEIGHT = 0;

for (let i = 0; i < width; i++) {
  tower.push(`0,${i}`);
  topTower.push(0);
}

const DeepCopy = (arr) => {
  let newArr = new Array(0);
  for (let i = 0; i < arr.length; i++) {
    newArr.push(typeof arr[i] === "number" ? arr[i] : DeepCopy(arr[i]));
  }
  return newArr;
};

const Push = (rock, direction) => {
  switch (direction) {
    case ">":
      direction = 1;
      let i = 0;
      while (i < rock.pos.length) {
        if (
          tower.includes(`${rock.pos[i][0]},${rock.pos[i][1] + direction}`) |
          (rock.pos[i][1] + direction >= width)
        ) {
          return rock;
        }
        i++;
      }
      break;

    case "<":
      direction = -1;
      let j = 0;
      while (j < rock.pos.length) {
        if (
          tower.includes(`${rock.pos[j][0]},${rock.pos[j][1] + direction}`) |
          (rock.pos[j][1] + direction < 0)
        ) {
          return rock;
        }
        j++;
      }
      break;
  }
  rock.pos = rock.pos.map((point) => ArrSum(point, [0, direction]));
  return rock;
};

const Fall = (rock) => {
  for (let i = 0; i < rock.pos.length; i++) {
    if (tower.includes(`${rock.pos[i][0] - 1},${rock.pos[i][1]}`)) {
      return true;
    }
  }
  rock.pos = rock.pos.map((point) => ArrSum(point, [-1, 0]));
  return rock;
};

const Shapes = {
  minus: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  plus: [
    [0, 0],
    [0, 1],
    [-1, 1],
    [1, 1],
    [0, 2],
  ],
  L: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  line: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  square: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
};

const Rocks = [
  { shape: Shapes.minus },
  { shape: Shapes.plus },
  { shape: Shapes.L },
  { shape: Shapes.line },
  { shape: Shapes.square },
];

const IsSurrounded = (stringPos) => {
  return (
    tower.includes(
      `${Number(stringPos.split(",")[0]) + 1},${Number(
        stringPos.split(",")[1]
      )}`
    ) &&
    (Number(stringPos.split(",")[1]) === 0) |
      tower.includes(
        `${Number(stringPos.split(",")[0])},${
          Number(stringPos.split(",")[1]) - 1
        }`
      ) &&
    (Number(stringPos.split(",")[1]) === 6) |
      tower.includes(
        `${Number(stringPos.split(",")[0])},${
          Number(stringPos.split(",")[1]) + 1
        }`
      )
  );
};

// After placing the rock, tells if the row at height h is filled
// Not very smart because we will check the end of the list every time
const IsRowFilled = (h) => {
  let casesFilled = 0;
  for (let i = 0; i < tower.length; i++) {
    if (Number(tower[i].split(",")[0]) === h) casesFilled++;
  }
  return casesFilled === width;
};

const UpdateTower = (rock, rockndx) => {
  for (let i = 0; i < rock.pos.length; i++) {
    if (rock.pos[i][0] > topTower[rock.pos[i][1]]) {
      topTower[rock.pos[i][1]] = rock.pos[i][0];
    }
    tower.push(`${rock.pos[i][0]},${rock.pos[i][1]}`);
  }
  floorHeight = Math.max(...topTower);

  // Should we simplify tower ?
  let h;
  for (let k = 0; k < rock.pos.length; k++) {
    h = rock.pos[k][0];
    if (IsRowFilled(h)) {
      tower = tower.filter((stringPos) => Number(stringPos.split(",")[0]) >= h);
      tower = tower.map(
        (stringPos) =>
          `${Number(stringPos.split(",")[0]) - h},${Number(
            stringPos.split(",")[1]
          )}`
      );
      HEIGHT += h;
      floorHeight -= h;

      topTower = new Array(0, 0, 0, 0, 0, 0, 0);
      for (let l = 0; l < tower.length; l++) {
        if (
          Number(tower[l].split(",")[0]) >
          topTower[Number(tower[l].split(",")[1])]
        ) {
          topTower[Number(tower[l].split(",")[1])] = Number(
            tower[l].split(",")[0]
          );
        }
      }
      tower = tower.filter((stringPos) => !IsSurrounded(stringPos));

      break; // this will prevent 2 rows from being cut as once, may prevent some issues
    }
  }

  // If this state was already seen
  let state = JSON.stringify(
    FloorShape().concat([rockndx, ind % input.length])
  );
  OverallHeight.push(HEIGHT + Math.max(...topTower));
  if (States.includes(state)) {
    States.push(state);
    return true;
  }
  States.push(state);
};

/* A state is characterized by :
    - A floor shape 
    - An instruction index
    - A rock index
If at some point we stumble upon a previous state, it means we found an alpha equilibrium
*/
let States = new Array(0);
let OverallHeight = new Array(0);

const FloorShape = () => {
  let min = Math.min(...topTower);
  return topTower.map((v) => v - min);
};

let alphaEquilibriumFound = false;
while (!alphaEquilibriumFound) {
  for (let j = 0; j < 5; j++) {
    rocks++;
    let rock = new Rock(j, [
      j === 1 ? floorHeight + 4 + 1 : floorHeight + 4,
      2,
    ]);

    let floorHit = false;
    while (!floorHit) {
      rock = Push(rock, input[ind % input.length]);
      floorHit = Fall(rock);

      if (floorHit !== true) {
        rock = floorHit;
        floorHit = false;
      }
      ind++;
    }

    // UpdateTower returns true if it found an alpha equilibrium
    if (UpdateTower(rock, j)) alphaEquilibriumFound = true;
  }
}
let firstRockOfEq = States.indexOf(States[States.length - 1]);
let lastRockOfEq = States.length - 1;

// The alpha equilibrium has now been found ! We just need to compute the overall height
let placedInAE = lastRockOfEq - firstRockOfEq;
let heightAddedInAE =
  OverallHeight[lastRockOfEq] - OverallHeight[firstRockOfEq];
let rocksPlacedBeforeAE = firstRockOfEq;

const r = (total - rocksPlacedBeforeAE) % placedInAE;
const n = (total - rocksPlacedBeforeAE - r) / placedInAE;
const h = Day17(rocksPlacedBeforeAE + r);

console.log("code took ", Date.now() - start, " ms");
console.log(h + heightAddedInAE * n);
