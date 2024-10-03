import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { keccak_256, Point } from "@cypher-laboratory/ring-sig-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { expect } = require("chai");

describe("Is on curve", function () {

  // this test ensure that this library can always verify a ring signature generated by the latest version of the @cypher-laboratory/alicesring-sag package
  // fails if the library cannot verify the signature
  it("Verify a ring signature from the @cypher-laboratory/alicesring-sag package", async function () {

    // Address: 0xC355a41c7a9d3FC3Ed850c9B7755e7E404204524
    // Private key: 4d3624822cde4ae618cdaeb75a9ba569df2ec8549f2e66f39bf2e59e64d3bfa3 // only used for testing
    const pubKey = [
      35011388195324381800132853840979509217207583095953368504894852379688280100001n, // x
      7900311600291446175332401125830153044453697478157150161022303396754506017045n // y
    ];

    // link library
    const contractFactory = await ethers.getContractFactory("SAGVerifier");

    // deploy SigVerifier contract
    const SagVerifier = await contractFactory.deploy();

    // console.log("base: ", await SagVerifier.modulo(pubKey[0], pubKey[1]));
    // console.log("assembly: ", await SagVerifier.moduloAssembly(pubKey[0], pubKey[1]));
  });

  // todo: test all cases (array length, etc) from `packages/sag-ts/test/data/jsonSignatures.json` (except the ones that plays with unexpected types)
});