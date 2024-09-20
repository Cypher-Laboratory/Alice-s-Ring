// SPDX-License-Identifier: MIT
// Developed by Cypher Lab (https://www.cypherlab.org/)

// see https://github.com/Cypher-Laboratory/evm-verifier // todo: updat to new repo url

pragma solidity ^0.8.20;

interface ISAGVerifier {
    function verifyRingSignature(
        uint256 message,
        uint256[] memory ring,
        uint256[] memory responses,
        uint256 c
    ) external view returns (bool);
}
