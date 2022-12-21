import { readFileSync } from "fs";
import { ArrSum } from "./modules/UT.js";
console.log("hello world");
let start = Date.now();

// We will create a simulation without any simplification
// There are 5 types of rocks, each rock has a name and a position. The position is an array of all the position of the subdivisions of the rock. For instance the 'minus' rock is divided into 4 subparts so its position array is of size 4
// The rocks will accumulate into the array tower. We will store the positions containing a part of a rock in this array
// We will also store (inside topTower) the maximum position of each of the 7 column to easily compute the height of the tower (which will be store into the variable floorHeight)

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
let topTower = new Map();
let floorHeight = 0;

for (let i = 0; i < width; i++) {
  tower.push(JSON.stringify([0, i]));
  topTower.set(i, 0);
}

// Pushes a rock according to a given direction by updating its position
// If the rock cannot be moved we simply return the initial rock
const Push = (rock, direction) => {
  switch (direction) {
    case ">":
      direction = 1;
      let i = 0;
      while (i < rock.pos.length) {
        if (
          tower.includes(JSON.stringify(ArrSum(rock.pos[i], [0, direction]))) |
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
          tower.includes(JSON.stringify(ArrSum(rock.pos[j], [0, direction]))) |
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

// Similarly, lets the rock fall by one if the movement is allowed
const Fall = (rock) => {
  for (let i = 0; i < rock.pos.length; i++) {
    if (tower.includes(JSON.stringify(ArrSum(rock.pos[i], [-1, 0])))) {
      return true;
    }
  }
  rock.pos = rock.pos.map((point) => ArrSum(point, [-1, 0]));
  return rock;
};

// Defines the shapes of each rock type, the left-most bottom-most subdivision of the rock is at position [0,0]
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

// Updates the tower by pushing the position of the given rock to the array tower
// Also computes the new tower height if it has changed
const UpdateTower = (rock) => {
  for (let i = 0; i < rock.pos.length; i++) {
    if (rock.pos[i][0] > topTower.get(rock.pos[i][1])) {
      topTower.set(rock.pos[i][1], rock.pos[i][0]);
    }
    tower.push(JSON.stringify(rock.pos[i]));
  }
  floorHeight = Math.max(...topTower.values());
};

let ind = 0;
let cpt = 0;
// We will place 2022 rocks, to do so we iterate by placing 404 times a cycle of 5 rocks then we just place two more
for (let i = 0; i < 405; i++) {
  for (let j = 0; j < 5; j++) {
    cpt++;
    // Places the new rock initially
    let rock = new Rock(j, [
      j === 1 ? floorHeight + 4 + 1 : floorHeight + 4,
      2,
    ]);

    // As long as the rock has not hit the tower, we push the rock then let it fall by one
    // A call to Fall either returns true if the rock hit the tower or returns the rock
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

    UpdateTower(rock);
    if (i === 404 && j === 1) {
      break;
    }
  }
}

console.log("Script took ", Date.now() - start, " ms");
console.log(floorHeight);
