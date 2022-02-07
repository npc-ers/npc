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
const PRIVATE_KEY = process.env.ETH_KEY || '0d09094037c745d98db8114057cd3f8addb423e8adbe209620148b19f6f9875e'
'0d09094037c745d98db8114057cd3f8addb423e8adbe209620148b19f6f9875e'

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PROD_KEY = process.env.ALCHEMY_PROD_KEY;

module.exports = {
  solidity: "0.7.3",
  networks: {
    local: {
      chainId: 1337,
      url: "http://127.0.0.1:8545",
      // Deployments + faucet
      accounts: [`0x${PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      chainId: 4,
      // url: `https://eth-rinkeby.alchemyapi.io/v2/j0lSD1_wDvtdG-YYUzT_Tceh_95VITDI`,
      url: `https://eth-rinkeby.alchemyapi.io/v2/5ExNsOhwN0GXiubHE5zyXIoPCNnHmJK0`,
      accounts: [PRIVATE_KEY],
      gas: 210000000000,
      gasPrice: 80000000000000 
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${PROD_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};
