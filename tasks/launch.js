const fs = require("fs");
const path = require("path");
require("@nomiclabs/hardhat-web3");

// const common = require('./common')
const getMainContract = () => {
  const addressesFile =
    __dirname + "/../constants/contracts/contract-address.json";
  // const artifactFile = __dirname + "/../artifacts/contracts/FourFourFour.sol/FourTest.json";
  const artifactFile = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "FourFourFour.sol",
    "Four44Test.json"
  );
  // if (!fs.existsSync(addressesFile)) {
  //   console.error("You need to deploy your contract first");
  //   return;
  // }

  // const addressJson = fs.readFileSync(addressesFile);
  const artifact = fs.readFileSync(artifactFile);
  const { abi } = JSON.parse(artifact);

  const contract = new web3.eth.Contract(
    abi,
    // "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    "0xe2055a8d05b849728f46749ada3af7a020e06f51"
  );
  return contract;
};

task("flipPremint", "opensStore").setAction(async (taskArgs) => {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const store = getMainContract();
  const salebool = await store.methods.presaleIsActive().call();
  console.log(salebool, "==========> presale is open");

  // if (taskArgs.close && !salebool) {
  //   console.warn("Store is already closed!");
  //   return;
  // }

  const [sender] = await ethers.getSigners();
  const walletAddress = sender.address;

  const gasPrice = await web3.eth.getGasPrice();
  const setGasCosts = await store.methods
    .flipPremintState()
    .estimateGas({ from: walletAddress });

  console.log(setGasCosts, "gas is....");
  const result = await store.methods.flipPremintState().send({
    gas: setGasCosts,
    from: walletAddress,
    gasPrice,
  });

  console.log("Opening Store", result);
});

task("openStore", "flips store open state").setAction(async ({ close, open }) => {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  try {
    const store = getMainContract();

    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;
    console.log(walletAddress, walletAddress)
    const provider = ethers.getDefaultProvider("https://eth-rinkeby.alchemyapi.io/v2/j0lSD1_wDvtdG-YYUzT_Tceh_95VITDI")
    const { chainId } = await provider.getNetwork()
    console.log(chainId, "provider")
    
    const salebool = await store.methods.storeIsOpen().call();
    console.log(salebool, "==========> store is open");    

    const gasPrice = await web3.eth.getGasPrice();
    const setGasCosts = await store.methods
      .flipStoreIsOpen()
      .estimateGas({ from: walletAddress });

    console.log(setGasCosts, "<============= gas is");
    const wantsToClose = salebool && close;
    const wantsToOpen = !salebool && open;

    // if (wantsToClose || wantsToOpen) {
      const result = await store.methods.flipStoreIsOpen().send({
        gas: setGasCosts,
        from: walletAddress,
        gasPrice: String(150000000000),
      });
      console.log(`${wantsToOpen ? "Opening Store" : "ClosingStore"}`, result);
    // } else {
    //   console.warn("Are you sure? It's already in the state you want it in");
    // }
  } catch (error) {
    console.error(error);
  }
});

task("activateSale", "sets sale state to active").setAction(async () => {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  const store = getMainContract();
  const salebool = await store.methods.saleIsActive().call();
  console.log(salebool, "==========> sale is active");
  const [sender] = await ethers.getSigners();
  const walletAddress = sender.address;

  if (!salebool) {
    const gasPrice = await web3.eth.getGasPrice();
    const setGasCosts = await store.methods
      .flipSaleState()
      .estimateGas({ from: walletAddress });

    console.log(setGasCosts, "gas is....");
    // console.log(gasPrice, "gas price is is....");
    const result = await store.methods.flipSaleState().send({
      gas: setGasCosts,
      from: walletAddress,
      gasPrice: String(150000000000),
    });

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
    const store = getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;
    const gasPrice = await web3.eth.getGasPrice();

    const setResult = await store.methods
      .setBaseURI(uri)
      .estimateGas({ from: walletAddress });

    console.log(setResult, "how much gas");

    await store.methods.setBaseURI(uri).send({
      from: walletAddress,
      gas: setResult,
      gasPrice,
    });

    console.log("setBaseUri complete", setResult);
  });

task("whitelist", "adds a user to the whitelist").setAction(async () => {
  // TODO: read a csv row by row + append them to a list
  // https://c2fo.github.io/fast-csv/docs/introduction/getting-started/

  const addresses = ["0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"];
  const [sender] = await ethers.getSigners();
  const walletAddress = sender.address;
  const store = getMainContract();

  const gas = await store.methods.whitelistAddress(addresses).estimateGas({
    from: walletAddress,
  });
  const gasPrice = await web3.eth.getGasPrice();

  const res = await store.methods.whitelistAddress(addresses).send({
    gas,
    from: walletAddress,
    gasPrice,
  });
  console.log(res);
});
