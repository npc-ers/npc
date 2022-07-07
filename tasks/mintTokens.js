const fs = require("fs");

require("@nomiclabs/hardhat-web3");
const common = require("./common");

task("totalSupply", "gets total supply").setAction(async () => {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const nuggContract = common.getMainContract();
  const [sender] = await ethers.getSigners();
  const walletAddress = sender.address;

  try {
    const supply = await nuggContract.methods.totalSupply().call();

    console.log(supply, "supply");
  } catch (error) {
    console.error(error, "error");
  }
});

task("withdraw", "runs the withdraw function on smart contract").setAction(
  async () => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const contract = common.getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;

    try {
      const result = await contract.methods
        .withdrawAll()
        .estimateGas({ from: walletAddress, gas: String(20766766) });

      console.log(result);

      await contract.methods.withdrawAll().send({
        from: walletAddress,
        gas: result,
      });

      console.log("withdraw complete ===================");
    } catch (error) {
      console.error(error, "error");
    }
  }
);

task("reserveNuggz", "reserves founder nuggz")
  .addPositionalParam(
    "receiver",
    "The founder's address that will receive them"
  )
  .setAction(async ({ receiver }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const nuggContract = common.getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;

    try {
      const supply = await nuggContract.methods.totalSupply().call();
      const gasPrice = await web3.eth.getGasPrice()

      console.log(supply, "total supply is", gasPrice);
      const setGasCosts = await nuggContract.methods
        .reserveNuggz(receiver)
        .estimateGas({ from: walletAddress, gas: gasPrice });

      console.log(setGasCosts, "costs");
      const setNuggResults = await nuggContract.methods
        .reserveNuggz(receiver)
        .send({ from: walletAddress, gas: String(setGasCosts), gasPrice });

      console.log(setNuggResults, "results");
    } catch (error) {
      console.error(error, "error");
    }
  });

task("setTokenURIsForSupply", "sets token uris to default value")
  .addPositionalParam("receiver", "The address that will receive them")
  .addPositionalParam("supplyStart", "Last revealed tokenId")
  .setAction(async ({ receiver, supplyStart = 0 }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const nuggContract = common.getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;

    const totalSupply = await nuggContract.methods.totalSupply().call();

    for (let id = 0; id < totalSupply; id++) {
      const metaData = await nuggContract.methods.tokenURI(id).call();
      console.log(metaData, "CURRENT METADATA");

      // TODO: minting a token should upload metadata to ipfs and then use that url here
      const setUriGasCosts = await nuggContract.methods
        ._setTokenURI(
          Number(id),
          "QmcStFUAvarpqjn8tHnM1UQfiBaLtsDRGQRaSq11fJMTK5"
        )
        .estimateGas({ from: walletAddress });

      const setUriResult = await nuggContract.methods
        ._setTokenURI(
          Number(id),
          "QmcStFUAvarpqjn8tHnM1UQfiBaLtsDRGQRaSq11fJMTK5"
        )
        .send({ from: walletAddress, gas: String(setUriGasCosts) });
    }

    console.log(totalSupply, "======> TOKENS OWNED");
    // Should also pin to ipfs with metadata
    // console.log(contract, '======================')
  });

task("setRevealedTokenURIs", "sets token uris to default value")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const nuggContract = common.getMainContract();
    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;

    // get a list of all tokens
    // array of totalSupply length indexed from 0
    const tokensOfOwner = await nuggContract.methods.totalSupply().call();

    for (let id = 0; id < tokensOfOwner; id++) {
      const metaData = await nuggContract.methods.tokenURI(id).call();
      console.log(metaData, "CURRENT METADATA");

      // TODO: minting a token should upload metadata to ipfs and then use that url here
      const URI = "QmUfzQRRSLMXMxxkiX6Gag7ZmP7fFaXGo3ANQ6kMrK1bqL";
      const setUriGasCosts = await nuggContract.methods
        .setTokenURI(Number(id), URI)
        .estimateGas({ from: walletAddress });

      const setUriResult = await nuggContract.methods
        .setTokenURI(Number(id), URI)
        .send({ from: walletAddress, gas: String(setUriGasCosts) });
    }

    console.log(tokensOfOwner, "======> TOKENS OWNED");
  });

task("mintTokens", "Mints tokens and pins picture data to ipfs")
  .addPositionalParam("receiver", "The address that will receive them")
  .addPositionalParam("numberNuggs", "Number to mint")
  .setAction(async ({ receiver, numberNuggs }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

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

    if ((await ethers.provider.getCode(Nuggz)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const nuggContract = new web3.eth.Contract(abi, Nuggz);

    const salebool = await nuggContract.methods.saleIsActive().call();
    const nuggPrice = await nuggContract.methods.nuggPrice().call();
    console.log(salebool, "======> sale is active");

    if (!salebool) {
      await nuggContract.methods.flipSaleState().call();
      console.log("flipping sale state");
      return;
    }

    const [sender] = await ethers.getSigners();
    const walletAddress = sender.address;
    const balance = await web3.eth.getBalance(walletAddress);

    console.log(balance, "======> balance maybe can send");

    const price = Number(nuggPrice) * numberNuggs;

    const gasAmount = await nuggContract.methods
      .mintNuggz(numberNuggs)
      .estimateGas({ from: walletAddress, value: price });

    console.log(gasAmount, "estimated gas==========");
    const tx = await nuggContract.methods
      .mintNuggz(numberNuggs)
      .send({ from: walletAddress, value: price, gas: String(gasAmount) })
      .on("transactionHash", function (hash) {
        console.log("^^^^^^^^^^^^^^^^^^^^^^ transactionHash", hash);
      });

    console.log("done???");
  });
