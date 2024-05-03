"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const points_1 = require("./points");
const curves_1 = require("./curves");
const ringSignature = src_1.RingSignature.sign(points_1.publicKeys_secp256k1, 7069703747800168800841771186958206142862606681731919084257487194227631820455n, "hello world", curves_1.SECP256K1);
console.log(ringSignature.toBase64());
