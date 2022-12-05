import { readFileSync } from "fs";
console.log("hello world");

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

// We use the same principle as Part 1 except we use an intermediate array for each line so that we push on the stacks in the correct order
const Update = (rule) => {
  let [amount, from, to] = rule;
  let newArr = Array(0);
  for (let j = 0; j < amount; j++) {
    newArr.push(rowStacks[from - 1].pop());
  }
  for (let j = 0; j < amount; j++) {
    rowStacks[to - 1].push(newArr[amount - j - 1]);
  }
};

for (let i = 0; i < rules.length; i++) {
  Update(rules[i]);
}

let answer = "";
for (let k = 0; k < 9; k++) {
  answer += rowStacks[k][rowStacks[k].length - 1];
}
console.log(answer);

const Update2 = (rule) => {
  let [amount, from, to] = rule;
  for (let j = 0; j < amount; j++) {
    newArr.push(stacks[from - 1].pop());
  }
  for (let j = 0; j < amount; j++) {
    stacks[to - 1].push(newArr[amount - j - 1]);
  }
};
