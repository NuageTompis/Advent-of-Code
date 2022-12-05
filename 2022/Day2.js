import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day2.txt", "utf-8")
  .trim()
  .split("\r\n")
  .map((line) => line.split(" "));

const Score = (row) => {
  let opponent = row[0];
  let mySelf = row[1];
  if (opponent == "A") {
    if (mySelf == "X") {
      return 1 + 3;
    }
    if (mySelf == "Y") {
      return 2 + 6;
    }
    if (mySelf == "Z") {
      return 3 + 0;
    }
  }
  if (opponent == "B") {
    if (mySelf == "X") {
      return 1 + 0;
    }
    if (mySelf == "Y") {
      return 2 + 3;
    }
    if (mySelf == "Z") {
      return 3 + 6;
    }
  }
  if (opponent == "C") {
    if (mySelf == "X") {
      return 1 + 6;
    }
    if (mySelf == "Y") {
      return 2 + 0;
    }
    if (mySelf == "Z") {
      return 3 + 3;
    }
  }
  console.log("Error");
};

console.log(input.reduce((ac, cur) => ac + Score(cur), 0));
