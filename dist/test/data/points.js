"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerPubKey_ed25519 = exports.signerPubKey_secp256k1 = exports.signerPrivKey = exports.randomResponses = exports.randomC = exports.idPointY_ed25519 = exports.idPointX_ed25519 = exports.idPoint_ed25519 = exports.idPointY_secp256k1 = exports.idPointX_secp256k1 = exports.idPoint_secp256k1 = exports.publicKeys_ed25519 = exports.publicKeys_secp256k1 = exports.zeroPivateKey = exports.privateKey = void 0;
const src_1 = require("../../src");
const utils_1 = require("../../src/utils");
const curves_1 = require("./curves");
const ed = __importStar(require("../../src/utils/noble-libraries/noble-ED25519"));
const sha512_1 = require("@noble/hashes/sha512");
ed.etc.sha512Sync = (...m) => (0, sha512_1.sha512)(ed.etc.concatBytes(...m));
exports.privateKey = [
    // len = 10
    BigInt("0x" +
        (0, utils_1.hash)("9705133229738916056634998425092693862103756529453934308865022401716")),
    BigInt("0x" +
        (0, utils_1.hash)("4318861583892663632806519796230532373192103809994855662126970712647")),
    BigInt("0x" +
        (0, utils_1.hash)("10579313822749735210413161819590856590862794332884737964405659760314")),
    BigInt("0x" +
        (0, utils_1.hash)("68161763693580201300943912337684944208977417910319730619449844563940")),
    BigInt("0x" +
        (0, utils_1.hash)("8634119974408146311716701391246969535999260973264641793056688235068")),
    BigInt("0x" +
        (0, utils_1.hash)("9113896929353355328784107873437923947336811150190804863481514955668")),
    BigInt("0x" +
        (0, utils_1.hash)("1163688883508814427224876604206982990192180583578734395491607304583")),
    BigInt("0x" +
        (0, utils_1.hash)("7258859556452483793061624179811700710650744725464309019396316674516")),
    BigInt("0x" +
        (0, utils_1.hash)("9414050615748193132357451564295068856153644556595859905926493518530")),
    BigInt("0x" +
        (0, utils_1.hash)("3466046328795217128129578311582509952671098725444443823446053020103")),
];
exports.zeroPivateKey = 0n;
exports.publicKeys_secp256k1 = exports.privateKey.map((privKey) => curves_1.SECP256K1.GtoPoint().mult(privKey));
exports.publicKeys_ed25519 = exports.privateKey.map((key) => {
    return curves_1.ED25519.GtoPoint().mult(ed.utils.getExtendedPublicKey(key.toString(16)).scalar);
});
// invalid points
exports.idPoint_secp256k1 = new src_1.Point(curves_1.SECP256K1, [0n, 0n], false);
exports.idPointX_secp256k1 = new src_1.Point(curves_1.SECP256K1, [0n, 1n], false);
exports.idPointY_secp256k1 = new src_1.Point(curves_1.SECP256K1, [1n, 0n], false);
exports.idPoint_ed25519 = new src_1.Point(curves_1.ED25519, [0n, 0n], false);
exports.idPointX_ed25519 = new src_1.Point(curves_1.ED25519, [0n, 1n], false);
exports.idPointY_ed25519 = new src_1.Point(curves_1.ED25519, [1n, 0n], false);
exports.randomC = 4663621002712304654134267866148565564648521986326001983848741804705428459856n;
exports.randomResponses = [
    // len = 10
    48369350950340794820993823831946226298689742469731910982201300697869810797167n,
    100449888915666473051591594355617005748335101020946797451756200381355427535883n,
    19461404851285363324410789626364457413244489434633287456900091567454654616320n,
    53706853720020248352568631504839791148236861114913686643543396106643678246398n,
    74646179906956108563362909297257464082782829881933463992813659851286428809739n,
    71535436363134726009492680326940110837538521870697878865667548074638456561387n,
    52195487097652879051304573687526354962305495615151447282113947599888977837532n,
    52196047653693565153635186992550383607134727307386493484715442322026234573447n,
    74091150300363372893247715377341913096446778788031541336871110197911481146359n,
    29896340703093012145909022712244181911546003092922234877958412520719305671945n,
];
/* -------------SIGNER KEYS------------- */
exports.signerPrivKey = BigInt("0x" +
    (0, utils_1.hash)("4705133659738916056634998425092693862103756529453934308865022401716"));
exports.signerPubKey_secp256k1 = curves_1.SECP256K1.GtoPoint().mult(exports.signerPrivKey);
exports.signerPubKey_ed25519 = curves_1.ED25519.GtoPoint().mult(ed.utils.getExtendedPublicKey(exports.signerPrivKey.toString(16)).scalar);
