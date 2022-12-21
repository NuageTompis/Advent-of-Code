import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day15.txt", "utf-8").trim().split("\r\n");
input = input.map((line) =>
  line
    .replace(/[a-zA-Z =]+/g, "")
    .split(":")
    .map((pos) => pos.split(",").map(Number))
);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const Manhattan = (from, to) => {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
};

let Y = 0;
let globalInterval;
while (true) {
  let map = new Map();
  let Intervals = Array(0);

  for (let i = 0; i < input.length; i++) {
    let sensor, beacon, point, closestInY;
    let d, dy;
    let interval;
    sensor = new Point(input[i][0][0], input[i][0][1]);
    beacon = new Point(input[i][1][0], input[i][1][1]);
    closestInY = new Point(sensor.x, Y);

    dy = Manhattan(input[i][0], new Array(input[i][0][0], Y));
    d = Manhattan(input[i][0], input[i][1]);

    if (dy <= d) {
      if (beacon.y === Y) {
        point = new Point(beacon.x, Y);
        map.set(JSON.stringify(point), "B");
      }

      if (sensor.y === Y) {
        point = new Point(sensor.x, Y);
        map.set(JSON.stringify(point), "S");
      }

      interval = Array(
        Math.max(0, input[i][0][0] - (d - dy)),
        Math.min(4000000, input[i][0][0] + (d - dy))
      );
      Intervals.push(interval);
    }
  }

  Intervals = Intervals.sort((arr1, arr2) => arr1[0] - arr2[0]);

  globalInterval = [Intervals[0]];

  for (let i = 1; i < Intervals.length; i++) {
    if (Intervals[i][0] > globalInterval[globalInterval.length - 1][1]) {
      globalInterval.push(Intervals[i]);
    } else {
      globalInterval.splice(
        globalInterval.length - 1,
        1,
        Array(
          globalInterval[globalInterval.length - 1][0],
          Math.max(
            Intervals[i][1],
            globalInterval[globalInterval.length - 1][1]
          )
        )
      );
    }
  }

  if (globalInterval.length === 2) {
    break;
  }
  Y++;
}
const Frequency = (point) => {
  return 4000000 * point.x + point.y;
};

console.log(Frequency(new Point(globalInterval[0][1] + 1, Y)));
