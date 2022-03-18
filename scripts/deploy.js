const fs = require('fs');

async function main() {

  console.log('Starting deployment...');

  console.log('Deploying VHSToken...');
  const VHSToken = await hre.ethers.getContractFactory("VHSToken");
  const vHSToken = await VHSToken.deploy({gasPrice: 80000000000});
  await vHSToken.deployed();
  const ownerAddress = await vHSToken.owner();
  const initialBalance = await vHSToken.balanceOf(ownerAddress);
  console.log(`VHSToken deployed to: ${vHSToken.address}, initial balance ${initialBalance}`);

  console.log('Deploying VideoNFT...');
  const VideoNFT = await hre.ethers.getContractFactory("VideoNFT");
  const videoNFT = await VideoNFT.deploy(vHSToken.address, {gasPrice: 80000000000});
  await videoNFT.deployed();
  console.log("VideoNFT deployed to:", videoNFT.address);

  console.log(`Transferring balance from VHSToken owner (${ownerAddress}) to VideoNFT contract...`)
  await vHSToken.transfer(videoNFT.address, initialBalance);
  const vhsBalanceOfNftContract = await vHSToken.balanceOf(videoNFT.address);
  console.log(`Balance of ${vhsBalanceOfNftContract} transferred from token contract to NFT contract.`);

  console.log("Setting defaults in VideoNFT contract...");
  const rentalPricePerDay = ethers.utils.parseUnits("10", "ether");
  const mintReward = ethers.utils.parseUnits("50", "ether");
  const modReward = ethers.utils.parseUnits("5", "ether");
  await videoNFT.setContractDefaults(rentalPricePerDay, mintReward, modReward, 1);
  console.log("Defaults set.");
  
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
