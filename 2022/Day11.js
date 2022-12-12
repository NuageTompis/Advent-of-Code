import { readFileSync } from "fs";
console.log("hello world");

// We divide the puzzle input into the sections descriping a monkey
let input = readFileSync("Day11.txt", "utf-8")
  .trim()
  .split("\r\n\r\n")
  .map((mon) => mon.split("\r\n"));

// We create an array of monkeys
let monkeys = [];
for (let i = 0; i < input.length; i++) {
  monkeys.push({
    items: input[i][1].split(": ")[1].split(", ").map(Number),
    div: Number(input[i][3].split(" ")[5]),
    ope: input[i][2].split("= ")[1].split(" "),
    throwTo: { true: input[i][4].slice(-1), false: input[i][5].slice(-1) },
    inspectedAmount: 0,
  });
}

// Given an operation such as ['old','+','4'], returns wp+4 where wp is the current worried power
const Plus = (wp, ope) => {
  return ope[2] === "old" ? wp + wp : wp + Number(ope[2]);
};
// Same thing for operations involving a product
const Times = (wp, ope) => {
  return ope[2] === "old" ? wp * wp : wp * Number(ope[2]);
};
// A general function for the two previous ones
const Update = (wp, ope) => {
  return ope[1] === "+" ? Plus(wp, ope) : Times(wp, ope);
};

let monkey;
let itemAmount;
let worriedPower;
let throwTo;
// We iterate and update the monkeys like the problem suggests
// The rest is quite self-explanatory
for (let round = 1; round < 21; round++) {
  for (let i = 0; i < monkeys.length; i++) {
    monkey = monkeys[i];
    itemAmount = monkey.items.length;
    monkey.inspectedAmount += itemAmount;

    for (let k = 0; k < itemAmount; k++) {
      worriedPower = Update(monkey.items[0], monkey.ope);
      worriedPower = Math.floor(worriedPower / 3);
      monkey.items[0] = worriedPower;

      throwTo =
        worriedPower % monkey.div == 0
          ? monkey.throwTo.true
          : monkey.throwTo.false;
      monkeys[throwTo].items.push(monkey.items.shift());
    }
  }
}

// The last round ended, now we want to know which two monkeys inspected the most items (M1 is the maximum amount, M2 the second)
let M1 = monkeys[0].inspectedAmount;
let M2 = monkeys[1].inspectedAmount;
let amount;
if (M2 > M1) {
  [M1, M2] = [M2, M1];
}
for (let i = 2; i < monkeys.length; i++) {
  amount = monkeys[i].inspectedAmount;
  if (amount > M1) {
    M2 = M1;
    M1 = amount;
  } else {
    if (amount > M2) {
      M2 = amount;
    }
  }
}
console.log(M1 * M2);
