import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");
//
let input = readFileSync("Day13.txt", "utf-8").trim().split("\r\n\r\n");
input = input.map((pair) => pair.split("\r\n"));

// The next 3 lines are simply here to make the code easier to read
const OB = "[";
const CB = "]";
const MakeList = (int) => OB + int + CB;

// Splits a string such as '[6,[3,3]]' into ['6','[3,3]']
const SmartSplit = (list) => {
  list = list.slice(1, list.length - 1).split("");
  let OBc = 0;
  // We gather the indexes where there is a comma that we should split at
  let commaInds = Array(0);
  for (let i = 0; i < list.length; i++) {
    if (list[i] === OB) {
      OBc++;
    } else if (list[i] === CB) {
      OBc--;
    }
    if (OBc === 0 && list[i] === ",") {
      commaInds.push(i);
    }
  }
  // Then we replace these commas by another value and we split the string according to this value
  for (let j = 0; j < commaInds.length; j++) {
    list[commaInds[j]] = "Z";
  }
  list = list.join("").split("Z");
  return list;
};

// Compares two strings that represents a list
const CompareLists = (left, right) => {
  // If the left list is empty but not the right one
  if (left[1] === CB && right[1] !== CB) {
    return true;
  }
  // If it's the other way around
  if (left[1] !== CB && right[1] === CB) {
    return false;
  }
  // Else
  left = SmartSplit(left);
  right = SmartSplit(right);
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
  if (left[0] === OB && right[0] === OB) {
    return CompareLists(left, right);
  } else if (left[0] === OB) {
    return CompareLists(left, MakeList(right));
  } else if (right[0] === OB) {
    return CompareLists(MakeList(left), right);
  } else {
    if (Number(left) < Number(right)) {
      return true;
    }
    return Number(left) > Number(right) ? false : 0;
  }
};

let orderedPairs = Array(0);
for (let i = 1; i <= input.length; i++) {
  if (Compare(input[i - 1][0], input[i - 1][1]) === true) {
    orderedPairs.push(i);
  }
}
console.log(orderedPairs.reduce(Sum, 0));
