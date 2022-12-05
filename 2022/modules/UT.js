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
