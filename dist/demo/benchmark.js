"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const fs_1 = __importDefault(require("fs"));
const curve = new src_1.Curve(src_1.CurveName.SECP256K1);
const message = "Hello world !";
const signerPrivKey = 47051336597389160587656532098427095267996634998425092693862103756529453934308865022401716n;
const config = {};
let ring = [];
// create if not exists ./demo/benchmark.json
if (!fs_1.default.existsSync("./demo/benchmark.json")) {
    fs_1.default.writeFileSync("./demo/benchmark.json", JSON.stringify({}));
}
else {
    fs_1.default.writeFileSync("./demo/benchmark.json", JSON.stringify({})); // reset it
}
const timings = [];
for (let i = 1; i < 2001; i += 100) {
    // update ring
    ring = ring.concat(randomRing(i - ring.length));
    // sign
    const init_sign = Date.now();
    const signature = src_1.RingSignature.sign(ring, signerPrivKey, message, curve, config);
    const end_sign = Date.now();
    // verify
    signature.verify();
    const end_verify = Date.now();
    // push timings
    timings.push({
        ringSize: i,
        generation: end_sign - init_sign,
        verification: end_verify - end_sign,
    });
    console.log("ring size: ", i, "\tgeneration timing: ", end_sign - init_sign, "\tverification timing: ", end_verify - end_sign);
}
// save timings
const benchmark = JSON.parse(fs_1.default.readFileSync("./demo/benchmark.json").toString());
timings.forEach((timing) => {
    benchmark[timing.ringSize] = {
        generation: timing.generation,
        verification: timing.verification,
    };
});
fs_1.default.writeFileSync("./demo/benchmark.json", JSON.stringify(benchmark));
function randomRing(size) {
    const ring = [];
    for (let i = 0; i < size; i++) {
        ring.push(curve.GtoPoint().mult((0, src_1.randomBigint)(curve.P)));
    }
    return ring;
}
