<script>
  import { onMount } from "svelte";
  import {
  connected,defaultEvmStores,
  makeContractStore,
  selectedAccount,web3
  } from "svelte-web3";
  import * as addressJson from "../constants/contract-address.json";
  import * as contractJson from "../constants/FourFourFour.json";
  let count = 0;

  // const rbyDeploy = "0x467FD970C1F33b6f95641f95018301D3427D81FA"
  // const rbyDeploy = "0xE2055A8D05B849728f46749AdA3AF7A020E06F51";
  const rbyDeploy = addressJson["FourFourFour"];
  const store = makeContractStore(contractJson.abi, rbyDeploy);

  // defaultEvmStores.setProvider('https://eth-rinkeby.alchemyapi.io/v2/j0lSD1_wDvtdG-YYUzT_Tceh_95VITDI')

  const errMap = {
    store: "Store isn't open yet",
    whitelist: "You must be on the white list",
    Premint: "Preminting is not open!",
    Sale: "We haven't opened minting yet",
    notEnough:
      "It looks like you don't have enough ETH to cover your mint, please add more to your balance before trying again.",
  };

  const dateNow = Date.now();
  const countDownDate = new Date("Feb 8, 2022 15:00:00").getTime();

  function handleDc() {
    defaultEvmStores.disconnect()
  }

  function handleConnect() {
    defaultEvmStores.setProvider()
  }

  function handleNav() {
    window.location = "/mint";
  }

  async function handleClickSale() {
    // alert("Not ready yet!")
    // return
    try {
      // console.log("444 activated!");
      const network = await $web3.eth.net.getId();
      // console.log(network, "NETWORK");

      const balance = await $web3.eth.getBalance($selectedAccount);
      // console.log(balance, "BALANCE");
      const price = await $store.methods.salePrice().call();
      // console.log(price, "PRICE IS");
      if (balance < price * count) {
        alert("You need more ETH!");
        return;
      }

      const gasAmount = await $store.methods
        .mainSaleMint(count)
        .estimateGas({ from: $selectedAccount, value: price });

      const gasPrice = await $web3.eth.getGasPrice();
      // could estimate gas here

      $store.methods
        .mainSaleMint(count)
        .send({
          from: $selectedAccount,
          value: price,
          gasAmount,
          gasPrice,
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

      if (e.message.includes("Sale")) {
        errMessage = errMap.Sale;
      }

      if (e.message.includes("insufficient funds")) {
        errMessage = errMap.notEnough;
      }

      if (String(e).includes("Returned values aren't valid")) {
        errMessage =
          "You might be on the wrong network! Make sure you are connected to mainnet!";
      }

      alert(
        errMessage ||
          "Hmm. We ran into an error we didn't recognize. Please let us know"
      );
      // console.log(e)
      // console.log("bye")
    }
  }
  async function handleClick() {
    if (count === 0) {
      alert("You need to mint at least one");
      return
    }

    return
    try {
      // console.log("444 activated!");
      const network = await $web3.eth.net.getId();
      // console.log(network, "NETWORK");

      const balance = await $web3.eth.getBalance($selectedAccount);
      // console.log(balance, "BALANCE");
      const price = await $store.methods.premintPrice().call();
      // console.log(price, "PRICE IS");
      if (balance < price * count) {
        alert("You need more ETH!");
        return;
      }

      const gasAmount = await $store.methods
        .presaleMint(count)
        .estimateGas({ from: $selectedAccount, value: price * count });

      const gasPrice = await $web3.eth.getGasPrice();
      // could estimate gas here

      $store.methods
        .presaleMint(count)
        .send({
          from: $selectedAccount,
          value: price * count,
          gasAmount,
          gasPrice,
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

      if (e.message.includes("Sale")) {
        errMessage = errMap.Sale;
      }

      if (e.message.includes("insufficient funds")) {
        errMessage = errMap.notEnough;
      }

      if (String(e).includes("Returned values aren't valid")) {
        errMessage =
          "You might be on the wrong network! Make sure you are connected to mainnet!";
      }

      alert(
        errMessage ||
          "Hmm. We ran into an error we didn't recognize. Please let us know and confirm your wallet is connected!"
      );
      // console.log(e)
      // console.log("bye")
    }
  }

  onMount(() => {
    console.log("setting up dapp")
    // defaultEvmStores.setProvider();
  });


</script>

{#if !$connected}
<p>My application is not yet connected</p>
<button on:click={handleConnect}>Connect</button>

{:else}
<p>Connected to dapp</p>
<button on:click={handleDc}>Disconnect</button>
{/if}

<style>
</style>
