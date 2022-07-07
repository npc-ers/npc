const fs = require("fs");
const path = require("path");

require("@nomiclabs/hardhat-web3");

const getMainContract = () => {
  const addressesFile = path.join(
    __dirname,
    "..",
    "constants",
    "contract-address.json"
  )
  // const artifactFile = __dirname + "/../artifacts/contracts/FourFourFour.sol/FourTest.json";
  const artifactFile = path.join(
    __dirname,
    "..",
    "constants",
    "FourFourFour.json"
  );
  if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first");
    return;
  }

  const addressJson = fs.readFileSync(addressesFile);
  const artifact = fs.readFileSync(artifactFile);
  const { abi } = JSON.parse(artifact);
  const { FourFourFour } = JSON.parse(addressJson)

  const contract = new web3.eth.Contract(
    abi,
    // "0x5FbDB2315678afecb367f032d93F642f64180aa3" // FourTest
    // "0xe2055a8d05b849728f46749ada3af7a020e06f51" // Rinkeby FourFourTest V1
    // "0x9F14986f80b6A1827b63103533a54Fc658AA94B3" // Rinkeby FourFourTest V1
    FourFourFour
  );
  return contract;
};

exports.getMainContract = getMainContract