/* istanbul ignore file */
import download from "download"
import fs from "fs"
import tmp from "tmp"
import { SnarkArtifacts } from "./types"

export default async function getSnarkArtifacts(treeDepth: number): Promise<SnarkArtifacts> {
    const tmpDir = "semaphore-proof"
    const tmpPath = `${tmp.tmpdir}/${tmpDir}`

    if (!fs.existsSync(tmpPath)) {
        tmp.dirSync({ name: tmpDir })

        await download(`https://config.clonk.me/semaphore-decryptable-dev/${treeDepth}/semaphore.wasm`, tmpPath)
        await download(`https://config.clonk.me/semaphore-decryptable-dev/${treeDepth}/semaphore.zkey`, tmpPath)
    }

    return {
        wasmFilePath: `${tmpPath}/semaphore.wasm`,
        zkeyFilePath: `${tmpPath}/semaphore.zkey`
    }
}
