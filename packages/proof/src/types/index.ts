import type { NumericString } from "@zk-kit/groth16"

export type BigNumberish = string | number | bigint

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}

export type SemaphoreProof = {
    treeRoot: NumericString
    message: NumericString
    nullifier: NumericString
    scope: NumericString
    decryptables: Decryptables
    proof: PackedProof
}

export type Decryptables = [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
]

export type PackedProof = [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
]
