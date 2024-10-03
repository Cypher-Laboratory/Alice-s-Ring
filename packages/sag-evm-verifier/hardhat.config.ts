import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    currency: 'USD',
    gasPrice: 20,
  },
};

export default config;
