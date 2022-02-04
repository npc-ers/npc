require("@nomiclabs/hardhat-waffle");

require("./tasks/faucet");
require("./tasks/launch");
require("./tasks/mintTokens");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
// const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts

// NOTE: THIS IS AN EMPTY ACCOUNT. IT HAS SOME ETH IN RINKEBY
const PRIVATE_KEY = process.env.ETH_KEY || '279de438a6c02e3f790414b6124d53245557861adc0ee6253f5cebf6d6a55472'

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PROD_KEY = process.env.ALCHEMY_PROD_KEY;

module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${PROD_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};
