import { readFileSync } from "fs";
console.log("hello world");

// This script is very similar to Part 1
let input = readFileSync("Day7.txt", "utf-8").trim().split("\r\n");
input.push("$ cd ..");

let command_indexes = Array(0);
input = input.map((line, ind) => {
  if (line[0] == "$") {
    command_indexes.push(ind);
  }
  return line.split(" ");
});

const Dupl = (str, fac) => {
  let newStr = "";
  for (let i = 0; i < fac; i++) {
    newStr += str;
  }
  return newStr;
};

// If we find a directory that is wide enough to free the required amount of space and is also thinner than minSize, then we update minSize to its size
let minSize = 10000001;
// We don't know yet the space to free up
let toFree = null;

class Tree {
  constructor(size, location, name, parent) {
    this.size = Number(size);
    this.location = location;
    this.name = name;
    this.children = [];
    this.parent = parent;
  }
  insert(name, size) {
    this.children.push(
      new Tree(size, this.location + "/" + this.name, name, this)
    );
  }
  get_children() {
    if (this.size == -1) {
      return this.children;
    } else {
      console.log("Error");
    }
  }
  get_name() {
    return this.name;
  }
  get_size() {
    return this.size;
  }
  is_dir() {
    return this.size == -1;
  }
  access(name) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].get_name() == name) {
        return this.children[i];
      }
    }
    return -1;
  }
  get_parent() {
    return this.parent;
  }
  has_child(name) {
    return this.access(name) != -1;
  }
  show(fac) {
    let str = this.is_dir()
      ? "dir : " + this.name + " of size " + this.get_size() + "\n"
      : "Element : " + this.name + " of size " + this.size + "\n";
    fac += 1;
    for (let i = 0; i < this.children.length; i++) {
      str += Dupl("  ", fac) + "- " + this.children[i].show(fac);
    }

    return str;
  }
  get_size() {
    if (this.is_dir()) {
      let totalSize = 0;
      for (let i = 0; i < this.children.length; i++) {
        totalSize += this.children[i].get_size();
      }
      // We will only try to get the smallest directory to delete once we know the space that we need to free up
      if (toFree != null) {
        if (totalSize > toFree && totalSize < minSize) {
          minSize = totalSize;
        }
      }
      return totalSize;
    } else {
      return this.size;
    }
  }
}

let root = new Tree(-1, "/", "");
let current = root;

for (let i = 1; i < command_indexes.length; i++) {
  let index = command_indexes[i];
  if (input[index][1] == "cd") {
    if (input[index][2] == "..") {
      current = current.get_parent();
    } else {
      current = current.access(input[index][2]);
    }
  }

  // if command is ls
  else {
    // j goes through each line output
    for (let j = 0; j < command_indexes[i + 1] - index - 1; j++) {
      if (
        input[index + 1 + j][0] == "dir" &&
        !current.has_child(input[index + 1 + j][1])
      ) {
        current.insert(input[index + 1 + j][1], -1);
      } else if (!current.has_child(input[index + +1 + j][1])) {
        current.insert(input[index + 1 + j][1], input[index + 1 + j][0]);
      }
    }
  }
}

let used = root.get_size();
let total = 70000000;
let free = total - used;
let needed = 30000000;
toFree = needed - free;
// We call get_size to root a second time since we now know the space to free up, now we can check on each directory if it satisfies the requirement
used = root.get_size();
console.log(minSize);
