import { readFileSync } from "fs";
console.log("hello world");

// This script goes through every line of the puzzle input and decodes it into decimal with the function PtoD (for "Pentadecimal to Decimal") then sums up the decimal numbers and finally enciphers it back to pentadecimal with the function DtoP

let input = readFileSync("Day25.txt", "utf-8").trim().split("\r\n");

const PtoD = (penta) => {
  let sum = 0;
  for (let i = penta.length - 1; i >= 0; i--) {
    if (penta[i] === "=") sum -= 2 * 5 ** (penta.length - 1 - i);
    else if (penta[i] === "-") sum -= 5 ** (penta.length - 1 - i);
    else sum += penta[i] * 5 ** (penta.length - 1 - i);
  }
  return sum;
};

const DtoP = (deci) => {
  let sum = new Array(0);
  let rest;
  while (deci !== 0) {
    rest = deci % 5;
    sum.push(rest);
    deci = (deci - rest) / 5;
  }
  sum.push(0);
  for (let i = 0; i < sum.length - 1; i++) {
    if (sum[i] === 3) {
      sum[i + 1] += 1;
      sum[i] = "=";
    } else if (sum[i] === 4) {
      sum[i + 1] += 1;
      sum[i] = "-";
    } else if (sum[i] === 5) {
      sum[i + 1] += 1;
      sum[i] = 0;
    }
  }
  if (sum[sum.length - 1] === 0) sum.splice(sum.length - 1, 1);
  sum = sum.map((e, i) => sum[sum.length - 1 - i]);
  return sum.join("");
};

console.log(DtoP(input.reduce((ac, cur) => ac + PtoD(cur), 0)));
