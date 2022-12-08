import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day6.txt", "utf-8").trim();
let i = 0;
// We iterate through each char until we find the (first) one that initiates a series of 4 distinct chars
let keep = true;
while (keep) {
  if (
    input[i] != input[i + 1] &&
    input[i] != input[i + 2] &&
    input[i] != input[i + 3] &&
    input[i + 1] != input[i + 2] &&
    input[i + 1] != input[i + 3] &&
    input[i + 2] != input[i + 3]
  ) {
    keep = false;
  }
  i++;
}
console.log(i + 3);
