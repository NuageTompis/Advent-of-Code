import { readFileSync } from "fs";
console.log("hello world");

// This code is more clever than the one used in Part 1
// The principle is the same : we iterate through each char until we find the series that satisfies the requirement
// However, we keep an array of the current series of chars (called arr) and compute the amount of duplicated values in the current array
// We add or substract 1 each time we encouter or leave a duplicate value
// We stop when this amount equals 0
let input = readFileSync("Day6.txt", "utf-8").trim();
let i = 0;
let keep = true;
let arr = Array(13);
for (let k = 0; k < 13; k++) {
  arr[k] = input[k];
}
// Let's calculate the amount of duplicated values present in the beginning
let doublons = arr
  .slice(0)
  .sort()
  .filter((char, ind, array) => {
    if (ind == 0) {
      return false;
    }
    return char == array[ind - 1];
  }).length;

// At the beginning of each iteration, the current array is of size 13, we then push the next value and remove the first by updating the value doublons at the right times
let removed = null;
while (keep && i < input.length) {
  if (arr.includes(input[13 + i])) {
    doublons += 1;
  }
  if (doublons == 0) {
    keep = false;
  }
  arr.push(input[13 + i]);
  removed = arr.shift();
  if (arr.includes(removed)) {
    doublons -= 1;
  }
  i++;
}
console.log(i + 13);
