import { readFileSync } from "fs";
console.log("hello world");

let start = performance.now();
let input = readFileSync("Day3.txt", "utf-8").trim().split("\r\n");
let a_ascii = "a".charCodeAt(0);
let A_ascii = "A".charCodeAt(0);

// Given a char, return its value according to the problem
const ValueOf = (char) => {
  let v = char.charCodeAt(0) - a_ascii;
  if (v < 0) {
    return char.charCodeAt(0) - A_ascii + 27;
  }
  return v + 1;
};

// Given 3 lines, return the common char
const Common = (A, B, C) => {
  let common = null;

  let keep = true;
  for (let l = 0; l < C.length && keep; l++) {
    if (A.includes(C[l]) && B.includes(C[l])) {
      keep = false;
      common = C[l];
    }
  }
  return common;
};

let Acc = 0;
for (let i = 0; i < input.length / 3; i++) {
  let A = input[3 * i];
  let B = input[3 * i + 1];
  let C = input[3 * i + 2];
  Acc += ValueOf(Common(A, B, C));
}
let end = performance.now();
console.log(Acc);
console.log("this took in ms : ", (end - start).toFixed(2));
