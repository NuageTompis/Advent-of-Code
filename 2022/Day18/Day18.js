import { readFileSync } from "fs";
console.log("hello world");

// We will initiate the surface area as its value if all cubes were disconnected
// We will iretate through the list of cubes.
// Given a cube, we will check in the following if they are connected. If so we reduce the initial area by 2

let input = readFileSync("Day18.txt", "utf-8").trim().split("\r\n");
input = input.map((cube) => cube.split(",").map(Number));

let unconnected = 6 * input.length;

// Given a cube, returns a function that takes another one and tells if they are connected
const Connects = (cube) => {
  return (cube2) =>
    Math.abs(cube[0] - cube2[0]) +
      Math.abs(cube[1] - cube2[1]) +
      Math.abs(cube[2] - cube2[2]) ===
    1;
};

input.map((cur, ind) => {
  let connects = Connects(cur);
  input.slice(ind + 1).map((cur2, ind2) => {
    if (connects(cur2)) {
      unconnected -= 2;
    }
  });
});

console.log(unconnected);
