import { readFileSync } from "fs";
import { ArrSum, Equals } from "./modules/UT.js";
console.log("hello world");
let start = Date.now();
let UpperBound = 250;

// We first give an arbitrary upper bound for the minimal time to reach the end. This bound will be incremented if it's impossible to reach the end that quickly
// Then we compute the map (the bilzzard configuration) at each minute for as long as the upper bound
// Then we can start finding the best path recursively with the FindBest function :
// At each step, we check where we can go (the reachable position differ depending on wether we are on a corner or next to a border) and make a recursion from this position if there is no blizzard
// The previous check is partially optimal because we start by checking if we are in the middle and not on a border which is more frequent
// If at some point the Manhattan distance plus the time spent is greater than the upper bound, this path is pointless and we can cut the recursion

// If we tried every path without finding a solution when the upper bound is too low and we try again after incrementing it by 10

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
for (let i = 0; i < UpperBound; i++) {
  map = UpdateMap(map);
  MAPS.push(map);
}

let S = [-1, 0];
let E = [L, C - 1];

const Manhattan = (P1, P2) => Math.abs(P2[1] - P1[1]) + Math.abs(P2[0] - P1[0]);

// DN stands for direct neighbors
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
  if (pos[0] > 0 && pos[0] < L - 1 && pos[1] > 0 && pos[1] < C - 1)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("N")),
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("E")),
      ArrSum(pos, DN.get("W")),
    ]);
  else if (Equals(pos, S)) posToCheck.push(ArrSum(pos, DN.get("S")));
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
  if (pos[1] === C - 1)
    posToCheck = posToCheck.concat([
      ArrSum(pos, DN.get("S")),
      ArrSum(pos, DN.get("W")),
      ArrSum(pos, DN.get("N")),
    ]);

  let blizzards = MAPS[minutes].filter((e, i) => i % 2 === 0);
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

let answer;
while (true) {
  answer = FindBest(S, 0);
  if (answer !== Infinity) break;
  for (let i = 0; i < 10; i++) {
    map = UpdateMap(map);
    MAPS.push(map);
  }
  States = new Array(0);
  UpperBound += 10;
}
console.log("Script took : ", (Date.now() - start) / 1000, " s");
console.log(answer);
