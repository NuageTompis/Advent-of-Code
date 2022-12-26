export const Sum = (a, b) => a + b;

export const xor = (a, b) => {
  return a | b && !a | !b ? true : false;
};

export const Prod = (a, b) => a * b;

export const Sub = (a, b) => a - b;

// To sort an array by ascending order
export const Desc = (a, b) => {
  return b - a;
};
// To sort an array by descending order
export const Asc = (a, b) => {
  return a - b;
};

// Calculates the highest common divider of a and b through Euclide's theorem
export const PGCD = (a, b) => {
  let c;
  while (b != 0) {
    c = b;
    b = a % b;
    a = c;
  }
  return a;
};

// Calculates the smallest common multiple of a and b
export const PPCM = (a, b) => {
  return Math.abs((a * b) / PGCD(a, b));
};

// Given two arrays, return their term-by-term sum
export const ArrSum = (arr1, arr2) => {
  return arr1.map((cur, ind) => cur + arr2[ind]);
};

// Same thing but for the substracion
export const ArrSub = (arr1, arr2) => {
  return arr1.map((cur, ind) => cur - arr2[ind]);
};

// Given two arrays, tells if they have the exact same values
export const Equals = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

// AofA means Array of arrays
export const RemoveDuplicatesOfSortedAofA = (arr) => {
  return arr.filter((array, ind) => {
    if (ind === 0) {
      return true;
    }
    return !Equals(array, arr[ind - 1]);
  });
};

// Returns the permutation array of an array
export const Perms = (arr) => {
  if (arr.length === 1) return arr;
  let perm = new Array(0);
  let childPerm;
  for (let i = 0; i < arr.length; i++) {
    childPerm = Perms(arr.slice(0, i).concat(arr.slice(i + 1)));
    for (let k = 0; k < childPerm.length; k++)
      perm.push([arr[i]].concat(childPerm[k]));
  }
  return perm;
};
