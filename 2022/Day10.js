import { readFileSync } from "fs";
console.log("hello world");

// We will go through each line as the problem suggests it and store the x streng every 20 cycles
// Then we will compute the answer with this array

let input = readFileSync("Day10.txt", "utf-8").trim().split("\r\n");

let xReg = 1;
let cycle = 1;
let line;
let xStrengh_ev20 = Array(0);

// Checks if the cycle is a multiple of 20 and adds the corresponding strengh if need be
const Check = () => {
  if (cycle % 20 == 0) {
    xStrengh_ev20.push(xReg * cycle);
  }
};

for (let i = 0; i < input.length; i++) {
  line = input[i];
  // If the line states noop
  if (line[0] == "n") {
    Check();
    cycle += 1;
  }
  // Else we update the x registery
  else {
    Check();
    cycle += 1;
    Check();
    cycle += 1;
    xReg += Number(line.split(" ")[1]);
  }
}

// We compute the answer
console.log(
  xStrengh_ev20.reduce((ac, v, i) => {
    if (i % 2 == 0) {
      return ac + v;
    }
    return ac;
  }, 0)
);
