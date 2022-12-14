import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

// We will go through each pair and call the function Compare to see if they are correctly ordered

let input = readFileSync("Day13.txt", "utf-8").trim().split("\r\n\r\n");
input = input.map((pair) => pair.split("\r\n").map(JSON.parse));

// Compares two strings that represents a list
const CompareLists = (left, right) => {
  // If the left list is empty but not the right one
  if (left.length === 0 && right.length !== 0) {
    return true;
  }
  // If it's the other way around
  if (left.length !== 0 && right.length === 0) {
    return false;
  }
  // Else
  let keep = true;
  let ll = left.length;
  let rl = right.length;
  let min_l = rl < ll ? rl : ll;
  for (let i = 0; i < min_l && keep; i++) {
    let comp = Compare(left[i], right[i]);
    if (comp === true) {
      return true;
    }
    if (comp === false) {
      return false;
    }
    // If comp = 0, we continue
  }
  // We reached the end of either one
  if (left.length < rl) return true;
  if (left.length > rl) return false;
  return 0;
};

// Compare two lines, calls CompareLists if both lines represent an array
const Compare = (left, right) => {
  if (typeof left !== "number" && typeof right !== "number") {
    return CompareLists(left, right);
  } else if (typeof left !== "number") {
    return CompareLists(left, [right]);
  } else if (typeof right !== "number") {
    return CompareLists([left], right);
  } else {
    if (left < right) {
      return true;
    }
    return left > right ? false : 0;
  }
};

let orderedPairs = Array(0);
for (let i = 1; i <= input.length; i++) {
  if (Compare(input[i - 1][0], input[i - 1][1]) === true) {
    orderedPairs.push(i);
  }
}
console.log(orderedPairs.reduce(Sum, 0));
console.log(input[0]);
