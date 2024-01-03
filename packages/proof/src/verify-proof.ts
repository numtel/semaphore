import { verify } from "@zk-kit/groth16"
import { SemaphoreProof } from "./types"
import unpackProof from "./unpack-proof"
// Generate keys using:
// $ yarn workspace @semaphore-protocol/circuits setup
// Copy from packages/circuits/build/semaphore/groth16_vkey.json
import verificationKeys from "./verification-keys.json"
import hash from "./hash"

/**
 * Verifies a Semaphore proof.
 * @param fullProof The SnarkJS Semaphore proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verifyProof({ treeRoot, nullifier, message, scope, decryptables, proof }: SemaphoreProof): Promise<boolean> {
    // TODO: support all tree depths after trusted-setup.
    // if (treeDepth < 1 || treeDepth > 32) {
    // throw new TypeError("The tree depth must be a number between 1 and 32")
    // }

    const verificationKey = {
        ...verificationKeys,
//         vk_delta_2: verificationKeys.vk_delta_2[0],
//         IC: verificationKeys.IC[0]
    }

    return verify(verificationKey, {
        publicSignals: [
          treeRoot,
          nullifier,
          decryptables[0],
          decryptables[1],
          decryptables[2],
          decryptables[3],
          hash(message),
          hash(scope),
          decryptables[4].toString(),
          decryptables[5].toString(),
        ],
        proof: unpackProof(proof)
    })
}
