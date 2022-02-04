const fs = require("fs");
require("@nomiclabs/hardhat-web3");

// const common = require('./common')
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
};

task("activateSale", "sets sale state to active").setAction(async () => {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  const nuggContract = getMainContract();
  const salebool = await nuggContract.methods.saleIsActive().call();
  console.log(salebool, "==========> sale is active");
  const [sender] = await ethers.getSigners();
  const walletAddress = sender.address;
  if (!salebool) {
    const gasPrice = await web3.eth.getGasPrice();
    const setGasCosts = await nuggContract.methods
      .flipSaleState()
      .estimateGas({ from: walletAddress });

    console.log(setGasCosts, "gas is....");
    // console.log(gasPrice, "gas price is is....");
    const result = await nuggContract.methods
      .flipSaleState()
      .send({ gas: setGasCosts, from: walletAddress, gasPrice: String(150000000000) });

    console.log("flipping sale state", result);
    return;
  }

  console.warn("Sale was already active");
});

task(
  "setBaseUri",
  "sets base uri so tokenURIs actually mean something in ipfs land"
)
  .addPositionalParam("uri", "ipfs hash normally")
  .setAction(async ({ uri }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
    const nuggContract = getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;
    const gasPrice = await web3.eth.getGasPrice();

    const setResult = await nuggContract.methods
      .setBaseURI(uri)
      .estimateGas({ from: walletAddress });
    console.log(setResult, "how much gas");

    await nuggContract.methods.setBaseURI(uri).send({
      from: walletAddress,
      gas: setResult,
      gasPrice: String(100000000000)
    });

    console.log("setBaseUri complete", setResult);
  });
