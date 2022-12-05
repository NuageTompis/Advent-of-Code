import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day2.txt", "utf-8")
  .trim()
  .split("\r\n")
  .map((line) => line.split(" "));

const Score2 = (row) => {
  let opponent = row[0];
  let mySelf = row[1];
  if (mySelf == "X") {
    if (opponent == "A") {
      return 0 + 3;
    }
    if (opponent == "B") {
      return 0 + 1;
    }
    if (opponent == "C") {
      return 0 + 2;
    }
  }
  if (mySelf == "Y") {
    if (opponent == "A") {
      return 3 + 1;
    }
    if (opponent == "B") {
      return 3 + 2;
    }
    if (opponent == "C") {
      return 3 + 3;
    }
  }
  if (mySelf == "Z") {
    if (opponent == "A") {
      return 6 + 2;
    }
    if (opponent == "B") {
      return 6 + 3;
    }
    if (opponent == "C") {
      return 6 + 1;
    }
  }
};

console.log(input.reduce((ac, cur) => ac + Score2(cur), 0));
