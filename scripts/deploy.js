const hre = require("hardhat");

async function main() {
  // No need for initBalance if the constructor doesn't accept it
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  
  // Deploy the contract without any arguments
  const assessment = await Assessment.deploy();
  await assessment.deployed();

  console.log(`Contract deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
