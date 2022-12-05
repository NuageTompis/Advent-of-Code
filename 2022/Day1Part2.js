import { readFileSync } from "fs";
import { Sum } from "./modules/UT.js";
console.log("hello world");

let input = readFileSync("Day1.txt", "utf-8")
  .trim()
  .split("\n\r")
  .map((elf) => elf.split("\n").map(Number))
  .map((elf) => elf.reduce((ac, cur) => ac + cur, 0));

const Highests = Array(0);
Highests.push(
  input.reduce((ac, cur) => {
    if (cur > ac) {
      return cur;
    }
    return ac;
  }, 0)
);

for (let i = 0; i < 2; i++) {
  Highests.push(
    input.reduce((ac, cur) => {
      if (cur > ac && cur < Highests[i]) {
        return cur;
      }
      return ac;
    }, 0)
  );
}

console.log(Highests.reduce(Sum, 0));
