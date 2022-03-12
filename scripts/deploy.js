const fs = require('fs');

async function main() {
  const VideoNFT = await hre.ethers.getContractFactory("VideoNFT");
  const videoNFT = await VideoNFT.deploy();
  await videoNFT.deployed();
  console.log("VideoNFT deployed to:", videoNFT.address);
  const VHSToken = await hre.ethers.getContractFactory("VHSToken");
  const vHSToken = await VHSToken.deploy(videoNFT.address);
  await vHSToken.deployed();
  console.log("VHSToken deployed to:", vHSToken.address);
  const config = {
    vhsTokenAddress: vHSToken.address,
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
