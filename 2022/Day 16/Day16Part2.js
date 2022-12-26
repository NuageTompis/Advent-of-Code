import { readFileSync } from "fs";
console.log("hello world");
let start = Date.now();

// See README for Day 16 for further explanations

const TIME = 26;
let input = readFileSync("Day16.txt", "utf-8").trim().split("\r\n");
input = input.map((line) =>
  Array(
    line.slice(6, 8),
    Number(line.replace(/\D/g, "")),
    line.includes("valves")
      ? line.split("valves ")[1].split(", ")
      : line.split("valve ")[1].split(", ")
  )
);
let V = input.length; // Amount of valves
let map = new Map();
let Flows = Array(0);
let Names = Array(0);
let PosFlows = Array(0);
let indexes = new Map();
for (let i = 0; i < input.length; i++) {
  if (input[i][1] !== 0) PosFlows.push(input[i][1]);
  Flows.push(input[i].slice(0, 2));
  Names.push(input[i][0]);
  map.set(input[i][0], {
    flow: input[i][1],
    leadTo: input[i][2],
    open: input[i][1] === 0 ? true : false,
  });
  indexes.set(input[i][0], i);
}
// Given a flow like 20 returns the name of the valve that has this flow (the flow must be > 0)
const GetValve = (flow) => {
  for (let i = 0; i < Flows.length; i++)
    if (Flows[i][1] === flow) return Flows[i][0];
};

// ##################### Creating distance matrix #####################
console.log("Initializing Distance Matrix");
let Distances = new Map();
let progress = 0; // The amount of nodes connected, each valve can be linked to every other so progress will be incremented each time we add a node until there are V*(V-1) connections
let dn; // Direct neighbors
for (let i = 0; i < Names.length; i++) {
  Distances.set(Names[i], new Map());
  dn = map.get(Names[i]).leadTo;
  for (let k = 0; k < dn.length; k++) {
    progress++;
    Distances.get(Names[i]).set(dn[k], 1);
  }
}
console.log("Progress : ", progress, "/", V * (V - 1));

let sn; // Secondary neighbors
while (progress < V * (V - 1)) {
  for (let i = 0; i < Names.length; i++) {
    dn = Distances.get(Names[i]).keys();
    dn = [...new Set(dn)];
    for (let k = 0; k < dn.length; k++) {
      sn = Distances.get(dn[k]).keys();
      sn = [...new Set(sn)];

      for (let n = 0; n < sn.length; n++) {
        if (!Distances.get(Names[i]).has(sn[n]) && Names[i] !== sn[n]) {
          progress++;
          Distances.get(Names[i]).set(
            sn[n],
            Distances.get(Names[i]).get(dn[k]) + Distances.get(dn[k]).get(sn[n])
          );
        } else if (Names[i] !== sn[n]) {
          Distances.get(Names[i]).set(
            sn[n],
            Math.min(
              Distances.get(Names[i]).get(sn[n]),
              Distances.get(Names[i]).get(dn[k]) +
                Distances.get(dn[k]).get(sn[n])
            )
          );
        }
      }
    }
  }
  console.log("Progress : ", progress, "/", V * (V - 1));
}
console.log("Distance Matrix successfully created");
// ##################### Distance matrix created #####################

let Best = 0;
// A path is an array like [12,22,35,45]
const OverallFlow = (path) => {
  let minutes = TIME;
  let flow = 0;
  let ind = 0;
  let valve = "AA";
  let nextValve, dist;
  while (ind < path.length && minutes > 1) {
    nextValve = GetValve(path[ind]);
    dist = Distances.get(valve).get(nextValve);
    minutes -= dist;
    minutes--;
    flow += path[ind] * minutes;
    valve = nextValve;
    ind++;
  }
  return flow;
};

let Paths = [];
let ElephantPaths = [];

// ############### Perms function ###############
const Perms = (head, available, minutes) => {
  head = head.slice(0);
  available = available.slice(0);
  if ((available.length === 0) | (minutes <= 1)) return [head];
  let valve = GetValve(head[head.length - 1]);
  available = available.filter(
    (valveVal) => Distances.get(valve).get(GetValve(valveVal)) < minutes - 1
  );
  if (available.length === 0) return [head];

  let paths = new Array(0);
  let childPerm;
  for (let i = 0; i < available.length; i++) {
    childPerm = Perms(
      head.concat(available[i]),
      available.filter((e) => e !== available[i]),
      minutes - 1 - Distances.get(valve).get(GetValve(available[i]))
    );
    for (let k = 0; k < childPerm.length; k++) {
      paths.push(childPerm[k]);
    }
  }
  return paths;
};
// ############### End of Perms function ###############

let valve;
for (let i = 0; i < PosFlows.length; i++) {
  valve = GetValve(PosFlows[i]);
  Paths = Paths.concat(
    Perms(
      [PosFlows[i]],
      PosFlows.filter((e) => e !== PosFlows[i]),
      TIME - 1 - Distances.get("AA").get(valve)
    )
  );
}

const Switch = (a, b) => [b, a];
// Returns if the given paths are disjoined
const Disjoined = (path1, path2) => {
  if (path2.length > path1.length) [path1, path2] = Switch(path1, path2);
  for (let i = 0; i < path1.length; i++)
    if (path2.includes(path1[i])) return false;
  return true;
};

for (let i = 0; i < Paths.length; i++) {
  ElephantPaths = Paths.filter((path) => Disjoined(path, Paths[i]));

  for (let k = 0; k < ElephantPaths.length; k++) {
    Best = Math.max(
      Best,
      OverallFlow(Paths[i]) + OverallFlow(ElephantPaths[k])
    );
  }
}

console.log("Script took : ", (Date.now() - start) / 1000, " s");
console.log(Best);
