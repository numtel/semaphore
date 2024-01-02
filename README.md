# Semaphore v4 + decryptable

This is a fork of [Semaphore v4](https://github.com/semaphore-protocol/semaphore/tree/feat/semaphore-v4/) with the proofs able to be decrypted by a single private key using [stark-friendly asymmetric ElGamal encryption](https://github.com/Shigoto-dev19/ec-elgamal-circom).

### Deployed Contracts

Network | Contract
--------|-----------
Holesky | [0x3957e9872985b8450b41566b4104006a1969cf1c](https://holesky.etherscan.io/address/0x3957e9872985b8450b41566b4104006a1969cf1c)

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/numtel/semaphore.git
```

And install the dependencies:

```bash
cd semaphore && git checkout feat/semaphore-v4-decryptable && yarn
```

> Compiling the circuit requires using a [modified Circom compiler](https://github.com/iden3/circom/pull/226).

### Build libraries & compile contracts

Run [Rollup](https://www.rollupjs.org) to build all the packages:

```bash
yarn build:libraries
```

Compile the smart contracts with [Hardhat](https://hardhat.org/):

```bash
yarn compile:contracts
```

### Testing

Run [Jest](https://jestjs.io/) to test the JS libraries:

```bash
yarn test:libraries
```

Run [Mocha](https://mochajs.org/) to test the contracts:

```bash
yarn test:contracts
```

Or test everything with:

```bash
yarn test
```
