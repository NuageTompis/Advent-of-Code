export const Sum = (a, b) => {
  return a + b;
};

export const xor = (a, b) => {
  return a | b && !a | !b ? true : false;
};

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
  let l = arr1.length;
  if (arr2.length !== l) {
    return false;
  }
  let keep = true;
  for (let i = 0; i < l; i++) {
    if (arr1[i] !== arr2[i]) {
      keep = false;
    }
  }
  return keep;
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
