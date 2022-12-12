import { readFileSync } from "fs";
import { ArrSum, ArrSub, Equals } from "./modules/UT.js";
console.log("hello world");

// We will watch the positions of the head and the tail at each step
// At each step, we compute the difference between the head and the tail :
// If the head is in amoung the 8 cases around the tail (or on top of it), we stall
// Othewise we move the tail accorgind to the difference

// We keep in track the positions visited by the tail and then remove the duplicated values

let input = readFileSync("Day9.txt", "utf-8").trim().split("\r\n");
input = input.map((line) => line.split(" "));

let visitedByTail = Array(0);
let headPos = [0, 0];
let tailPos = [0, 0];

// Used to move the head according to the input
const dirDic = { R: [0, 1], L: [0, -1], U: [-1, 0], D: [1, 0] };
const MoveHead = (dir) => {
  if (dir === "R") {
    headPos = ArrSum(headPos, dirDic.R);
  }
  if (dir === "L") {
    headPos = ArrSum(headPos, dirDic.L);
  }
  if (dir === "U") {
    headPos = ArrSum(headPos, dirDic.U);
  }
  if (dir === "D") {
    headPos = ArrSum(headPos, dirDic.D);
  }
};

// As explained at the beginning, moves the tail according to the problem
const moveTail = () => {
  let diff = ArrSub(headPos, tailPos);
  let absDif = Array(Math.abs(diff[0]), Math.abs(diff[1]));
  let stall =
    absDif[0] + absDif[1] <= 1 || (absDif[0] === 1 && absDif[1] === 1);
  if (stall) {
    return;
  }
  // diff 0 & 2
  if (diff[0] === 0) {
    tailPos = ArrSum(tailPos, [0, diff[1] / 2]);
    return;
  }
  if (diff[1] === 0) {
    tailPos = ArrSum(tailPos, [diff[0] / 2, 0]);
    return;
  }
  // diff 2 & 1
  if (absDif[0] > absDif[1]) {
    tailPos = ArrSum(tailPos, [diff[0] / 2, diff[1]]);
    return;
  }
  // diff 1 & 2
  if (absDif[0] < absDif[1]) {
    tailPos = ArrSum(tailPos, [diff[0], diff[1] / 2]);
    return;
  }
  console.log("err");
};

// Goes through each line of the puzzle input, moves the head then the tail for each step. Then we push the position the tail is in
for (let i = 0; i < input.length; i++) {
  let steps = input[i][1];
  for (let j = 0; j < steps; j++) {
    MoveHead(input[i][0]);
    moveTail();
    visitedByTail.push(tailPos);
  }
}

// We sort the array of the positions visited by tail so that we can remove the duplicates easily
visitedByTail = visitedByTail.sort((arr1, arr2) => {
  if (arr1[0] != arr2[0]) {
    return arr1[0] - arr2[0];
  }
  return arr1[1] - arr2[1];
});

// We remove the duplicated positions
visitedByTail = visitedByTail.filter((arr, ind) => {
  if (ind === 0) {
    return true;
  }
  return !Equals(arr, visitedByTail[ind - 1]);
});

console.log(visitedByTail.length);
