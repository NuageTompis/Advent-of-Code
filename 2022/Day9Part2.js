import { readFileSync } from "fs";
import { ArrSum, ArrSub, Equals } from "./modules/UT.js";
console.log("hello world");

// Same thing as Part 1 except this time we have 9 tails

let input = readFileSync("Day9.txt", "utf-8").trim().split("\r\n");
input = input.map((line) => line.split(" "));

let visitedByTail = Array(0);
let headPos = [0, 0];
let tailPos = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const dirDic = { R: [0, 1], L: [0, -1], U: [-1, 0], D: [1, 0] };
const MoveHead = (dir) => {
  if (dir == "R") {
    headPos = ArrSum(headPos, dirDic.R);
  }
  if (dir == "L") {
    headPos = ArrSum(headPos, dirDic.L);
  }
  if (dir == "U") {
    headPos = ArrSum(headPos, dirDic.U);
  }
  if (dir == "D") {
    headPos = ArrSum(headPos, dirDic.D);
  }
};

const moveTail = (i) => {
  let diff = null;

  // If we want to move the first tail
  if (i == 0) {
    diff = ArrSub(headPos, tailPos[0]);
  } else {
    diff = ArrSub(tailPos[i - 1], tailPos[i]);
  }
  let absDif = Array(Math.abs(diff[0]), Math.abs(diff[1]));
  let stall =
    absDif[0] + absDif[1] <= 1 || (absDif[0] === 1 && absDif[1] === 1);
  if (stall) {
    return;
  }
  // diff 0 & 2
  if (diff[0] === 0) {
    tailPos[i] = ArrSum(tailPos[i], [0, diff[1] / 2]);
    return;
  }
  if (diff[1] === 0) {
    tailPos[i] = ArrSum(tailPos[i], [diff[0] / 2, 0]);
    return;
  }
  // diff 2 & 1
  if (absDif[0] > absDif[1]) {
    tailPos[i] = ArrSum(tailPos[i], [diff[0] / 2, diff[1]]);
    return;
  }
  // diff 1 & 2
  if (absDif[0] < absDif[1]) {
    tailPos[i] = ArrSum(tailPos[i], [diff[0], diff[1] / 2]);
    return;
  }
  // diff 2 & 2
  tailPos[i] = ArrSum(tailPos[i], [diff[0] / 2, diff[1] / 2]);
};

for (let i = 0; i < input.length; i++) {
  let steps = input[i][1];
  for (let j = 0; j < steps; j++) {
    MoveHead(input[i][0]);
    for (let k = 0; k < 9; k++) {
      moveTail(k);
    }
    visitedByTail.push(tailPos[8]);
  }
}

visitedByTail = visitedByTail.sort((arr1, arr2) => {
  if (arr1[0] != arr2[0]) {
    return arr1[0] - arr2[0];
  }
  return arr1[1] - arr2[1];
});

visitedByTail = visitedByTail.filter((arr, ind) => {
  if (ind === 0) {
    return true;
  }
  return !Equals(arr, visitedByTail[ind - 1]);
});

console.log(visitedByTail.length);
