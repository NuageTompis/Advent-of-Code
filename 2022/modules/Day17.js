import { readFileSync } from "fs";
import { ArrSum } from "./UT.js";

export const Day17 = (amount) => {
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

  const Push = (rock, direction) => {
    switch (direction) {
      case ">":
        direction = 1;
        let i = 0;
        while (i < rock.pos.length) {
          if (
            tower.includes(
              JSON.stringify(ArrSum(rock.pos[i], [0, direction]))
            ) |
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
            tower.includes(
              JSON.stringify(ArrSum(rock.pos[j], [0, direction]))
            ) |
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
      if (tower.includes(JSON.stringify(ArrSum(rock.pos[i], [-1, 0])))) {
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
  while (true) {
    for (let j = 0; j < 5; j++) {
      cpt++;
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

      UpdateTower(rock);
      if (cpt === amount) {
        return floorHeight;
      }
    }
  }
};
