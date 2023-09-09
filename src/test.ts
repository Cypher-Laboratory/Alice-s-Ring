import { G, randomBigint } from "./utils";

const k =
  randomBigint(
    9999999999999999999999999555555555555555555555555555555555555555555555555555555555n,
  );
console.log(k);

const x = k * G[0];
const y = k * G[1];

console.log(x * x * x + 7n === y * y);
