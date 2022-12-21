import { readFileSync } from "fs";
console.log("hello world");
let start = Date.now();

// We will get the 'root' monkey and find the number it is supposed to shout. To do so, we will recursively reach each of its children (the two monkeys it needs to hear first) and find the number they are supposed to shout.
// In order to save some time, once we find the value of a monkey we will update it
// For instance, we start by storing a monkey like 'abcd: aaaa + bbbb' in an array ['abcd','aaaa','+','bbbb']
// Then  when we find the values aaaa and bbbb shout (for instance 1 and 3) we instead store abcd in the array ['abcd',4]

let input = readFileSync("Day21.txt", "utf-8").trim().split("\r\n");
input = input.map((monkey) => monkey.split(/[ :]+/g));
input = input.map((monkey) =>
  monkey.length === 2 ? [monkey[0], Number(monkey[1])] : monkey
);

const monkeyNames = input.map((monkey) => monkey[0]);

// Given the name of a monkey, returns its value
const FindValue = (name) => {
  let ind = monkeyNames.indexOf(name);
  if (input[ind].length === 2) return input[ind][1];

  let ope = input[ind][2];
  let val;
  switch (ope) {
    case "+":
      val = FindValue(input[ind][1]) + FindValue(input[ind][3]);
      break;
    case "-":
      val = FindValue(input[ind][1]) - FindValue(input[ind][3]);
      break;
    case "*":
      val = FindValue(input[ind][1]) * FindValue(input[ind][3]);
      break;
    case "/":
      val = Math.floor(FindValue(input[ind][1]) / FindValue(input[ind][3]));
      break;
  }
  input[ind].splice(1, 3, val);
  return val;
};

let answer = FindValue("root");
console.log("Script took ", Date.now() - start, " ms");
console.log(answer);
