require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Check for private key
const privateKey = process.env.PRIVATE_Key;
if (!privateKey) {
  throw new Error("Please set your PRIVATE_Key in a .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: "https://1rpc.io/sepolia",
      accounts: [`0x${privateKey}`],
      chainId: 11155111
    }
  }
};