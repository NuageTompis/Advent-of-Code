import { readFileSync } from "fs";
import { ArrSum, Equals } from "./modules/UT.js";
import { Day24 } from "./modules/Day24.js";
console.log("hello world");
let start = Date.now();

// This script follows the exact same principle as Part 1 except we make an offset to the array MAPS

let UpperBound = 285;

let part1;

let input = readFileSync("Day24.txt", "utf-8").trim().split("\r\n");
const L = input.length - 2;
const C = input[0].length - 2;

const UpdateMap = (map) => {
  let newMap = map.slice(0);
  let blizPos;
  for (let d = 1; d < map.length; d += 2) {
    blizPos = JSON.parse(map[d - 1]);
    switch (map[d]) {
      case ">":
        newMap[d - 1] = JSON.stringify([blizPos[0], (blizPos[1] + 1) % C]);
        break;
      case "<":
        newMap[d - 1] = JSON.stringify([blizPos[0], (C + blizPos[1] - 1) % C]);
        break;
      case "^":
        newMap[d - 1] = JSON.stringify([(L + blizPos[0] - 1) % L, blizPos[1]]);
        break;
      case "v":
        newMap[d - 1] = JSON.stringify([(blizPos[0] + 1) % L, blizPos[1]]);
        break;
    }
  }
  return newMap;
};

let map = new Array(0);
for (let i = 1; i < L + 1; i++) {
  for (let j = 1; j < C + 1; j++) {
    if (input[i][j] !== ".") {
      map.push(JSON.stringify([i - 1, j - 1]));
      map.push(input[i][j]);
    }
  }
}

let MAPS = new Array(0);
// MAPS.push(map.slice(0));
for (let i = 0; i < 245 + UpperBound; i++) {
  map = UpdateMap(map);
  MAPS.push(map);
}

let E = [-1, 0];
let S = [L, C - 1];

const Manhattan = (P1, P2) => Math.abs(P2[1] - P1[1]) + Math.abs(P2[0] - P1[0]);

let DN = new Map();
DN.set("N", [-1, 0]);
DN.set("S", [1, 0]);
DN.set("W", [0, -1]);
DN.set("E", [0, 1]);

let States = new Array(0);

const FindBest = (pos, minutes) => {
  let state = JSON.stringify([pos, minutes]);
  States.push(state);

  let distanceToEnd = Manhattan(pos, E);
  if (distanceToEnd === 1) {
    if (minutes + 1 < UpperBound);
    UpperBound = minutes + 1;
    return minutes + 1;
  }

  if (minutes + distanceToEnd >= UpperBound) return Infinity;

  let posToCheck = new Array(0);
  posToCheck.push(pos);
  if (Equals(pos, S)) posToCheck.push(ArrSum(pos, DN.get("N")));
  else if (Equals(pos, [0, 0]))
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("E")),
    ]);
  else if (Equals(pos, [L - 1, 0]))
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("E")),
    ]);
  else if (Equals(pos, [0, C - 1]))
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("W")),
    ]);
  else if (Equals(pos, [L - 1, C - 1]))
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("W")),
    ]);
  else if (pos[0] === 0)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("W")),
      ArrSum(pos, DN.get("E")),
    ]);
  else if (pos[0] === L - 1)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("W")),
      ArrSum(pos, DN.get("E")),
    ]);
  else if (pos[1] === 0)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("E")),
    ]);
  else if (pos[1] === C - 1)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("W")),
      ArrSum(pos, DN.get("N")),
    ]);
  else
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("E")),
      ArrSum(pos, DN.get("W")),
    ]);

  let blizzards = MAPS[minutes + 1 + part1].filter((e, i) => i % 2 === 0);
  let reacheable = posToCheck.filter(
    (p) =>
      !blizzards.includes(JSON.stringify(p)) &&
      !States.includes(JSON.stringify([p, minutes + 1]))
  );

  let options = new Array(0);
  for (let i = 0; i < reacheable.length; i++)
    options.push(FindBest(reacheable[i], minutes + 1));
  return Math.min(...options);
};

let totalTime = 0;
// First trip
let time = Day24(0);
totalTime += time;
part1 = time;
console.log("Elf required ", time, " m to reach end");
// Second trip

while (true) {
  time = FindBest(S, 0);
  if (time !== Infinity) break;
  for (let i = 0; i < 10; i++) {
    map = UpdateMap(map);
    MAPS.push(map);
  }
  States = new Array(0);
  UpperBound += 10;
}

totalTime += time;
console.log("then ", time, " m to go back");
// Third trip
time = Day24(totalTime);
totalTime += time;
console.log("then ", time, " m to get back to the end");
console.log("Script took : ", (Date.now() - start) / 1000, " s");
console.log("Total time required : ", totalTime);
