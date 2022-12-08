import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day8.txt", "utf-8").trim().split("\r\n");
const L = input.length;
const C = input[0].length;

let visible = Array(0);

// Similar to the script for Part 1, but this time the Sight functions are a bit different :
// They have an initial positions and checks to the North (or South, etc) how many trees are visible according to the problem's rules

// ind2 is the index that is constant (either a row or a column)
const NSight = (ind, ind2) => {
  let keep = true;
  let i = ind - 1;
  let maxHeight = input[ind][ind2];
  let cpt = 0;
  while (i >= 0 && keep) {
    if (input[i][ind2] >= maxHeight) {
      keep = false;
    }
    i--;
    cpt++;
  }
  return cpt;
};
const SSight = (ind, ind2) => {
  let keep = true;
  let i = ind + 1;
  let cpt = 0;
  let maxHeight = input[ind][ind2];
  while (i < L && keep) {
    if (input[i][ind2] >= maxHeight) {
      keep = false;
      maxHeight = input[i][ind2];
    }
    i++;
    cpt++;
  }
  return cpt;
};
const WSight = (ind2, ind) => {
  let keep = true;
  let i = ind - 1;
  let maxHeight = input[ind2][ind];
  let cpt = 0;
  while (i >= 0 && keep) {
    if (input[ind2][i] >= maxHeight) {
      keep = false;
      maxHeight = input[ind2][i];
    }
    i--;
    cpt++;
  }
  return cpt;
};
const ESight = (ind2, ind) => {
  let keep = true;
  let i = ind + 1;
  let maxHeight = input[ind2][ind];
  let cpt = 0;
  while (i < C && keep) {
    if (input[ind2][i] >= maxHeight) {
      keep = false;
      maxHeight = input[ind2][i];
    }
    cpt++;

    i++;
  }
  return cpt;
};

const Scope = (i, j) => {
  return NSight(i, j) * WSight(i, j) * ESight(i, j) * SSight(i, j);
};

// We compute the scope for each tree and save the greatest
let maxScope = 0;
for (let i = 0; i < L; i++) {
  for (let j = 0; j < C; j++) {
    let scope = Scope(i, j);
    if (scope > maxScope) {
      maxScope = scope;
    }
  }
}

console.log(maxScope);
