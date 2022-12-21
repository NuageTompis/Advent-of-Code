import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

let input = readFileSync("Day15.txt", "utf-8").trim().split("\r\n");
input = input.map((line) =>
  line
    .slice(12)
    .split(": closest beacon is at x=")
    .map((pos) => pos.split(", y=").map(Number))
);
console.log(input[0]);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const Manhattan = (from, to) => {
  return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
};

const Insert = (interval) => {
  let a = 0;
  let b = Intervals.length - 1;
  let c;
  let insert = false;
  // we should ba able to just say while true, actually no im dumb
  while (true) {
    c = Math.floor((a + b) / 2);
    // console.log("c is : ", c);
    // console.log("i should insert");
    if (insert) {
      if (c === -1) {
        c = 0;
      }
      // insert on the right or else on the left
      if (Intervals[c][1] <= interval[0]) {
        Intervals.splice(c + 1, 0, interval);
      } else {
        Intervals.splice(c, 0, interval);
      }
      //   console.log("inserted");
      break;
    }
    // new int a bit on the left
    // console.log(Intervals[c], c);
    if (Intervals[c][0] <= interval[1] && Intervals[c][0] >= interval[0]) {
      //   console.log("a");
      // if we are at the beginning
      if (c === 0) {
        Intervals[c] = Array(interval[0], Intervals[c][1]);
      }
      break;
    }
    // new int a bit on the right
    else if (Intervals[c][1] <= interval[1] && Intervals[c][1] >= interval[0]) {
      // if we are at the end
      //   console.log("b");
      if (c === Intervals.length - 1) {
        Intervals[c] = Array(Intervals[c][0], interval[1]);
      }
      break;
    }
    // new int if far on the left
    else if (Intervals[c][0] > interval[0] && Intervals[c][1] > interval[1]) {
      //   console.log("c", a, b, c);
      if (a + 1 === b) {
        insert = true;
        // console.log("insert");
      }
      b = c - 1;
    }
    // new int if far on the right
    else if (Intervals[c][0] < interval[0] && Intervals[c][1] < interval[1]) {
      //   console.log("d", a, b, c);

      a = c + 1;
    }

    if (a === b) {
      insert = true;
      // we may insert next time
    }
  }
};

const Y = 2000000;
// D=dy= distance sensor-closest
// d= distance sensor-beacon
let cpt = 0;
let map = new Map();
let Intervals = Array(0);

// input.length
for (let i = 0; i < 0; i++) {
  let sensor, beacon, point;
  let d, dy, x;
  let interval;

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

    // xi = sensor.x - (d - dy) xf = sensor.x + (d - dy)
    interval = Array(input[i][0][0] - (d - dy), input[i][0][0] + (d - dy));
  }
}

console.log(cpt);
// 4907780
Intervals.push([0, 4]);
Intervals.push([8, 10]);
let intt = [-15, -6];
console.log(Intervals, intt);

Insert(intt);
Insert([2, 6]);
// Insert(intt);
console.log(Intervals);
