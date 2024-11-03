const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory
    const Faucet = await hre.ethers.getContractFactory("Faucet");
    console.log("Deploying Faucet...");

    // Deploy the contract
    const faucet = await Faucet.deploy("0x4544d69b37F43e478a31e35EAadB1c2a8DA5F93F");

    // Wait for deployment to complete
    await faucet.waitForDeployment();

    // Get the deployed contract address
    const address = await faucet.getAddress();

    console.log("Faucet deployed to:", address);

    // Optional: Print transaction hash
    console.log(
      "Deployment transaction:",
      faucet.deploymentTransaction()?.hash
    );
  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
