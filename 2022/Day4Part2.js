import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day4.txt", "utf-8").trim().split("\r\n");
input = input.map((line) => line.split(",").map((elf) => elf.split("-")));

const Contains = (A, B) => {
  return Number(A[0]) <= Number(B[1]) && Number(A[1]) >= Number(B[0]);
};

console.log(
  input.reduce((ac, cur) => {
    if (Contains(cur[1], cur[0]) | Contains(cur[0], cur[1])) {
      return ac + 1;
    }
    return ac;
  }, 0)
);
