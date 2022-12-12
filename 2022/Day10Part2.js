import { readFileSync, writeFileSync } from "fs";
import { Asc, Sum } from "./modules/UT.js";
console.log("hello world");

// This script is not a generic answer script
// By this I mean it won't simply print the answer in the console but write in a file called "Day10Output.txt" a human-readable answer code

let input = readFileSync("Day10.txt", "utf-8").trim().split("\r\n");

let xReg = 1;
let cycle = 1;
let line;
let outputStr = "";

// Writes on a string the next character to be displayed, either a '#' or a '.' (that i replaces by a space) according to the problem rules
const Draw = () => {
  if (Math.abs(((cycle - 1) % 40) - xReg) <= 1) {
    outputStr += "#";
  } else {
    outputStr += " ";
  }
};

for (let i = 0; i < input.length; i++) {
  line = input[i];
  // case noop
  if (line[0] == "n") {
    Draw();
    cycle += 1;
  }
  // case addx
  else {
    Draw();
    cycle += 1;
    Draw();
    cycle += 1;
    xReg += Number(line.slice(5));
  }
}

// Let's now add the new lines with \n
let output = outputStr.split("");
outputStr = "";
for (let i = 0; i < output.length; i += 40) {
  outputStr += output.slice(i, i + 40).join("") + "\n";
}
// Writing on the other file
writeFileSync("Day10Output.txt", outputStr);
