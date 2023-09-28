"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ringSignature_1 = require("./ringSignature");
const utils_1 = require("./utils");
const privKey = 4663621002712304654134267866148565564648521986326001983848741804705428459856n;
const priv = [
    926127015555093326973908533125539491652580295586299699713181342559458121060n,
    2438507748444926500156175360028991153775555588115231615964478554901831554097n,
    4926464100658056745662829013300371983107822721580264728347596278899076719892n,
];
const ring = [
    new utils_1.Point(utils_1.Curve.ED25519, new utils_1.Point(utils_1.Curve.ED25519, [1n, 2n])
        .mult(priv[0])
        .toAffine()),
    new utils_1.Point(utils_1.Curve.ED25519, new utils_1.Point(utils_1.Curve.ED25519, [1n, 2n])
        .mult(priv[1])
        .toAffine()),
    new utils_1.Point(utils_1.Curve.ED25519, new utils_1.Point(utils_1.Curve.ED25519, [1n, 2n])
        .mult(priv[2])
        .toAffine()),
];
const signature = ringSignature_1.RingSignature.sign(ring, privKey, "message", utils_1.Curve.ED25519);
console.log(signature.verify());
// const a = 2n;
// const G = new Point(Curve.ED25519, ED25519.G);
// console.log("2*G: ", G.mult(a).x);
// console.log("G+G: ", G.add(G).x);
// const double = ExtendedPoint.fromAffine({
//   x: G.x,
//   y: G.y,
// });
// console.log("double G: ", double.double().x);
