const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory
    const BobToken = await hre.ethers.getContractFactory("BobToken");
    console.log("Deploying BobToken...");

    // Deploy the contract
    const bobToken = await BobToken.deploy(100000000, 50);
    
    // Wait for deployment to complete
    await bobToken.waitForDeployment();
    
    // Get the deployed contract address
    const address = await bobToken.getAddress();
    
    console.log("BobToken deployed to:", address);
    
    // Optional: Print transaction hash
    console.log("Deployment transaction:", bobToken.deploymentTransaction()?.hash);
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