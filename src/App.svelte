<script>
  console.log("SVELTE IS RUNNING");
  import {
  chainId,connected,defaultEvmStores,selectedAccount,web3
  } from "svelte-web3";

  defaultEvmStores.setProvider();


  async function handleClick() {
    console.log($connected, $chainId, $selectedAccount)
    const balance = await $web3.eth.getBalance($selectedAccount)
    console.log(balance)
  }
</script>

  <button on:click={handleClick}>
    <div class="card-img mbr-figure">
      <img src="assets/images/all-together-1408x807.png" alt="StartMinting" />
    </div>
  </button>

<style></style>
