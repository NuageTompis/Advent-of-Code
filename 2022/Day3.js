import { readFileSync } from "fs";
console.log("hello world");

let start = performance.now();
let input = readFileSync("Day3.txt", "utf-8").trim().split("\r\n");
input = input.map((line) => {
  let l = line.length;
  return [line.slice(0, l / 2), line.slice(l / 2)];
});

let a_ascii = "a".charCodeAt(0);
let A_ascii = "A".charCodeAt(0);

// Given a char, return its value according to the problem
const ValueOf = (char) => {
  let v = char.charCodeAt(0);
  if (v - a_ascii < 0) {
    return v - A_ascii + 27;
  }
  return v - a_ascii + 1;
};

// Given a line, finds the common character and returns its value
const Priority = (line) => {
  let keep = true;
  let i = 0;
  while (i < line[0].length && keep) {
    if (line[0].includes(line[1][i])) {
      keep = false;
    }
    i++;
  }
  return ValueOf(line[1][i - 1]);
};

console.log(input.reduce((ac, cur) => ac + Priority(cur), 0));
let end = performance.now();
console.log((end - start).toFixed(2));
