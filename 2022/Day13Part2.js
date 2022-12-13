import { readFileSync } from "fs";
console.log("hello world");

// This script does the same as Part 1 except we also need to add the elements [[2]] and [[6]] and then sort the puzzle input
let input = readFileSync("Day13.txt", "utf-8")
  .trim()
  .replace(/\n\r/g, "")
  .split("\r\n");
input = input.map((pair) => pair.split("\r\n")[0]);

const MakeList = (int) => "[" + int + "]";

const OB = "[";
const CB = "]";
const SmartSplit = (list) => {
  let list2 = list.slice(1, list.length - 1).split("");
  let OBc = 0;
  let commaInds = Array(0);
  for (let i = 0; i < list2.length; i++) {
    if (list2[i] == OB) {
      OBc++;
    }
    if (list2[i] == CB) {
      OBc--;
    }
    if (OBc === 0 && list2[i] == ",") {
      commaInds.push(i);
    }
  }
  for (let j = 0; j < commaInds.length; j++) {
    list2[commaInds[j]] = "Z";
  }
  list2 = list2.join("").split("Z");
  return list2;
};

const CompareLists = (left, right) => {
  if (left[1] === "]" && right[1] !== "]") {
    return true;
  }
  if (left[1] !== "]" && right[1] === "]") {
    return false;
  }
  let left2 = SmartSplit(left);
  let right2 = SmartSplit(right);
  let keep = true;
  let l = left2.length;
  l = right2.length < l ? right2.length : l;
  for (let i = 0; i < l && keep; i++) {
    let comp = Compare(left2[i], right2[i]);
    if (comp === true) {
      return true;
    }
    if (comp === false) {
      return false;
    }
  }
  if (left2.length < right2.length) return true;
  if (left2.length > right2.length) return false;
  return 0;
};

const Compare = (left, right) => {
  if (left[0] === "[" && right[0] === "[") {
    return CompareLists(left, right);
  } else if (left[0] === "[") {
    return CompareLists(left, MakeList(right));
  } else if (right[0] === "[") {
    return CompareLists(MakeList(left), right);
  } else {
    if (Number(left) < Number(right)) {
      return true;
    }
    return Number(left) > Number(right) ? false : 0;
  }
};

input.push("[[2]]");
input.push("[[6]]");

input = input.sort((line1, line2) => {
  if (Compare(line1, line2)) return -1;
  return 1;
});

console.log((input.indexOf("[[2]]") + 1) * (input.indexOf("[[6]]") + 1));
