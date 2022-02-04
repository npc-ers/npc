const fs = require("fs");

require("@nomiclabs/hardhat-web3");

const getMainContract = () => {
  const addressesFile =
      __dirname + "/../constants/contracts/contract-address.json";
    const artifactFile = __dirname + "/../constants/contracts/Nuggz.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const artifact = fs.readFileSync(artifactFile);
    const { Nuggz } = JSON.parse(addressJson);
    const { abi } = JSON.parse(artifact);

    const nuggContract = new web3.eth.Contract(abi, Nuggz);
    return nuggContract;
}

exports.getMainContract = getMainContract