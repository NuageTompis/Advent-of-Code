import { readFileSync } from "fs";
console.log("hello world");

let input = readFileSync("Day7.txt", "utf-8").trim().split("\r\n");
// The next line will be explained later on
input.push("$ cd ..");
let command_indexes = Array(0);
input = input.map((line, ind) => {
  if (line[0] == "$") {
    command_indexes.push(ind);
  }
  return line.split(" ");
});

// Used for debugging, was meant to help displaying a directory
const Dupl = (str, fac) => {
  let newStr = "";
  for (let i = 0; i < fac; i++) {
    newStr += str;
  }
  return newStr;
};
let Sum = 0;

// I implemented a Tree class and divided my script into two parts :
// Firstly we represent  the file system with a Tree by going through each command and looking at what the output of ls is
// See below for the second part or Part 1
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
  // I ended up not using this method
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
  // Used for debugging, was meant to be used using console.log(<some tree>.show()) to display the directory or file
  show(fac = 0) {
    let str = this.is_dir()
      ? "dir : " + this.name + "\n"
      : "Element : " + this.name + "\n";
    fac += 1;
    for (let i = 0; i < this.children.length; i++) {
      str += Dupl("  ", fac) + "- " + this.children[i].show(fac);
    }

    return str;
  }
  // If applied to a file, returns its size, else returns the sum of all the files contained in the directory
  get_size() {
    if (this.is_dir()) {
      let totalSize = 0;
      for (let i = 0; i < this.children.length; i++) {
        totalSize += this.children[i].get_size();
      }
      // This if statement is used in the second part of Part 1
      if (totalSize < 100001) {
        Sum += totalSize;
      }
      return totalSize;
    } else {
      return this.size;
    }
  }
}

// root is the root directory of the file system, current will be a subpart of root and will allow us to insert elements easily
// By convention, a Tree is of size -1 if it is a directory
let root = new Tree(-1, "/", "root");
let current = root;

// We go through each command listed in the puzzle input, the rest is quite self-explanatory
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
    // j goes through each line output for the given command
    // To know how many iterations we have to do, we look at the amount of output lines between the current command and the next
    // However, if the last command is a ls one, this would be an issue, that's why we wrote line 6
    for (let j = 0; j < command_indexes[i + 1] - index - 1; j++) {
      if (
        input[index + 1 + j][0] == "dir" &&
        !current.has_child(input[index + 1 + j][1])
      ) {
        current.insert(input[index + 1 + j][1], -1);
      } else if (!current.has_child(input[index + 1 + j + 1 + j][1])) {
        current.insert(input[index + 1 + j][1], input[index + 1 + j][0]);
      }
    }
  }
}

// Here comes the second part of Part 1
// By calling get_size on root, we compute the size of each sub-directory
// Thus it is easy to exploit this method to calculate the Sum of all directories that have a size lower than 100000
root.get_size();
console.log(Sum);
// console.log(root.show());
