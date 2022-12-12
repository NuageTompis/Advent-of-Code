import { readFileSync } from "fs";
import { ArrSub, ArrSum, Equals } from "./modules/UT.js";
console.log("hello world");

// This part is very similar to Part 1 except we start from the end and stop when we found a box 'a'

let input = readFileSync("Day12.txt", "utf-8").trim().split("\r\n");
let L = input.length;
let C = input[0].length;

let sKeep = true;
let eKeep = true;
let ePos, sPos;
for (let i = 0; i < L; i++) {
  for (let j = 0; j < C && eKeep | sKeep; j++) {
    if (sKeep && input[i][j] == "S") {
      sKeep = false;
      sPos = Array(i, j);
    }
    if (eKeep && input[i][j] == "E") {
      eKeep = false;
      ePos = Array(i, j);
    }
  }
}

let z_ascii = "z".charCodeAt(0);
let a_ascii = "a".charCodeAt(0);

let boxes = [
  {
    pos: ePos,
    gCost: 0,
    closed: false,
  },
];

const SmallestGCost = () => {
  let min = Infinity;
  let smallest;
  for (let i = 0; i < boxes.length; i++) {
    if (!boxes[i].closed && boxes[i].gCost < min) {
      min = boxes[i].gCost;
      smallest = boxes[i];
    }
  }
  return smallest;
};

const Find = (pos) => {
  let box;
  let keep = true;
  for (let i = 0; i < boxes.length && keep; i++) {
    if (Equals(pos, boxes[i].pos)) {
      keep = false;
      box = boxes[i];
    }
  }
  return box;
};

const Checked = (pos) => {
  let keep = true;
  for (let i = 0; i < boxes.length && keep; i++) {
    if (Equals(pos, boxes[i].pos)) {
      keep = false;
    }
  }
  return !keep;
};

const E_code = "E".charCodeAt(0);
const S_code = "S".charCodeAt(0);
const CanGo = (prevBox, pos) => {
  let prevCode = input[prevBox.pos[0]][prevBox.pos[1]].charCodeAt(0);

  if (prevCode === E_code) {
    return (input[pos[0]][pos[1]] === "y") | (input[pos[0]][pos[1]] === "z");
  }
  let boxCode = input[pos[0]][pos[1]].charCodeAt(0);
  if (boxCode === S_code) {
    return (prevCode === a_ascii) | (prevCode === a_ascii + 1);
  }
  return boxCode >= prevCode - 1;
};

const UpdateNear = (prevBox) => {
  let prevPos = prevBox.pos;
  let box;
  let pos;
  let g;
  g = prevBox.gCost + 1;
  for (let i = prevPos[0] - 1; i <= prevPos[0] + 1; i += 2) {
    pos = ArrSum(prevPos, [i - prevPos[0], 0]);

    if (i >= 0 && i < L && CanGo(prevBox, pos)) {
      if (!Checked(pos)) {
        boxes.push({
          pos: pos,
          gCost: g,
          closed: false,
        });
      } else {
        box = Find(pos);
        if (!box.closed && box.gCost > g) {
          box.gCost = g;
        }
      }
    }
  }

  for (let j = prevPos[1] - 1; j <= prevPos[1] + 1; j += 2) {
    pos = ArrSum(prevPos, [0, j - prevPos[1]]);

    if (j >= 0 && j < C && CanGo(prevBox, pos)) {
      if (!Checked(pos)) {
        boxes.push({
          pos: pos,
          gCost: g,
          closed: false,
        });
      } else {
        box = Find(pos);
        if (!box.closed && box.gCost > g) {
          box.gCost = g;
        }
      }
    }
  }
};

let answer;
let keep = true;
while (keep) {
  let best = SmallestGCost();
  UpdateNear(best);
  best.closed = true;
  if (input[best.pos[0]][best.pos[1]] === "a") {
    keep = false;
    answer = best.gCost;
  }
}

console.log(answer);
