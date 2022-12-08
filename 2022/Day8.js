import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day8.txt", "utf-8").trim().split("\r\n");
const L = input.length;
const C = input[0].length;

// We will first go through each line, for each one we look from the West then from the East and push in an array the positions of trees that are visible from the outside
// Then we remove the duplicated values

let visible = Array(0);

// From the North, checks which tree positions are visible at columb ind and pushes them into the previous array
const NSight = (ind) => {
  let i = 0;
  let maxHeight = -1;
  while (i < L) {
    if (input[i][ind] > maxHeight) {
      maxHeight = input[i][ind];
      visible.push(new Array(i, ind));
    }
    i++;
  }
};
// Just like NSight but from the South
const SSight = (ind) => {
  let i = L - 1;
  let maxHeight = -1;
  while (i >= 0) {
    if (input[i][ind] > maxHeight) {
      maxHeight = input[i][ind];
      visible.push(new Array(i, ind));
    }
    i--;
  }
};
const WSight = (ind) => {
  let i = 0;
  let maxHeight = -1;
  while (i < C) {
    if (input[ind][i] > maxHeight) {
      maxHeight = input[ind][i];
      visible.push(new Array(ind, i));
    }
    i++;
  }
};
const ESight = (ind) => {
  let i = C - 1;
  let maxHeight = -1;
  while (i >= 0) {
    if (input[ind][i] > maxHeight) {
      maxHeight = input[ind][i];
      visible.push(new Array(ind, i));
    }
    i--;
  }
};

for (let i = 0; i < L; i++) {
  WSight(i);
  ESight(i);
}
for (let j = 0; j < C; j++) {
  NSight(j);
  SSight(j);
}

// Used to compare two arrays of length 2
const Equals = (arr1, arr2) => {
  return arr1[0] == arr2[0] && arr1[1] == arr2[1];
};

// We sort the array
visible = visible.sort((arr1, arr2) => {
  if (arr1[0] - arr2[0] < 0) {
    return -1;
  }
  if (arr1[0] - arr2[0] > 0) {
    return 1;
  }
  if (arr1[1] - arr2[1] < 0) {
    return -1;
  }
  return 1;
});
// We remove the duplicated positions
visible = visible.filter((arr, ind) => {
  if (ind == 0) {
    return true;
  }
  return !Equals(arr, visible[ind - 1]);
});

console.log(visible.length);
