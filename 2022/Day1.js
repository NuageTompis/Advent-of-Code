import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day1.txt", "utf-8")
  .trim()
  .split("\n\r")
  .map((elf) => elf.split("\n").map(Number))
  .map((elf) => elf.reduce((ac, cur) => ac + cur, 0));

console.log(
  input.reduce((ac, cur) => {
    if (cur > ac) {
      return cur;
    }
    return ac;
  }, 0)
);
