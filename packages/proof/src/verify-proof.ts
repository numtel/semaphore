import { verify } from "@zk-kit/groth16"
import { SemaphoreProof } from "./types"
import unpackProof from "./unpack-proof"
import verificationKeys from "./verification-keys.json"
import hash from "./hash"

/**
 * Verifies a Semaphore proof.
 * @param fullProof The SnarkJS Semaphore proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verifyProof({ treeRoot, nullifier, message, scope, publicKey, ephemeralKey, encryptedMessage, proof }: SemaphoreProof): Promise<boolean> {
    // TODO: support all tree depths after trusted-setup.
    // if (treeDepth < 1 || treeDepth > 32) {
    // throw new TypeError("The tree depth must be a number between 1 and 32")
    // }

    const verificationKey = {
        ...verificationKeys,
        vk_delta_2: verificationKeys.vk_delta_2[0],
        IC: verificationKeys.IC[0]
    }

    return verify(verificationKey, {
        publicSignals: [
          treeRoot,
          nullifier,
          ephemeralKey[0],
          ephemeralKey[1],
          encryptedMessage[0],
          encryptedMessage[1],
          hash(message),
          hash(scope),
          publicKey.x.toString(),
          publicKey.y.toString(),
        ],
        proof: unpackProof(proof)
    })
}
