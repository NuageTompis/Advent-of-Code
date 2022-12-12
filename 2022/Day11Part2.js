import { readFileSync } from "fs";
console.log("hello world");

// We execute the same script as Part 1 except instead of dividing the worried power by 3 we hash it by the smallest common factor of the test dividers for each monkey. For my input these values were prime so I guess it is the case for everyone and just compute the product
let commonFac = 1;

let input = readFileSync("Day11.txt", "utf-8")
  .trim()
  .split("\r\n\r\n")
  .map((mon) => mon.split("\r\n"));

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

const Plus = (wp, ope) => {
  return ope[2] === "old" ? wp + wp : wp + Number(ope[2]);
};
const Times = (wp, ope) => {
  return ope[2] === "old" ? wp * wp : wp * Number(ope[2]);
};
const Update = (wp, ope) => {
  return ope[1] === "+" ? Plus(wp, ope) : Times(wp, ope);
};

for (let i = 0; i < monkeys.length; i++) {
  commonFac *= monkeys[i].div;
}

let monkey;
let itemAmount;
let worriedPower;
let throwTo;
for (let round = 1; round < 10001; round++) {
  for (let i = 0; i < monkeys.length; i++) {
    monkey = monkeys[i];
    itemAmount = monkey.items.length;
    monkey.inspectedAmount += itemAmount;

    for (let k = 0; k < itemAmount; k++) {
      worriedPower = Update(monkey.items[0], monkey.ope);
      worriedPower = Math.floor(worriedPower % commonFac);
      monkey.items[0] = worriedPower;

      throwTo =
        worriedPower % monkey.div == 0
          ? monkey.throwTo.true
          : monkey.throwTo.false;
      monkeys[throwTo].items.push(monkey.items.shift());
    }
  }
}

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
