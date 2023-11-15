"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const errors_1 = require("../../src/errors");
const secp256k1 = new src_1.Curve(src_1.CurveName.SECP256K1);
const ed25519 = new src_1.Curve(src_1.CurveName.ED25519);
/**
 * Test the Curve.fromString() method
 *
 * test if:
 * - the method returns a valid curve object
 * - the method throw if the curve is not supported
 */
describe("Test fromString()", () => {
    it("Should return a valid curve object - secp256k1", () => {
        const strCurve = 
        // eslint-disable-next-line max-len
        '{"curve":"SECP256K1","Gx":"55066263022277343669578718895168534326250603453777594175500187360389116729240","Gy":"32670510020758816978083085130507043184471273380659243275938904335757337482424","N":"115792089237316195423570985008687907852837564279074904382605163141518161494337","P":"115792089237316195423570985008687907853269984665640564039457584007908834671663"}';
        expect(src_1.Curve.fromString(strCurve).name).toBe(secp256k1.name);
    });
    it("Should return a valid curve object - ed25519", () => {
        const strCurve = 
        // eslint-disable-next-line max-len
        '{"curve":"ED25519","Gx":"15112221349535400772501151409588531511454012693041857206046113283949847762202","Gy":"46316835694926478169428394003475163141307993866256225615783033603165251855960","N":"7237005577332262213973186563042994240857116359379907606001950938285454250989","P":"57896044618658097711785492504343953926634992332820282019728792003956564819949"}';
        expect(src_1.Curve.fromString(strCurve).name).toBe(ed25519.name);
    });
    it("Should throw if the curve is not supported", () => {
        const strCurve = 
        // eslint-disable-next-line max-len
        '{"curve":"NO_CURVE","Gx":"55066263022277343669578718895168534326250603453777594175500187360389116729240","Gy":"32670510020758816978083085130507043184471273380659243275938904335757337482424","N":"115792089237316195423570985008687907852837564279074904382605163141518161494337","P":"115792089237316195423570985008687907853269984665640564039457584007908834671663"}';
        expect(() => src_1.Curve.fromString(strCurve)).toThrow((0, errors_1.unknownCurve)("NO_CURVE"));
    });
});
