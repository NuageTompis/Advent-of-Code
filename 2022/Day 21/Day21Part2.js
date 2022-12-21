import { readFileSync } from "fs";
console.log("hello world");
let start = Date.now();

// See the README for Day 21 for further explanations

let input = readFileSync("Day21.txt", "utf-8").trim().split("\r\n");
input = input.map((monkey) => monkey.split(/[ :]+/g));
input = input.map((monkey) =>
  monkey.length === 2 ? [monkey[0], Number(monkey[1])] : monkey
);

const monkeyNames = input.map((monkey) => monkey[0]);
let Monkeys = input.map((monkey) => monkey.slice(0));
const hooman = monkeyNames.indexOf("humn");
const root = monkeyNames.indexOf("root");
let hoomanVal = 0;

// Given the name of a monkey, returns its value
const FindValue = (name) => {
  let ind = monkeyNames.indexOf(name);
  if (Monkeys[ind].length === 2) return Monkeys[ind][1];

  let ope = Monkeys[ind][2];
  let val;
  switch (ope) {
    case "+":
      val = FindValue(Monkeys[ind][1]) + FindValue(Monkeys[ind][3]);
      break;
    case "-":
      val = FindValue(Monkeys[ind][1]) - FindValue(Monkeys[ind][3]);
      break;
    case "*":
      val = FindValue(Monkeys[ind][1]) * FindValue(Monkeys[ind][3]);
      break;
    case "/":
      val = Math.floor(FindValue(Monkeys[ind][1]) / FindValue(Monkeys[ind][3]));
      break;
  }
  Monkeys[ind].splice(1, 3, val);
  return val;
};

// Find the root's child that is constant (the one that doesn't change when humn does), rearrange the root monkey in the input array so that its right child is the constant one
Monkeys[hooman][1] = hoomanVal;
let initialLeft = FindValue(input[root][1]);
let initialRight = FindValue(input[root][3]);
let nextLeft, nextRight;
let keep = true;
while (keep) {
  hoomanVal++;
  Monkeys = input.map((monkey) => monkey.slice(0));
  Monkeys[hooman][1] = hoomanVal;

  nextLeft = FindValue(input[root][1]);
  nextRight = FindValue(input[root][3]);
  if (nextLeft !== initialLeft) {
    keep = false;
  }
  if (nextRight !== initialRight) {
    input[root] = ["humn", input[root][3], "=", input[root][1]];
    keep = false;
  }
}

// Tells if the given numbers are of same sign
const OfSameSign = (a, b) => (a < 0 ? b < 0 : b >= 0);

hoomanVal = 0;
const Right = FindValue(input[root][3]);
initialLeft = FindValue(input[root][1]);
keep = true;
let [a, b, c] = [0, 1, 0];
while (keep) {
  let Left = FindValue(input[root][1]);
  if (Left === Right) break;

  // Left and right signs
  hoomanVal = a;
  Monkeys = input.map((monkey) => monkey.slice(0));
  Monkeys[hooman][1] = hoomanVal;
  let aValue = FindValue(input[root][1]);
  hoomanVal = b;
  Monkeys = input.map((monkey) => monkey.slice(0));
  Monkeys[hooman][1] = hoomanVal;
  let bValue = FindValue(input[root][1]);
  // If the wanted value is within the searching interval, we reduce this interval
  if (!OfSameSign(aValue - Right, bValue - Right)) {
    c = Math.floor((a + b) / 2);
    hoomanVal = c;
    Monkeys = input.map((monkey) => monkey.slice(0));
    Monkeys[hooman][1] = hoomanVal;
    if (OfSameSign(aValue - Right, FindValue(input[root][1]) - Right)) {
      a = c;
    } else b = c;
  }
  // Otherwise we increase the right bound of the interval
  else {
    b = 2 * b;
  }

  Monkeys = input.map((monkey) => monkey.slice(0));
  Monkeys[hooman][1] = hoomanVal;
}

console.log("Script took ", (Date.now() - start) / 1000, " s");
console.log(hoomanVal);
