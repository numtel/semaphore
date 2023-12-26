pragma circom 2.1.5;

include "babyjub.circom";
include "poseidon.circom";
include "binary-merkle-root.circom";
include "encrypt.circom";

template Semaphore(MAX_DEPTH) {
    signal input privateKey;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input message;
    signal input scope;
    signal input nonceKey;
    signal input publicKey[2];

    signal output treeRoot, nullifier, ephemeralKey[2], encryptedMessage[2];

    var Ax, Ay;
    (Ax, Ay) = BabyPbk()(privateKey);

    var identityCommitment = Poseidon(2)([Ax, Ay]);

    treeRoot <== BinaryMerkleRoot(MAX_DEPTH)(identityCommitment, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([scope, privateKey]);

    // Encrypted value can only be 32 bits
    var idBits[254] = Num2Bits(254)(identityCommitment);
    var truncatedIdBits[32];
    for(var i = 0; i<32; i++) {
        truncatedIdBits[i] = idBits[i];
    }
    var truncatedIdentity = Bits2Num(32)(truncatedIdBits);

    var encodedIdentity[2];
    encodedIdentity = Encode()(truncatedIdentity);

    (ephemeralKey, encryptedMessage) <== Encrypt()(encodedIdentity, nonceKey, publicKey);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== message * message;
}

