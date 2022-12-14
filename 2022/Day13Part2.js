import { readFileSync } from "fs";
import { Equals, Prod } from "./modules/UT.js";
console.log("hello world");

// This script does the same as Part 1 except we also need to add the elements [[2]] and [[6]] and then sort the puzzle input
let input = readFileSync("Day13.txt", "utf-8")
  .trim()
  .replace(/\n\r/g, "")
  .split("\r\n")
  .map(JSON.parse)
  .concat([[[2]], [[6]]]);

const CompareLists = (left, right) => {
  if (left.length === 0 && right.length !== 0) {
    return true;
  }
  if (left.length !== 0 && right.length === 0) {
    return false;
  }
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
  }
  if (left.length < rl) return true;
  if (left.length > rl) return false;
  return 0;
};

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

input = input.sort((line1, line2) => {
  if (Compare(line1, line2)) return -1;
  return 1;
});

let indexes = Array(0);
for (let i = 0; i < input.length; i++) {
  if (Equals(input[i], [[2]])) {
    indexes.push(i + 1);
  } else if (Equals(input[i], [[6]])) {
    indexes.push(i + 1);
    break;
  }
}

console.log(indexes.reduce(Prod, 1));
