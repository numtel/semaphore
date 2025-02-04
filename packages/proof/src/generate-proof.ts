import { BigNumber } from "@ethersproject/bignumber"
import { BytesLike, Hexable } from "@ethersproject/bytes"
import { Group } from "@semaphore-protocol/group"
import type { Identity } from "@semaphore-protocol/identity"
import { NumericString, prove } from "@zk-kit/groth16"
import { encrypt } from "ec-elgamal-circom/src";
import { encode } from "ec-elgamal-circom/utils/encode";
import getSnarkArtifacts from "./get-snark-artifacts.node"
import hash from "./hash"
import packProof from "./pack-proof"
import { SemaphoreProof, SnarkArtifacts } from "./types"

/**
 * Generates a Semaphore proof.
 * @param identity The Semaphore identity.
 * @param group The Semaphore group or its Merkle proof.
 * @param scope The external nullifier.
 * @param message The Semaphore signal.
 * @param treeDepth The depth of the tree with which the circuit was compiled.
 * @param snarkArtifacts The SNARK artifacts.
 * @returns The Semaphore proof ready to be verified.
 */
export default async function generateProof(
    identity: Identity,
    group: Group,
    message: BytesLike | Hexable | number | bigint,
    scope: BytesLike | Hexable | number | bigint,
    publicKey: any,
    treeDepth?: number,
    snarkArtifacts?: SnarkArtifacts
): Promise<SemaphoreProof> {
    const leafIndex = group.indexOf(identity.commitment)
    const merkeProof = group.generateMerkleProof(leafIndex)
    const merkleProofLength = merkeProof.siblings.length

    treeDepth ??= merkleProofLength

    // If the Snark artifacts are not defined they will be automatically downloaded.
    /* istanbul ignore next */
    if (!snarkArtifacts) {
        snarkArtifacts = await getSnarkArtifacts(treeDepth)
    }

    // The index must be converted to a list of indices, 1 for each tree level.
    // The missing siblings can be set to 0, as they won't be used in the circuit.
    const treeIndices = []
    const treeSiblings = merkeProof.siblings

    for (let i = 0; i < treeDepth; i += 1) {
        treeIndices.push((merkeProof.index >> i) & 1)

        if (treeSiblings[i] === undefined) {
            treeSiblings[i] = "0"
        }
    }


    // Encrypted value can only be 32 bits
    const identityCommitment = BigInt(identity.commitment) & 0xFFFFFFFFn;
    const encodedMsg = encode(identityCommitment);
    const encryption = encrypt(publicKey, encodedMsg);

    const { proof, publicSignals } = await prove(
        {
            privateKey: identity.secretScalar,
            treeDepth: merkleProofLength,
            treeIndices,
            treeSiblings,
            scope: hash(scope),
            message: hash(message),
            nonceKey: encryption.nonce,
            publicKey: [
                publicKey.x,
                publicKey.y
            ],
        },
        snarkArtifacts.wasmFilePath,
        snarkArtifacts.zkeyFilePath
    )

    return {
        treeRoot: publicSignals[0],
        nullifier: publicSignals[1],
        message: BigNumber.from(message).toString() as NumericString,
        scope: BigNumber.from(scope).toString() as NumericString,
        decryptables: [
          publicSignals[2],
          publicSignals[3],
          publicSignals[4],
          publicSignals[5],
          publicKey.x.toString(),
          publicKey.y.toString(),
        ],
        proof: packProof(proof)
    }
}
