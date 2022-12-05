import { readFileSync } from "fs";
console.log("hello world");

// We split the input into two arrays that we then modify to make them easier to work with
let input = readFileSync("Day5.txt", "utf-8").split("\n\r");
let stacks = input[0].replace(/[\[,\]]/g, "").replace(/    /g, " ");
stacks = stacks.slice(0, stacks.indexOf("\r\n 1"));
stacks = stacks.split("\r\n").map((line) => line.split(" "));
let rules = input[1].split("\r\n").map((line) => {
  return line.slice(5).replace("from", "to").split(" to ").map(Number);
});

let rowStacks = Array(stacks[0].length);
let row = [];
let newEl = "";
for (let i = 0; i < stacks[0].length; i++) {
  row = [];
  for (let j = stacks.length - 1; j >= 0; j--) {
    newEl = stacks[j][i];
    if (newEl !== "") {
      row.push(newEl);
    }
  }
  rowStacks[i] = row;
}
// The input is now split into rowStacks and rules, which we are going to work with

// This function takes a rule and updates the rowStacks array according to it
const Update = (rule) => {
  let [amount, from, to] = rule;
  for (let j = 0; j < amount; j++) {
    rowStacks[to - 1].push(rowStacks[from - 1].pop());
  }
};

// We update the stacks for every line
for (let i = 0; i < rules.length; i++) {
  Update(rules[i]);
}

// Let's now take the upper element of each pile and merge them into a string
let answer = "";
for (let k = 0; k < 9; k++) {
  answer += rowStacks[k][rowStacks[k].length - 1];
}
console.log(answer);
