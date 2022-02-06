<script>
  console.log("SVELTE IS RUNNING");
  import {
  defaultEvmStores,
  makeContractStore,
  selectedAccount,
  web3
  } from "svelte-web3";
  import * as contractJson from "../artifacts/contracts/FourFourFour.sol/Four44Test.json";

  // const rbyDeploy = "0x467FD970C1F33b6f95641f95018301D3427D81FA"
  const rbyDeploy = "0xE2055A8D05B849728f46749AdA3AF7A020E06F51";
  const store = makeContractStore(contractJson.abi, rbyDeploy);

  defaultEvmStores.setProvider();

  const errMap = {
    store: "Store isn't open yet",
    whitelist: "You must be on the white list",
    Premint: "Preminting is not open!",
    notEnough: "It looks like you don't have enough ETH to cover your mint, please add more to your balance before trying again."
  };

  async function handleClick(number = 1) {
    try {
      console.log("444 activated!");
      const balance = await $web3.eth.getBalance($selectedAccount);
      console.log(balance, "BALANCE");
      const price = await $store.methods.salePrice().call();
      console.log(price, "PRICE IS");
      if (balance < price * number) {
        alert("You need more ETH!");
        return;
      }

      const gasAmount = await $store.methods
        .mainSaleMint(1)
        .estimateGas({ from: $selectedAccount, value: price });

      const gasPrice = await $web3.eth.getGasPrice();
      // could estimate gas here

      $store.methods
        .mainSaleMint(1)
        .send({
          from: $selectedAccount,
          value: price,
        })
        .on("transactionHash", function (hash) {
          alert("You just minted!");
        })
        .on("error", function (error) {
          if (error.code === 4001) {
            alert("You denied the transaction");
          }
        });
    } catch (e) {
      let errMessage;
      if (e.message.includes("Store")) {
        errMessage = errMap.store;
      }

      if (e.message.includes("whitelist")) {
        errMessage = errMap.whitelist;
      }

      if (e.message.includes("Preminting")) {
        errMessage = errMap.Premint;
      }

      if (e.message.includes("insufficient funds")) {
        errMessage = errMap.notEnough
      }

      alert(errMessage || "We ran into an error. Please let us know!");
      console.log(e)
    }
  }
</script>

<button on:click={handleClick}>
  <div class="card-img mbr-figure">
    <img src="assets/images/all-together-1408x807.png" alt="StartMinting" />
  </div>
</button>

<style></style>
