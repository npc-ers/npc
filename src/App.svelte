<script>
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { confirmToast, failToast } from './Toasts';
  import {
    connected,
    defaultEvmStores,
    makeContractStore,
    selectedAccount,
    web3,
  } from "svelte-web3";
  import * as contractJson from "../constants/npc.json";

  const testnetDeploy = "0xe989b867D924C231894d6Ce0ce29F1F3cAAc9A03";
  const store = makeContractStore(contractJson.abi, testnetDeploy);
  const options = {};
  const UNKNOWN_ERROR_MSG = "Hmm. We ran into an error we didn't recognize. Please let us know";
  let connectedNetwork = undefined;
  
  function handleDc() {
    defaultEvmStores.disconnect();
  }

  function handleConnect() {
    defaultEvmStores.setProvider();
  }

  function cleanHash(hash) {
    return (hash.substring(0,5) + "..." + hash.substring(hash.length-5, hash.length));
  }

  function createHashLinkedMessage(hash) {
    let link = '';
    switch (connectedNetwork){
      case 4:
        link = 'https://rinkeby.etherscan.io/tx/';
        break;
      case 5:
        link = 'https://goerli.etherscan.io/tx/';
        break;
      default:
        link = 'https://etherscan.io/tx/';
    }
    let cleanedHash = cleanHash(hash);
    return `<a href=${link+hash} target="_blank">${cleanedHash}</a>`;
  }

  async function handleClickSale() {
    try {
      connectedNetwork = await $web3.eth.net.getId();
      console.log(connectedNetwork, "NETWORK");

      console.log($selectedAccount, "what");
      const gasAmount = await $store.methods
        .mint($selectedAccount)
        .estimateGas({ from: $selectedAccount });

      const gasPrice = await $web3.eth.getGasPrice();
      $store.methods
        .mint($selectedAccount)
        .send({
          from: $selectedAccount,
          gasAmount,
          gasPrice,
        })
        .on("transactionHash", function (hash) {
          confirmToast(`Current tx: ${createHashLinkedMessage(hash)} />`);
        })
        .on("error", function (error) {
          console.log(error);
          let errMessage = UNKNOWN_ERROR_MSG;
          if (error.code === 4001) {
            errMessage = "You denied the transaction";
          }
          failToast(errMessage);
        })
        .on("receipt", function (blockData) {
          console.log(hablockDatash, "minted!");
          confirmToast(`Minted NFT!! ${createHashLinkedMessage(blockData.blockHash)}`);
        });
    } catch (e) {
      let errMessage = UNKNOWN_ERROR_MSG;
      
      if (String(e).includes("Returned values aren't valid")) {
        errMessage =
          "You might be on the wrong network! Make sure you are connected to mainnet!";
      }

      failToast(errMessage);
    }
  }

  onMount(() => {
    // if it's available, we'll just set it
    defaultEvmStores.setProvider();
  });
</script>

<body class="masthead" id="home">
  <div
    style="position:absolute; bottom:1em; right: 1em"
  >
    <SvelteToast options={options} target={"default"} />
  </div>
  <div
    class="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center"
  >
    <div class="d-flex justify-content-center" style="padding-bottom:120px;">
      <a
        class="itanica-font btn btn-primary mb-5"
        href="https://discord.gg/CUC2gyPTaU"
        target="_blank"
        style="font-size: 1em; margin-left: 3em">Discord</a
      >
      <div class="text-center d-flex justify-content-center">
        {#if !$connected}
          <button
            class="itanica-font btn btn-primary mb-5"
            on:click={handleConnect}
            style="font-size:1em;margin-left:3em;">Connect</button
          >
        {:else}
          <button
            class="itanica-font btn btn-primary mb-5"
            on:click={handleClickSale}
            style="font-size:1em;margin-left:3em;">Mint</button
          >
        {/if}
      </div>
    </div>
  </div>
</body>
<footer class="footer bg-black small text-center text-white-50" style="background-color: rgb(0, 161, 255);"><div class="container px-4 px-lg-5">watch out mfers</div></footer>

<style>
  :root {
    --toastBackground: black;
    --toastColor: #123456;
    --toastHeight: 300px;
  }
</style>
