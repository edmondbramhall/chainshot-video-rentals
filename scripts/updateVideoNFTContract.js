const contractConfig = require('../app/__config.json');
const VideoNFT = require('../app/artifacts/contracts/VideoNFT.sol/VideoNFT.json');

async function main() {
  const videoNFT = new ethers.Contract(contractConfig.nftAddress, VideoNFT.abi, hre.ethers.provider.getSigner());
  const rentalPricePerDay = ethers.utils.parseUnits("10", "ether");
  const mintReward = ethers.utils.parseUnits("60", "ether");
  const modReward = ethers.utils.parseUnits("5", "ether");
  //await videoNFT.setContractDefaults(rentalPricePerDay, mintReward, modReward, 1);
  console.log(`rentalPricePerDay: ${rentalPricePerDay}, mintReward: ${mintReward}, modReward: ${modReward}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
