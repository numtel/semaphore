/* istanbul ignore file */
import { SnarkArtifacts } from "./types"

export default async function getSnarkArtifacts(treeDepth: number): Promise<SnarkArtifacts> {
    return {
        wasmFilePath: `https://config.clonk.me/semaphore-decryptable-dev/${treeDepth}/semaphore.wasm`,
        zkeyFilePath: `https://config.clonk.me/semaphore-decryptable-dev/${treeDepth}/semaphore.zkey`
    }
}
