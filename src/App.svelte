<script>
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { toast } from "@zerodevx/svelte-toast";
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
  
  function handleDc() {
    defaultEvmStores.disconnect();
  }

  function handleConnect() {
    defaultEvmStores.setProvider();
  }

  async function handleClickSale() {
    try {
      const network = await $web3.eth.net.getId();
      console.log(network, "NETWORK");

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
          console.log(hash, "we should include a txn hash");
          // toast.push("Mint successful! Welcome NPC");
          confirmToast(`Current tx: ${hash}`);
        })
        .on("error", function (error) {
          console.log(error);
          let errMessage = UNKNOWN_ERROR_MSG;
          if (error.code === 4001) {
            errMessage = "You denied the transaction";
          }
          failToast(errMessage);
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
    console.log("setting up dapp");
    // defaultEvmStores.setProvider(
    //   "https://eth-rinkeby.alchemyapi.io/v2/j0lSD1_wDvtdG-YYUzT_Tceh_95VITDI"
    // );
  });
</script>

<body class="masthead" id="home">
  <div
    style="position:absolute; top:1em; right: 1em"
  >
    <SvelteToast options={options} target={"default"} />
  </div>
  <div
    class="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center"
  >
    <div class="d-flex justify-content-center">
      <a
        class="itanica-font btn btn-primary mb-5"
        href="https://discord.gg/CUC2gyPTaU"
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
          <!-- <button class="itanica-font btn btn-primary mb-5" on:click={handleDc}>Disconnect</button> -->
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

<style>
  :root {
    --toastBackground: black;
    --toastColor: #123456;
    --toastHeight: 300px;
  }
  :toast-container-mods {
    /* --zIndex: 4; */
    position: absolute;
    /* top: 0; */
    /* right: 0; */
  }
</style>
