import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import { config as dotenvConfig } from "dotenv"
import "hardhat-gas-reporter"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import "solidity-coverage"
import { config } from "./package.json"
import "./tasks/accounts"
import "./tasks/deploy-semaphore"

dotenvConfig({ path: resolve(__dirname, "../../.env") })

function getNetworks(): NetworksUserConfig {
    if (!process.env.BACKEND_PRIVATE_KEY) {
        return {}
    }

    const infuraApiKey = process.env.INFURA_API_KEY
    const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`]

    return {
        goerli: {
            url: `https://goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 5,
            accounts
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
            chainId: 11155111,
            accounts
        },
        holesky: {
            url: `https://ethereum-holesky.publicnode.com/`,
            chainId: 17000,
            accounts
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${infuraApiKey}`,
            chainId: 80001,
            accounts
        },
        "optimism-goerli": {
            url: `https://optimism-goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 420,
            accounts
        },
        "arbitrum-goerli": {
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: 421613,
            accounts
        },
        arbitrum: {
            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
            accounts
        }
    }
}

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        ...getNetworks()
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        outDir: config.paths.build.typechain,
        target: "ethers-v5"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
        customChains: [
          {
            network: "holesky",
            chainId: 17000,
            urls: {
              apiURL: "https://api-holesky.etherscan.io/api",
              browserURL: "https://holesky.etherscan.io"
            }
          }
        ]
    }
}

export default hardhatConfig
