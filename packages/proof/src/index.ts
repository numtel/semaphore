import generateProof from "./generate-proof"
import getSnarkArtifacts from "./get-snark-artifacts.node"
import packProof from "./pack-proof"
import unpackProof from "./unpack-proof"
import verifyProof from "./verify-proof"
import { genPubKey, genKeypair, genPrivKey } from "ec-elgamal-circom/src";

export * from "./types"
export {
  generateProof,
  getSnarkArtifacts,
  packProof,
  unpackProof,
  verifyProof,
  genPubKey,
  genKeypair,
  genPrivKey
}
