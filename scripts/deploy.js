const fs = require('fs');

async function main() {
  const VideoRentals = await hre.ethers.getContractFactory("VideoRentals");
  const videoRentals = await VideoRentals.deploy();
  await videoRentals.deployed();
  console.log("VideoRentals deployed to:", videoRentals.address);
  const VideoNFT = await hre.ethers.getContractFactory("VideoNFT");
  const videoNFT = await VideoNFT.deploy();
  await videoNFT.deployed();
  console.log("VideoNFT deployed to:", videoNFT.address);
  const config = {
    rentalsAddress: videoRentals.address,
    nftAddress: videoNFT.address
  }
  fs.writeFileSync("./app/__config.json", JSON.stringify(config, null, 2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
