// NB: this gets pulled in at the client and should be embedded at build. but it not.
// import merge from "lodash/merge";

// const devConfig = {
//   development: true,
//   env: "dev",
//   version: "1.0",
//   mintContractAddress: "",
//   services: {},
// };

// const stagingConfig = {
//   development: true,
//   env: "dev",
//   mintContractAddress: "0xb810917d144f9cdf493712832f2b4c7b47378608",
//   services: {},
// };

// const productionConfig = {
//   development: false,
//   env: "prod",
//   mintContractAddress: "",
//   services: {},
// };

// let finalConfig = devConfig;
// switch (process.env.NODE_ENV) {
//   case "staging":
//   case "dev":
//     finalConfig = merge({}, devConfig, stagingConfig);
//     break;
//   case "prod":
//     finalConfig = merge({}, devConfig, productionConfig);
//     break;
//   default:
//     break;
// }

// console.log(finalConfig);

// export const config = { ...finalConfig };
