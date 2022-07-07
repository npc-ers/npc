<script>
  import { makeContractStore } from "svelte-web3";
  import * as addressJson from "../constants/contract-address.json";
  import * as contractJson from "../constants/FourFourFour.json";
  const rbyDeploy = addressJson["FourFourFour"];
  const store = makeContractStore(contractJson.abi, rbyDeploy);
  console.log("hi")
  console.log($store)
  // if ($store) {
  //   const totalSupply = await $store.methods.totalSupply().call();
  //   console.log(totalSupply);
  // }
</script>

<div>
  <br />
  <h2>STUFF</h2>
</div>
