require("@nomiclabs/hardhat-web3");
// This is a script for deploying your contracts. You can adapt it to deploy
const fs = require("fs");
// yours, or create new ones.
const PROJECT_NAME = "Nuggz"
const common = require("../tasks/common");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(deployer)
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const artifactFile = __dirname + "/../artifacts/contracts/FourFourFour.sol/Four44Test.json";
  const artifact = fs.readFileSync(artifactFile);
  const { bytecode, abi } = JSON.parse(artifact);

  const contract = new web3.eth.Contract(abi);

  let options = {
      arguments: [],
      data: bytecode
  }

  const gasPrice = await web3.eth.getGasPrice()
  console.log(gasPrice, "gas is...")
  const estimatedGas = await contract.deploy(options).estimateGas({ from: deployer.address });
  console.log(estimatedGas)
  console.log("-----------> Deploying", deployer.address)
  const deployedObj = await contract.deploy(options).send({ from: deployer.address, gas: estimatedGas, gasPrice });
  console.log(deployedObj)
  console.log("---------------> Making Deployment Object")
  console.log("----------------------------------> DEPLOYED MOTHER FATHER GENTLEMAN")
  console.log("project address:", deployedObj._address);

  // // We also save the contract's artifacts and address in the frontend directory
  // saveFrontendFiles(deployedObj);
}

function saveFrontendFiles(project) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../constants/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ [PROJECT_NAME]: project.address }, undefined, 2)
  );

  const projectArtifact = artifacts.readArtifactSync(PROJECT_NAME);

  fs.writeFileSync(
    contractsDir + `/${PROJECT_NAME}.json`,
    JSON.stringify(projectArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
