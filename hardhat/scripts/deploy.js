const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const whitelistContract = "0x9D4EF128a3e900D7555048a4C4116158B6fAd553";
  // URL from where we can extract the metadata for a EXCNFT
  const metadataURL = "ipfs://QmY3wajmpBvjNuuCMUgeXbMWATdpYdG4F6Zg6hv9YH9gp2/";

  const excNFTContract = await ethers.getContractFactory("EXCNFT");

  // deploy the contract
  const deployedEXCNFTContract = await excNFTContract.deploy(metadataURL, whitelistContract);

  await deployedEXCNFTContract.deployed();

  // print the address of the deployed contract
  console.log("EXCNFT Contract Address:", deployedEXCNFTContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });