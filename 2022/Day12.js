import { readFileSync } from "fs";
import { ArrSub, ArrSum, Equals } from "./modules/UT.js";
console.log("hello world");

// We will use a A* algorhtim deeply inspired by the video made by Sebastian
// The video can be found at : https://www.youtube.com/watch?v=-L-WgKMFuhE&t=324s&fbclid=IwAR0m110tc3tvX0-K75wOzhPK6rF2p75KMkxPP7LFB6qdzzYXivczX87zHp0

let input = readFileSync("Day12.txt", "utf-8").trim().split("\r\n");
let L = input.length;
let C = input[0].length;

// This part is intended to get the indexes of the starting and ending positions
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
// --------

const HCost = (pos) => {
  let diff = ArrSub(pos, ePos);
  let absDif = diff.map((d) => Math.abs(d));
  return absDif[0] + absDif[1];
};

let z_ascii = "z".charCodeAt(0);
let a_ascii = "a".charCodeAt(0);

// I use only one array in which is element is called a box and can be closed or not, a box is closed it we have already looked at its neighbours through it
// I start by adding the S box
let boxes = [
  {
    pos: sPos,
    gCost: 0,
    hCost: HCost(sPos),
    fCost: HCost(sPos) + 0,
    closed: false,
  },
];

// Among the open boxes, find the one that has the lowest f-cost
const SmallestFCost = () => {
  let min = Infinity;
  let smallest;
  for (let i = 0; i < boxes.length; i++) {
    if (!boxes[i].closed && boxes[i].fCost < min) {
      min = boxes[i].fCost;
      smallest = boxes[i];
    }
  }
  return smallest;
};

// Return the box at the given position
// If this function is called then the box has to exists in our array
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

// Tells wether the box at the given position was created (open or closed)
const Checked = (pos) => {
  let keep = true;
  for (let i = 0; i < boxes.length && keep; i++) {
    if (Equals(pos, boxes[i].pos)) {
      keep = false;
    }
  }
  return !keep;
};

// The following function tells wether or not it's possible to go from the previous cell to the given position
const E_code = "E".charCodeAt(0);
const S_code = "S".charCodeAt(0);
const CanGo = (prevBox, pos) => {
  let prevCode = input[prevBox.pos[0]][prevBox.pos[1]].charCodeAt(0);
  let boxCode = input[pos[0]][pos[1]].charCodeAt(0);

  if (prevCode === S_code) {
    return Array(0, 1).includes(boxCode - a_ascii);
  }

  if (boxCode === E_code) {
    return Array(0, 1).includes(z_ascii - prevCode);
  }
  return boxCode <= prevCode + 1;
};

// Updates the nearest cells according to the A* algorithm adapted to our problem
// In Sebastian's code there are up to 8 neighbors, here there are up t 4
// We first check the ones on top and bottom then the ones on left and right
const UpdateNear = (prevBox) => {
  let prevPos = prevBox.pos;
  let box;
  let pos;
  let g, h;
  g = prevBox.gCost + 1;
  for (let i = prevPos[0] - 1; i <= prevPos[0] + 1; i += 2) {
    pos = ArrSum(prevPos, [i - prevPos[0], 0]);

    if (i >= 0 && i < L && CanGo(prevBox, pos)) {
      h = HCost(pos);
      if (!Checked(pos)) {
        boxes.push({
          pos: pos,
          gCost: g,
          hCost: h,
          fCost: g + h,
          closed: false,
        });
      }
      // If already checked
      else {
        box = Find(pos);
        if (!box.closed && box.fCost > g + h) {
          box.gCost = g;
          box.fCost = g + h;
        }
      }
    }
  }

  for (let j = prevPos[1] - 1; j <= prevPos[1] + 1; j += 2) {
    pos = ArrSum(prevPos, [0, j - prevPos[1]]);

    if (j >= 0 && j < C && CanGo(prevBox, pos)) {
      h = HCost(pos);
      if (!Checked(pos)) {
        boxes.push({
          pos: pos,
          gCost: g,
          hCost: h,
          fCost: g + h,
          closed: false,
        });
      }
      // If already checked
      else {
        box = Find(pos);
        if (!box.closed && box.fCost > g + h) {
          box.gCost = g;
          box.fCost = g + h;
        }
      }
    }
  }
};

let answer;
let keep = true;
// At every step we get the best box and update its neighbors, then we close it
while (keep) {
  let best = SmallestFCost();
  UpdateNear(best);
  best.closed = true;
  // If we found E
  if (best.hCost === 0) {
    keep = false;
    answer = best.gCost;
  }
}

console.log(answer);
